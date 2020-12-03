import React, { useEffect, useMemo, useState, useCallback, useContext } from "react";
import axios from 'axios';
import "./index.css";

import SwitchMode from "../../components/SwitchMode/index.js";
import TableAddress from "../../components/Table/TableAddress.js";
import ErrorBox from "../../components/ErrorBox/index.js";
import Button from "../../components/Buttons/Button.js";

import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

// http://141.101.196.127
let address = "";
axios.patch(address + "/api/v1_0/set_mode", {work_mode: "auto"});

function Main(props) {
    const [error, setError] = useState('');
    const [mode, setMode] = useState("auto"); 
    const [page, setPage] = useState('');

    const [cookies] = useCookies();

    const createError = (error) => {
        return setError(JSON.parse(error.request.response).detail[0].msg || error.message)
    }

    const tableSettings = {
        cube: useMemo(() => ({
                        title: "Очередь кубов",
                        addFields: ["/edit", "/trash"],
                        columns: ["created_at", "qr", "id"],
                        address: address + "/api/v1_0/cubes_queue",
                        type: "cubes",
                    }), []),

        multipack: useMemo(() => ({
                        title: "Очередь мультипаков",
                        addFields: ["/edit", "/trash"],
                        columns: ["created_at", "qr", "status", "id"],
                        address: address + "/api/v1_0/multipacks_queue",
                        type: "multipacks",
                    }), []),

        pack: useMemo(() => ({
                        title: "Очередь пачек",
                        addFields: ["/trash"],
                        columns: ["created_at", "qr", "id"],
                        address: address + "/api/v1_0/packs_queue",
                        type: "packs",
                    }), []),

    } 

    if (page === "/") {
            return (
              <Redirect to="/" />  
            );
        } 

    const updateMode = () => {
        let newMode = mode === "auto" ? "manual" : "auto" 
        axios.patch(address + "/api/v1_0/set_mode", {work_mode: newMode})
        .then(res => {
            setMode(newMode);
        })
        .catch(e => {
            createError(e);
        })
    }


    return(
        <div className="container">
            <div className="header">
                <div className="header-line">
                    <p>
                        Партия №: <u><b>{cookies.batchNumber ? cookies.batchNumber : "N/A"}</b></u>,
                        куб: <u><b>{cookies.multipacks ? cookies.multipacks : "N/A"}</b></u> мультипаков, 
                        мультипак: <u><b>{cookies.packs ? cookies.packs : "N/A"}</b></u> пачек.
                    </p>
                    
                    <div className="newbutton-container" style={mode === "manual" ? {visibility: "visible"} : {visibility: "hidden"}}> 
                        <Button text="Новый куб"
                                callback={() => {console.log("Новый куб")}} />

                        <Button text="Новый мультипак"
                                callback={() => {console.log("Новый мультипак")}} />
                    </div>

                </div>

                <div className="switch-container">
                    <span>Автоматический</span>
                        <SwitchMode callback={updateMode} />
                    <span>Ручной</span>
                </div>

                <br />

                <div className="container-error-button"
                    style={{visibility: error ? "visible" : "hidden"}}>
                    <ErrorBox text={error} />
                    
                    <Button text="Сбросить ошибку"
                            callback={() => {setError('')}} />
                </div>

            </div>

            <br />

            <div className="tables-container">
                <TableAddress settings={tableSettings.cube} setError={(error) => createError(error)} />
                
                <TableAddress settings={tableSettings.multipack} setError={(error) => createError(error)} />

                <TableAddress settings={tableSettings.pack} setError={(error) => createError(error)} />

            </div>

        <div className="footer">
            <span className="text-mode">
                {mode === "manual" ? "Ручной: отсканируйте QR упаковки для редактирования" : "Автомат: отсканируйте внутренний QR для привязки к кубу"}
            </span>

            <div className="footer-components">
                <div>
                    <label>QR: </label>
                    <input type="text" 
                        id="input-qr"
                        autoFocus/>
                </div>
                
                <Button text="Новая партия"
                        callback={() => {setPage("/")}} />

                <Button text="Сформировать неполный куб"
                        callback={() => {console.log("Сформировать неполный куб")}} /> 
            </div>

        </div>

        </div>
    );
}

export default Main;