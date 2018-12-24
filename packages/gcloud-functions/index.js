const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "diff-204716",
    clientEmail: "firebase-adminsdk-qxq8y@diff-204716.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDNKcY31oulBI5j\nf5So3ei7lEXT8XKZRC7TPLj+qdaiWTm36mJHJMxwzbUZHz5IAHBe9qJ7RXNDJkS9\ncMFgopYJZTrPc6G7e8kLzD1lX69wGymJJOabiG6oN7a5khjGYP2EvaLBqlnqpd8i\n6bL40/FKJ0NZOpWck7EdJ5r2JNKQbe20h/5EeRPhGNRr8P8L6/j7i57p0dHviWVZ\nfU57pktQ0WI8vsZQngBk9BjZkc71pjaOmq2CCa7Sb454xZWExc6uEYVJcpH2T4Q4\nCCy+e7W/jJEZc4gOSnPlAI25Arx6irPwZ+E3LUAk9C8g92LpRfMwlblo+N9aY8XX\nWKzCQZvfAgMBAAECggEAQNuJ7DEI6FvuX4n/hvrQDiyrfnr/zW/+lYzGtsseLSij\n1H5mHzOE5cxCCfUUjVKGM58ocmvcKkg4xuKUX2ZGpCW6V8aoREq3neEtL5T2MyyD\nDvX5aQXSZZ9nRnbnGh+jRYlloG+oCUPyrGjQyVTHHLgY1GZu0ZbnEN5qYJH3duyY\ni+yGGwmt+MNJrLwZzed4a3c+UEfnxxCN0E471Ikdz9ZQAzgbDZ+P5rrLNWCFdEMG\nCPdseXsSzJArvEqK1K0UKHCHnEzhbVcd0MKNJO9Rg2Wd0+lwQ05Hd6lAoDIApYSo\nYzO0UDFUUDi7w35uwjulVUWGhwvMAKNZ3OzEj31Y8QKBgQDuWM7xFe9ShUJQtDi7\nVFKOuzEGASpEZZFP39/+kTagduhv2IjOfQqYl5Z99ptLwwxW0+GxSap2tRM/md1e\nd1Lle95lU/KSVEVl/YxS4BnhdNTor6I+hYlrfxIPnluGCY6yLWu1h2ZJHJey+twW\n0ce5ELVvxXZSvBM+ZEmmQaXKhQKBgQDcW8ilGMsiB6A3DujLN6uGiTYfuRq2v3fc\n6+khH/onV7JVWOpkl0TZbZhMeIDk2l7U1MbOfYYjbz8xVU1/vhjfMX/O3bILna7w\nMKTAfraQX0oKmml3cP+SRYyHCEJTFuPdFu7uOiYNuX1gvVJnV36HajOfKaWnOo6T\np3d+KJuEEwKBgCPzNzt74H4k5WzA0jHHNTCcIXfTYymv3CwdC28dPg0UAlkkYvYq\nPBfp/WQAd0oFIG5URR11jAWdqEqWjaI7A0Dj3xaPg+34UgNhK/IwJRcxhQ+XtjQR\n9jlFkFbUvt9Hv8M2QKG/y3jJnEP9vIagm6xZTdSPBxrRjWGCxO0Tx8r1AoGARb7L\nP+4cBTZSsHqIliGVqaxuNBY7bVIm1wbYMALWA3PPXxIYhiQWx5bXmISfj0/KqiR6\nlErIlRiV8MBmGiOJ7cLWCBzFSMXs49sRmlfA4us2HSsIbKSYT6yxsN+dVn0tPAIR\nN9exybBHDcJ+fXUE+ElV82+UHdz72aIswQKLTn8CgYEAz1/aVaS/TtQ6WR4eP88u\n5Rczpohc6ufT+B6wBm88rzmVH3cU2e7nMkXixAzJYslwskEtPerGw5Ey6UCyNQx/\ndllJEiqObAvDHUW0Ilr7M1RmwGHkkNI/h4b/5VOXJVCEJ0/tRgt2FwrIzLDzLmvT\nPBLjSXRx6N6Q9MbETYgtNNc=\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: "https://diff-204716.firebaseio.com"
});

const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

/**
 * Background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.helloGCS = (data, context) => {
  const file = data;
  console.log("Executing firestore cloud function");
  return db
    .collection("components")
    .doc()
    .set({
      url: `${file.bucket}/${file.name}`,
      name: file.name,
      created: file.timeCreated,
      updated: file.updated,
      metageneration: file.metageneration
    })
    .then(() => {
      console.log(`File ${file.name} metadata updated.`);
    })
    .catch(error => {
      console.error("Error writing document: ", error);
    });
};
