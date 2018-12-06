module.exports.allCollection = (db, collectionName) => async () => {
    const events = [];
    const querySnapshot = await db.collection(collectionName).get();
    querySnapshot.forEach(doc => {
        events.push(doc.data())
    })
    return events;
}