import React from 'react'

export const NavigationWidget = ({ autolocate, zoomIn, zoomOut }) => {
  return <div style={{ position: 'fixed', bottom: 50, left: 50 }}>
    <button onClick={autolocate}>auto</button>
    <button onClick={zoomIn}>+</button>
    <button onClick={zoomOut}>-</button>
  </div>
}