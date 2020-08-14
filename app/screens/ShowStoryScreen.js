import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

export default function ShowStoryScreen({ route }) {
    const { title, image, description } = route.params;
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Text h4>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            <Image
                source={{ uri: image }}
                style={{ height: 200, resizeMode: 'contain', marginTop: 20 }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    contentContainer: {
        paddingVertical: 15,
    },
    description: {
        marginTop: 10,
    },
});
