import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

export default function ShowStoryScreen({ route }) {
    const { image, description } = route.params;
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Image
                source={{ uri: image }}
                style={{ height: 200, resizeMode: 'stretch', margin: 5 }}
            />
            <Text>{description}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingTop: 15,
    },
});
