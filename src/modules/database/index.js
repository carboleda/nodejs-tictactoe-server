const { database } = require('../../../config/config.json');
const admin = require('firebase-admin');
const serviceAccount = require(`../../../config/${database.serviceAccount}`);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const mFirestore = admin.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
mFirestore.settings(settings);

function  saveMatchResult(matchResult) {
    const docRef = mFirestore.collection(database.collections.matches);
    matchResult.createdAt = Date.now();
    return docRef.add(matchResult);
}

function getMatchesByNickName(nickName) {
    const docRef = mFirestore.collection(database.collections.matches);
    return docRef.where('nickName', '==', nickName)
        .get()
        .then(snapshot => {
            const docs = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                docs.push({ ...{ id: doc.id }, ...data });
            });
            return docs;
        });
}

module.exports = {
    saveMatchResult,
    getMatchesByNickName
}