import React from 'react';
import { Button, Text } from 'react-native-elements';
import Colors from '../constants/Colors';
import { Platform, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
    generateHexStringAsync,
    makeRedirectUri,
    Prompt,
    ResponseType,
    useAuthRequest,
    useAutoDiscovery,
} from 'expo-auth-session';
import firebase from 'firebase';
import { googleSignIn } from '../services/auth';
import { useAuth, useMyPublicProfile } from 'nonzone-lib';

WebBrowser.maybeCompleteAuthSession();

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = makeRedirectUri({ useProxy: true });

// Generate a random hex string for the nonce parameter
function useNonce() {
    const [nonce, setNonce] = React.useState(null);
    React.useEffect(() => {
        generateHexStringAsync(16).then((value) => setNonce(value));
    }, []);
    return nonce;
}

function ProfileScreen(props) {
    const { navigation } = props;
    const { user } = useAuth();
    let { profile } = useMyPublicProfile();
    navigation.setOptions({
        title: profile.nickname ? 'Profile settings' : 'Registration',
    });
    const nonce = useNonce();
    // Endpoint
    const discovery = useAutoDiscovery('https://accounts.google.com');
    // Request
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.IdToken,
            clientId:
                '536893121831-qk9qg5a3qar734t2rlt5so3mu380ervh.apps.googleusercontent.com',
            redirectUri,
            scopes: ['openid', 'profile', 'email'],

            // Optionally should the user be prompted to select or switch accounts
            prompt: Prompt.SelectAccount,
            extraParams: {
                nonce,
            },
            usePKCE: false,
        },
        discovery
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            console.log(id_token);
            const credential = firebase.auth.GoogleAuthProvider.credential(
                id_token
            );
            googleSignIn(credential);
            navigation.replace('WalletScreen');
        }
    }, [response]);
    return !user ? (
        <View>
            <Button
                disabled={!request || !nonce}
                color={Colors.tintColor}
                title="Login"
                onPress={() => {
                    promptAsync({ useProxy, redirectUri });
                }}
            />
        </View>
    ) : (
        <View>
            <Text>Logged in</Text>
        </View>
    );
}

export default ProfileScreen;
