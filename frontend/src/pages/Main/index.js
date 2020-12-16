import React, { useEffect, useMemo, useState, useCallback, useContext } from "react";
import axios from 'axios';
import "./index.css";

import SwitchMode from "../../components/SwitchMode/index.js";
import TableAddress from "../../components/Table/TableAddress.js";
import Button from "../../components/Buttons/Button.js";
import InputTextQr from "../../components/InputText/InputTextQr.js";
import ModalWindow from "../../components/ModalWindow/index.js";
import ColumnError from "../../components/ColumnError/index.js";
import Notification from "../../components/Notification/index.js";

import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

import address from "../../address.js";

axios.patch(address + "/api/v1_0/set_mode", {work_mode: "auto"});

function Main() {
    const [mode, setMode] = useState("auto"); 
    const [page, setPage] = useState('');
    const [modal, setModal] = useState(false);
    const [notificationText, setNotificationText] = useState("Отсканируйте QR пачки или мультипака для идентифицирования куба");

    const [cookies] = useCookies();

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
        let newMode = "auto";
        if (mode === "auto") {
            newMode = "manual";
            setNotificationText("Отсканируйте QR куба для редактирования");
        } else if (mode === "manual") {
            newMode = "auto";
            setNotificationText("Отсканируйте QR пачки или мультипака для идентифицирования куба")
        }

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
                    {modal ? <ModalWindow text={"Вы действительно хотите удалить этот элемент?"} callback={(flag) => {if (flag) {modal[0](modal[1]); setModal(false)} else {setModal(false)}}} /> : null} 
                </div>

                <br />

            </div>

            <br />

            <div className="tables-container">

                <TableAddress settings={tableSettings.cube} setModal={setModal} />
                
                <TableAddress settings={tableSettings.multipack} setModal={setModal}/>

                <TableAddress settings={tableSettings.pack} setModal={setModal} />

            </div>

        <div className="footer">
            <Notification text={notificationText} />
            <ColumnError />

            <div className="footer-components">
                <InputTextQr label="QR: " autoFocus={true} setNotification={setNotificationText} mode={mode}/>
                
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