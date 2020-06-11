import React, { useState, useEffect } from 'react';
import './App.css';
import { CommunityMap, Pin, initFirebase, detectLocation } from "@opencommunitymap/react-sdk";
import mapStyles from './MapsGoogleDarkStyle.json'
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || '';


initFirebase('development')

const Splash = () => {
  return <div className="Splash-header">
    {/* <img src={logo} className="Splash-logo" alt="logo" /> */}
    <p>
      Non-zone
    </p>
  </div>
}

const Navigation = ({ autolocate, zoomIn, zoomOut }) => {
  return <div style={{ position: 'fixed', bottom: 50, left: 50 }}>
    <button onClick={autolocate}>auto</button>
    <button onClick={zoomIn}>+</button>
    <button onClick={zoomOut}>-</button>
  </div>
}

const NewContentWidget = ({ loc }) => {
  const [showModal, setShowModal] = useState(false)
  return <div style={{ position: 'fixed', bottom: 50, right: 50, background: 'lightgrey' }}>
    {showModal
      ? (
        <div style={{ width: 300, height: 500 }}>
          <h3>New non-zone</h3>
          <textarea style={{ width: '100%', height: '80%' }} />
          <br />
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )
      : (
        <button onClick={() => setShowModal(true)}>New</button>
      )
    }
  </div>
}
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
      navigationWidget={
        <Navigation
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
    setTimeout(() => setLoading(false), 1000)
  }, []);

  return (
    <div className="App">
      {loading && <Splash />}
      <Map />
    </div>
  );
}

export default App;
