import React from "react";

function DeleteButton({ callback }) {
    return (
        <div className="icon-container">
            <img className="icon"
                 src="./trash.svg" 
                 alt="delete"
                 onClick={callback} />
        </div>
    );
}

export default DeleteButton;