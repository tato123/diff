const { GraphQLServer } = require("graphql-yoga");
const path = require("path");
const admin = require("firebase-admin");
const collectionUtils = require("./utils/collections");
const pubsub = require("./pubsub");
const { Storage } = require("@google-cloud/storage");

// Creates a client
const storage = new Storage({
  projectId: "experiments-224320"
});
const myBucket = storage.bucket("stage-diff-fake_account");
const str = require("string-to-stream");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const EVENT_TOPIC = "onEventChange";

const processUpload = async (upload, metaData) => {
  console.log("received upload design request", metaData);

  const id = Math.floor(Math.random() * 100000);
  const file = myBucket.file(`${id}-design`);

  // from our file
  const result = await upload;

  return new Promise((resolve, reject) => {
    str(result)
      .pipe(
        file.createWriteStream({
          metadata: {
            contentType: "image/svg+xml",
            metadata: {
              custom: "metadata"
            }
          }
        })
      )
      .on("error", err => {
        console.error("could not upload file", err);
        reject({
          status: "error"
        });
      })
      .on("finish", () => {
        resolve({
          status: "done"
        });
      });
  });
};

const resolvers = {
  Query: {
    allEvents: collectionUtils.allCollection(db, "events"),
    allInvites: collectionUtils.allCollection(db, "invites"),
    allUsers: collectionUtils.allCollection(db, "users")
  },
  Event: {
    url: event => event.url.href
  },
  Mutation: {
    uploadDesign: (obj, { file, metaData }) => processUpload(file, metaData)
  },
  Subscription: {
    events: {
      subscribe: (_, args) => {
        const unsub = db.collection("events").onSnapshot(querySnapshot => {
          const collection = [];
          querySnapshot.docChanges().forEach(change => {
            const record = {
              type: change.type,
              data: change.doc.data()
            };
            collection.push(record);
          });
          const output = {
            events: collection
          };
          console.log("publishing", output);
          pubsub.publish(EVENT_TOPIC, output);
        });

        return pubsub.asyncIterator(EVENT_TOPIC);
      }
    }
  }
};

const port = process.env.PORT || 8080;

const options = {
  port,
  endpoint: "/graphql",
  bodyParserOptions: {
    limit: "50mb",
    extended: true
  }
};

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, "./schema.graphql"),
  resolvers,
  context: { pubsub }
});

server.start(options, () =>
  console.log(`Server is running on localhost:${port}`)
);
