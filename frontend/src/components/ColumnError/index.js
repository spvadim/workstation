import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import address from "../../address.js";
import Button from "../../components/Buttons/Button.js";

const ColumnError = React.memo(() => {
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setInterval(() => {
            axios.get(address + "/api/v1_0/get_state")
            .then(res => {
                setErrorMessage(res.data.error_msg);
            })
            .catch(e => {console.log(e)})
        }, 1000)
    }, [])
    
    return (
        <div className="error-container" style={errorMessage ? {visibility: "visible"} : {visibility: "hidden"}}>
            <div>
                <span className="error-container-title">
                    <img src="./error.svg" alt="error" />
                    <h3>Возникла ошибка</h3>
                </span>
                <span>{errorMessage}</span>
            </div>
            <Button
                    onClick={() => {
                        axios.patch(address + "/api/v1_0/flush_state")
                        .catch(e => console.log(e))
                    }}>
                Сбросить ошибку
            </Button>
        </div>
    );
})

export default ColumnError;