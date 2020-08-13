import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
    makeRedirectUri,
    ResponseType,
    useAuthRequest,
    useAutoDiscovery,
    generateHexStringAsync,
    Prompt,
} from 'expo-auth-session';
import firebase from 'firebase';
import { Platform, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { googleSignIn, signout, useAuth } from '../services/auth';

import colors from '../constants/Colors';

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

export default function ProfileScreen() {
    const { user } = useAuth();

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
        }
    }, [response]);

    return (
        <View style={styles.contentContainer}>
            {!user && (
                <View style={styles.buttonContainer}>
                    <Button
                        disabled={!request || !nonce}
                        color={colors.tintColor}
                        title="Login"
                        onPress={() => {
                            promptAsync({ useProxy, redirectUri });
                        }}
                    />
                </View>
            )}
            {user && (
                <View style={styles.buttonContainer}>
                    <Button
                        title="Logout"
                        onPress={() => {
                            signout();
                        }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        marginTop: 20,
    },
});
