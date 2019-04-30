import { CUSTOMER_SUBSCRIPTION_CHANGE, PROJECT, DELTA } from "./channels";
import createUserChannelSubscription from "./utils/createUserSubscription";
import pubsub from "../../redis/pubsub";

export default {
  customerSubscriptionChange: createUserChannelSubscription(
    CUSTOMER_SUBSCRIPTION_CHANGE
  ),
  // projects
  onAddProject: createUserChannelSubscription(PROJECT.ADDED),
  onDeleteProject: createUserChannelSubscription(PROJECT.DELETED),
  // deltas
  onAddDelta: createUserChannelSubscription(DELTA.ADDED),
  onDeleteDelta: createUserChannelSubscription(DELTA.DELETED)
};
