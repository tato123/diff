import pubsub from "../../../redis/pubsub";
import { withFilter } from "graphql-subscriptions";

export default channelName => ({
  subscribe: withFilter(
    () => pubsub.asyncIterator(channelName),
    (payload, variables, context, info) => {
      console.log("payload", payload);
      console.log("variables", variables);
      console.log("context", context);
      console.log("info", info);
      return true;
    }
  )
});
