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
    OBJECT_UPDATE: 'OBJECT_UPDATE',
    OBJECT_DELETE: 'OBJECT_DELETE',
    OBJECT_PUBLISH: 'OBJECT_PUBLISH',
    PROFILE_CREATE: 'PROFILE_CREATE',
};

const getActionValue = (type) => {
    switch (type) {
        case types.OBJECT_PUBLISH:
            return -5;
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
    .onCreate(async (snapshot, context) => {
        const { uid } = context.auth;
        functions.logger.info('Profile created', { data: snapshot.val(), uid });

        await firebase
            .database()
            .ref('users-public')
            .child(uid)
            .update({ created: new Date().toISOString() });

        const newActivity = {
            type: types.PROFILE_CREATE,
            timestamp: new Date().toISOString(),
            data: snapshot.val(),
        };
        return applyNewActivity(uid, newActivity);
    });

exports.onObjectChanged = functions.database
    .ref('objects/{objectId}')
    .onUpdate((change, context) => {
        const { uid } = context.auth;
        const { before, after } = change;
        functions.logger.info('Object changed', {
            data: after.val(),
            id: context.params.objectId,
            uid,
        });
        const isUpdated = before.exists() && after.exists();
        const isDeleted = before.exists() && !after.exists();
        const isPublished =
            isUpdated && !before.val().published && !!after.val().published;
        let type = types.OBJECT_CREATE;
        if (isPublished) {
            type = types.OBJECT_PUBLISH;
        } else if (isUpdated) {
            type = types.OBJECT_UPDATE;
        } else if (isDeleted) {
            type = types.OBJECT_DELETE;
        } else {
            type = 'UNKNOWN';
        }
        const newActivity = {
            type,
            timestamp: new Date().toISOString(),
            id: context.params.objectId,
            data: after.val(),
        };
        return applyNewActivity(uid, newActivity);
    });
