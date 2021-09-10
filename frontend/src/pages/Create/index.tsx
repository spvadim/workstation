import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Redirect } from "react-router-dom";

import TableData from "../../components/Table/TableData.js";
import address from "../../address.js";
import ModalWindow from "../../components/ModalWindow/index.js";
import { Notification } from "../../components/Notification/index.js";
import { Text, InputRadio, Button, TextField, NotificationPanel } from 'src/components';
import imgCross from 'src/assets/images/cross.svg';
import imgOk from 'src/assets/images/ok.svg';

import "./style.scss"
//import "./style_mobile.scss"

const CtxCurrentMultipack = React.createContext({
    currentMultipack: null,
    setCurrentMultipack: () => console.warn,
});

const RadioCurrentMultipack = ({ index }) => {
    const { currentMultipack, setCurrentMultipack } = React.useContext(CtxCurrentMultipack);
    return (
        <InputRadio name="multipacksChoose"
            htmlFor={index}
            key={index}
            checked={index === currentMultipack}
            onChange={() => setCurrentMultipack(index)}
            className="radio-multipack">
            {index + 1}
        </InputRadio>
    )
}

const tableProps = {
    multipacksTable: {
        name: "multipacksTable",
        columns: [
            {
                name: "radioButton",
                title: "№",
                Component: RadioCurrentMultipack,
            },
        ],
        buttonDelete: "/delete",
    },
    packsTable: {
        name: "packsTable",
        columns: [
            { name: "number", title: "№", width: 64 },
            { name: "qr", title: "QR", width: 'auto' },
        ],
        buttonDelete: "/delete",
    }

};

function Create() {
    const [page, setPage] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [params, setParams] = useState([]);
    const [settings, setSettings] = useState({});
    const [cubeQr, setCubeQr] = useState('');
    const [packQr, setPackQr] = useState('');
    const [modalCancel, setModalCancel] = useState(false);
    const [modalSubmit, setModalSubmit] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [notificationErrorText, setNotificationErrorText] = useState('');
    const [multipacksTableData, setMultipacksTableData] = useState([]);
    const [currentMultipack, setCurrentMultipack] = useState('');

    useEffect(() => {
        axios.get(address + "/api/v1_0/batches_params")
            .then(res => setParams(res.data))
            .catch(e => console.log(e.response))
    }, [])

    useEffect(() => {
        axios.get(address + "/api/v1_0/settings")
            .then(res => {
                if (res.data.location_settings) {
                    document.title = "Новый куб: " + res.data.location_settings.place_name.value
                }
            })
    }, [])

    const deletePack = (indexPack, indexMultipack) => {
        let temp = multipacksTableData.slice();
        temp[indexMultipack].splice(indexPack, 1);
        setMultipacksTableData(temp);
    }

    const deleteMultipack = (index) => {
        if (index === -1) return false;
        let temp = multipacksTableData.slice();
        temp.splice(index, 1);
        setMultipacksTableData(temp);
    }

    const checkExist = () => {
        if (!settings.id) {setNotificationErrorText("Параметры партии не заданы!"); return false}
        else if (!batchNumber) {setNotificationErrorText("Номер партии не задан!"); return false}
        else if (!cubeQr) {setNotificationErrorText("QR куба не задан!"); return false}
        else if (!barcode) {setNotificationErrorText("Штрихкод не задан!"); return false}
        else if (multipacksTableData.length === 0) {setNotificationErrorText("Очередь паллет пуста!"); return false}

        return true;
    }

    const submitChanges = () => {
        if (!checkExist()) return false;

        let body = {
            params_id: settings.id,
            batch_number: batchNumber,
            qr: cubeQr,
            barcode_for_packs: barcode,
            content: multipacksTableData,
        }

        axios.put(address + "/api/v1_0/cube_with_new_content", body)
            .then(() => setPage("/"))
            .catch(e => setNotificationErrorText(e.response.data.detail))
    }

    const closeChanges = () => {
        setModalCancel([setPage, "/"]);
        setPage("/")
    }

    const checkQrUnique = (qr) => {
        let finded = multipacksTableData.find(arr => {
            return arr.find(pack => pack.qr === qr)
        })

        return finded ? false : true
    }

    const addEmptyMultipack = () => {
        if (multipacksTableData.length >= settings.multipacks) {
            setNotificationErrorText("Превышен предел мульпаков");
            return false;
        }

        let temp = multipacksTableData.slice();
        temp.push([]);
        setMultipacksTableData(temp);
        return temp;
    }

    const addPackToMultipack = (qr, indexMultipack_) => {
        if (!settings.id) {
            setNotificationErrorText("Сначала выберите параметры партии!");
            setPackQr("");
            return false;
        }

        if (!qr) return false;

        if (!checkQrUnique(qr)) return false; 

        let indexMultipack = indexMultipack_;
        let temp = multipacksTableData.slice();
        let packs = temp[indexMultipack];


        if (!packs) {
            addEmptyMultipack();
            setCurrentMultipack(0);
            packs = [];
            indexMultipack = 0;
        }

        if (packs.length >= settings.packs) {
            if (!addEmptyMultipack()) return false;
            setCurrentMultipack(multipacksTableData.length);
            packs = [];
            packs.push({ qr: qr });
            temp[multipacksTableData.length] = packs;

            setMultipacksTableData(temp);
        } else {
            packs.push({ qr: qr });
            temp[indexMultipack] = packs;

            setMultipacksTableData(temp);
        }

        setPackQr("");
    }

    if (page === "/") return <Redirect to="/" />

    if (window.screen.width < 600) {
        return (
            <div style={{padding: "10px 15px"}}>
                {modalCancel && (
                    <ModalWindow
                        title="Отменить изменения"
                        description="Вы действительно хотите отменить изменения?"
                    >
                        <Button onClick={() => {
                            modalCancel[0](modalCancel[1]);
                            setModalCancel(false);
                        }}>
                            <img className="modal-button-icon" src={imgOk} style={{ width: 25 }} />
                            Отменить
                        </Button>
                        <Button onClick={() => setModalCancel(false)} theme="secondary">
                            <img className="modal-button-icon" src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                            Вернуться к изменениям
                        </Button>
                    </ModalWindow>
                )}
                {modalSubmit && (
                    <ModalWindow
                        title="Принять изменения"
                        description="Вы действительно хотите принять изменения?"
                    >
                        <Button onClick={() => {
                            modalSubmit[0](modalSubmit[1]);
                            setModalSubmit(false);
                        }}>
                            <img className="modal-button-icon" src={imgOk} style={{ width: 25 }} />
                            Принять изменения
                        </Button>
                        <Button onClick={() => setModalSubmit(false)} theme="secondary">
                            <img className="modal-button-icon" src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                            Отменить
                        </Button>
                    </ModalWindow>
                )}
    
                <div className="header">
                    <span className="title1" style={{borderBottom: "3px solid #086bb2"}}>Создание</span>
                    {notificationErrorText &&
                        <div className="notification">
                            <span>{notificationErrorText}</span>
                        </div> 
                    }
                </div>
    
                <div className="body">
                    <div className="input-container">
                        <span className="title2">Номер партии ГП:</span>
                   <TextField className="text-input" placeholder="0000" onChange={e => setBatchNumber(e.target.value)}></TextField>
                   
                    </div>
    
                    <div className="input-container">
                        <span className="title2">QR куба:</span>
                        <TextField className="text-input" placeholder="0000" onChange={e => setCubeQr(e.target.value)}></TextField>
                    </div>
    
                    <div className="input-container">
                        <span className="title2">Штрихкод каждой пачки в кубе:</span>
                        <TextField className="text-input" placeholder="0000" onChange={e => setBarcode(e.target.value)}></TextField>
                    </div>
    
                    <br />
                    <br />
    
                    <div className="input-container">
                        {params.map((obj, index) => (
                            <InputRadio name="param_batch"
                                htmlFor={obj.id}
                                key={index}
                                onClick={() => setSettings(obj)}>
                                <span className="input-radio">
                                    Куб: {obj.multipacks} паллет, паллета: {obj.packs} пачек,
                                        <br />
                                        пинцет: {obj.multipacks_after_pintset} паллета
                                </span>
                            </InputRadio>
                        ))}
                        
                    </div>
                    
                    <div>
                        <div className="header" style={{justifyContent: "space-between", alignItems: "center"}}>
                            <span className="title2">Паллеты</span>
                            <Button style={{margin: "0 auto"}} className="button" onClick={() => addEmptyMultipack()}>Добавить</Button>
                        </div>
    
                        <CtxCurrentMultipack.Provider value={{ currentMultipack, setCurrentMultipack }}>
                            <TableData
                                rows={multipacksTableData}
                                className="table-content"
                                onDelete={obj => {
                                    deleteMultipack(multipacksTableData.indexOf(obj))
                                }}
                                hideTracksWhenNotNeeded
                                {...tableProps.multipacksTable}
                            />
                        </CtxCurrentMultipack.Provider>
                    </div>
    
                    <div>
                        <div className="header" style={{justifyContent: "space-between", alignItems: "center"}}>
                            <span className="title2">Пачки</span>
                            <TextField style={{fontSize: "1.5rem"}}
                                placeholder="0000"
                                name="pack_qr"
                                type="text"
                                value={packQr}
                                onChange={e => setPackQr(e.target.value)}
                                onKeyPress={e => (e.charCode === 13) && addPackToMultipack(packQr, currentMultipack)}
                            />
                        </div>
    
                        <TableData
                            rows={multipacksTableData[currentMultipack] ?
                                multipacksTableData[currentMultipack].map((obj, index) => ({ number: index + 1, qr: obj.qr })) :
                                []}
                            className="table-content"
                            onDelete={obj => deletePack(obj.number - 1, currentMultipack)}
                            hideTracksWhenNotNeeded
                            {...tableProps.packsTable}
                        />
                    </div>
    
                    <div className="button-container">
                            <Button onClick={() => setModalSubmit([submitChanges])} className="button-submit">
                                <img src={imgOk} /><span>Принять изменения</span>
                            </Button>
                            <Button onClick={() => setModalCancel([closeChanges])} theme="secondary">
                                <img src={imgCross} style={{ filter: 'invert(1)' }} /><span>Отменить изменения</span>
                            </Button>
                        </div>
                    
                </div>
            </div>
        );
    } else {
        useEffect(() => {
            axios.get(address + "/api/v1_0/settings")
                .then(res => {
                    if (res.data.location_settings) {
                        document.title = "Новый куб: " + res.data.location_settings.place_name.value
                    }
                })
        }, [])

        return (
            <div className="edit">
                {modalCancel && (
                    <ModalWindow
                        title="Отменить изменения"
                        description="Вы действительно хотите отменить изменения?"
                    >
                        <Button onClick={() => {
                            modalCancel[0](modalCancel[1]);
                            setModalCancel(false);
                        }}>
                            <img className="modal-button-icon" src={imgOk} style={{ width: 25 }} />
                            Отменить
                        </Button>
                        <Button onClick={() => setModalCancel(false)} theme="secondary">
                            <img className="modal-button-icon" src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                            Вернуться к изменениям
                        </Button>
                    </ModalWindow>
                )}
                {modalSubmit && (
                    <ModalWindow
                        title="Принять изменения"
                        description="Вы действительно хотите принять изменения?"
                    >
                        <Button onClick={() => {
                            modalSubmit[0](modalSubmit[1]);
                            setModalSubmit(false);
                        }}>
                            <img className="modal-button-icon" src={imgOk} style={{ width: 25 }} />
                            Принять изменения
                        </Button>
                        <Button onClick={() => setModalSubmit(false)} theme="secondary">
                            <img className="modal-button-icon" src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                            Отменить
                        </Button>
                    </ModalWindow>
                )}
    
                <div className="header">
                    <Text type="title">Создание</Text>
                    <div className="header-inputs">
                        <span className="input-label">Номер партии ГП: </span>
                     <TextField
                            placeholder="0000"
                            name="batch_number"
                            type="text"
                            value={batchNumber}
                            onChange={e => setBatchNumber(e.target.value)}
                       />
                        
                        <span className="input-label">QR куба: </span>
                        <TextField
                            placeholder="0000"
                            name="cube_qr"
                            type="text"
                            value={cubeQr}
                            onChange={e => setCubeQr(e.target.value)}
                        />
    
                        <span className="input-label">Штрихкод каждой пачки в кубе: </span>
                        <TextField
                            placeholder="0000"
                            name="barcode"
                            type="text"
                            value={barcode}
                            onChange={e => setBarcode(e.target.value)}
                        />
    
                    </div>
                </div>
    
                <div className="table-container">
                    <div className="form">
                        {params.map((obj, index) => (
                            <InputRadio name="param_batch"
                                htmlFor={obj.id}
                                key={index}
                                onClick={() => setSettings(obj)}>
                                <span className="radio-label">
                                    Куб: {obj.multipacks} паллет, паллета: {obj.packs} пачек,
                                        <br />
                                        пинцет: {obj.multipacks_after_pintset} паллета
                                </span>
                            </InputRadio>
                        ))}
                        <div className="button-container">
                            <Button onClick={() => setModalSubmit([submitChanges])} className="button-submit">
                                <img src={imgOk} /><span>Принять изменения</span>
                            </Button>
                            <Button onClick={() => setModalCancel([closeChanges])} theme="secondary">
                                <img src={imgCross} style={{ filter: 'invert(1)' }} /><span>Отменить изменения</span>
                            </Button>
                        </div>
                    </div>
    
                    <div>
                        <div className="table-title-container">
                            <Text className="table-title" type="title2">Паллеты</Text>
                            <Button onClick={() => addEmptyMultipack()}><span>Добавить</span></Button>
                        </div>
                        <CtxCurrentMultipack.Provider value={{ currentMultipack, setCurrentMultipack }}>
                            <TableData
                                rows={multipacksTableData}
                                className="table-content"
                                onDelete={obj => {
                                    deleteMultipack(multipacksTableData.indexOf(obj))
                                }}
                                hideTracksWhenNotNeeded
                                {...tableProps.multipacksTable}
                            />
                        </CtxCurrentMultipack.Provider>
                    </div>
    
                    <div>
                        <div className="table-title-container">
                            <Text className="table-title" type="title2">Пачки</Text>
                            <TextField
                                placeholder="0000"
                                name="pack_qr"
                                type="text"
                                value={packQr}
                                forceFocus
                                onChange={e => setPackQr(e.target.value)}
                                onKeyPress={e => (e.charCode === 13) && addPackToMultipack(packQr, currentMultipack)}
                            />
                        </div>
                        <TableData
                            rows={multipacksTableData[currentMultipack] ?
                                multipacksTableData[currentMultipack].map((obj, index) => ({ number: index + 1, qr: obj.qr })) :
                                []}
                            className="table-content"
                            onDelete={obj => deletePack(obj.number - 1, currentMultipack)}
                            hideTracksWhenNotNeeded
                            {...tableProps.packsTable}
                        />
                    </div>
                </div>
    
                <NotificationPanel
                    errors={
                        notificationErrorText && (
                            [
                                <Notification
                                    title="Ошибка"
                                    key={notificationErrorText + "_key"}
                                    description={notificationErrorText}
                                    onClose={() => setNotificationErrorText("")}
                                    error
                                />
                            ]
                        )
                    }
                />
            </div>
        );
    }
}

export default Create;
