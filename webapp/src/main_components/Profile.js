import React from 'react'
import { useAuth } from '../Auth'


export const Profile = ({ onClose }) => {
  const { user } = useAuth()

  return <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: 5,
    height: 400,
    width: 400,
    background: 'white'
  }}>
    TODO profile
    {user && <div>{user.email}</div>}

    <button onClick={onClose}>close</button>
  </div>
}