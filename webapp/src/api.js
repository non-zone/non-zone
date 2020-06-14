import axios from 'axios';
const {
  REACT_APP_OCM_HOST: HOST = 'https://communitymap.online',
  REACT_APP_OCM_TOKEN: TOKEN,
} = process.env;

console.log({ HOST, TOKEN });

/**
 * Creates new object in OCM DB
 *
 * @param {props} object Props of create map object
 *
 * type: story|place
 * loc: {latitude: number, longitude: number}
 */
export const addNewObject = async ({
  type,
  loc,
  title,
  description,
  external_data = null,
}) => {
  const uri = `${HOST}/api/v0/object/?token=${TOKEN}`;
  const data = {
    type,
    loc,
    title,
    description,
    external_data,
    valid_until: '2100-01-01', //temp
  };

  console.debug('Add new object', uri, JSON.stringify(data));

  const res = await axios.post(uri, data);
  console.debug('Result:', res.data);
};
