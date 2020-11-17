import React, { useState } from "react";

import "./index.css";

function EditButton({ callback }) {

    return (
        <div className="icon-container"
             onClick={callback}>
            <img className="icon" src="./edit.svg" alt="яйца"/>
        </div>
    );
}

export default EditButton;