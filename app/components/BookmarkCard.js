import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
import Colors from '../constants/Colors';
import { useLoadStory } from 'nonzone-lib';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
const size = 128;

export default function BookmarkCard(props) {
    const { bookmark } = props;
    const { data: story } = useLoadStory(bookmark.objectId);
    console.log(story);
    return story ? (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: story.image }} />
            <Text numberOfLines={1} style={styles.title}>
                {bookmark.title}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
                {dayjs(bookmark.date).fromNow()}
            </Text>
        </View>
    ) : null;
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        width: size,
        height: size + 40,
        borderRadius: 5,
        backgroundColor: '#202022',
    },
    image: {
        width: size,
        height: size,
        resizeMode: 'cover',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    title: {
        color: Colors.tintColor,
        fontSize: 14,
        marginHorizontal: 10,
        marginVertical: 2,
    },
    text: {
        color: Colors.textColor,
        fontSize: 10,
        marginHorizontal: 10,
        marginVertical: 2,
    },
});
