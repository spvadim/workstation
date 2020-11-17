import React, { useState, useEffect } from "react";
import './index.css';

import InputRadio from "../../components/InputRadio/index.js";
import Button from "../../components/Buttons/Button.js";

import { Redirect } from "react-router-dom";

function PartyParameters({setPartyParamsState}) {
    let [partyNumber, setPartyNumber] = useState('');
    let [settings, setSettings] = useState({})
    let [redirect, setRedirect] = useState(false);

    function submitHandler(event) {
        event.preventDefault();

        if (partyNumber && Object.keys(settings).length !== 0) { 
            setRedirect(true);
        }
    }

    if (redirect) return <Redirect to={
        {
            pathname: "/main",
            state: {partyNumber, settings}
        }
    } /> 

    return (
        
        <form id="params_box" onSubmit={submitHandler}>
           
            <div className="input-text"> 
                <span>Номер партии ГП: </span>
                <input name="number_party" 
                       type="text"
                       value={partyNumber} 
                       onChange={event => setPartyNumber(event.target.value)} 
                       autoFocus/>
            </div>

            <div className="params" style={{margin: "10px 0"}}>
                <InputRadio name="param_party"
                            htmlFor="param_1"
                            settings={{
                                multipack: 8,
                                pack: 6,
                            }}
                            text="Куб: 8 мультипаков, мультипак: 6 пачек" 
                            onClick={settings => setSettings(settings)}/>
                
                <hr />
                
                <InputRadio name="param_party"
                            htmlFor="param_2"
                            settings={{
                                multipack: 8,
                                pack: 8,
                            }}
                            text="Куб: 8 мультипаков, мультипак: 8 пачек"
                            onClick={settings => setSettings(settings)} />
                
                <hr />

                <InputRadio name="param_party"
                            htmlFor="param_3"
                            settings={{
                                multipack: 4,
                                pack: 6,
                            }}
                            text="Куб: 4 мультипаков, мультипак: 6 пачек"
                            onClick={settings => setSettings(settings)} />
            </div>

            <Button text="Начать выпуск партии" />
            
        </form>
    );
}

export default PartyParameters;