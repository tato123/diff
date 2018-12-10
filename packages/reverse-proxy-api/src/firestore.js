const admin = require("firebase-admin");
const  serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://diff-204716.firebaseio.com"
});

const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
  
module.exports = {
    db
}