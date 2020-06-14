import React from 'react';
import './slider.css';

export const Slider = (props) => {
    const { elements, onChange } = props;
    return (
        <div className="slider__container">
            <div className="slider__wrapper">
                {elements.map((slide) => (
                    <div
                        className="slider__slide"
                        onClick={() => onChange(slide[2])}
                    >
                        <h5 className="slider__name">{slide[0]}</h5>
                        <p className="slider__description">{slide[1]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
