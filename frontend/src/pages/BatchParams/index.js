import React, { useState, useEffect } from "react";
import axios from 'axios';
import './index.css';

import Button from "../../components/Buttons/Button.js";
import Loader from "../../components/Loader/index.js";

import { Redirect } from "react-router-dom";
import InputRadioContainer from "../../components/InputRadioContainer";
import { useCookies } from "react-cookie";
import address from "../../address.js";


function BatchParams() {
    let [batchNumber, setPartyNumber] = useState('');
    let [params, setParams] = useState({});
    let [settings, setSettings] = useState({})
    let [redirect, setRedirect] = useState(false);

    const [cookies, setCookie] = useCookies([]);

    useEffect(() => {
        axios.get(address + '/api/v1_0/batches_params')
        .then(res => {
            setParams(res.data);
        })
        .catch(e => console.log(e))
    }, [setParams])

    function submitHandler(event) {
        event.preventDefault();

        if (batchNumber && Object.keys(settings).length !== 0) { 
            axios.put(address + "/api/v1_0/batches", {
                number: batchNumber,
                params_id: settings.id
            })
            .then(() => setRedirect(true))
            .catch(e => console.log(e))
        }
    }

    if (redirect) {
        setCookie("batchNumber", batchNumber, {path: "/"});
        setCookie("multipacks", settings.multipacks, {path: "/"});
        setCookie("packs", settings.packs, {path: "/"});

        return <Redirect to="/main" />
    }

    return (
        
        <form id="params_box" onSubmit={submitHandler}>
           
            <div className="input-text"> 
                <span>Номер партии ГП: </span>
                <input name="number_party" 
                       type="text"
                       value={batchNumber} 
                       onChange={event => setPartyNumber(event.target.value)} 
                       autoFocus/>
            </div>

            {Object.keys(params).length === 0 ? 
                <Loader /> :
                <InputRadioContainer data={params}
                                     getParamSettings={(s) => setSettings(s)} /> }

            
            <Button text="Начать выпуск партии" />
            
        </form>
    );
}

export default BatchParams;