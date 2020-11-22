import React from "react";
import "./index.css";

function InputRadio({ name, htmlFor, text, settings, callback }) {

    return (
        <label className="radioContainer"
               name={name}
               htmlFor={htmlFor}>
       
            <span style={{marginRight: "10px"}}>{text}</span>
            <input name={name}
                   id={htmlFor} 
                   type="radio" 
                   onClick={() => callback(settings)}/>
                
            <div className="radio"
                 style={{backgroundImage: "url('./cross.svg')", backgroundSize: 0}}/>

        </label>

    );
}

export default InputRadio;