import * as firebase from 'firebase/app';
import 'firebase/auth';

export const googleSignIn = (credential) => {
    firebase
        .auth()
        .signInWithCredential(credential)
        .then((userCred) => {
        })
        .catch((err) => console.log('Error signing in:', err));
};
