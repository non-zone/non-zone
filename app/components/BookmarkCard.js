import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import Colors from '../constants/Colors';
import { useLoadStory } from 'nonzone-lib';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigation } from '@react-navigation/native';

dayjs.extend(relativeTime);
const size = 128;

export default function BookmarkCard(props) {
    const { bookmark } = props;
    const { data: story } = useLoadStory(bookmark.objectId);
    const navigation = useNavigation();

    return story ? (
        <TouchableOpacity
            onPress={() => navigation.navigate('ShowStory', story)}
        >
            <View style={styles.container}>
                <Image style={styles.image} source={{ uri: story.image }} />
                <Text numberOfLines={1} style={styles.title}>
                    {bookmark.title}
                </Text>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.text}
                >
                    {dayjs(bookmark.date).fromNow()}
                </Text>
            </View>
        </TouchableOpacity>
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
