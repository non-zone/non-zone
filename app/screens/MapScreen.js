import React, { useEffect, useMemo, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { Avatar, Button, Icon, Image } from 'react-native-elements';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import mapStyle from '../constants/mapStyle';
import {
    useAuth,
    useLoadStoriesByRegion,
    useMyPublicProfile,
} from 'nonzone-lib';
import * as Location from 'expo-location';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;

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
    const { user } = useAuth();
    let { profile } = useMyPublicProfile();
    let [latitudeDelta, setLatitudeDelta] = useState(10);
    let [longitudeDelta, setLongitudeDelta] = useState(
        latitudeDelta * ASPECT_RATIO
    );

    let [location, setLocation] = useState(null);

    let [physicalLocation, setPhysicalLocation] = useState(null);
    const bounds = useMemo(() => (location ? loc2bounds(location) : null), [
        location,
    ]);
    const { navigation } = props;
    let mapView = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('location not granted');
            }

            let position = await Location.getCurrentPositionAsync({});
            // console.log('Detected current position:', position);

            let newLocation = {
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            setLocation(newLocation);
            if (!physicalLocation) {
                setPhysicalLocation(newLocation);
            }
        })();
    }, []);

    useEffect(() => {
        async function adjustZoom() {
            let latitudeDeltaTemp = 10;

            if (profile && profile.type === 'zoner') {
                latitudeDeltaTemp = 0.01;
            }

            setLatitudeDelta(latitudeDeltaTemp);
            let longitudeDeltaTemp = latitudeDeltaTemp * ASPECT_RATIO;
            setLongitudeDelta(longitudeDeltaTemp);

            setPhysicalLocation({
                ...physicalLocation,
                latitudeDelta: latitudeDeltaTemp,
                longitudeDelta: longitudeDeltaTemp,
            });
            setLocation(physicalLocation);
        }

        adjustZoom();
    }, [profile]);

    useEffect(() => {
        if (mapView) {
            goToPhysicalLocation();
        }
    }, [physicalLocation]);

    const { data = [] } = useLoadStoriesByRegion(bounds);

    const createStory = async () => {
        if (user) {
            let position = await Location.getCurrentPositionAsync({});
            navigation.navigate('CreateStory', position.coords);
        } else {
            navigation.navigate('ProfileScreen');
        }
    };

    const goToPhysicalLocation = () => {
        if (mapView && mapView.current) {
            mapView.current.animateToRegion(physicalLocation, 0);
        } else {
            console.log('mapView does not exist yet');
        }
    };

    return (
        <View style={styles.container}>
            {location !== null ? (
                <View>
                    <MapView
                        ref={mapView}
                        style={styles.mapStyle}
                        initialRegion={location}
                        minZoomLevel={2}
                        maxZoomLevel={18}
                        customMapStyle={mapStyle}
                        provider={PROVIDER_GOOGLE}
                        onLongPress={createStory}
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
                                        navigation.navigate('ShowStory', marker)
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
                    <Avatar
                        size={63}
                        rounded
                        onPress={() => {
                            if (user) {
                                navigation.toggleDrawer();
                            } else {
                                navigation.navigate('ProfileScreen');
                            }
                        }}
                        containerStyle={{
                            position: 'absolute', //use absolute position to show button on top of the map
                            top: '5%', //for center align
                            right: '5%',
                            alignSelf: 'flex-end', //for align to right
                            borderColor: 'white',
                            borderWidth: 3,
                        }}
                        renderPlaceholderContent={
                            user ? (
                                <Image
                                    source={{
                                        uri: user && user.photoURL,
                                    }}
                                    style={{ height: 63, width: 63 }}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Icon name="person" color="white" size={50} />
                            )
                        }
                    />

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
                        onPress={createStory}
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
                        onPress={async () => {
                            let position = await Location.getCurrentPositionAsync(
                                {}
                            );
                            setPhysicalLocation({
                                latitudeDelta: latitudeDelta,
                                longitudeDelta: longitudeDelta,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            });
                        }}
                    />
                </View>
            ) : (
                <View></View>
            )}
        </View>
    );
};

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        backgroundColor: Colors.tintBackground,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 10,
    },
    button: {
        backgroundColor: Colors.buttonBackground,
    },
});
