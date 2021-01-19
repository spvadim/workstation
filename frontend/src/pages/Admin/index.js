import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";
import address from "../../address.js";
import { createUseStyles } from "react-jss";

import ToolTip from "../../components/ToolTip";
import ModalWindow from "../../components/ModalWindow/index.js";
import Table from "../../components/Table/index.js";
import { Button, Text, Link, NotificationPanel, Switch, TextField } from "src/components";
import imgCross from 'src/assets/images/cross.svg';
import imgOk from 'src/assets/images/ok.svg';

const useStyles = createUseStyles({
    tableContainer: {
        width: 634,
        height: 300,
    },
    settingsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
    },
    row: {
        display: "flex",
        alignItems: "center",
        gap: 5,
    },
})

const bathesParamsTableProps = [
    {name: "number", title: "№", width: 48},
    {name: "packs", title: "Пачек в паллете"},
    {name: "multipacks", title: "Паллет в кубе"},
    {name: "multipacks_after_pintset", title: "Паллет после пинцета"},
    
]

const rowDelete = (id) => {
    axios.delete(address + "/api/v1_0/batches_params/" + id)
}

function Admin() {
    const classes = useStyles();

    const [batchesParams, setBatchesParams] = useState([]);

    const [modalAddBatchParams, setModalAddBatchParams] = useState(false);
    const [newPacks, setNewPacks] = useState(false);
    const [newMultipacks, setNewMultipacks] = useState(false);
    const [newPalletAfterPintset, setNewPalletAfterPintset] = useState(false); 
    const [settings, setSettings] = useState({});
    const [editSettings, setEditSettings] = useState({});

    useEffect(() => {
        axios.get(address + "/api/v1_0/get_settings?default=false")
             .then(res => {setSettings(res.data); setEditSettings(res.data)});
    }, []);

    useEffect(() => {
        const request = () => {
            let request = axios.get(address + "/api/v1_0/batches_params");
            request.then(res => setBatchesParams(res.data))
        };
        request();
        const interval = setInterval(request, 1000);
        return () => clearInterval(interval);
    }, []);

    const generateSettings = () => {
        return Object.keys(settings).map((key) => {
            return <div className={classes.row}>
                <span>{key}</span>
                <input value={editSettings[key]} onChange={(e) => {let temp = {}; Object.assign(temp, editSettings); temp[key] = e.target.value; setEditSettings(temp)}} />
            </div>
        })
    }


    return (
        <div style={{padding: 20}}>
            {modalAddBatchParams && 
            <ModalWindow
                title="Добавление"
                description="Введите параметры партии"
            >
                <div>
                    <TextField
                            placeholder="Пачек в паллете"
                            onChange={async e => {
                                setNewPacks(e.target.value);
                            }}
                            hidden={false}
                            outlined
                            autoFocus
                    />
                    <TextField
                            placeholder="Паллет в кубе"
                            onChange={async e => {
                                setNewMultipacks(e.target.value);
                            }}
                            hidden={false}
                            outlined
                            autoFocus
                    />
                    <TextField
                            placeholder="Паллет после пинцета"
                            onChange={async e => {
                                setNewPalletAfterPintset(e.target.value);
                            }}
                            hidden={false}
                            outlined
                            autoFocus
                    />
                </div>


                <Button onClick={() => {
                    if (newPacks && newMultipacks && newPalletAfterPintset) {
                        axios.put(address + "/api/v1_0/batches_params", {
                            packs: newPacks,
                            multipacks: newMultipacks,
                            multipacks_after_pintset: newPalletAfterPintset,
                        })
                            .then(() => {
                                setNewPalletAfterPintset("");
                                setNewPacks("");
                                setNewMultipacks("");
                                setModalAddBatchParams(false);
                            })
                    }
                    
                }}>
                    <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                    Добавить
                </Button>
                <Button onClick={() => {
                    setNewPalletAfterPintset("");
                    setNewPacks("");
                    setNewMultipacks("");
                    setModalAddBatchParams(false);
                }} theme="secondary">
                    <img className={classes.modalButtonIcon} src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                    Отмена
                </Button>
            </ModalWindow>}

            <div className={classes.settingsContainer}>
                {generateSettings()}
                <Button style={{width: "max-content"}} onClick={() => {
                    axios.post(address + "/api/v1_0/set_settings", editSettings)
                }} > Сохранить </Button>
            </div>

            <div className={classes.tableContainer}>
                <Button onClick={() => setModalAddBatchParams(true)}>Создать новые параметры партии</Button>
                <Table columns={bathesParamsTableProps}
                        rows={batchesParams.map((param, index) => {
                            let temp = {};
                            Object.assign(temp, param);
                            temp.number = batchesParams.length - index;
                            return temp;
                        })}
                        className={"bathesParams"}
                        buttonDelete={"/trash"}
                        onDelete={(row) => rowDelete(row.id)} />
            </div>
        </div>
    );
}

export default Admin;