import _ from 'lodash';
import * as Users from '../../aws/tables/Users';

const stripe = require("stripe")(process.env.STRIPE_KEY);
const DIFF_PLAN = process.env.STRIPE_PLAN_ID
interface CustomerInput {
    input: {
        source: string;
    }

}

const getCustomerId = async (uid: string): Promise<string | null> => {
    try {
        const customerId = await Users.getUserByUid(uid);
        return customerId;
    } catch (err) {
        return null
    }
}



const createStripeCustomer = async (_parent, args: CustomerInput, context) => {
    const user = await context.getUser();
    console.log('user is ', user)
    console.log('args are', args)
    console.log('has', _)

    // cant do anything
    if (!_.has(args, 'input.source') || !_.isString(args.input.source)) {
        return null;
    }

    try {
        const customerId = getCustomerId(user.sub);


        // get the customer from stripe
        const customer = customerId != null ? customerId : await stripe.customers.create({
            email: user.email,
            source: args.input.source,
        });

        // store the information against their 
        console.log('customer created', customer);
        await Users.updateByUid(user.sub, 'stripe_customer_id', customer.id)

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: DIFF_PLAN }]
        })

        const FULL_PLAN = 'full'

        await Users.updateByUid(user.sub, 'stripe_plan_id', subscription.id)
        await Users.updateByUid(user.sub, 'plan', FULL_PLAN);
        await Users.updateByUid(user.sub, 'plan_status', subscription.status)


        // store the information against their 
        console.log('subscription created', subscription);

        return { plan: FULL_PLAN, status: subscription.status };
    } catch (err) {
        console.error(err.message);
        return null;
    }


}


export default createStripeCustomer;