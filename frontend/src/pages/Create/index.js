import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import axios from "axios";
import { Redirect } from "react-router-dom";

import TableData from "../../components/Table/TableData.js";
import address from "../../address.js";
import ModalWindow from "../../components/ModalWindow/index.js";
import { Notification } from "../../components/Notification/index.js";
import { Text, InputRadio, Button, TextField, NotificationPanel } from 'src/components';
import { color } from 'src/theme';
import imgCross from 'src/assets/images/cross.svg';
import imgOk from 'src/assets/images/ok.svg';



const useStyles = createUseStyles({
    Edit: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        paddingLeft: 49,
        paddingRight: 49,
        marginTop: 24,
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
    },
    headerInputs: {
        '& > *:nth-child(odd)': {
            marginLeft: 50,
        },
        '& > *:nth-child(even)': {
            marginLeft: 10,
        },
        display: 'flex',
        alignItems: 'center',
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
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingBottom: 22,
        paddingLeft: 27,
        paddingRight: 27,
    },
    switchContainer: {
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        fontSize: 18,
    },
    switchTitle: {
        fontSize: 24,
        fontWeight: 700,
    },
    tableDescription: {
        height: 135,
    },
    buttonContainer: {
        '& > .button > span': {
            flexGrow: 1,
        },
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: '1fr',
        columnGap: 10,
    },
    buttonSubmit: {
        borderColor: color.yellow,
    },
    tableContent: {
        height: 600,
    },
    switchTable: {
        '& .switch_thumb': {
            backgroundColor: color.yellow,
        },
        position: 'absolute',
        left: 1000,
        zIndex: 1,
    },
    textEditor: {
        borderStyle: 'none',
        outline: 'none',
    },
    tableTitleContainer: {
        paddingLeft: 12,
        display: 'grid',
        gridAutoFlow: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        columnGap: 10,
        height: 50,
    },
    form: {
        '& .input-radio': {
            flexDirection: 'row-reverse',
        },
        marginTop: 100,
        display: 'grid',
        gridAutoRows: 54,
        rowGap: '12px',

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

function Create() {
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

    useEffect(() => {
        axios.get(address + "/api/v1_0/batches_params")
            .then(res => setParams(res.data))
            .catch(e => console.log(e.response))
    }, [])


    // const deleteRow = (row, from) => {
    //     console.log(row, from)
    //     if (from === "addTable") {
    //         let temp = addTableData.filter((obj) => obj.qr !== row.qr);
    //         setAddTableData(temp);
    //     } else if (from === "removeTable") {
    //         let temp = removeTableData.filter((obj) => obj.qr !== row.qr);
    //         setRemoveTableData(temp);
    //     } else if (from === "containTable") {
    //         let finded = containTableData.find(obj => obj.qr === row.qr)
    //         let findedInRemoveTable = removeTableData.find(obj => obj.qr === row.qr)
    //         if (finded && !findedInRemoveTable) {
    //             let temp = removeTableData.slice();
    //             temp.push(row)
    //             setRemoveTableData(temp);
    //         }
    //     }
    // }

    // const addPack = (qr) => {
    //     let temp = addTableData.slice();
    //     temp.push({ barcode: barcode, qr: qr})
    //     setAddTableData(temp);
    // }

    // const submitChanges = () => {
    //     if (containTableData.length === 0) {
    //         axios.delete(address + "/api/v1_0/" + type + "/" + description.id)
    //             .then(() => setPage("/"))

    //     } else if (containTableData !== "/loader") {
    //         let packs = containTableData.map((obj) => obj.id);
    //         let temp = { pack_ids: packs };
    //         axios.patch(address + "/api/v1_0/" + type + "/" + description.id, temp)
    //             .then(() => {
    //                 setModalSubmit(false);
    //                 setPage("/");
    //             })

    //     } else {
    //         setPage("/")
    //     }
    // }

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

    return (
        <div className={classes.Edit}>
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
                <Text type="title">Создание</Text>
                <div className={classes.headerInputs}>
                    <span className={classes.inputLabel}>Номер партии ГП: </span>
                 <TextField
                        placeholder="0000"
                        name="batch_number"
                        type="text"
                        value={batchNumber}
                        onChange={e => setBatchNumber(e.target.value)}
                   />
                    
                    <span className={classes.inputLabel}>QR куба: </span>
                    <TextField
                        placeholder="0000"
                        name="cube_qr"
                        type="text"
                        value={cubeQr}
                        onChange={e => setCubeQr(e.target.value)}
                    />

                    <span className={classes.inputLabel}>Штрихкод каждой пачки в кубе: </span>
                    <TextField
                        placeholder="0000"
                        name="barcode"
                        type="text"
                        value={barcode}
                        onChange={e => setBarcode(e.target.value)}
                    />

                </div>
            </div>

            <div className={classes.tableContainer}>
                <div className={classes.form}>
                    {params.map((obj, index) => (
                        <InputRadio name="param_batch"
                            htmlFor={obj.id}
                            key={index}
                            onClick={() => setSettings(obj)}>
                            <span className={classes.radioLabel}>
                                Куб: {obj.multipacks} паллет, паллета: {obj.packs} пачек,
                                    <br />
                                    пинцет: {obj.multipacks_after_pintset} паллета
                            </span>
                        </InputRadio>
                    ))}
                    <div className={classes.buttonContainer}>
                        <Button onClick={() => setModalSubmit([submitChanges])} className={classes.buttonSubmit}>
                            <img src={imgOk} /><span>Принять изменения</span>
                        </Button>
                        <Button onClick={() => setModalCancel([closeChanges])} theme="secondary">
                            <img src={imgCross} style={{ filter: 'invert(1)' }} /><span>Отменить изменения</span>
                        </Button>
                    </div>
                </div>

                <div>
                    <div className={classes.tableTitleContainer}>
                        <Text className={classes.tableTitle} type="title2">Паллеты</Text>
                        <Button onClick={() => addEmptyMultipack()}><span>Добавить</span></Button>
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
                    <div className={classes.tableTitleContainer}>
                        <Text className={classes.tableTitle} type="title2">Пачки</Text>
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
                        className={classes.tableContent}
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

            {/* <div className={classes.footer}>
                <div>
                    <div className={classes.switchTitle} style={{ textAlign: 'right' }}>
                        Вид интерфейса:
                    </div>
                    <div className={classes.switchContainer}>
                        Сжатый
                    <Switch onClick={console.error} />
                        Расширенный
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default Create;