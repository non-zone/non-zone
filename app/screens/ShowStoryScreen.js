import React, { useState } from 'react';
import {
    StyleSheet,
    Image,
    Dimensions,
    View,
    TouchableOpacity,
} from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import Line from '../components/Line';
import {
    useLoadMyBookmarks,
    useLoadAdditionalInfoForObjects,
    useAuth,
    likeObject,
    setBookmarkObject,
    clearBookmarkObject,
} from 'nonzone-lib';

import Comment from '../components/Comment';

const { width } = Dimensions.get('window');

export default function ShowStoryScreen({ route, navigation }) {
    const { id, kind, title, image, description } = route.params;
    const { user } = useAuth();
    const { data: bookmarks } = useLoadMyBookmarks();
    const isBookmarked = bookmarks?.some((b) => b.objectId === id);

    const { data: additionalDataArr } = useLoadAdditionalInfoForObjects([id]);
    const additionalData = additionalDataArr?.[id];
    const storyTips = Object.values(additionalData?.tips || {});
    console.log(storyTips.length);

    const storyLikes = Object.values(additionalData?.likes || {});
    const _isLikedDB = storyLikes.some((t) => t.uid === user?.uid);
    const [_isLikedState, setIsLiked] = useState(false);
    const isLikedByMe = _isLikedDB || _isLikedState;
    const comments = Object.values(additionalData?.comments || []);

    const _like = async () => {
        setIsLiked(true);
        try {
            await likeObject(id);
        } catch (err) {
            console.log(err.message);
        }
    };

    const _toggleBookmark = () => {
        if (!isBookmarked) {
            setBookmarkObject(user.uid, id, title);
        } else {
            clearBookmarkObject(user.uid, id);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon
                        size={24}
                        name="close"
                        color="white"
                        style={{ marginRight: 10 }}
                    />
                </TouchableOpacity>
                <Text
                    numberOfLines={1}
                    style={{ flex: 1, fontSize: 16, fontWeight: 'bold' }}
                >
                    {title}
                </Text>
                <TouchableOpacity onPress={_like}>
                    <Icon
                        size={24}
                        name={isLikedByMe ? 'favorite' : 'favorite-border'}
                        color={isLikedByMe ? 'red' : 'white'}
                        style={{ marginLeft: 10 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={_toggleBookmark}>
                    <Icon
                        size={24}
                        name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                        color="white"
                        style={{ marginLeft: 10 }}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Image
                    source={{ uri: image }}
                    style={{
                        height: 244,
                        width: width - 20,
                        resizeMode: 'contain',
                    }}
                />
                <Text style={styles.description}>{description}</Text>

                <Text style={{ color: Colors.border, paddingBottom: 0 }}>
                    #{kind}
                </Text>

                <Line
                    thickness={1}
                    marginTop={2}
                    marginBottom={0}
                    marginLeft={0}
                    marginRight={0}
                />

                {comments.length == 0 ? (
                    <Text
                        style={{
                            textAlign: 'center',
                            marginBottom: 20,
                            marginTop: 20,
                        }}
                    >
                        Did you enjoy the story?{' '}
                        <Text style={{ textDecorationLine: 'underline' }}>
                            Leave a note!
                        </Text>
                    </Text>
                ) : (
                    comments.map((item) => <Comment comment={item} />)
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.tintBackground,
        flex: 1,
        paddingBottom: 10,
    },
    contentContainer: {
        paddingHorizontal: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    description: {
        marginVertical: 10,
    },
});
