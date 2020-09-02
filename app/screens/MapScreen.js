import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import mapStyle from '../constants/mapStyle';
import { useLoadStories } from '../services/db';

export const MapScreen = (props) => {
    const { error, loading, data = [] } = useLoadStories();
    // console.log({ error, loading, data });

    return (
        <View style={styles.container}>
            <MapView
                style={styles.mapStyle}
                minZoomLevel={2}
                customMapStyle={mapStyle}
                provider={PROVIDER_GOOGLE}
                onLongPress={(mapEvent) => {
                    const { coordinate } = mapEvent.nativeEvent;
                    console.log(coordinate);
                    props.navigation.navigate('CreateStory', coordinate);
                }}
            >
                {data.map((marker) => (
                    <Marker
                        key={marker.title}
                        coordinate={marker.loc}
                        title={marker.title}
                        description={marker.description}
                        image={require('../assets/images/marker.png')}
                        onPress={() =>
                            props.navigation.navigate('ShowStory', marker)
                        }
                    />
                ))}
            </MapView>
        </View>
    );
};

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
