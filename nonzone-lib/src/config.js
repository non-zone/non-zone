import firebaseConfig from './firebaseConfig';
import firebaseConfigDev from './firebaseConfigDev';

const { REACT_APP_NONZONE_ENV = 'development' } = process.env;
const fbConf =
    REACT_APP_NONZONE_ENV === 'production' ? firebaseConfig : firebaseConfigDev;
export const googleConfig = fbConf;
