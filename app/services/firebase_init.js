import * as firebase from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import firebaseConfigDev from '../firebaseConfigDev';

const { NODE_ENV = 'development' } = process.env;
const fbConf = NODE_ENV === 'production' ? firebaseConfig : firebaseConfigDev;

console.log('Init with', fbConf);
firebase.initializeApp(fbConf);
