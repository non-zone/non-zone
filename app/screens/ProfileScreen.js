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
import { Button, Avatar, Card, Text, Input } from 'react-native-elements';
import { googleSignIn, signout, useAuth } from '../services/auth';

import colors from '../constants/Colors';
import Layout from '../constants/Layout';

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
                <View style={styles.container}>
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
                </View>
            )}
            {user && (
                <View style={styles.container}>
                    <Avatar
                        size="large"
                        rounded
                        source={{
                            uri: user.photoURL,
                        }}
                        containerStyle={{ alignSelf: 'center' }}
                    />
                    <View
                        style={{
                            width: Layout.window.width - 20,
                            marginTop: 20,
                        }}
                    >
                        <Text style={styles.text}>
                            Welcome to <Text style={styles.bold}>Non-zone</Text>
                        </Text>
                        <Text>
                            This is your{' '}
                            <Text style={styles.bold}>secret place</Text>, help
                            us to make it{' '}
                            <Text style={styles.bold}>more personal</Text> for
                            you.
                        </Text>
                        <Input
                            disabled
                            placeholder="Your nickname"
                            value={user.displayName}
                            inputContainerStyle={{ marginTop: 20 }}
                        />
                    </View>

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
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    contentContainer: {
        marginTop: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
});
