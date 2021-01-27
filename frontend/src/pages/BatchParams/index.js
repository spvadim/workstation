import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import address from "../../address.js";
import { Paper, Button, InputRadio, TextField, Text, Loader, TouchPanel } from "src/components";

const useStyles = createUseStyles({
    BatchParams: {
        height: '100%',
        display: 'flex',
    },
    main: {
        margin: 'auto',
        display: "flex",
        gap: "2rem",
    },
    form: {
        '& > .input-radio': {
            marginTop: 13,
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    paperMain: {
        boxSizing: 'border-box',
        width: 422,
        height: "max-content",
        paddingTop: 38,
        paddingBottom: 38,
        paddingLeft: 35,
        paddingRight: 35,
    },
    input: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    inputLabel: {
        fontWeight: 700,
        fontSize: 18,
    },
    submitButton: {
        marginTop: 13,
        width: '100%',
    },
    radioLabel: {
        marginRight: 'auto',
        weight: 400,
        fontSize: 16,
    },
    batchNumber: {
        fontSize: 16,
        width: 140,
    },
    title: {
        position: 'absolute',
        marginTop: 62,
        width: '100%',
        textAlign: 'center',
    },
});

function BatchParams() {
    const date_ = new Date();

    const classes = useStyles();
    const [batchNumber, setBatchNumber] = useState('');
    const [params, setParams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({})
    const [redirect, setRedirect] = useState(false);
    const [date, setDate] = useState(date_.getFullYear() + "-" + ((date_.getMonth() + 1).toString().length === 1 ? "0" + (date_.getMonth() + 1) : (date_.getMonth() + 1)) + "-" + date_.getDate() + " 00:00");

    const [cookies, setCookie] = useCookies([]);


    useEffect(() => {
        setLoading(true);

        axios.get(address + '/api/v1_0/batches_params')
            .then(res => {
                setParams(res.data);
            })
            .catch(e => console.log(e))
            .finally(() => setLoading(false));
    }, [])

    function submitHandler(event) {
        event.preventDefault();

        if (batchNumber && Object.keys(settings).length !== 0 && date) {
            axios.put(address + "/api/v1_0/batches", {
                number: {
                    batch_number: batchNumber,
                    batch_date: date,
                },
                params_id: settings.id
            })
                .then(() => setRedirect(true))
                .catch(e => console.log(e))
        }
    }

    if (redirect) {
        return <Redirect to="/" />
    }

    console.log(date)
    return (
        <div className={classes.BatchParams}>
            <Text type="title" className={classes.title}>Вход</Text>
            <div className={classes.main}>
                

                <Paper className={classes.paperMain}>
                    <form className={classes.form} onSubmit={submitHandler} autoComplete="off">
                        <div className={classes.input}>
                            <span className={classes.inputLabel}>Номер партии ГП: </span>
                            <TextField
                                placeholder="0000"
                                className={classes.batchNumber}
                                name="number_party"
                                type="text"
                                value={batchNumber}
                                onChange={event => setBatchNumber(event.target.value)}
                                autoFocus
                                forceFocus
                            />
                        </div>
                        <div className={classes.input} style={{height: 24, paddingTop: 10, position: "relative"}}>
                            <span className={classes.inputLabel}>Дата партии ГП: </span>
                            <input type="date" value={date.split(" ")[0]} onChange={e => setDate(e.target.value + " 00:00")} style={{width: "max-content", position: "absolute", right: 0}} />
                        </div>

                        {loading ?
                            <Loader /> :
                            params.map((obj, index) => (
                                <InputRadio name="param_batch"
                                    htmlFor={obj.id}
                                    key={index}
                                    onChange={() => setSettings(obj)}>
                                    <span className={classes.radioLabel}>
                                        Куб: {obj.multipacks} паллет, паллета: {obj.packs} пачек,
                                        <br />
                                        пинцет: {obj.multipacks_after_pintset} паллет
                                    </span>
                                </InputRadio>
                            ))}


                        <Button className={classes.submitButton}>Начать выпуск партии</Button>

                    </form>

                    <Button className={classes.submitButton} onClick={() => setRedirect(true)}>Вернуться на основную страницу</Button>
                </Paper>

               <TouchPanel addNumber={(number) => {
                   setBatchNumber(batchNumber + number)
               }}          
                           deleteNumber={() => {
                    setBatchNumber(batchNumber.slice(0, -1))
                }} /> 
            </div>
        </div>
    );
}

export default BatchParams;