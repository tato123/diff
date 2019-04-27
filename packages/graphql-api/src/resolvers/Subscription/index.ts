import { CUSTOMER_SUBSCRIPTION_CHANGE } from "./channels";
import pubsub from "./pubsub";

const customerSubscriptionChange = {
  subscribe: (_, args, context) => {
    const user = context.user;
    const channel = `${CUSTOMER_SUBSCRIPTION_CHANGE}_${user.sub}`;
    console.log("subscribing to", channel);
    return pubsub.asyncIterator(channel);
  }
};

const onAddPrototype = {
  subscribe: (_, args, context) => {
    const user = context.user;
    const channel = `${CUSTOMER_SUBSCRIPTION_CHANGE}_${user.sub}`;
    console.log("subscribing to", channel);
    return pubsub.asyncIterator(channel);
  }
};

export default {
  customerSubscriptionChange
};
