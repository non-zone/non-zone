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
    REDEEM_SPACE: 'REDEEM_SPACE',
    SEND_TIP: 'SEND_TIP',
    RECEIVE_TIP: 'RECEIVE_TIP',
};

const getActionValue = (type, optionalAmount) => {
    switch (type) {
        case types.OBJECT_PUBLISH:
            return -5;
        case types.PROFILE_CREATE:
            return 10;
        case types.REDEEM_SPACE:
            return 10;
        case types.SEND_TIP:
            return -optionalAmount;
        case types.RECEIVE_TIP:
            return optionalAmount;
        default:
            return 0;
    }
};

const calcBalance = (activity) => {
    const balance = activity.reduce((sum, act) => {
        return sum + getActionValue(act.type, act.amount);
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

exports.checkRedeemBalance = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called ' + 'while authenticated.'
        );
    }
    const uid = context.auth.uid;
    const date = new Date().toISOString().substr(0, 10);
    const ref = firebase.database().ref('/user-redeem').child(uid).child(date);
    const snap = await ref.once('value');
    if (snap && snap.val()) {
        return 0;
    }

    // do not redeem for profile created today
    const refActivity = firebase
        .database()
        .ref('/users-activity')
        .child(uid)
        .limitToFirst(1);
    const snapFirstActivity = await refActivity.once('value');
    if (
        !snapFirstActivity ||
        !snapFirstActivity.val() ||
        Object.values(snapFirstActivity.val())[0].timestamp.substr(0, 10) ===
            date
    ) {
        // profile created today or being created at the moment
        return 0;
    }

    const type = types.REDEEM_SPACE;
    const newActivity = {
        type,
        timestamp: new Date().toISOString(),
    };
    await applyNewActivity(uid, newActivity);

    await ref.set(true);

    return getActionValue(type);
});

exports.tipUser = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called ' + 'while authenticated.'
        );
    }
    const { amount, recipient } = data;
    if (!amount || !recipient) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'amount and recipient arguments are expected'
        );
    }

    const uid = context.auth.uid;
    if (uid === recipient) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Cannot tip self'
        );
    }

    const senderWalletRef = firebase.database().ref('users-wallets').child(uid);
    const recipientWalletRef = firebase
        .database()
        .ref('users-wallets')
        .child(uid);

    const timestamp = new Date().toISOString();

    const senderWallet = await senderWalletRef.once('value');
    if (!senderWallet || senderWallet.balance < amount) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Insufficient funds'
        );
    }

    const recpWallet = await recipientWalletRef.once('value');
    if (!recpWallet) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Recipient not found'
        );
    }

    const activitySender = {
        type: types.SEND_TIP,
        timestamp,
        amount,
        recipient,
    };
    await applyNewActivity(uid, activitySender);

    const activityRecipient = {
        type: types.RECEIVE_TIP,
        timestamp,
        amount,
        sender: uid,
    };
    await applyNewActivity(recipient, activityRecipient);

    return 'Tipping successful';

    // perhaps a better implementation, but not how the others work at the moment
    // TODO review in future
    //
    // await senderWalletRef.transaction(wallet => {
    //     if(!wallet || wallet.balance < amount) {
    //         throw new functions.https.HttpsError(
    //             'failed-precondition',
    //             'Balance too low'
    //         );
    //     }
    //     wallet.balance -= amount;
    //     return wallet
    // })
    // await receiptWalletRef.transaction(wallet => {
    //     wallet.balance += amount;
    //     return wallet
    // })
});
