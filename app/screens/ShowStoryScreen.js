import React, { useState } from 'react';
import {
    StyleSheet,
    Image,
    Dimensions,
    View,
    TouchableOpacity,
} from 'react-native';
import {
    Text,
    Icon,
    Input,
    Button,
    Overlay,
    Avatar,
} from 'react-native-elements';
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
    leaveComment,
    sendTip,
} from 'nonzone-lib';

import Comment from '../components/Comment';

const { width } = Dimensions.get('window');

export default function ShowStoryScreen({ route, navigation }) {
    const { uid, id, kind, title, image, description } = route.params;
    const { user } = useAuth();
    const { data: bookmarks } = useLoadMyBookmarks();
    const isBookmarked = bookmarks?.some((b) => b.objectId === id);

    const { data: additionalDataArr } = useLoadAdditionalInfoForObjects([id]);
    const additionalData = additionalDataArr?.[id];

    const storyLikes = Object.values(additionalData?.likes || {});
    const _isLikedDB = storyLikes.some((t) => t.uid === user?.uid);
    const [_isLikedState, setIsLiked] = useState(false);
    const isLikedByMe = _isLikedDB || _isLikedState;
    const comments = Object.values(additionalData?.comments || []);

    let [savingComment, setSavingComment] = useState(false);
    const [comment, setComment] = useState('');
    let [tippingModalVisible, setTippingModalVisible] = useState(false);

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

    const saveComment = async () => {
        setSavingComment(true);
        console.log('save');

        try {
            await leaveComment(id, comment);
        } catch (err) {
            console.log(err.message);
        } finally {
            setComment('');
            setSavingComment(false);
            setTippingModalVisible(true);
        }
    };

    const tipStory = async (amount) => {
        console.log(amount, 'tipped');
        try {
            await sendTip(uid, amount, id);
            console.log('tip successful');
        } catch (err) {
            console.log(err);
        } finally {
            setTippingModalVisible(false);
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

                <Text style={{ color: Colors.border }}>#{kind}</Text>

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
                    comments.map((item, index) => (
                        <Comment key={index} comment={item} />
                    ))
                )}
            </ScrollView>
            {user ? (
                <View>
                    <Input
                        placeholder="Comment"
                        disabled={savingComment}
                        value={comment}
                        onChangeText={(value) => setComment(value)}
                        style={{ bottom: 0 }}
                        rightIcon={
                            <TouchableOpacity onPress={saveComment}>
                                <Icon name="send" color="white" />
                            </TouchableOpacity>
                        }
                    />
                </View>
            ) : (
                <View style={{ paddingHorizontal: 10 }}>
                    <Text>
                        In order to comment on a story you need to log into your
                        account
                    </Text>
                    <Button
                        title="Login"
                        onPress={() => navigation.navigate('ProfileScreen')}
                        buttonStyle={{ width: 200, alignSelf: 'center' }}
                    />
                </View>
            )}
            <Overlay
                isVisible={tippingModalVisible}
                onBackdropPress={() => setTippingModalVisible(false)}
                overlayStyle={{
                    backgroundColor: Colors.background,
                    marginHorizontal: 20,
                }}
            >
                <Text>
                    Thanks! Now, traveling may be tiring, would you like to
                    offer a coffee to the author?
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        margin: 20,
                    }}
                >
                    <Avatar
                        rounded
                        size={50}
                        title="1"
                        activeOpacity={0.5}
                        onPress={() => {
                            tipStory(3);
                        }}
                        overlayContainerStyle={{
                            backgroundColor: Colors.tintColor,
                        }}
                    />
                    <Avatar
                        rounded
                        size={50}
                        title="3"
                        activeOpacity={0.5}
                        onPress={() => {
                            tipStory(1);
                        }}
                        overlayContainerStyle={{
                            backgroundColor: Colors.tintColor,
                        }}
                    />
                    <Avatar
                        rounded
                        size={50}
                        title="5"
                        activeOpacity={0.5}
                        onPress={() => {
                            tipStory(5);
                        }}
                        overlayContainerStyle={{
                            backgroundColor: Colors.tintColor,
                        }}
                    />
                </View>
            </Overlay>
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
