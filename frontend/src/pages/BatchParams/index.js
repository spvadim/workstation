import React, { useState, useEffect } from "react";
import axios from 'axios';
import './index.css';

import Button from "../../components/Buttons/Button.js";
import Loader from "../../components/Loader/index.js";

import { Redirect } from "react-router-dom";
import InputRadioContainer from "../../components/InputRadioContainer";

// http://141.101.196.127
let address = "";

function BatchParams() {

    let [partyNumber, setPartyNumber] = useState('');
    let [batch, setBatch] = useState('');
    let [params, setParams] = useState({});
    let [settings, setSettings] = useState({})
    let [redirect, setRedirect] = useState(false);


    useEffect(() => {
        axios.get(address + '/api/v1_0/batches_params')
        .then(res => {
            setParams(res.data);
        })
        .catch(e => console.log(e))

        // let promise = fetch('http://141.101.196.127/api/v1_0/batches_params')
        // console.log(promise)

    }, [setParams])

    function submitHandler(event) {
        event.preventDefault();

        if (partyNumber && Object.keys(settings).length !== 0) { 
            axios.put(address + "/api/v1_0/batches", {
                number: partyNumber,
                params_id: settings.id
            })
            .then((res) => {setBatch({partyNumber: res.data.number, settings: res.data.params}); setRedirect(true)})
            .catch(e => console.log(e))
        }
    }

    if (redirect) {
        
        return <Redirect to={
            {
                pathname: "/main",
                state: {
                    partyNumber: partyNumber,
                    settings: settings,
                    batch: batch
                },
            }
        } />
    }

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
                                     getParamSettings={(s) => setSettings(s)} /> }

            
            <Button text="Начать выпуск партии" />
            
        </form>
    );
}

export default BatchParams;