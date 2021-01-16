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

    header: {
        width: "100%",
        height: "max-content",
    },

    commonParams: {
        width: "max-content",
        display: "flex",
        flexDirection: "column",
    },

    innerParams: {
        width: "max-content",
        display: "flex",
        flexDirection: "column",
        paddingLeft: 20,
    },
    row: {
        display: "flex",
        alignItems: "center",
        gap: 20,
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

    useEffect(() => {
        const request = () => {
            let request = axios.get(address + "/api/v1_0/batches_params");
            request.then(res => setBatchesParams(res.data))
        };
        request();
        const interval = setInterval(request, 1000);
        return () => clearInterval(interval);
    }, []);

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


            <div className={classes.header}>
                <div className={classes.commonParams}>
                    <span>Общие параметры</span>
                    <div className={classes.innerParams}>
                        <span>Завод ТЕХНОПЛЕКС, Учалы, линия №1 XPS</span>
                        <span className={classes.row} title={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, \n sunt in culpa qui officia deserunt mollit anim id est laborum.`}>Дней хранения информации: 60 <ToolTip text={""} /></span>
                        <span>Часовой пояс: 5</span> 
                    </div>
                </div>

                <br />

                <div className={classes.commonParams}>
                    <span>Параметры блока ERD</span>
                    <div className={classes.innerParams}>
                        <span>IP адрес блока ERD: 192.168.20.200</span>
                        <span>порт SNMP: 161</span>
                    </div>
                </div>

                <br />

                <div className={classes.commonParams}>
                    <span> Параметры подключения к пинцету</span>
                    <div className={classes.innerParams}>
                        <span>IP пинцета: 192.168.20.210</span>
                        <span>Rack: 0</span>
                        <span>Slot: 2</span>
                        <span>Область памяти: 60</span>
                        <span>C какого байта читать: 0</span>
                    </div>
                </div>

                <br />

                <div className={classes.commonParams}>
                    <span>Параметры телеграмм</span>
                    <div className={classes.innerParams}>
                        <span>BotApiKey</span>
                        <span>chat_id</span>
                    </div>
                </div>
            </div>
            
            <br />

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