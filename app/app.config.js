import 'dotenv/config';

export default {
    name: 'Non-Zone',
    slug: 'Non-Zone',
    platforms: ['ios', 'android', 'web'],
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'nonzone',
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#1b1d1f',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'app.nonzone.nonzone',
        buildNumber: '1.0.0',
    },
    android: {
        package: 'app.nonzone.nonzone',
        versionCode: 1,
        config: {
            googleMaps: {
                apiKey: process.env.GOOGLE_API_KEY_ANDROID,
            },
        },
    },
    androidStatusBar: {
        barStyle: 'light-content',
    },
    web: {
        favicon: './assets/images/favicon.ico',
    },
};
