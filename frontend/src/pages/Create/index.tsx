import React, { createRef, useEffect, useReducer, useState } from 'react';
import axios from "axios";
import { Redirect } from "react-router-dom";

import TableData from "../../components/Table/TableData.js";
import address from "../../address.js";
import ModalWindow from "../../components/ModalWindow/index.js";
import { Text, InputRadio, Button, TextField } from 'src/components';
import imgCross from 'src/assets/images/cross.svg';
import imgOk from 'src/assets/images/ok.svg';

import "./style.scss"
import NotificationProvider from 'src/components/NotificationProvider';
import DataProvider from 'src/components/DataProvider';
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

const Create = () => {
    const [page, setPage] = useState('');
    const [batchIndex, setBatchIndex] = useState<number>();
    const [params, setParams] = useState([]);
    const [settings, setSettings] = useState({});
    const [cubeQr, setCubeQr] = useState('');
    const [packQr, setPackQr] = useState('');
    const [modalCancel, setModalCancel] = useState(false);
    const [modalSubmit, setModalSubmit] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [multipacksTableData, setMultipacksTableData] = useState([]);
    const [currentMultipack, setCurrentMultipack] = useState('');

    const refBatch = createRef<HTMLSelectElement>();
    const refCubeQR = createRef<HTMLInputElement>();
    const refPackBar = createRef<HTMLInputElement>();
    const refParams = createRef<HTMLInputElement>();
    const refPacksQR = createRef<HTMLInputElement>();

    const setFocus = (ref: React.RefObject<HTMLInputElement | HTMLSelectElement>) => ref.current?.focus();
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const loadBatches = () => {
        DataProvider.Batches.load()
        .then(res => {
            DataProvider.Batches.data = res.data.reverse().slice(0, 10);
            forceUpdate();
        })
    }

    useEffect(loadBatches, [])
    
    useEffect(() => {
        axios.get(address + "/api/v1_0/settings")
            .then(res => {
                if (res.data.location_settings) {
                    document.title = "Новый куб: " + res.data.location_settings.place_name.value
                }
            })
    }, [])

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

    const deletePack = (indexPack: number, indexMultipack: number) => {
        let temp = multipacksTableData.slice();
        temp[indexMultipack].splice(indexPack, 1);
        setMultipacksTableData(temp);
    }

    const deleteMultipack = (index: number) => {
        if (index === -1) return false;
        let temp = multipacksTableData.slice();
        temp.splice(index, 1);
        setMultipacksTableData(temp);
    }

    const checkExist = () => {
        let errorText = "";
        if (!settings.id) errorText = "Параметры партии не заданы!"
        else if (!batchIndex) errorText = "Партия не выбрана!"
        else if (!cubeQr) errorText = "QR куба не задан!"
        else if (!barcode) errorText = "Штрихкод не задан!"
        else if (multipacksTableData.length === 0) errorText = "Очередь паллет пуста!"

        if (errorText !== "")
            NotificationProvider.createNotification("Ошибка", errorText, "danger", 10000)
        return errorText === "";
    }

    const submitChanges = () => {
        if (!checkExist()) return false;
        if (batchIndex === undefined || DataProvider.Batches.data === undefined) return false;

        let body = {
            params_id: settings.id,
            batch_number: DataProvider.Batches.data[batchIndex].number,
            qr: cubeQr,
            barcode_for_packs: barcode,
            content: multipacksTableData,
        }

        axios.put(address + "/api/v1_0/cube_with_new_content", body)
            .then(() => setPage("/"))
            .catch(e => NotificationProvider.createNotification("Ошибка", e.response.data.detail, "danger", 10000))
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
            NotificationProvider.createNotification("Ошибка", "Превышен предел мульпаков", "danger", 10000);
            return false;
        }

        let temp = multipacksTableData.slice();
        temp.push([]);
        setMultipacksTableData(temp);
        return temp;
    }

    const addPackToMultipack = (qr, indexMultipack_) => {
        if (!settings.id) {
            NotificationProvider.createNotification("Ошибка", "Сначала выберите параметры партии!", "danger", 10000);
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

    const applyFocus = () => setTimeout(() => {
        //setTimeout is FireFox workaround, not needed in Chrome
        //Edit: needed in Chrome to get correct active element
        if (window.screen.width < 600) return;
        if (["INPUT", "SELECT"].includes(document.activeElement?.tagName ?? ""))
            return;

        let ref: React.RefObject<HTMLInputElement | HTMLSelectElement> = refBatch;
        if (batchIndex !== undefined) ref = refCubeQR;
        if (cubeQr !== "") ref = refPackBar;
        if (barcode !== "") ref = refPacksQR;
        setFocus(ref)
    }, 10)

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
                </div>
    
                <div className="body">
                    <div className="input-container">
                        <span className="title2">Партия ГП:</span>
                        {DataProvider.Batches.data !== undefined && (
                            <select ref={refBatch} onChange={e => setBatchIndex(+e.target.value)}>
                                <option hidden disabled selected>Выберите партию</option>
                                {DataProvider.Batches.data.map((x, i) => <option value={i} key={i}>
                                        Номер: {x.number.batch_number} Дата: {x.number.batch_date}
                                    </option>)}
                            </select>
                        )}
                    </div>
    
                    <div className="input-container">
                        <span className="title2">QR куба:</span>
                        <input ref={refCubeQR} className="text-input" placeholder="0000"
                        onChange={e => setCubeQr(e.target.value)}
                        onBlur={applyFocus}></input>
                    </div>
    
                    <div className="input-container">
                        <span className="title2">Штрихкод каждой пачки в кубе:</span>
                        <input ref={refPackBar} className="text-input" placeholder="0000"
                        onChange={e => setBarcode(e.target.value)}
                        onBlur={applyFocus}></input>
                    </div>
    
                    <br />
                    <br />
    
                    <div className="param-container">
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
                            <input style={{fontSize: "1.5rem"}}
                                placeholder="0000"
                                name="pack_qr"
                                type="text"
                                ref={refPacksQR}
                                value={packQr}
                                onChange={e => setPackQr(e.target.value)}
                                onBlur={applyFocus}
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
                    <span className="title2">Партия ГП:</span>
                        {DataProvider.Batches.data !== undefined && (
                            <select autoFocus onChange={e => setBatchIndex(+e.target.value)}
                            ref={refBatch} onBlur={applyFocus}>
                                <option hidden disabled selected>Выберите партию</option>
                                {DataProvider.Batches.data.map((x, i) => <option value={i} key={i}>
                                        Номер: {x.number.batch_number} Дата: {x.number.batch_date}
                                    </option>)}
                            </select>
                        )}
                        
                        <span className="input-label">QR куба: </span>
                        <input
                            placeholder="0000"
                            name="cube_qr"
                            type="text"
                            onBlur={applyFocus}
                            ref={refCubeQR}
                            value={cubeQr}
                            onChange={e => setCubeQr(e.target.value)}
                        />
    
                        <span className="input-label">Штрихкод каждой пачки в кубе: </span>
                        <input
                            placeholder="0000"
                            name="barcode"
                            type="text"
                            onBlur={applyFocus}
                            ref={refPackBar}
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
                            <input
                                placeholder="0000"
                                name="pack_qr"
                                type="text"
                                value={packQr}
                                ref={refPacksQR}
                                onBlur={applyFocus}
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
            </div>
        );
    }
}

export default Create;
