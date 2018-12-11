const { db } = require("./firestore");
const fetch = require("node-fetch");

const defaultScript = process.env.SCRIPT_URL;
const createReservation = (versionId, url, ready = false) => {
  const docRef = db.collection("instances").doc();
  return docRef.set({
    versionId,
    url,
    ready,
    proxyTarget: null,
    script: null
  });
};

const reserveFirstAvailable = async proxyTarget => {
  // get an instance
  const reservable = await getReservable();
  const instanceUrl = reservable[0].data.url;
  const invokeUrl = `${instanceUrl}/reserve?proxyTarget=${encodeURIComponent(
    proxyTarget
  )}&script=${encodeURIComponent(defaultScript)}`;
  console.log("Reserving instance with url", invokeUrl);
  const response = await fetch(invokeUrl);

  if (response.ok) {
    const instanceRef = await db
      .collection("instances")
      .doc(reservable[0].id)
      .update({
        proxyTarget,
        script: defaultScript
      });

    return instanceUrl;
  }

  throw new Error(response.statusText);
};

const getReservable = async () => {
  // go to datastore, get an instance, write a record
  const querySnapshot = await db
    .collection("instances")
    .where("proxyTarget", "==", null)
    .limit(1)
    .get();

  let docs = [];
  querySnapshot.forEach(docSnapshot => {
    docs.push({ id: docSnapshot.id, data: docSnapshot.data() });
  });

  return docs;
};

module.exports = {
  reserveFirstAvailable,
  createReservation,
  getReservable
};
