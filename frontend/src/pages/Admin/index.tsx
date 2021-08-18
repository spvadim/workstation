import React, { useEffect, useState } from "react";
import axios from 'axios';
import address from "../../address.js";

import ModalWindow from "../../components/ModalWindow/index.js";
import Table from "../../components/Table/index.js";
import { Notification } from "../../components/Notification/index.js";
import { Button, NotificationPanel, TextField } from "src/components";
import imgCross from 'src/assets/images/cross.svg';
import imgOk from 'src/assets/images/ok.svg';

import "./SettingsBlock.scss";
import SettingsBlock from "./SettingsBlock";
import {Settings} from "./SettingsInterface";

const bathesParamsTableProps = [
    {name: "number", title: "№", width: 48},
    {name: "packs", title: "Пачек в паллете"},
    {name: "multipacks", title: "Паллет в кубе"},
    {name: "multipacks_after_pintset", title: "Паллет после пинцета"},
]

const rowDelete = (id: string) => {
    axios.delete(address + "/api/v1_0/batches_params/" + id)
}

function Admin() {
    const [batchesParams, setBatchesParams] = useState([]);

    const [modalAddBatchParams, setModalAddBatchParams] = useState(false);
    const [newPacks, setNewPacks] = useState(false);
    const [newMultipacks, setNewMultipacks] = useState(false);
    const [newPalletAfterPintset, setNewPalletAfterPintset] = useState(false); 
    const [settings, setSettings] = useState<Settings>();
    const [editSettings, setEditSettings] = useState<Settings>();
    const [notificationText, setNotificationText] = useState("");
    const [notificationErrorText, setNotificationErrorText] = useState("");
    const [choosedSetting] = useState("");

    useEffect(() => {
        axios.get(address + "/api/v1_0/settings")
             .then(res => {
                setSettings(res.data);
                setEditSettings(res.data);
                if (res.data.location_settings) {
                    document.title = "Настройки: " + res.data.location_settings.place_name.value
                }
             });
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
        if (settings === undefined || editSettings === undefined) return;
        return SettingsBlock(settings, editSettings, setEditSettings);
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
                    <img src={imgOk} style={{ width: 25 }} />
                    Добавить
                </Button>
                <Button onClick={() => {
                    setNewPalletAfterPintset("");
                    setNewPacks("");
                    setNewMultipacks("");
                    setModalAddBatchParams(false);
                }} theme="secondary">
                    <img src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                    Отмена
                </Button>
            </ModalWindow>}

            <div className="container">
                <div className="settings-container">
                    {(editSettings !== undefined) && Object.keys(editSettings).length !== 0 && generateSettings()}
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Button style={{width: "max-content", height: "max-content"}} onClick={() => {
                            axios.patch(address + "/api/v1_0/settings", editSettings)
                                .then(() => {
                                    setNotificationText("Успешно");
                                    setTimeout(() => setNotificationText(""), 2000)
                                })
                                .catch(e => {
                                    setNotificationErrorText(e.response.data.detail[0].msg);
                                    setTimeout(() => setNotificationText(""), 2000)
                                })
                        }} > Сохранить </Button>
                        <NotificationPanel
                            errors={
                                notificationErrorText && (
                                    <Notification
                                        error
                                        description={notificationErrorText}
                                    />
                                )
                            }  
                            notifications={
                                notificationText && (
                                    <Notification
                                        description={notificationText}
                                    />
                                )
                            }
                        />
                    </div>
                </div>

                <div className="table-container">
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
                            buttonVisible={"/visible"}
                            onVisible={(row) => {
                                axios.patch(address + "/api/v1_0/batches_params/" + row.id, {visible: !row.visible})
                            }}
                            onDelete={(row) => rowDelete(row.id)} />
                            
                    
                </div>
                
            </div>

            {choosedSetting && 
                <div className="full-description">
                    <p style={{fontWeight: 500}}>{choosedSetting.title}</p>
                    <span>{choosedSetting.desc}</span>
                </div>
            }
            
        </div>
    );
}

export default Admin;