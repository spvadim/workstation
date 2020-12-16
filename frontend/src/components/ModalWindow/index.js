import React from "react";
import "./index.css";

import Button from "../../components/Buttons/Button.js";

const ModalWindow = React.memo(({ text, callback }) => {
    
    return (
        <div className="modal-window">
            <span>{text}</span>
            <Button onClick={() => callback(true)} >Удалить</Button>
            <Button onClick={() => callback(false)} >Отменить</Button>
        </div>
    );
})

export default ModalWindow;