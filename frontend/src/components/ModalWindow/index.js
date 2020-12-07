import React from "react";
import "./index.css";

import Button from "../../components/Buttons/Button.js";

const ModalWindow = React.memo(({ text, callback }) => {
    
    return (
        <div className="modal-window">
            <span >{text}</span>
            <Button text="Удалить" callback={() => callback(true)} />
            <Button text="Отменить" callback={() => callback(false)} />
        </div>
    );
})

export default ModalWindow;