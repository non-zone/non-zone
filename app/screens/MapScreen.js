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
                    key={marker}
                    coordinate={marker.coordinate}
                    title={marker.title}
                    description={marker.description}
                    image={require('../assets/images/marker.png')}
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
