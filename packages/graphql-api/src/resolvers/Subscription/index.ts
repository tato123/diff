import { CUSTOMER_SUBSCRIPTION_CHANGE, PROJECT, DELTA } from "./channels";
import createUserChannelSubscription from "./utils/createUserSubscription";

export default {
  customerSubscriptionChange: createUserChannelSubscription(
    CUSTOMER_SUBSCRIPTION_CHANGE
  ),
  // projects
  onAddPrototype: createUserChannelSubscription(PROJECT.ADDED),
  onDeletePrototype: createUserChannelSubscription(PROJECT.DELETED),
  // deltas
  onAddDelta: createUserChannelSubscription(DELTA.ADDED),
  onDeleteDelta: createUserChannelSubscription(DELTA.DELETED)
};
