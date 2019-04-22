import React, { useContext, useEffect, useState } from "react";
import SyncClient from "twilio-sync";
import UserContext from "../../utils/context";
import _ from "lodash";

const handlePresence = (syncClient, docId, userId, onUserChange) => {
  // Open a Document by unique name and update its value
  syncClient
    .document(docId)
    .then(doc => {
      // Listen to updates on the Document
      doc.on("updated", event => {
        onUserChange(event);
      });

      // mutate to state we are online
      doc.mutate(remoteValue => {
        remoteValue[userId] = true;
        return remoteValue;
      });
    })

    .catch(function(error) {
      console.error("Unexpected error", error);
    });
};

const handleDocState = (syncClient, docId, onDocOpen = _.noop) => {
  syncClient
    .map(docId + "-state")
    .then(onDocOpen)
    .catch(err => {});
};

const Sync = ({ docId, onOnlineUsersChange, onDocOpen }) => {
  const user = useContext(UserContext);

  useEffect(() => {
    user
      .exchangeForTwilioToken()
      .then(tokenResponse => {
        const syncClient = new SyncClient(tokenResponse.token, {
          logLevel: "info"
        });

        syncClient.on("connectionStateChanged", function(state) {
          console.log("connection state changed");
        });

        handlePresence(
          syncClient,
          docId,
          user.getProfile().sub,
          onOnlineUsersChange
        );

        handleDocState(syncClient, docId, onDocOpen);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return null;
};

Sync.defaultProps = {
  onOnlineUsersChange: _.noop
};

export default Sync;
