import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Redirect } from "react-router-dom";
import address from "../../address.js";
import { createUseStyles } from "react-jss";

import Table from "../../components/Table/index.js";

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
            <div className={classes.header}>
                <div className={classes.commonParams}>
                    <span>Общие параметры</span>
                    <div className={classes.innerParams}>
                        <span>Завод ТЕХНОПЛЕКС, Учалы, линия №1 XPS</span>
                        <span>Дней хранения информации: 60</span>
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
            
            <div className={classes.tableContainer}>
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