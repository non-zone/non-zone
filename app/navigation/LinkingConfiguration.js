import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    Root: {
      path: 'root',
      screens: {
        Home: 'home',
        Profile: 'profile',
        CreateStory: 'createStory',
        ShowStory: 'showStory',
        Map: 'map',
      },
    },
  },
};
