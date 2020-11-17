import React from "react";
import "./index.css";

function SwitchSlider({callback}) {
    return (
        <label className="switch">
            <input type="checkbox"
                   onClick={callback} />
            <span className="slider" />
        </label>
    );
}

export default SwitchSlider;