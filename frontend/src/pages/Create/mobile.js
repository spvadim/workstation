import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import axios from "axios";
// import { Redirect } from "react-router-dom";

import TableData from "../../components/Table/TableData.js";
import address from "../../address.js";
import ModalWindow from "../../components/ModalWindow/index.js";
import { InputRadio, Button, TextField } from 'src/components';
import imgCross from 'src/assets/images/cross.svg';
import imgOk from 'src/assets/images/ok.svg';


const useStyles = createUseStyles({
    header: {
        // display: "flex",
        marginBottom: 10,
    },

    title1: {
        fontSize: "2rem",
        fontWeight: 700,
        
    },

    title2: {
        fontSize: "1.5rem",
        fontWeight: 700,
        float: "left",
    },

    body: {
    
    },

    inputContainer: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 10,
    },

    textInput: {
        fontSize: "2rem",
    },

    inputRadio: {
        fontSize: "1.5rem",
    },

    button: {
        fontWeight: 600
    },

    buttonContainer: {
        display: "flex",
        
    },

    tableContainer: {
        '& > div': {
            marginLeft: 12,
            flexBasis: 0,
            flexGrow: 1,
            height: 662,
        },
        flexGrow: 1,
        display: 'flex',
        paddingTop: 65,
        paddingRight: 22,
        paddingLeft: 36,
        position: 'relative',
    },

    tableDescription: {
        height: 135,
    },

    tableContent: {
        height: 300,
    },

    radioLabel: {
        flexGrow: 1,
        marginLeft: 12,
    },
    radioMultipack: {
        '& .input-radio_mark': {
            marginRight: 12,
        },
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
    },

    notification: {
        border: "1px solid red",
        borderRadius: "7px",
        padding: "0.7rem",
        fontSize: "1.3rem",
        fontWeight: 500,
        position: "fixed",
        right: 15,
        maxWidth: "50%",
        wordWrap: "break-word",
        backgroundColor: "#fea1a1",
    },

});



const CtxCurrentMultipack = React.createContext({
    currentMultipack: null,
    setCurrentMultipack: () => console.warn,
});

const RadioCurrentMultipack = ({ index }) => {
    const { currentMultipack, setCurrentMultipack } = React.useContext(CtxCurrentMultipack);
    const classes = useStyles();
    return (
        <>
            <InputRadio name="multipacksChoose"
                htmlFor={index}
                key={index}
                checked={index === currentMultipack}
                onChange={() => setCurrentMultipack(index)}
                className={classes.radioMultipack}>
                {index + 1}
            </InputRadio>
        </>
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

function Create_mobile() {
    const classes = useStyles();
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

    let timer;

    useEffect(() => {
        axios.get(address + "/api/v1_0/batches_params")
            .then(res => setParams(res.data))
            .catch(e => console.log(e.response))
    }, [])

    const deleteMultipack = (index) => {
        if (index === -1) return false;
        let temp = multipacksTableData.slice();
        temp.splice(index, 1);
        setMultipacksTableData(temp);
    }
    
    const deletePack = (indexPack, indexMultipack) => {
        let temp = multipacksTableData.slice();
        temp[indexMultipack].splice(indexPack, 1);
        setMultipacksTableData(temp);
    }
    
    const checkExist = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setNotificationErrorText("");
        }, 2000);

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
            clearTimeout(timer);
            timer = setTimeout(() => {
                setNotificationErrorText("");
            }, 2000);
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
            clearTimeout(timer);
            timer = setTimeout(() => {
                setNotificationErrorText("");
            }, 2000);
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

    if (page) console.log("redirect"); // return <Redirect to="/" />

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
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Отменить
                    </Button>
                    <Button onClick={() => setModalCancel(false)} theme="secondary">
                        <img className={classes.modalButtonIcon} src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
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
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Принять изменения
                    </Button>
                    <Button onClick={() => setModalSubmit(false)} theme="secondary">
                        <img className={classes.modalButtonIcon} src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                        Отменить
                    </Button>
                </ModalWindow>
            )}

            <div className={classes.header}>
                <span className={classes.title1} style={{borderBottom: "3px solid #086bb2"}}>Создание</span>
                {notificationErrorText &&
                    <div className={classes.notification}>
                        <span>{notificationErrorText}</span>
                    </div> 
                }
            </div>

            <div className={classes.body}>
                <div className={classes.inputContainer}>
                    <span className={classes.title2}>Номер партии ГП:</span>
               <TextField className={classes.textInput} placeholder="0000" onChange={e => setBatchNumber(e.target.value)}></TextField>
               
                </div>

                <div className={classes.inputContainer}>
                    <span className={classes.title2}>QR куба:</span>
                    <TextField className={classes.textInput} placeholder="0000" onChange={e => setCubeQr(e.target.value)}></TextField>
                </div>

                <div className={classes.inputContainer}>
                    <span className={classes.title2}>Штрихкод каждой пачки в кубе:</span>
                    <TextField className={classes.textInput} placeholder="0000" onChange={e => setBarcode(e.target.value)}></TextField>
                </div>

                <br />
                <br />

                <div className={classes.inputContainer}>
                    {params.map((obj, index) => (
                        <InputRadio name="param_batch"
                            htmlFor={obj.id}
                            key={index}
                            onClick={() => setSettings(obj)}>
                            <span className={classes.inputRadio}>
                                Куб: {obj.multipacks} паллет, паллета: {obj.packs} пачек,
                                    <br />
                                    пинцет: {obj.multipacks_after_pintset} паллета
                            </span>
                        </InputRadio>
                    ))}
                    
                </div>
                
                <div>
                    <div className={classes.header} style={{justifyContent: "space-between", alignItems: "center"}}>
                        <span className={classes.title2}>Паллеты</span>
                        <Button style={{margin: "0 auto"}} className={classes.button} onClick={() => addEmptyMultipack()}>Добавить</Button>
                    </div>

                    <CtxCurrentMultipack.Provider value={{ currentMultipack, setCurrentMultipack }}>
                        <TableData
                            rows={multipacksTableData}
                            className={classes.tableContent}
                            onDelete={obj => {
                                deleteMultipack(multipacksTableData.indexOf(obj))
                            }}
                            hideTracksWhenNotNeeded
                            {...tableProps.multipacksTable}
                        />
                    </CtxCurrentMultipack.Provider>
                </div>

                <div>
                    <div className={classes.header} style={{justifyContent: "space-between", alignItems: "center"}}>
                        <span className={classes.title2}>Пачки</span>
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
                        className={classes.tableContent}
                        onDelete={obj => deletePack(obj.number - 1, currentMultipack)}
                        hideTracksWhenNotNeeded
                        {...tableProps.packsTable}
                    />
                </div>

                <div className={classes.buttonContainer}>
                        <Button onClick={() => setModalSubmit([submitChanges])} className={classes.buttonSubmit}>
                            <img src={imgOk} /><span>Принять изменения</span>
                        </Button>
                        <Button onClick={() => setModalCancel([closeChanges])} theme="secondary">
                            <img src={imgCross} style={{ filter: 'invert(1)' }} /><span>Отменить изменения</span>
                        </Button>
                    </div>
                
            </div>
        </div>
    );
}

export default Create_mobile;