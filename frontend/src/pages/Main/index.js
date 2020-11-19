import React, { useState } from "react";
import "./index.css";

import SwitchSlider from "../../components/SwitchSlider/index.js";
import Table from "../../components/Table/index.js";
import ErrorBox from "../../components/ErrorBox/index.js";
import Button from "../../components/Buttons/Button.js";

import { Redirect } from "react-router-dom";

function Main({ partyNumber, settings }) {
    let [error, setError] = useState('Ошибка');
    let [mode, setMode] = useState(false); // false = auto; true = manual
    let [page, setPage] = useState('');

    if (page === "party_parameters") {
        return (
          <Redirect to="/party_parameters" />  
        );
    } 

    return(
        <div className="container">
            <div className="header">
                <div className="header-line">
                    <p>
                        Партия №: <u><b>{partyNumber}</b></u>,
                        куб: <u><b>{settings.multipack}</b></u> мультипаков, 
                        мультипак: <u><b>{settings.pack}</b></u> пачек.
                    </p>

                    <div style={{display: "flex", width: "max-content", padding: "0 1rem", gap: "1rem"}}> 
                        <Button text="Новый куб"
                                callback={() => console.log("Новый куб")} />

                        <Button text="Новый мультипак"
                                callback={() => console.log("Новый мультипак")}/>
                     </div>

                </div>

                

                <div className="switch-container">
                    <span>Автоматический</span>
                    <SwitchSlider callback={() => setMode(!mode) } />
                    <span>Ручной</span>
                </div>

                <br />

                <div className="container-error-button"
                    style={{visibility: error ? "visible" : "hidden"}}>
                    <ErrorBox text={error} />
                    
                    <Button text="Сбросить ошибку"
                            callback={() => setError('')} />
                </div>

            </div>

            <br />

            <div className="tables-container">
                <Table  title="Очередь больших кубов"
                        columns={["Время", "ID", "QR", "/trash", "/edit"]}
                        data={
                            {
                                "type": "cube",
                                "rows": [
                                    {
                                        "Время": "26.10.2020 16:52",
                                        "ID": "h1g22jh4g12jgk2",
                                        "QR": "https://xps.tn.ru....",
                                    },
                                    {
                                        "Время": "26.10.2020 18:47",
                                        "ID": "jsdkfhs4kdh25",
                                        "QR": "https://xps.tn.ru....",
                                    }
                                ]
                            }                           
                        }
                        
                />

                <Table  title="Очередь мультипаков"
                        columns={["Время", "ID", "QR", "Статус", "/trash", "/edit"]}
                        data={
                            {
                                "type": "multipack",
                                "rows": [
                                    {
                                        "Время": "26.10.2020 16:52",
                                        "ID": "h1g22jh4g12jgk2",
                                        "QR": "https://xps.tn.ru....",
                                    },
                                    {
                                        "Время": "26.10.2020 18:47",
                                        "ID": "jsdkfhs4kdh25",
                                        "QR": "https://xps.tn.ru....",
                                    }
                                ]
                            }
                        }
                        
                />

                <Table  title="Очередь пачек"
                        columns={["Время", "ID", "QR", "/trash"]}
                        data={
                            {
                                "type": "pack",
                                "rows": [
                                    {
                                        "Время": "26.10.2020 16:52",
                                        "ID": "h1g22jh4g12jgk2",
                                        "QR": "https://xps.tn.ru....",
                                    },
                                    {
                                        "Время": "26.10.2020 18:47",
                                        "ID": "jsdkfhs4kdh25",
                                        "QR": "https://xps.tn.ru....",
                                    }
                                ]
                            }
                        }
                />

            </div>

        <div className="footer">
                <span className="text-mode">{mode ? "Ручной: отсканируйте QR упаковки для редактирования" : "Автомат: отсканируйте внутренний QR для привязки к кубу"}</span>

            <div className="footer-components">
                <div>
                    <label>QR: </label>
                    <input type="text" 
                        id="input-qr"
                        autoFocus/>
                </div>
                
                <Button text="Новая партия"
                        callback={() => {
                            setPage("party_parameters");
                        }} />

                <Button text="Сформировать неполный куб"
                        callback={() => console.log("Сформировать неполный куб")} /> 
            </div>

        </div>

        </div>
    );
}

export default Main;