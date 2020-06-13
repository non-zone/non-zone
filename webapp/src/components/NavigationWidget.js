import React, { useState } from "react";
import "./navigation.css";
import { svg } from "./svg/svg.js";

export const NavigationWidget = ({ autolocate, zoomIn, zoomOut }) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            {showModal ? <div></div> : ""}
            <div className="navigation">
                <div className="navigation__layer"></div>
                <button
                    className="navigation__filter navigation__button"
                    onClick={zoomIn}
                >
                    {svg.Navigation.current}
                </button>
                <button
                    className="navigation__create navigation__button"
                    onClick={() => setShowModal(true)}
                >
                    {svg.Navigation.create}Create nonzone
                </button>

                <button
                    className="navigation__current navigation__button"
                    onClick={autolocate}
                >
                    {svg.Navigation.current}
                </button>
            </div>
        </>
    );
};
