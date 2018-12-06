const { GraphQLServer } = require('graphql-yoga')

const { GooglePubSub } = require('@axelspringer/graphql-google-pubsub');
const admin = require('firebase-admin');
const collectionUtils = require('./utils/collections');

const pubsubOptions = {};
const topic2SubName = topicName => `${topicName}`
const messageHandler = ({ data }) => {
  const d = JSON.parse(data.toString('utf-8'));
  return d;
}


var serviceAccount = require("./diff-204716-firebase-adminsdk-qxq8y-9fbaa1a5cb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://diff-204716.firebaseio.com"
});

const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const pubsub = new GooglePubSub(pubsubOptions, topic2SubName, messageHandler);

const typeDefs = `
 
  type Event {
    type: String!
    comment: String
    url: String!
    id: String
    selector: String
  }

  type Invite {
    email: String
    firstName: String
    invitedBy: String
    lastName: String
    status: String
    workspaceId: String
    id: String
  }

  type User {
    aud: String
    email: String
    email_verified: Boolean
    exp: Int
    family_name: String
    gender: String
    given_name: String
    iat: Int
    iss: String
    locale: String
    name: String
    nickname: String
    picture: String
    plan: String
    sub: String
    updated_at: String
  }

  type Query {
    allEvents: [Event]    
    allInvites: [Invite]
    allUsers: [User]
  }

  type Counter {
    count: Int!
    countStr: String
  }

  type DocChange {
    type: String,
    data: Event
  }

  type Subscription {
    events: [DocChange]
  }
`


const EVENT_TOPIC = 'onEventChange';

const resolvers = {
  Query: {
    allEvents: collectionUtils.allCollection(db, 'events'),
    allInvites: collectionUtils.allCollection(db, 'invites'),
    allUsers: collectionUtils.allCollection(db, 'users')
  },
  Event: {
    url: event => event.url.href
  },
  Subscription: {
    events: {
      subscribe: (_, args) => {
        const unsub = db.collection('events').onSnapshot(querySnapshot => {


          const collection = [];
          querySnapshot.docChanges().forEach(change => {
            const record = {
              type: change.type,
              data: change.doc.data()
            }
            collection.push(record)

          });
          const output = {
            events: collection
          }
          console.log('publishing', output)
          pubsub.publish(EVENT_TOPIC, output);
        })

        return pubsub.asyncIterator(EVENT_TOPIC)
      }
    }
  },
}

const port = process.env.PORT || 8080;

const options = {
  port
}

const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })

server.start(options, () => console.log(`Server is running on localhost:${port}`))