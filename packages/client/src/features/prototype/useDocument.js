import Automerge from "automerge";
import { useEffect, useState, useContext } from "react";
import UserContext from "../../utils/context";
import SyncClient from "twilio-sync";
import _ from "lodash";
import Pusher from "pusher-js";
import { WebSocketChannel } from "twilsock/lib/websocketchannel";
import { connect, LocalDataTrack } from "twilio-video";

export const useTwilioSync = () => {
  const [syncClient, setSyncClient] = useState(null);
  const user = useContext(UserContext);

  useEffect(() => {
    user
      .exchangeForTwilioToken()
      .then(tokenResponse => {
        const syncClient = new SyncClient(tokenResponse.token, {
          logLevel: "info"
        });
        setSyncClient(syncClient);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return syncClient;
};

export const useVideo = docId => {
  const [room, setRoom] = useState();
  const user = useContext(UserContext);

  useEffect(() => {
    user
      .exchangeForTwilioToken([`room=${docId}`])
      .then(tokenResponse => {
        const dataTrack = new LocalDataTrack();

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

  return room;
};

export const useSyncStream = streamName => {
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const syncClient = useTwilioSync();

  useEffect(() => {
    if (!syncClient) {
      return;
    }
    setLoading(true);
    syncClient
      .stream("MyStream")
      .then(stream => {
        setStream(stream);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        setError(error);
      });
  }, [syncClient]);

  return { stream, loading, error };
};

export const useActiveUsers = docId => {
  const [users, setUsers] = useState([]);
  const syncClient = useTwilioSync();
  const user = useContext(UserContext);

  useEffect(() => {
    if (!syncClient) {
      return;
    }
    syncClient
      .list(docId + "-presence")
      .then(list => {
        // when we add an item add to the list
        list.on("itemAdded", args => {
          if (args.isLocal) {
            return;
          }
          setUsers([...users, args.item.value]);
        });

        list.on("itemRemoved", args => {
          if (args.isLocal) {
            return;
          }
          const newUsers = _.remove(users, x => x === args.value);
          setUsers(newUsers);
        });

        // get all of the current users when we first start
        list
          .getItems({ from: 0, order: "asc" })
          .then(paginator => {
            paginator.items.forEach(item => setUsers([...users, item]));
          })
          .catch(function(error) {
            console.error("List getItems() failed", error);
          });

        // add ourself
        list.push(user.sub);
      })

      .catch(function(error) {
        console.error("Unexpected error", error);
      });

    // check when a user goes offline if it's one of ours
    syncClient.list("online").then(list => {
      list.on("itemRemoved", args => {
        if (args.isLocal) {
          return;
        }
        const newUsers = _.remove(users, x => x === args.value);
        setUsers(newUsers);
      });
    });
  }, [syncClient]);

  return users;
};

export const usePusher = docId => {
  const [members, setMembers] = useState([]);
  const [count, setCount] = useState(0);
  const [channel, setChannel] = useState();

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher("738f996660519e1aade6", {
      cluster: "mt1",
      forceTLS: true,
      authEndpoint: "http://localhost:8081/pusher/auth",
      headers: {
        authorization: "Bearer test"
      }
    });

    const channel = pusher.subscribe("presence-" + docId);

    channel.bind("pusher:subscription_error", function(status) {
      console.error("[pusher] got status", status);
    });

    channel.bind("pusher:subscription_succeeded", function(members) {
      // for example
      setCount(members.count);

      members.each(function(member) {
        // for example:
        setMembers(m => [...m, { id: member.id, info: member.info }]);
      });
    });

    channel.bind("pusher_internal:subscription_succeeded", () => {
      console.log("succeeded");
    });

    setChannel(channel);
  }, []);

  return { channel, members, count };
};

export const useDocument = docId => {
  // first lets create a document
  const [doc, setDoc] = useState();
  const { channel, members, count } = usePusher(docId);
  const user = useContext(UserContext);
  const video = useVideo();

  // // lets grab the current document id
  // useEffect(() => {
  //   if (!stream) {
  //     return;
  //   }
  // const doc1 = Automerge.init();
  // setDoc(doc1);

  //   stream.on("messagePublished", function(args) {
  //     if (args.isLocal) {
  //       return;
  //     }

  //     const changes = JSON.parse(args.message.value.val);
  //     console.log("new revision created", changes);

  // const newDoc = Automerge.applyChanges(doc1, changes);
  // setDoc(newDoc);
  //   });
  // }, [stream]);

  // const toChange = cb => {
  //   const newRevision = Automerge.change(doc, "effect change", cb);
  //   let changes = Automerge.getChanges(doc, newRevision);
  //   console.log("new revision created", newRevision);
  //   stream.publishMessage({ val: JSON.stringify(changes) });
  // };

  useEffect(() => {
    if (!channel) {
      return;
    }

    const doc1 = Automerge.init();
    setDoc(doc1);

    channel.bind("client-docchange", (data, metadata) => {
      const newDoc = Automerge.applyChanges(doc1, data);
      setDoc(newDoc);
    });
  }, [channel]);

  const toChange = cb => {
    const newRevision = Automerge.change(doc, "effect change", cb);
    let changes = Automerge.getChanges(doc, newRevision);
    channel.trigger("client-docchange", changes);
  };

  return { doc, change: toChange };
};
