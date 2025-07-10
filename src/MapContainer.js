import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  OverlayView,
  InfoWindow,
  useJsApiLoader
} from '@react-google-maps/api';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from './firebase';

// Import local assets
import f1 from './assets/f1.jpg';
import f2 from './assets/f2.jpg';
import f3 from './assets/f3.jpg';
import m1 from './assets/m1.jpg';
import aashay from './assets/aashay.jpg';

const imageMap = {
  "f1.jpg": f1,
  "f2.jpg": f2,
  "f3.jpg": f3,
  "aashay.jpg": aashay,
  "m1.jpg": m1
};

const db = getFirestore(app);

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 37.6189,
  lng: -122.3750
};

function MapContainer() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_googleMapsApiKey
  });

  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Tracking"));
        const users = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const docId = doc.id;

          const lastDashIndex = docId.lastIndexOf("-");
          const latStr = docId.substring(0, lastDashIndex);
          const lngStr = "-" + docId.substring(lastDashIndex + 1);

          const lat = parseFloat(latStr);
          const lng = parseFloat(lngStr);

          users.push({
            id: docId,
            lat,
            lng,
            status: data.Status || "No status",
            image: data.image || "f1.jpg",
            name: data.UserName
          });
        });

        setLocations(users);
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
        alert("❌ Failed to fetch user data.");
      }
    };

    if (isLoaded) {
      fetchLocations();
    }
  }, [isLoaded]);

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={11}
    >
      {locations.map((loc) => (
        <OverlayView
          key={loc.id}
          position={{ lat: loc.lat, lng: loc.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div
            onClick={() => setSelected(loc)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid white',
              boxShadow: '0 0 6px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transform: 'scale(0.5)',
              animation: 'popIn 0.4s ease-out forwards'
            }}
          >
            <img
              src={imageMap[loc.image] || f1}
              alt="profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </OverlayView>
      ))}

      {selected && (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => setSelected(null)}
        >
          <div style={{
            minWidth: '160px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <img
              src={imageMap[selected.image] || f1}
              alt="profile"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '8px'
              }}
            />
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong>{selected.name}</strong><br />{selected.status}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default MapContainer;
