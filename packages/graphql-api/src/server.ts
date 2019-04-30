import path = require("path");
import resolvers from "./resolvers";
import context from "./context";
import webhooks from "./webhooks";
import getUser from "./context/auth0";
import _ from "lodash";
import { createServer } from "http";

import express from "express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import twilioRoutes from "./routes/twilio";
import bodyParser from "body-parser";

// launch mongoose
import aws from "./aws";

const { importSchema } = require("graphql-import");
const cors = require("cors");

const ExpressPeerServer = require("peer").ExpressPeerServer;
const { ApolloServer, gql } = require("apollo-server-express");

const port = process.env.PORT || 8081;

const app = express();

// start our connection to our databas
aws.dynamo.connect();

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

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
  console.log(
    `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect: () => {
        console.log("connected");
      },
      onDisconnect: () => {
        console.log("disconnected");
      }
    },
    {
      server: server,
      path: "/graphql"
    }
  );
});

webhooks(app);
