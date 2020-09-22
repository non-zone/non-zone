import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import Colors from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';

const size = 128;

export default function StoryCard(props) {
    const { story } = props;
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('ShowStory', story)}
        >
            <View style={styles.container}>
                <Image style={styles.image} source={{ uri: story.image }} />
                <Text numberOfLines={1} style={styles.title}>
                    {story.title}
                </Text>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.text}
                >
                    {story.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        width: size,
        height: size + 40,
        borderRadius: 5,
        backgroundColor: Colors.tintColor,
    },
    image: {
        width: size,
        height: size,
        resizeMode: 'cover',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    title: {
        color: 'white',
        fontSize: 14,
        marginHorizontal: 10,
        marginVertical: 2,
    },
    text: {
        color: Colors.background,
        fontSize: 10,
        marginHorizontal: 10,
        marginVertical: 2,
    },
});
