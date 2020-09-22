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
import { Platform, View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Button, Avatar, Text, Icon } from 'react-native-elements';
import StoryCard from '../components/StoryCard';
import BookmarkCard from '../components/BookmarkCard';
import Line from '../components/Line';
import {
    signOut,
    useAuth,
    useLoadMyBookmarks,
    useLoadUserStories,
    useMyWallet,
    useMyPublicProfile,
} from 'nonzone-lib';
import { googleSignIn } from '../services/auth';

import Colors from '../constants/Colors';
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

export default function WalletScreen() {
    const { user } = useAuth();
    let bookmarks = useLoadMyBookmarks();
    let stories = useLoadUserStories(user?.uid, false);
    let { balance } = useMyWallet(user?.uid);
    let { profile } = useMyPublicProfile();

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
        <ScrollView style={styles.container}>
            {!user && (
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
            )}
            {user && (
                <View>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            size={63}
                            rounded
                            source={{
                                uri: user.photoURL,
                            }}
                            containerStyle={{
                                alignSelf: 'center',
                                borderColor: 'white',
                                borderWidth: 1,
                            }}
                        />
                        <View>
                            <Text>{profile.nickname}</Text>
                            <Text>{user.email}</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Icon
                                    style={{ marginRight: 10 }}
                                    size={18}
                                    type="material"
                                    name="camera-alt"
                                    color={Colors.tintColor}
                                />
                                <Text>{user.type ? user.type : 'Zoner'}</Text>
                            </View>
                        </View>
                        <View>
                            <Icon name="edit" color={Colors.tintColor} />
                        </View>
                    </View>
                    <View
                        style={{
                            width: Layout.window.width - 50,
                            marginTop: 20,
                            marginHorizontal: 25,
                        }}
                    >
                        <Text style={styles.text}>
                            Welcome to <Text style={styles.bold}>Non-zone</Text>
                        </Text>
                        <Text style={styles.text}>
                            This is your{' '}
                            <Text style={styles.bold}>secret place</Text>, let
                            us{'\n'}
                            make it{' '}
                            <Text style={styles.bold}>more personal</Text> for
                            you.
                        </Text>
                    </View>

                    <Line />

                    <Text style={styles.balanceText}>
                        Your balance is {balance} SPACE
                    </Text>

                    <Text style={styles.title}>My Bookmarks</Text>
                    <FlatList
                        style={styles.list}
                        horizontal={true}
                        data={bookmarks.data}
                        renderItem={({ item, index }) => (
                            <BookmarkCard key={index} bookmark={item} />
                        )}
                        keyExtractor={(item) => item.objectId}
                        ListEmptyComponent={() => (
                            <Text style={styles.disabledText}>
                                You haven't saved any bookmarks yet
                            </Text>
                        )}
                    />

                    <Text style={styles.title}>My Stories</Text>
                    <FlatList
                        style={styles.list}
                        horizontal={true}
                        data={stories.data}
                        renderItem={({ item, index }) => (
                            <StoryCard key={index} story={item} />
                        )}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={() => (
                            <Text style={styles.disabledText}>
                                You haven't created any stories yet
                            </Text>
                        )}
                    />
                    <Button
                        title="Logout"
                        onPress={() => {
                            signOut();
                        }}
                        buttonStyle={{
                            width: 200,
                            alignSelf: 'center',
                            marginTop: 30,
                            marginBottom: 20,
                        }}
                    />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    text: {
        fontSize: 18,
        color: Colors.textColor,
    },
    disabledText: {
        color: Colors.disabledText,
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.textColor,
    },
    title: {
        fontSize: 20,
        marginLeft: 10,
        marginVertical: 10,
        color: Colors.textColor,
    },
    balanceText: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.textColor,
    },
    list: {
        marginLeft: 10,
        marginBottom: 10,
    },
});
