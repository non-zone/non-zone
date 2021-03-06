import * as Linking from 'expo-linking';

export default {
    prefixes: [Linking.makeUrl('/')],
    config: {
        Root: {
            path: 'root',
            screens: {
                Home: 'home',
                Wallet: 'wallet',
                CreateStory: 'createStory',
                ShowStory: 'showStory',
                Map: 'map',
                Profile: 'profile',
            },
        },
    },
};
