import React from 'react';
import './interface.css';

/**
 * Interface - represent buttons of interface
 *
 * @param {props} props - includes:
 * @param {object} leftButton - includes two properties: svg - image for the button and onClick hanlder
 * @param {object} CentralButton - includes two properties: svg - image for the button and onClick hanlder + name
 * @param {object} rightButton - includes two properties: svg - image for the button and onClick hanlder
 *
 * @returns {HTMLElement} - control elements
 */

export const Interface = (props) => {
  const { leftButton, centralButton, rightButton } = props;
  return (
    <div className="navigation">
      <div className="navigation__layer"></div>
      <button
        className="navigation__filter navigation__button"
        onClick={leftButton.onClick}
      >
        {leftButton.svg}
      </button>
      <button
        className="navigation__create navigation__button"
        onClick={centralButton.onClick}
      >
        {centralButton.svg}
        {centralButton.name}
      </button>

      <button
        className="navigation__current navigation__button"
        onClick={rightButton.onClick}
      >
        {rightButton.svg}
      </button>
    </div>
  );
};
