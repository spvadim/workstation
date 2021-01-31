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
    title: {
        fontSize: 18,
        fontWeight: 600,
    },
    settingInner: {
        paddingLeft: 15,
        display: "flex",
        flexDirection: "column",
        gap: 5,
    },
    container: {
        display: "flex",
        justifyContent: "space-between",
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
        axios.get(address + "/api/v1_0/settings")
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
        return Object.keys(settings).map((sKey) => {
            if (["id"].indexOf(sKey) !== -1) return null

            let setting = settings[sKey]; 
            return (
                <div>
                    <span className={classes.title}>{setting.title}:</span>
                    {
                        <div className={classes.settingInner}>
                            {
                                Object.keys(setting).map((key) => {
                                    return (
                                        ["title", "advanced"].indexOf(key) !== -1 ?
                                            null :
                                            (
                                                <div className={classes.row}>
                                                        <span>{setting[key].title}:</span>
                                                        <input 
                                                        value={editSettings[sKey][key].value}
                                                        onChange={(e) => {
                                                            let temp = {};
                                                            Object.assign(temp, editSettings);
                                                            temp[sKey][key].value = temp[sKey][key].value_type === "integer" ? +e.target.value : e.target.value;
                                                            setEditSettings(temp);
                                                        }} />
                                                    </div>
                                            )
                                    )
                                })
                            }
                        </div>
                        
                    }   
                </div>
            )
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

            <div className={classes.container}>
                <div className={classes.settingsContainer}>
                    {Object.keys(editSettings).length !== 0 && generateSettings()}
                    <Button style={{width: "max-content"}} onClick={() => {
                        axios.patch(address + "/api/v1_0/settings", editSettings)
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
            
        </div>
    );
}

export default Admin;