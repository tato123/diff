import pubsub from '../Subscription/pubsub';
import { CUSTOMER_SUBSCRIPTION_CHANGE } from '../Subscription/channels'

export default (_, args, context) => {

    const result = {
        plan: 'p-' + Math.floor(Math.random() * 1000),
        status: 's-' + Math.floor(Math.random() * 1000)
    };
    console.log('publishing data')
    pubsub.publish(`${CUSTOMER_SUBSCRIPTION_CHANGE}_google-oauth2|104736605438964937955`,{customerSubscriptionChange: result} )

    return result;
}