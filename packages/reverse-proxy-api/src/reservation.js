const {db} = require('./firestore');


const createReservation = (versionId, url, ready=false) => {
    const docRef = db.collection('instances').doc();
    return docRef.set({
        versionId,
        url,
        ready,
        proxyTarget: null
    })
}


const reserveInstance = async (proxyTarget) => {
  

}

const getReservable = async () => {
    // go to datastore, get an instance, write a record
    const querySnapshot = await db.collection('instances').where('proxyTarget', '==', null).limit(1).get();

    let docs = []
    querySnapshot.forEach(docSnapshot => {
        docs.push(docSnapshot.data());
    })

    return docs;
}

module.exports = {
    reserveInstance,
    createReservation,
    getReservable

}