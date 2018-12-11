const serviceAccount = require("./key.json");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

module.exports.create = (target, script, version) => {
  const bs = require("browser-sync").create(version);
  console.log("------------------------------");
  console.log("[proxy-target]: " + target);
  console.log("[inject script target]: " + script);
  console.log(`<script async src="${script}"></script>`);

  return new Promise((resolve, reject) => {
    // Start a Browsersync proxy
    bs.init({
      proxy: {
        target: target
      },
      notify: false,
      open: false,
      ghostMode: false,
      logLevel: "debug",
      ui: false,
      https: false,
      host: "0.0.0.0",
      snippetOptions: {
        rule: {
          match: /<\/head>/i,
          fn: function(snippet, match) {
            return `<script src="${script}"></script>` + snippet + match;
          }
        }
      },
      callbacks: {
        ready(err, bs) {
          if (err) {
            return reject(err);
          }

          return resolve(bs);
        }
      }
    });
  });
};

module.exports.getReservation = async version => {
  const querySnapshot = await db
    .collection("instances")
    .where("versionId", "==", version)
    .get();
  if (querySnapshot.empty) {
    return null;
  } else {
    // do something with the data
    const [data] = querySnapshot.docs.map(documentSnapshot =>
      documentSnapshot.data()
    );

    // we created an instance but
    // it doesnt have an entry
    if (data.proxyTarget == null) {
      return null;
    }

    console.log("firestore data", data);

    return {
      proxyTarget: data.proxyTarget,
      script: data.script
    };
  }
};
