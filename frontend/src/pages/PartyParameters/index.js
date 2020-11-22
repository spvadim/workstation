import React, { useState, useEffect } from "react";
import axios from 'axios';
import './index.css';

import InputRadio from "../../components/InputRadio/index.js";
import Button from "../../components/Buttons/Button.js";
import Loader from "../../components/Loader/index.js";

import { Redirect } from "react-router-dom";
import InputRadioContainer from "../../components/InputRadioContainer";

function PartyParameters() {
    let [partyNumber, setPartyNumber] = useState('');
    let [params, setParams] = useState({});
    let [settings, setSettings] = useState({})
    let [redirect, setRedirect] = useState(false);

    useEffect(() => {
        axios.get('/api/v1_0/batches_params')
        .then(res => {
            setParams(res.data);
        })
        .catch(e => console.log(e))

    }, [setParams])

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

            {Object.keys(params).length === 0 ? 
                <Loader /> :
                <InputRadioContainer data={params}
                                     getParamSettings={(s) => {
                                         console.log("settings in: ", s)
                                         setSettings(s)
                                     }} /> }

            
            <Button text="Начать выпуск партии" />
            
        </form>
    );
}

export default PartyParameters;