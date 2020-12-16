import React, { useState, useEffect } from "react";
import axios from 'axios';

import Loader from "../../components/Loader/index.js";

import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import address from "../../address.js";
import { Paper, Button, InputRadio, TextField } from "src/components";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    BatchParams: {
        height: '100%',
        display: 'flex',
    },
    main: {
        margin: 'auto',
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
        height: 294,
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
        marginTop: 'auto',
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
        fontSize: 36,
        fontWeight: 700,
        position: 'absolute',
        marginTop: 62,
        width: '100%',
        textAlign: 'center',
    },
});

function BatchParams() {
    const classes = useStyles();
    const [batchNumber, setPartyNumber] = useState('');
    const [params, setParams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({})
    const [redirect, setRedirect] = useState(false);

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
        setCookie("batchNumber", batchNumber, { path: "/" });
        setCookie("multipacks", settings.multipacks, { path: "/" });
        setCookie("packs", settings.packs, { path: "/" });

        return <Redirect to="/main" />
    }
    return (
        <div className={classes.BatchParams}>
            <div className={classes.title}>Вход</div>
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
                                onChange={event => setPartyNumber(event.target.value)}
                                autoFocus />
                        </div>

                        {loading ?
                            <Loader /> :
                            params.map((obj, index) => (
                                <InputRadio name="param_batch"
                                    htmlFor={obj.id}
                                    key={index}
                                    onClick={() => setSettings(obj)}>
                                    <span className={classes.radioLabel}>
                                        Куб: {obj.multipacks} мультипаков, мультипак: {obj.packs} пачек,
                                        <br />
                                        пинцет: {obj.multipacks_after_pintset} мультипак
                                    </span>
                                </InputRadio>
                            ))}


                        <Button color="yellow" className={classes.submitButton}>Начать выпуск партии</Button>

                    </form>
                </Paper>
            </div>
        </div>
    );
}

export default BatchParams;