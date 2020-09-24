import * as React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Button, Avatar, Text, Icon } from 'react-native-elements';
import StoryCard from '../components/StoryCard';
import BookmarkCard from '../components/BookmarkCard';
import WelcomeBlock from '../components/WelcomeBlock';
import {
    signOut,
    useAuth,
    useLoadMyBookmarks,
    useLoadUserStories,
    useMyPublicProfile,
} from 'nonzone-lib';

import Colors from '../constants/Colors';

export default function WalletScreen(props) {
    const { user } = useAuth();
    let bookmarks = useLoadMyBookmarks();
    let stories = useLoadUserStories(user?.uid, false);
    let { profile } = useMyPublicProfile();
    const { navigation } = props;

    return user ? (
        <ScrollView style={styles.container}>
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
                                name={
                                    profile.type === 'explorer'
                                        ? 'explore'
                                        : 'camera-alt'
                                }
                                color={Colors.tintColor}
                            />
                            <Text>{profile.type ? profile.type : 'zoner'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ProfileScreen')}
                    >
                        <Icon name="edit" color={Colors.tintColor} />
                    </TouchableOpacity>
                </View>

                <WelcomeBlock />

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
                        navigation.replace('MapScreen');
                    }}
                    buttonStyle={{
                        width: 200,
                        alignSelf: 'center',
                        marginTop: 30,
                        marginBottom: 20,
                    }}
                />
            </View>
        </ScrollView>
    ) : null;
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
    disabledText: {
        color: Colors.disabledText,
    },
    title: {
        fontSize: 20,
        marginLeft: 10,
        marginVertical: 10,
        color: Colors.textColor,
    },
    list: {
        marginLeft: 10,
        marginBottom: 10,
    },
});
