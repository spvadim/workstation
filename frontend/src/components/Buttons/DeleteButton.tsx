import React from "react";

const DeleteButton = (callback?: React.MouseEventHandler<HTMLImageElement>): JSX.Element => {
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