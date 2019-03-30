import _ from 'lodash';
import * as Users from '../../aws/tables/Users';
import { CUSTOMER_SUBSCRIPTION_CHANGE } from '../Subscription/channels';
import pubsub from '../Subscription/pubsub';

const stripe = require("stripe")(process.env.STRIPE_KEY);
const DIFF_PLAN = process.env.STRIPE_PLAN_ID
interface CustomerInput {
    input: {
        source: string;
    }

}

const getCustomerId = (uid: string): Promise<string | null> => {
    console.log(`[getCustomerId] [uid:${uid}]`);

    return Users.getUserByUid(uid)
        .then(user => user.customerId)
}



const createStripeCustomer = async (_parent, args: CustomerInput, context) => {
    console.log('[createStripeCustomer]---------------------------------------');
    const user = context.user;
    const useDiscount = _.indexOf(_.get(user, 'permissions', []), 'create:discountRate') !== -1;

    // cant do anything
    if (!_.has(args, 'input.source') || !_.isString(args.input.source)) {
        return null;
    }

    if (useDiscount) {
        console.log('Applying discount code to user', user.sub)
    }

    try {

        const customerId = await getCustomerId(user.sub);

        console.log('CustomerId', customerId)
        // get the customer from stripe
        const customer = !_.isNil(customerId) ? { id: customerId } : await stripe.customers.create({
            email: user.email,
            source: args.input.source,
        });

        // store the information against their 
        console.log('customer created', customer);
        await Users.updateByUid(user.sub, 'stripe_customer_id', customer.id)
        const subOptions = {
            customer: customer.id,
            items: [{ plan: DIFF_PLAN }],

        };

        if (useDiscount) {
            subOptions['coupon'] = process.env.STRIPE_ADMIN_COUPON;
        }
        const subscription = await stripe.subscriptions.create(subOptions)

        const FULL_PLAN = 'full'

        await Users.updateByUid(user.sub, 'stripe_plan_id', subscription.id)
        await Users.updateByUid(user.sub, 'plan', FULL_PLAN);
        await Users.updateByUid(user.sub, 'plan_status', subscription.status)


        // store the information against their 
        console.log('subscription created', subscription);
        const result = { plan: FULL_PLAN, status: subscription.status };
        pubsub.publish(`${CUSTOMER_SUBSCRIPTION_CHANGE}_${user.sub}`, { customerSubscriptionChange: result })

        return result;


    } catch (err) {
        console.error(err.message);
        return null;
    }


}


export default createStripeCustomer;