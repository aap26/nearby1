import './App.css';
import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import MapContainer from './MapContainer'; // Map component (next step)
import a1 from './assets/a1.jpg';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleGuestLogin = () => {
    const email = process.env.REACT_APP_guestLogin;
    const password = process.env.REACT_APP_guestPassword;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in as Guest:", user.email);
        setLoggedIn(true);
      })
      .catch((error) => {
        console.error("Guest login failed:", error.code, error.message);
        alert("Login failed. Please check credentials or Firebase setup.");
      });
  };

  return (
    <div className="App">
      <div className="super-container">
        <div className="left-container">
          {loggedIn ? (
            <>
      <h1 style={{ marginBottom: '0.5rem' }}>Guest Mode</h1>
      <p style={{ fontSize: '14px', color: '#ccc' }}>
        You are at San Francisco International Airport, San Francisco, CA, USA
      </p>
      <p><strong>5 users</strong> near by</p>
    </>
          ) : (
            <>
              <h2>Hello, Guest 👋</h2>
              <p>Welcome to Nearby! Start exploring the map by logging in.</p>
              <button onClick={handleGuestLogin}>Login</button>
            </>
          )}
        </div>

        <div className="right-container">
        {loggedIn ? (
          <MapContainer />
        ) : (
          <img
            src={a1}
            alt="Nearby illustration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
      </div>
      </div>
    </div>
  );
}

export default App;