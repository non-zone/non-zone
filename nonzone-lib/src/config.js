import firebaseConfig from './firebaseConfig';
import firebaseConfigDev from './firebaseConfigDev';

const { REACT_APP_NONZONE_ENV, REACT_NATIVE_NONZONE_ENV } = process.env;
const NONZONE_ENV =
    REACT_APP_NONZONE_ENV || REACT_NATIVE_NONZONE_ENV || 'development';
export const getNonzoneEnv = () => NONZONE_ENV;

const fbConf =
    NONZONE_ENV === 'production' ? firebaseConfig : firebaseConfigDev;
export const googleConfig = fbConf;
