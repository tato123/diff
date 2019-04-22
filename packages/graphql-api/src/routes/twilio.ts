const express = require("express");
const router = express.Router();

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const AccessToken = require("twilio").jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;
var VideoGrant = AccessToken.VideoGrant;

import getUser from "../context/auth0";
import _ from "lodash";

/*
Generate an Access Token for a Sync application user - it generates a random
username for the client requesting a token, and takes a device ID as a query
parameter.
*/
router.get("/token", async (req, res) => {
  console.log("twilio request received");

  const room = req.query.room;
  //
  // This is the most critical part of your backend code, as you must identify the user and (possibly)
  // challenge them with some authentication scheme. To determine the identity, you might use:
  //    * A session datum consistently identifying one anonymous visitor,
  //    * A session key identifying a logged-in user
  //    * OAuth credentials identifying a logged-in user
  //    * A random username for all comers.
  //
  try {
    const bearer = _.get(req, "headers.authorization", "");
    const [_header, jwtToken] = bearer.split(" ");
    const user = await getUser(jwtToken);

    // Create a "grant" identifying the Sync service instance for this app.
    var syncGrant = new SyncGrant({
      serviceSid: process.env.TWILIO_SYNC_SERVICE_SID
    });

    // Grant access to Video
    var grant = new VideoGrant();
    grant.room = room;

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created and specifying his identity.
    var token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET
    );
    token.addGrant(syncGrant);
    token.addGrant(grant);
    token.identity = user.sub;

    // Serialize the token to a JWT string and include it in a JSON response
    res.send({
      identity: user.sub,
      token: token.toJwt()
    });
  } catch (err) {
    res.status(401).send("error" + err.message);
  }
});

// get all the items
const onlineList = client.sync
  .services(process.env.TWILIO_SYNC_SERVICE_SID)
  .syncMaps("online");

router.get("/online", (req, res) => {
  const identities = [];
  onlineList
    .fetch()
    .then(sync_map => res.json(sync_map))
    .catch(err => {
      res.status(404).send("not found");
    });
});

const deleteUser = identity => {
  onlineList
    .syncMapItems(identity)
    .remove()
    .then(sync_map_item => console.log(sync_map_item.key))
    .catch(err => {
      console.error("error occured during delete", err);
    });
};

router.post("/event", async (req, res) => {
  console.log("A twillio event occured", req.body);

  const event = req.body;
  switch (event.EventType) {
    case "endpoint_disconnected":
      deleteUser(event.Identity);
      break;
    case "endpoint_connected":
      onlineList.syncMapItems
        .create({ key: event.Identity, data: { identity: event.Identity } })
        .catch(err => {
          console.error("error occured during connection", err);
        });
      break;
  }

  res.status(200).send("ok");
});

export default router;
