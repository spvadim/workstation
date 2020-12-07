import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

import Button from "../../components/Buttons/Button.js";
import address from "../../address.js";


const ErrorBox = () => {
    const [value, setValue] = useState("");

    const flushState = () => {
        axios.patch(address + "/api/v1_0/flush_state");
    }

    useEffect(() => {
        setTimeout(() => {
            let request = axios.get(address + "/api/v1_0/get_state");
            request.then(res => {
                if (res.data.state !== "normal") {
                    setValue(res.data.error_msg);
                }
            })
            request.catch(res => console.log(res))
        }, 1000)
    }, [value])

    return (
        <div className="container-error-button"
             style={{visibility: value ? "visible" : "hidden"}}>
            <div className="error-box">
                <span className="error-text">{value}</span>
            </div>
            <Button text="Сбросить ошибку"
                    callback={flushState} />
        </div>
         
    );
}

export default ErrorBox;