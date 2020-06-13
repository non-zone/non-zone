import React, { useState } from 'react';
import { Interface } from '../components/interface/Interface';
import { Profile } from '../components/profile/Profile';
import { svg } from '../components/svg/svg.js';

export const NavigationWidget = ({ autolocate, zoomIn, zoomOut }) => {
  const [showModal, setShowModal] = useState(false);
  const {
    Navigation: { current, create, merch },
  } = svg;
  return (
    <>
      {showModal ? <div></div> : ''}
      <Profile avatarUrl={"https://hhcdn.ru/photo/586132179.jpeg?t=1592170832&h=5QwltFkMTmjCmxroLG7oXA"} />
      <Interface
        leftButton={{
          onClick: zoomIn,
          svg: merch,
        }}
        centralButton={{
          onClick: () => setShowModal(true),
          name: 'Create a nonzone',
          svg: create,
        }}
        righButton={{
          onClick: autolocate,
          svg: current,
        }}
      />
    </>
  );
};
