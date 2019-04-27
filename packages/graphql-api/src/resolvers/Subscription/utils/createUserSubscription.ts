import pubsub from "../../../redis/pubsub";

export default channelName => ({
  subscribe: (_, args, context) => {
    const user = context.user;
    const channel = `${channelName}_${user.sub}`;
    console.log("subscribing to", channel);
    return pubsub.asyncIterator(channel);
  }
});
