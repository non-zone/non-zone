const { createMetroConfiguration } = require('expo-yarn-workspaces');
let config = createMetroConfiguration(__dirname);
config.resolver.extraNodeModules = require('node-libs-react-native');
module.exports = config;
