import React from "react";
import "./index.css";

const ErrorBox = React.memo(({ text }) => {
    return (
        <div className="error-box">
            <span className="error-text">{text}</span>
        </div> 
    );
})

export default ErrorBox;