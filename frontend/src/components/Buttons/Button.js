import React from "react";
import "./index.css";

const Button = React.memo(({ text, callback }) => {
    return (
        <div className="button-wrapper"
             onClick={callback ? callback : null}>

            <button>{text}</button>

        </div>
    );
})

export default Button;