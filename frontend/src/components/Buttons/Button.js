import { func } from "prop-types";
import React from "react";
import "./index.css";

function Button({ text, callback }) {
    return (
        <div className="button-wrapper"
             onClick={callback ? callback : null}>

            <button>{text}</button>

        </div>
    );
}

export default Button;