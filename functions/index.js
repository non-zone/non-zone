const functions = require('firebase-functions');
const firebase = require('firebase-admin');
firebase.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
});

const types = {
    OBJECT_CREATE: 'OBJECT_CREATE',
    PROFILE_CREATE: 'PROFILE_CREATE',
};

const getActionValue = (type) => {
    switch (type) {
        case types.OBJECT_CREATE:
            return 5;
        case types.PROFILE_CREATE:
            return 10;
        default:
            return 0;
    }
};

const calcBalance = (activity) => {
    const balance = activity.reduce((sum, act) => {
        return sum + getActionValue(act.type);
    }, 0);
    functions.logger.info('Calculated balance', { balance, activity });
    return balance;
};

const applyNewActivity = async (uid, activity) => {
    const refActivity = firebase.database().ref('users-activity').child(uid);
    const snap = await refActivity.once('value');
    const existingActivity = snap.val()
        ? Object.keys(snap.val()).map((key) => snap.val()[key])
        : [];
    refActivity.push(activity);
    const newBalance = calcBalance([...existingActivity, activity]);
    return firebase
        .database()
        .ref('users-wallets')
        .child(uid)
        .child('balance')
        .set(newBalance);
};

exports.onProfileCreated = functions.database
    .ref('users-public/{uid}')
    .onCreate((snapshot, context) => {
        const { uid } = context.auth;
        functions.logger.info('Profile created', { data: snapshot.val(), uid });
        const newActivity = {
            type: types.PROFILE_CREATE,
            timestamp: new Date().toISOString(),
            data: snapshot.val(),
        };
        return applyNewActivity(uid, newActivity);
    });

exports.onObjectCreated = functions.database
    .ref('objects/{objectId}')
    .onCreate((snapshot, context) => {
        const { uid } = context.auth;
        functions.logger.info('Object created', {
            data: snapshot.val(),
            id: context.params.objectId,
            uid,
        });
        const newActivity = {
            type: types.OBJECT_CREATE,
            timestamp: new Date().toISOString(),
            id: context.params.objectId,
            data: snapshot.val(),
        };
        return applyNewActivity(uid, newActivity);
    });
