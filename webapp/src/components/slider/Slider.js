import React from 'react';
import './slider.css';

const Slide = (props) => {
    const { onChange, name, description, value, active, svg = '' } = props;
    return (
        <div
            className={
                'slider__slide ' + (active ? 'slider__slide-active' : '')
            }
            onClick={() => {
                onChange(value);
            }}
        >
            {svg}
            <h5
                className={
                    'slider__name ' + (active ? 'slider__name-active' : '')
                }
            >
                {name}
            </h5>
            <p
                className={
                    'slider__description ' +
                    (active ? 'slider__description-active' : '')
                }
            >
                {description}
            </p>
        </div>
    );
};

export const Slider = ({ elements, activeElement, onChange }) => {
    return (
        <div className="slider__container">
            <div className="slider__wrapper">
                {elements.map((slide) => (
                    <Slide
                        key={slide[0]}
                        onChange={onChange}
                        name={slide[0]}
                        description={slide[1]}
                        value={slide[2]}
                        active={slide[2] === activeElement}
                        svg={slide[3]}
                    />
                ))}
            </div>
        </div>
    );
};
