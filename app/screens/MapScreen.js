import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

class MapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [
        {
          coordinate: {
            latitude: 51.2992875,
            longitude: 4.6915887,
          },
          title: 'Jeugdhuis Babylon',
          description: 'A great and fairly cheap place to have a drink and chill with the youth of the town of Westmalle',
          image: 'https://via.placeholder.com/728x200.png?text=Jeugdhuis+Babylon',
        },
        {
          coordinate: {
            latitude: 51.2832156,
            longitude: 4.6562933,
          },
          title: 'Westmalle Trappist Abbey',
          description: 'This is where the monks brew the Westmalle Trappist beer, also a very nice place to go for a walk with lots of forrest to bathe in.',
          image: 'https://via.placeholder.com/728x200.png?text=Westmalle+Trappisten',
        },
      ],
    };
  }

  render() {
    return (
        <View style={styles.container}>
          <MapView style={styles.mapStyle} minZoomLevel={4}>
            {this.state.markers.map(marker => (
                <Marker
                    key={marker.title}
                    coordinate={marker.coordinate}
                    title={marker.title}
                    description={marker.description}
                    image={require('../assets/images/marker.png')}
                    onPress={() => this.props.navigation.navigate('ShowStory', marker)}
                />
            ))}
          </MapView>
        </View>
    );
  }
}

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
