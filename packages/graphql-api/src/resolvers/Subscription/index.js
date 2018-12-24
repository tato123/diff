const pubsub = require('../../pubsub')
module.exports = {
  events: {
    subscribe: (_, args) => {
      const channel = Math.random().toString(36).substring(2, 15) // random channel name
      let count = 0
      setInterval(() => pubsub.publish(channel, { events: { count: count++ } }), 2000)
      return pubsub.asyncIterator(channel)
    }
  }
}