const stripe = require("stripe")(process.env.STRIPE_KEY);
import * as Users from '../../aws/tables/Users';
import _ from 'lodash';


const cancelSubscription = async (_parent, args, context) => {
    console.log('[resolver][mutation] - cancelSubscription');
    const user = context.user;
    const sub = _.get(user, 'sub');
    if (!sub) {
        return null;
    }

    try {
        const CANCEL_TYPE = 'cancel_at_period_end';
        const dbUser = await Users.getUserByUid(sub);
        stripe.subscriptions.update(dbUser.planId, { cancel_at_period_end: true });
        await Users.updateByUid(user.sub, 'plan_status', CANCEL_TYPE);

        return {
            plan: dbUser.plan,
            status: CANCEL_TYPE
        }
    } catch (err) {
        console.error('An error occured', err.message);
        return null;
    }


}

export default cancelSubscription;