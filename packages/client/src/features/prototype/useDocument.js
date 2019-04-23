import Automerge from "automerge";
import { useEffect, useState, useContext } from "react";
import UserContext from "../../utils/context";
import SyncClient from "twilio-sync";
import _ from "lodash";
import Pusher from "pusher-js";
import { WebSocketChannel } from "twilsock/lib/websocketchannel";
import { connect, LocalDataTrack } from "twilio-video";

export const useVideo = docId => {
  const [room, setRoom] = useState();
  const [dataTrack, setDatatrack] = useState();
  const user = useContext(UserContext);

  useEffect(() => {
    user
      .exchangeForTwilioToken([`room=${docId}`])
      .then(tokenResponse => {
        const dataTrack = new LocalDataTrack();
        setDatatrack(dataTrack);
        return connect(
          tokenResponse.token,
          {
            name: docId,
            audio: false,
            video: false,
            tracks: [dataTrack]
          }
        );
      })
      .then(room => {
        console.log(`Successfully joined a Room: ${room}`);
        room.on("participantConnected", participant => {
          console.log(`A remote Participant connected: ${participant}`);
        });
        setRoom(room);
      })
      .catch(error => {
        console.error(`Unable to connect to Room: ${error.message}`);
      });
  }, []);

  return [room, dataTrack];
};

export const useActiveUsers = docId => {
  return [];
};

export const useDocument = docId => {
  // first lets create a document
  const [doc, setDoc] = useState();
  const user = useContext(UserContext);
  const [room, dataTrack] = useVideo();

  const canvas = document.getElementById("canvas");
  const connectButton = document.getElementById("connect");
  const disconnectButton = document.getElementById("disconnect");
  const form = document.getElementById("form");
  const identityInput = document.getElementById("identity");
  const nameInput = document.getElementById("name");
  const participants = document.getElementById("participants");
  const video = document.querySelector("#local-participant > video");

  /**
   * Handle a connected RemoteParticipant.
   * @param {RemoteParticipant} participant
   * @retruns {void}
   */
  function participantConnected(participant) {
    const participantDiv = document.createElement("div");
    participantDiv.className = "participant";
    participantDiv.id = participant.sid;

    const videoElement = document.createElement("video");
    participantDiv.appendChild(videoElement);
    document.body.appendChild(participantDiv);

    participant.tracks.forEach(publication =>
      trackPublished(participant, publication)
    );
    participant.on("trackPublished", publication =>
      trackPublished(participant, publication)
    );
    participant.on("trackUnpublished", publication =>
      trackUnpublished(participant, publication)
    );
  }

  /**
   * Handle a disconnnected RemoteParticipant.
   * @param {RemoteParticipant} participant
   * @returns {void}
   */
  function participantDisconnected(participant) {
    console.log(`RemoteParticipant "${participant.identity}" disconnected`);
    const participantDiv = document.getElementById(participant.sid);
    if (participantDiv) {
      participantDiv.remove();
    }
  }

  /**
   * Handle a published Track.
   * @param {RemoteParticipant} participant
   * @param {RemoteTrackPublication} publication
   */
  function trackPublished(participant, publication) {
    console.log(
      `RemoteParticipant "${participant.identity}" published ${
        publication.kind
      } Track ${publication.trackSid}`
    );
    if (publication.isSubscribed) {
      trackSubscribed(participant, publication.track);
    } else {
      publication.on("subscribed", track =>
        trackSubscribed(participant, track)
      );
    }
    publication.on("unsubscribed", track =>
      trackUnsubscribed(participant, track)
    );
  }

  /**
   * Handle a subscribed Track.
   * @param {RemoteParticipant} participant
   * @param {Track} track
   * @returns {void}
   */
  function trackSubscribed(participant, track) {
    console.log(
      `LocalParticipant subscribed to RemoteParticipant "${
        participant.identity
      }"'s ${track.kind} Track ${track.sid}`
    );
    if (track.kind === "audio" || track.kind === "video") {
      track.attach(`#${participant.sid} > video`);
    } else if (track.kind === "data") {
      track.on("message", data => {
        const change = JSON.parse(data);

        setDoc(doc => Automerge.applyChanges(doc, change));
        const state = Automerge.getHistory(doc);
        console.log(state);
      });
    }
  }

  /**
   * Handle an unsubscribed Track.
   * @param {RemoteParticipant} participant
   * @param {Track} track
   * @returns {void}
   */
  function trackUnsubscribed(participant, track) {
    console.log(
      `LocalParticipant unsubscribed from RemoteParticipant "${
        participant.identity
      }"'s ${track.kind} Track ${track.sid}`
    );
    if (track.kind === "audio" || track.kind === "video") {
      track.detach();
    }
  }

  /**
   * Update the UI in response to disconnecting.
   * @returns {void}
   */
  function didDisconnect(error) {
    if (room) {
      if (error) {
        console.error(error);
      }
      room.participants.forEach(participantDisconnected);
    }
    // identityInput.disabled = false;
    // nameInput.disabled = false;
    // connectButton.disabled = false;
    // disconnectButton.disabled = true;
  }

  /**
   * Handle an unpublished Track.
   * @param {RemoteParticipant} participant
   * @param {RemoteTrackPublication} publication
   */
  function trackUnpublished(participant, publication) {
    console.log(
      `RemoteParticipant "${participant.identity}" unpublished ${
        publication.kind
      } Track ${publication.trackSid}`
    );
  }

  useEffect(() => {
    if (!room) {
      return;
    }

    room.once("disconnected", didDisconnect);

    room.participants.forEach(participantConnected);
    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
  }, [room]);

  useEffect(() => {
    const doc1 = Automerge.init();
    setDoc(doc1);
  }, []);

  const toChange = cb => {
    const change = Math.floor(Math.random() * 10000) + "--change";
    const newRevision = Automerge.change(doc, change, cb);
    let changes = Automerge.getChanges(doc, newRevision);
    dataTrack.send(JSON.stringify(changes));
    setDoc(doc => newRevision);
  };

  return { doc, change: toChange };
};
