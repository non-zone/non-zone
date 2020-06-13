import React, { useState } from 'react'


export const NewContentWidget = ({ loc }) => {
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