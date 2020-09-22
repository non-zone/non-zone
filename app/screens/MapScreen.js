import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import mapStyle from '../constants/mapStyle';
import { useAuth, useLoadStoriesByRegion } from 'nonzone-lib';
import * as Location from 'expo-location';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 10;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const loc2bounds = (loc) => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = loc;
    return {
        minLat: latitude,
        minLng: longitude,
        maxLat: latitude + latitudeDelta,
        maxLng: longitude + longitudeDelta,
    };
};

export const MapScreen = (props) => {
    let [location, setLocation] = useState({
        latitude: undefined,
        longitude: undefined,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });
    let [initialLocation, setInitialLocation] = useState(null);
    const { user } = useAuth();
    const bounds = useMemo(
        () => (location.latitude ? loc2bounds(location) : null),
        [location]
    );

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('location not granted');
            }

            let position = await Location.getCurrentPositionAsync({});
            console.log('Detected current position:', position);
            let newLocation = {
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            setLocation(newLocation);
            if (!initialLocation) {
                setInitialLocation(newLocation);
            }
        })();
    }, []);

    const { data = [] } = useLoadStoriesByRegion(bounds);
    // console.log({ error, loading, data });

    return (
        <View style={styles.container}>
            {location.latitude !== undefined && (
                <View>
                    <MapView
                        style={styles.mapStyle}
                        region={location}
                        minZoomLevel={2}
                        maxZoomLevel={18}
                        customMapStyle={mapStyle}
                        provider={PROVIDER_GOOGLE}
                        onLongPress={(mapEvent) => {
                            const { coordinate } = mapEvent.nativeEvent;
                            console.log(coordinate);
                            props.navigation.navigate(
                                'CreateStory',
                                coordinate
                            );
                        }}
                        onRegionChangeComplete={(region) => {
                            if (
                                location.latitude !== region.latitude ||
                                location.longitude !== region.longitude
                            )
                                setLocation(region);
                        }}
                    >
                        {data.map((marker) => (
                            <Marker
                                key={marker.id}
                                coordinate={marker.loc}
                                title={marker.title}
                                description={marker.description}
                                image={require('../assets/images/marker.png')}
                            >
                                <Callout
                                    style={styles.calloutStyle}
                                    tooltip={true}
                                    onPress={() =>
                                        props.navigation.navigate(
                                            'ShowStory',
                                            marker
                                        )
                                    }
                                >
                                    <View style={styles.boxStyle}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                marginBottom: 8,
                                            }}
                                        >
                                            {marker.title}
                                        </Text>
                                        <Text
                                            numberOfLines={7}
                                            ellipsizeMode="tail"
                                            style={{
                                                color: 'white',
                                                fontSize: 12,
                                                fontWeight: '100',
                                            }}
                                        >
                                            {marker.description.replace(
                                                /[\r\n]+/gm,
                                                ' '
                                            )}
                                        </Text>
                                    </View>
                                    <Button
                                        style={styles.button}
                                        title="Open"
                                    />
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>
                    {user && (
                        <Avatar
                            size={63}
                            rounded
                            source={{
                                uri: user.photoURL,
                            }}
                            onPress={() =>
                                props.navigation.navigate('WalletScreen')
                            }
                            containerStyle={{
                                position: 'absolute', //use absolute position to show button on top of the map
                                top: '5%', //for center align
                                right: '5%',
                                alignSelf: 'flex-end', //for align to right
                                borderColor: 'white',
                                borderWidth: 3,
                            }}
                        />
                    )}

                    <Avatar
                        size={40}
                        rounded
                        icon={{ name: 'add-location' }}
                        containerStyle={{
                            position: 'absolute', //use absolute position to show button on top of the map
                            bottom: 80, //for center align
                            right: '5%',
                            alignSelf: 'flex-end', //for align to right
                            backgroundColor: Colors.tintColor,
                        }}
                        onPress={() => {
                            props.navigation.navigate('CreateStory', location);
                        }}
                    />

                    <Avatar
                        size={40}
                        rounded
                        icon={{ name: 'explore' }}
                        containerStyle={{
                            position: 'absolute', //use absolute position to show button on top of the map
                            bottom: 30, //for center align
                            right: '5%',
                            alignSelf: 'flex-end', //for align to right
                            backgroundColor: Colors.tintColor,
                        }}
                        onPress={() => {
                            setLocation(initialLocation);
                        }}
                    />
                </View>
            )}
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
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    calloutStyle: {
        width: 255,
    },
    boxStyle: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,106,127,0.75)',
        borderColor: '#00FFE0',
        borderWidth: 1,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#349F92',
    },
});
