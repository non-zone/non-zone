import React from 'react';
import './sliderr.css';

const Slide = (props) => {
    const { name, description, svg = '' } = props;
    return (
        <div className={'sliderr__slide'}>
            {svg}
            <h5 className={'sliderr__name'}>{name}</h5>
            <p className={'sliderr__description'}>{description}</p>
        </div>
    );
};

export const Sliderr = (props) => {
    const { elements, onChange } = props;
    return (
        <div className="sliderr__container">
            <div className="sliderr__wrapper">
                {elements.map((slide) => (
                    <Slide
                        onChange={onChange}
                        name={slide[0]}
                        key={slide[0]}
                        description={slide[1]}
                        value={slide[2]}
                        svg={slide[3]}
                    />
                ))}
            </div>
        </div>
    );
};
