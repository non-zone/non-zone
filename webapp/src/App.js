import React, { useState, useEffect } from 'react';
import './App.css';
import {
  CommunityMap,
  Pin,
  initFirebase,
  detectLocation
} from "@opencommunitymap/react-sdk";
import mapStyles from './MapsGoogleDarkStyle.json'
import {
  NewContentWidget,
  NavigationWidget,
  Splash,
  ProfileWidget,
  renderObject
} from './components'
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';


initFirebase('development')



const defaultCenter = { latitude: 42.69, longitude: 23.32 };

const Map = () => {
  const [center, setCenter] = useState(defaultCenter)
  const [zoom, setZoom] = useState()

  return <>
    <CommunityMap
      mapApiKey={GOOGLE_API_KEY}
      autolocate
      filterOrigin="non-zone"
      mapStyles={mapStyles}
      centerPin={<Pin color="#79CAB5" />}
      center={center}
      zoom={zoom}
      showZoomControls={false}
      profileWidget={<ProfileWidget />}
      renderObject={renderObject}
      navigationWidget={
        <NavigationWidget
          autolocate={() =>
            detectLocation()
              .then((loc) => setCenter(loc))
              .catch(err => alert(err.message))
          }
          zoomIn={() => setZoom((zoom = 18) => zoom + 1)}
          zoomOut={() => setZoom((zoom = 18) => zoom - 1)}
        />
      }
      onChange={(center, bounds, zoom) => { setCenter(center); setZoom(zoom); }}
    />
    <NewContentWidget loc={center} />
  </>
}


function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 3000)
  }, []);

  return (
    <div className="App">
      {loading && <Splash />}
      <Map />
    </div>
  );
}

export default App;
