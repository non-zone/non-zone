import React from 'react'


export const Profile = ({ onClose }) => {
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
    
    <button onClick={onClose}>close</button>
  </div>
}