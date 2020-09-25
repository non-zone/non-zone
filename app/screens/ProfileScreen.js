import React, { useState } from 'react';
import {
    Avatar,
    Button,
    Icon,
    Text,
    Input,
    ButtonGroup,
    Image,
} from 'react-native-elements';
import Colors from '../constants/Colors';
import {
    Platform,
    TouchableOpacity,
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
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
import { useAuth, useMyPublicProfile, updateUserProfile } from 'nonzone-lib';
import WelcomeBlock from '../components/WelcomeBlock';
import Line from '../components/Line';

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

const TypeButton = (props) => (
    <View
        style={{
            backgroundColor: Colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
        }}
    >
        <Icon name={props.icon} color={Colors.tintColor} />
        <Text style={{ color: '#8D8D8F', fontSize: 16 }}>{props.name}</Text>
        <Text style={{ color: 'white', fontSize: 11 }}>
            {props.description}
        </Text>
    </View>
);

const zonerButton = () => (
    <TypeButton
        name="Zoner"
        description="Create, pin and own new stories."
        icon="camera-alt"
    />
);
const explorerButton = () => (
    <TypeButton
        name="Explorer"
        description="Discover & interact with exciting stories."
        icon="explore"
    />
);
const buttons = [{ element: zonerButton }, { element: explorerButton }];

function ProfileScreen(props) {
    const { navigation } = props;
    const { user } = useAuth();
    let { profile } = useMyPublicProfile();
    const [nickname, setNickname] = useState(
        profile?.nickname ? profile.nickname : ''
    );
    const [typeIndex, setTypeIndex] = useState(
        profile?.type === 'explorer' ? 1 : 0
    );
    const [updating, setUpdating] = useState(false);

    navigation.setOptions({
        title: profile?.nickname ? 'Profile settings' : 'Registration',
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

    const updateUser = async () => {
        setUpdating(true);
        try {
            await updateUserProfile(user.uid, {
                nickname,
                type: typeIndex == 1 ? 'explorer' : 'zoner',
            });
            navigation.navigate('WalletScreen');
        } catch (err) {
            console.log(err);
        } finally {
            setUpdating(false);
        }
    };

    return !user ? (
        <View>
            <View style={styles.avatarContainer}>
                <Avatar
                    size={63}
                    rounded
                    containerStyle={{
                        alignSelf: 'center',
                        borderColor: 'white',
                        borderWidth: 1,
                        marginRight: 20,
                    }}
                    renderPlaceholderContent={
                        <Icon name="person" color="white" size={50} />
                    }
                />
                <View>
                    <Text>This is your Space.</Text>
                </View>
            </View>
            <WelcomeBlock />
            <Button
                disabled={!request || !nonce}
                color={Colors.tintColor}
                icon={{
                    name: 'google',
                    color: 'white',
                    type: 'font-awesome',
                }}
                title="Sign in"
                onPress={async () => {
                    await promptAsync({ useProxy, redirectUri });
                }}
                buttonStyle={{ alignSelf: 'center' }}
            />
        </View>
    ) : (
        <ScrollView style={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar
                    size={63}
                    rounded
                    containerStyle={{
                        alignSelf: 'center',
                        borderColor: 'white',
                        borderWidth: 1,
                        marginRight: 20,
                    }}
                    renderPlaceholderContent={
                        user ? (
                            <Image
                                source={{
                                    uri: user && user.photoURL,
                                }}
                                style={{ height: 63, width: 63 }}
                                resizeMode="contain"
                            />
                        ) : (
                            <Icon name="person" color="white" size={50} />
                        )
                    }
                />
                <View>
                    {profile.nickname ? <Text>{profile.nickname}</Text> : null}
                    {!profile.nickname ? <Text>{user.email}</Text> : null}
                    {profile.nickname ? (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ProfileScreen')}
                        >
                            <Text
                                style={{
                                    color: Colors.tintColor,
                                    textDecorationLine: 'underline',
                                }}
                            >
                                Change avatar
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            {profile.nickname ? <Line /> : <WelcomeBlock />}

            <Input
                label="Your public name"
                labelStyle={{
                    color: Colors.textColor,
                    fontSize: 16,
                    fontWeight: 'normal',
                }}
                value={nickname}
                onChangeText={(value) => setNickname(value)}
            />

            {profile.nickname ? (
                <Text style={styles.labelText}>Feeling different today?</Text>
            ) : (
                <Text style={styles.labelText}>
                    How do you see yourself the most?
                </Text>
            )}

            <ButtonGroup
                buttons={buttons}
                vertical={true}
                containerStyle={{
                    marginTop: 20,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    height: 200,
                    width: '100%',
                    alignSelf: 'center',
                }}
                selectedButtonStyle={{
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    borderWidth: 3,
                    borderColor: Colors.tintColor,
                }}
                innerBorderStyle={{ color: 'transparent' }}
                selectedIndex={typeIndex}
                onPress={(selectedIndex) => setTypeIndex(selectedIndex)}
            />

            <Button
                buttonStyle={{
                    width: 200,
                    alignSelf: 'center',
                    marginBottom: 20,
                }}
                title={profile.nickname ? 'Update' : 'Start'}
                onPress={updateUser}
                loading={updating}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    labelText: {
        marginLeft: 10,
        color: Colors.textColor,
        fontSize: 16,
        fontWeight: 'normal',
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
});

export default ProfileScreen;
