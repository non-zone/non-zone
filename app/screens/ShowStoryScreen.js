import * as React from 'react';
import { StyleSheet, Text, Image } from 'react-native';
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
        backgroundColor: '#fafafa',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 15,
    },
});
