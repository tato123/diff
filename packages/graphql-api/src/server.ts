import path = require("path");
import resolvers = require("./resolvers");
import context from "./context";
import webhooks from "./webhooks";
import getUser from "./context/auth0";
import _ from "lodash";
import express from "express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import twilioRoutes from "./routes/twilio";
import bodyParser from "body-parser";
var Pusher = require("pusher");

var pusher = new Pusher({
  appId: "662290",
  key: "738f996660519e1aade6",
  secret: "62db73487c4c961e43ff",
  cluster: "mt1",
  encrypted: true
});
const { importSchema } = require("graphql-import");
const cors = require("cors");

const ExpressPeerServer = require("peer").ExpressPeerServer;
const { ApolloServer, gql } = require("apollo-server-express");

const port = process.env.PORT || 8081;

const app = express();

app.use("*", cors({ origin: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/twilio", twilioRoutes);

const schema = makeExecutableSchema({
  typeDefs: importSchema(path.resolve(__dirname, "./schema.graphql")),
  resolvers
});

const apolloServer = new ApolloServer({
  schema,
  context
});

apolloServer.applyMiddleware({ app });

const server = app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
  console.log(
    `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );

  const WebSocket = require("ws");
  const wss = new WebSocket.Server({ server: server });

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: wss,
      path: "/graphql"
    }
  );
});

// ----------------------------------------
// configure our server

app.post("/pusher/auth", function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;

  const id = Math.floor(Math.random() * 10000);
  var presenceData = {
    user_id: "user-" + id,
    user_info: {
      name: "Mr Channels",
      twitter_id: "@pusher"
    }
  };
  var auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

webhooks(app);
