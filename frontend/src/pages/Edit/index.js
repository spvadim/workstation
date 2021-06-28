import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import axios from "axios";
import { Redirect } from "react-router-dom";

import TableData from "../../components/Table/TableData.js";
import address from "../../address.js";
import ModalWindow from "../../components/ModalWindow/index.js";
import { Text, Switch, Button, NotificationPanel, Loader, TextField } from 'src/components';
import { Notification } from "../../components/Notification/index.js";

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
        marginTop: 24,
        marginBottom: 24,
    },
    tableContainer: {
        '& > div': {
            marginLeft: 12,
            flexBasis: 0,
            flexGrow: 1,
            height: 800,
        },
        flexGrow: 1,
        display: 'flex',
        paddingRight: 22,
        paddingLeft: 36,
        position: 'relative',
    },
    tableTitle: {
        marginLeft: 12,
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
        marginTop: -19,
        paddingRight: 14,
        height: 54,
    },
    buttonSubmit: {
        borderColor: color.yellow,
    },
    titleContent: {
        display: 'block',
        marginTop: 65,
    },
    tableContent: {
        height: 397,
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
});

// const QrLink = ({ children }) => <Link href={children}>{children}</Link>;

// const TextEditor = ({ children, style }) => {
//     const classes = useStyles();
//     return <input className={classes.textEditor} style={style} defaultValue={children} />
// };

// const LinkEditor = ({ children }) => {
//     return <TextEditor style={{ color: color.linkBlue }}>{children}</TextEditor>
// }

const getTableProps = (type, extended) => ({
    description: {
        type: type,
        columns: [
            { name: "created_at", title: "Создано", width: 123 },
            { name: "qr", title: "qr" },
            { name: "id", title: "id", width: 240 },
        ],
    },

    addTable: {
        name: "addTable",
        type: type,
        columns: [
            { name: "barcode", title: "barcode", width: 200 },
            { name: "qr", title: "qr" },
        ],
        buttonDelete: "/delete",
    },

    removeTable: {
        name: "removeTable",
        type: type,
        columns: extended ?
        [
            { name: "created_at", title: "Создано", width: 123 },
            { name: "barcode", title: "barcode", width: 130 },
            { name: "qr", title: "qr" },
            { name: "id", title: "id", width: 200},
        ] : 
        [
            { name: "created_at", title: "Создано", width: 123 },
            { name: "barcode", title: "barcode", width: 130 },
            { name: "qr", title: "qr" },
        ],
        buttonDelete: "/return",
    },

    containTable: {
        type: type,
        columns: extended ? 
        [
            { name: "index", title: "№", width: 48 }, 
            { name: "created_at", title: "Создано", width: 123 },
            { name: "qr", title: "qr"},
            { name: "id", title: "id", width: 200 },
        ] : 
        [
            { name: "index", title: "№", width: 48 }, 
            { name: "created_at", title: "Создано", width: 123 },
            { name: "qr", title: "qr"},
        ],
        buttonDelete: "/remove",
    },
});

function Edit({ description, type, extended }) {
    const classes = useStyles();
    const tableProps = getTableProps(type, extended);
    const [tableSwitch, setTableSwitch] = useState(false);
    const [newQrCube, setNewQrCube] = useState("");
    const [cubeId, setCubeId] = useState("");
    const [valueQr, setValueQr] = useState('');
    // const [valueFlag, setValueFlag] = useState(false);
    // const [barcode, setBarcode] = useState("placeholder");
    const [errorText, setErrorText] = useState("");
    const [errorText2, setErrorText2] = useState("");
    const [addTableData, setAddTableData] = useState([]);
    const [removeTableData, setRemoveTableData] = useState([]);
    const [page, setPage] = useState('');
    const [containTableData, setContainTableData] = useState("/loader");
    const [modalCancel, setModalCancel] = useState(false);
    const [modalSubmit, setModalSubmit] = useState(false);
    // const [toProcess, setToProcess] = useState(false);
    const [toProcessDump] = useState(false);

    // useEffect(() => {
    //     if (valueFlag) {
    //         clearTimeout(timer);
    //         timer = setTimeout(() => {
    //             let finded = containTableData.find(obj => obj.qr === valueQr);
    //             if (tableSwitch) deleteRow(finded, "containTable")
    //             else addPack(valueQr);
    //             setValueQr("")
    //         }, 500);
    //     }
    //     setValueFlag(false);

    // }, [valueFlag])

    useEffect(() => {
        axios.get(address + "/api/v1_0/" + type + "/" + description.id)
            .then(async res => {
                if (type === "multipacks") {
                    setContainTableData(await getPacks(res.data.pack_ids));
                } else if (type === "cubes") {
                    setContainTableData(await getPacksFromMultipacks(Object.keys(res.data.multipack_ids_with_pack_ids)));
                    // setToProcess(res.data.to_process);
                    setCubeId(res.data.id);
                }
            })
    }, [])

    useEffect(() => {
        axios.get(address + "/api/v1_0/settings")
            .then(res => {
                if (res.data.location_settings) {
                    document.title = "Редактирование: " + res.data.location_settings.place_name.value
                }
            })
    }, [])

    const deleteOrAddPack = () => {
        let finded = containTableData.find(obj => obj.qr === valueQr);
        
        if (tableSwitch) deleteRow(finded, "containTable")
        else addPack(valueQr);
        setValueQr("");
    }

    const getPacksFromMultipacks = async (ids) => {
        let packsIds = [];
        for (let i = 0; i < ids.length; i++) {
            let request = await axios.get(address + "/api/v1_0/multipacks/" + ids[i]);
            let data = request.data;
            packsIds.push(data.pack_ids)
        }

        return getPacks(packsIds.flat())
    }

    // const getMultipacks = async (ids) => {
    //     let multipacks = [];
    //     for (let i = 0; i < ids.length; i++) {
    //         let request = await axios.get(address + "/api/v1_0/multipacks/" + ids[i]);
    //         let data = request.data;
    //         multipacks.push({
    //             qr: data.qr,
    //             barcode: data.barcode,
    //             created_at: data.created_at,
    //             id: data.id,
    //         })
    //     }

    //     return multipacks;
    // }

    const getPacks = async (ids) => {
        let packs = [];
        for (let i = 0; i < ids.length; i++) {
            let request = await axios.get(address + "/api/v1_0/packs/" + ids[i]);
            let data = request.data;
            packs.push({
                qr: data.qr,
                barcode: data.barcode,
                created_at: data.created_at,
                id: data.id,
            })
        }

        return packs;
    }

    const deleteRow = (row, from) => {
        if (!row) return false;
        setErrorText("");
        if (from === "addTable") {
            let temp = addTableData.filter((obj) => obj.qr !== row.qr);
            setAddTableData(temp);
        } else if (from === "removeTable") {
            let temp = removeTableData.filter((obj) => obj.qr !== row.qr);
            setRemoveTableData(temp);
        } else if (from === "containTable") {
            let finded = containTableData.find(obj => obj.qr === row.qr)
            let findedInRemoveTable = removeTableData.find(obj => obj.qr === row.qr)
            if (finded && !findedInRemoveTable) {
                let temp = removeTableData.slice();
                temp.push(row)
                setRemoveTableData(temp);
            }
        }
    }

    const addPack = (qr) => {
        let finded = addTableData.find(obj => obj.qr === qr)
        if (!finded) {
            let temp = addTableData.slice();
            temp.push({ barcode: containTableData[0].barcode, qr: qr});
            setErrorText("");
            setAddTableData(temp);
        }
    }

    const submitChanges = () => {
        if (containTableData !== "/loader" && (removeTableData.length !== 0 || addTableData.length !== 0) && !errorText2) {
            axios.patch(address + "/api/v1_0/edit_cube/" + description.id, {
                pack_ids_to_delete: removeTableData.map(row => row.id),
                packs_barcode: containTableData[0].barcode,
                pack_qrs: addTableData.map(row => row.qr),
                to_process: toProcessDump ? false : true,
            })
            .then(() => {setErrorText(""); setPage("/")})
            .catch(e => setErrorText(e.response.data.detail))
        } else if (toProcessDump) {
            axios.patch(address + "/api/v1_0/cubes/" + description.id, {to_process: false})
                .then(() => {setErrorText(""); setPage("/")})
        }

        if (newQrCube && !errorText) {
            axios.patch(address + "/api/v1_0/cubes/" + cubeId, {qr: newQrCube})
                .then(() => {setErrorText2(""); setPage("/")})
                .catch(e => setErrorText2(e.response.data.detail))
        }


    }

    const closeChanges = () => {
        setErrorText("");
        setErrorText2("");
        setPage("/");
    }

    if (page === "/" && !errorText && !errorText2) return <Redirect to="/" />

    return (
        <div className={classes.Edit}>
            {modalCancel && (
                <ModalWindow
                    title="Отменить изменения"
                    description="Вы действительно хотите отменить изменения?"
                >
                    <Button onClick={() => {
                        setModalCancel(false);
                        modalCancel[0](modalCancel[1])
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
                    title="Применить изменения"
                    description="Вы действительно хотите применить изменения?"
                >
                    <Button onClick={() => {
                        setModalSubmit(false);
                        modalSubmit[0](modalSubmit[1])
                    }}>
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Применить
                    </Button>
                    <Button onClick={() => setModalSubmit(false)} theme="secondary">
                        <img className={classes.modalButtonIcon} src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                        Отмена
                    </Button>
                </ModalWindow>
            )}


            <div className={classes.header}>
                <Text type="title">Редактор</Text>
                <TextField
                    placeholder="QR..."
                    onChange={async e => {
                        // setValueFlag(true);
                        setValueQr(e.target.value);
                    }}
                    onKeyPress={e => (e.charCode === 13) && deleteOrAddPack()}
                    hidden
                    value={valueQr}
                    forceFocus
                    autoFocus
                />
                
            </div>

            <div className={classes.tableContainer}>
                <Switch onClick={() => {
                    setTableSwitch(!tableSwitch);
                    setValueQr("");
                }} className={classes.switchTable} />
                <div>
                    <div style={{display: "flex", gap: 20, alignItems: "center"}}>
                        <Text className={classes.tableTitle} type="title2">{type}</Text>
                        <span>Новый QR: <TextField style={{padding: "5px 5px", width: 300}}
                                                                            outlined
                                                                            placeholder="Новый Qr..."
                                                                            onChange={async e => {
                                                                                setNewQrCube(e.target.value);
                                                                                setErrorText2("");
                                                                            }} /></span>
                        {/* {toProcess &&
                            <Button onClick={() => setToProcessDump(!toProcessDump)} theme="secondary">
                                <img className={classes.modalButtonIcon} src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                                Сбросить статус: ({toProcessDump ? "true" : "false"})
                            </Button>
                        } */}
                    </div>
                    <TableData
                        className={classes.tableDescription}
                        rows={[description]}
                        hideTracksWhenNotNeeded
                        {...tableProps.description}
                    />

                    <div className={classes.buttonContainer}>
                        <Button onClick={() => {
                            if ((removeTableData.length === 0 && addTableData.length === 0) && !newQrCube && !toProcessDump) closeChanges()
                            else setModalSubmit([submitChanges])
                        }} className={classes.buttonSubmit}>
                            <img src={imgOk} /><span>Принять изменения</span>
                        </Button>
                        <Button onClick={() => {
                            if (removeTableData.length === 0 && addTableData.length === 0) closeChanges()
                            else setModalCancel([closeChanges])
                        }} theme="secondary">
                            <img src={imgCross} style={{ filter: 'invert(1)' }} /><span>Отменить изменения</span>
                        </Button>
                    </div>

                    <Text className={[classes.tableTitle, classes.titleContent].join(' ')} type="title2">Содержимое</Text>
                    {containTableData === "/loader" ? <Loader /> : 
                    <TableData
                        rows={containTableData.map((obj, index) => {obj.index = index + 1; return obj})}
                        className={classes.tableContent}
                        onDelete={row => deleteRow(row, "containTable")}
                        hideTracksWhenNotNeeded
                        {...tableProps.containTable}
                    />}
                </div>

                <div style={{ opacity: tableSwitch ? 0.4 : 1 }}>
                    <Text className={classes.tableTitle} type="title2">Добавляемое</Text>
                    <TableData
                        rows={addTableData}
                        onDelete={row => deleteRow(row, "addTable")}
                        {...tableProps.addTable}
                    />
                </div>

                <div style={{ opacity: tableSwitch ? 1 : 0.4 }}>
                    <Text className={classes.tableTitle} type="title2">Удаляемое</Text>
                    <TableData
                        rows={removeTableData}
                        onDelete={row => deleteRow(row, "removeTable")}
                        {...tableProps.removeTable}
                    />
                </div>
            </div>

            <NotificationPanel
                errors={
                    [
                        errorText && (
                            <Notification
                                title="Ошибка"
                                description={errorText}
                                error
                            > </Notification>
                        ),
                        errorText2 && (
                            <Notification
                                title="Ошибка"
                                description={errorText2}
                                error
                            > </Notification>
                        ),
                    ]
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

export default Edit;