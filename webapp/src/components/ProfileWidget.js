import React, { useState, useEffect } from 'react'
import * as firebase from "firebase/app";
import "firebase/auth";
import { useAuth } from '../Auth';


const googleSignIn = () => {
  firebase.auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(userCred => {
      console.log('User info after sign in:', userCred)
    })
    .catch(
      err => console.log('Error signing in:', err)
    )
}

const Login = () => {
  return <div style={{ position: 'fixed', top: 10, right: 60 }}>
    <button onClick={googleSignIn}>SignInWithGoogle</button>
  </div>
}

const signout = () => firebase.auth().signOut();

export const ProfileWidget = ({ onShowProfile }) => {
  const [showLogin, setShowLogin] = useState(false);
  const { user, loading } = useAuth()


  if (loading) return <span />

  if (showLogin && !user) {
    return <Login />
  }

  return <div style={{ position: 'fixed', top: 10, right: 60 }}>
    {user
      ? <div style={{ background: 'white', padding: 5 }}>
        <button onClick={onShowProfile}>show profile</button>
        <button onClick={signout}>signout</button>
      </div>
      : <button onClick={() => setShowLogin(true)}>Sign in</button>
    }
  </div>
}