import React, { useState } from 'react';
import './slider.css';

const Slide = (props) => {
    const [active, setActive] = useState(false);
    const { onChange, name, description, value, svg = '' } = props;
    return (
        <div
            className={
                'slider__slide ' + (active ? 'slider__slide-active' : '')
            }
            onClick={() => {
                setActive(!active);
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

export const Slider = (props) => {
    const { elements, onChange } = props;
    return (
        <div className="slider__container">
            <div className="slider__wrapper">
                {elements.map((slide) => (
                    <Slide
                        onChange={onChange}
                        name={slide[0]}
                        description={slide[1]}
                        value={slide[2]}
                        svg={slide[3]}
                    />
                ))}
            </div>
        </div>
    );
};
