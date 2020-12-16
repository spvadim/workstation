import React, { useState } from "react";
import "./index.css";


const Notification = React.memo(({ text }) => {
    return (
        <div className="notification-container" style={text ? {visibility: "visible"} : {visibility: "hidden"}}>
            <div>
                <img src="./notification.svg" alt="notification" />
                <h3>Уведомление</h3>
            </div>
            <span>{text}</span> 
        </div>
        
    );
})

export default Notification;