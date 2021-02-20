import React, { useMemo, useState, useEffect, useRef } from "react";
import axios from 'axios';

import TableAddress from "../../components/Table/TableAddress.js";
import InputTextQr from "../../components/InputText/InputTextQr.js";
import Input from "../../components/InputText/Input.js";
import ModalWindow from "../../components/ModalWindow/index.js";

// import ColumnError from "../../components/ColumnError/index.js";
import { Notification, NotificationImage } from "../../components/Notification/index.js";
import { Button, Text, Link, NotificationPanel, Switch, TextField } from "src/components";
import imgCross from 'src/assets/images/cross.svg';
import imgOk from 'src/assets/images/ok.svg';
// import imgScanner from 'src/assets/images/scanner.svg';
// import imgScannerActive from 'src/assets/images/scanner-active.svg';
// import imgQR from 'src/assets/images/qr.svg';

import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

import address from "../../address.js";
import { createUseStyles } from "react-jss";
import { HeaderInfo } from './HeaderInfo';

const getTableProps = (extended) => ({
    cube: {
        columns: extended ?
            [
                { name: "index", title: "№", width: 48 },
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr" },
                { name: "id", title: "id", width: 200 },
            ] : [
                { name: "index", title: "№", width: 48 },
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr" },
            ],
    },

    multipack: {
        columns: extended ?
            [
                { name: "index", title: "№", width: 48 },
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", width: 48, Component: () => <>...</> },
                { name: "status", title: "Статус" },
                { name: "id", title: "id", width: 200 },
            ] : [
                { name: "index", title: "№", width: 48 },
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr" },
                { name: "status", title: "Статус" },
            ],
    },

    pack: {
        columns: extended ?
            [
                { name: "index", title: "№", width: 48 },
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr" },
                { name: "id", title: "id", width: 200 },
            ] : [
                { name: "index", title: "№", width: 48 },
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr" },
            ],
    },

});

const useStyles = createUseStyles({
    Main: {
        backgroundColor: ({ redBackground }) => redBackground && "#CC3333",
        display: 'flex',
        flexDirection: 'column',
        height: "100%",
    },
    header: {
        '& .button': {
            marginRight: 12,
        },
        display: 'flex',
        paddingLeft: 48,
        paddingRight: 48,
        paddingTop: 31,
        paddingBottom: 70,
    },
    headerInfo: {
        display: 'flex',
        flexGrow: 1,
        flexBasis: 0,
        justifyContent: 'space-between',
    },
    headerCenter: {
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
        flexBasis: 0,
    },
    headerRight: ({ mode }) => ({
        ...mode === 'auto' && { visibility: 'hidden' },
        display: 'flex',
        flexGrow: 1,
        flexBasis: 0,
    }),
    qrInput: {
        fontSize: 18,
        width: 177,
        marginLeft: 'auto',
    },
    tableContainer: {
        '& > div': {
            marginLeft: 12,
            flexBasis: 0,
            flexGrow: 1,
            height: 600,
        },
        flexGrow: 1,
        display: 'flex',
        paddingRight: 22,
        paddingLeft: 36,
    },
    tableTitle: {
        marginLeft: 12,
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
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
    modalButtonIcon: {
        marginRight: 13,
    },
    notificationQrCodeImgContainer: {
        display: 'grid',
        columnGap: 9,
        gridAutoFlow: 'column',
        alignItems: 'center',
    }
});

function Main() {
    const [mode, setMode] = useState('auto');
    const [redBackground, setRedBackground] = useState(false);
    const [batchSettings, setBatchSettings] = useState({});
    const [extended, setExtended] = useState(false);
    const [page, setPage] = useState('');

    const [modalDeletion, setModalDeletion] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalCube, setModalCube] = useState(false);
    const [modalDisassemble, setModalDisassemble] = useState(false);
    const [modalDelete2Pallet, setModalDelete2Pallet]  = useState(false);
    const [modalPackingTableError, setModalPackingTableError] = useState(false);
    const [modalAgree, setModalAgree] = useState(false);
    const [modalChangePack, setModalChangePack] = useState(false);
    const [modalChangePackAgree, setModalChangePackAgree] = useState(false);
    const [modalWithdrawal, setModalWithdrawal] = useState(false);

    const [valueQrModalPackingTable, setValueQrModalPackingTable] = useState("");
    const [valueQrToDisassemble, setValueQrToDisassemble] = useState("");
    const [valueQrCube, setValueQrCube] = useState('');
    const [valueQrToChangePack, setValueQrToChangePack] = useState('');
    const [valueQrToChangeNewPack, setValueQrToChangeNewPack] = useState('');

    const [packingTableRecords, setPackingTableRecords] = useState("");
    const [notificationText, setNotificationText] = useState("");
    const [returnNotificationText, setReturnNotificationText] = useState("");
    const [notificationErrorText, setNotificationErrorText] = useState("");
    const [notificationPintsetErrorText, setNotificationPintsetErrorText] = useState("");
    const [notificationColumnErrorText, setNotificationColumnErrorText] = useState("");
    const classes = useStyles({ mode, redBackground });
    const tableProps = useMemo(() => getTableProps(extended), [extended]);

    const [forceFocus, setForceFocus] = useState("inputQr");

    const inputQrRef = useRef();
    const inputQrCubeRef = useRef();
    const inputPackingTableRef = useRef();
    const inputDisassembleRef = useRef();
    const inputChangePackOldRef = useRef();
    const inputChangePackNewRef = useRef();

    const dictRefs = {
        inputQr: inputQrRef,
        inputQrCube: inputQrCubeRef,
        inputPackingTable: inputPackingTableRef,
        inputDisassemble: inputDisassembleRef,
        inputChangePackOld: inputChangePackOldRef,
        inputChangePackNew: inputChangePackNewRef,
    }

    useEffect(() => {
        axios.get(address + "/api/v1_0/current_batch")
            .then(res => {
                setBatchSettings({
                    batchNumber: res.data.number.batch_number,
                    batchDate: res.data.number.batch_date.split("T")[0].split("-").reverse(), 
                    multipacks: res.data.params.multipacks,
                    packs: res.data.params.packs,
                    multipacksAfterPintset: res.data.params.multipacks_after_pintset,
                })
            })
            
        }, [setBatchSettings])

    useEffect(() => {
        axios.get(address + "/api/v1_0/settings")
            .then(res => {
                if (res.data.location_settings) {
                    document.title = "" + res.data.location_settings.place_name.value
                }
            })
    }, [])

    useEffect(() => {
        axios.get(address + "/api/v1_0/get_mode")
            .then(res => {
                setMode(res.data.work_mode);
                if (res.data.work_mode === "auto") setReturnNotificationText("")
                else {
                    setReturnNotificationText("Сосканируйте QR куба для редактирования");
                    setNotificationText("Сосканируйте QR куба для редактирования");
                }
            })
            .catch(e => setNotificationErrorText(e.response.data.detail))
    }, [setMode]);

    useEffect(() => {
        const request2 = () => {
            axios.get(address + "/api/v1_0/packing_table_records")
                .then(res => {
                    setPackingTableRecords(res.data);
                    if (res.data.multipacks_amount === batchSettings.multipacks && mode === "auto") {
                        setNotificationText("Надо отсканировать QR Куба")
                    } 
            });
        }
        
        request2();
        const interval1 = setInterval(() => request2(), 1000);
        return () => clearInterval(interval1);
    }, [batchSettings]);

    useEffect(() => {
        const request = () => {
            let request = axios.get(address + "/api/v1_0/get_state");
            request.then(res => {
                let temp = res.data;
                if (temp.state === "normal") setNotificationColumnErrorText("") 
                    else {setNotificationColumnErrorText(temp.error_msg); setRedBackground(true)}
                if (temp.pintset_state === "normal") setNotificationPintsetErrorText("") 
                    else {setNotificationPintsetErrorText(temp.pintset_error_msg); setRedBackground(true)}
                if (temp.packing_table_state === "normal") setModalPackingTableError("") 
                    else {setForceFocus("inputPackingTable"); setModalPackingTableError(temp.packing_table_error_msg); setRedBackground(true)}
                if (temp.pintset_withdrawal_state === "normal") setModalWithdrawal("") 
                    else {setModalWithdrawal(temp.pintset_withdrawal_error_msg); setRedBackground(true)}

                if (temp.state === "normal" && temp.pintset_state === "normal" && temp.packing_table_state === "normal" && temp.pintset_withdrawal_state === "normal") setRedBackground(false);    
            })
            request.catch(e => setNotificationErrorText(e.response.data.detail))
        };
        request();
        const interval = setInterval(() => request(), 1000);
        return () => {clearInterval(interval)};
    }, []);

    useEffect (() => {
        let interval;
        let isExist = Object.keys(dictRefs).indexOf(forceFocus) !== -1;

        console.log(forceFocus)

        if (forceFocus && isExist) {
            interval = setInterval(() => {
                if (document.activeElement.id !== forceFocus && dictRefs[forceFocus].current) {
                    dictRefs[forceFocus].current.focus();
                }
            }, 300)
        } else if (!isExist) {
            interval = setInterval(() => {
                if (document.activeElement.id !== forceFocus) {
                    dictRefs["inputQr"].current.focus();
                }
            }, 300);
        }       

        return () => {clearInterval(interval)};
    }, [forceFocus])

    if (page === "batch_params") {
        return (
            <Redirect to="/batch_params" />
        );
    } else if (page === "create") {
        return (
            <Redirect to="/create" />
        );
    }

    const returnNotification = () => {
        setNotificationText(returnNotificationText);
    }

    const updateMode = () => {
        let newMode = mode === "auto" ? "manual" : "auto"
        axios.patch(address + "/api/v1_0/set_mode", { work_mode: newMode })
            .then(res => {
                setMode(res.data.work_mode);
                if (res.data.work_mode === "auto") {
                    setReturnNotificationText("");
                    setNotificationText("");
                } else {
                    setReturnNotificationText("Сосканируйте QR куба для редактирования");
                    setNotificationText("Сосканируйте QR куба для редактирования");
                }
            })
            .catch(e => {
                // TOD0: handle error
                console.log(e);
            })
    }

    const flushStateColumn = () => {
        axios.patch(address + "/api/v1_0/flush_state")
            .then(() => {setNotificationColumnErrorText(""); setRedBackground(false)})
            .catch(e => setNotificationErrorText(e.response.detail[0].msg))
    }

    const flushPintsetError = () => {
        axios.patch(address + "/api/v1_0/flush_pintset")
            .then(res => {
                if (res.status === 200) {
                    setReturnNotificationText(notificationText);
                    setNotificationText("Ошибка с пинцета успешно сброшена");
                    setNotificationPintsetErrorText("");
                    setRedBackground(false);
                    setTimeout(() => returnNotification(), 2000);
                }
            })
            .catch(res => setNotificationErrorText(res.response.detail[0].msg))
    }

    const createIncompleteCube = () => {
        axios.put(address + "/api/v1_0/cube_finish_manual/?qr=" + inputQrCubeRef.current.value.replace("/", "%2F"))
            .then(() => {
                setReturnNotificationText(notificationText);
                setNotificationText("Неполный куб успешно сформирован");
                setTimeout(() => {
                    returnNotification();
                }, 2000);
            })
            .catch(e => {
                setNotificationErrorText(e.response.data.detail)
            })
    }

    return (
        <div className={classes.Main}>
            {modalWithdrawal && 
                <ModalWindow
                    title="Подтверждение выемки из-под пинцета"
                    description={modalWithdrawal}
                >
                    <Button onClick={() => {
                        axios.patch(address + "/api/v1_0/flush_pintset_withdrawal")
                            .then(() => setModalWithdrawal(false))
                        axios.delete(address + "/api/v1_0/remove_packs_from_pintset")
                            .catch(e => {
                                setNotificationErrorText(e.response.data.detail);
                            })
                    }}>
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Вынимаю все
                    </Button>

                    <Button onClick={() => {
                        axios.patch(address + "/api/v1_0/flush_pintset_withdrawal")
                            .then(() => setModalWithdrawal(false))
                    }}>
                        Ничего не вынимаю
                    </Button>
                </ModalWindow>
            }

            {modalChangePackAgree && 
                <ModalWindow
                    title="Подтвердите действие"
                    description="Вы действительно хотите заменить пачку?"
                >
                    <Button onClick={modalChangePackAgree[0]}>
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Заменить
                    </Button>

                    <Button onClick={() => {setModalChangePackAgree(false); setForceFocus("inputQr")}}>
                        Отмена
                    </Button>
                </ModalWindow>
            }

            {modalChangePack && 
                <ModalWindow
                    title="Замена пачки"
                    description="Введите QR заменяемой и новой пачек"
                >
                    <Button onClick={() => {setModalChangePack(false); setForceFocus("inputQr")}}>
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Отмена
                    </Button>

                    <Input 
                        id="inputChangePackOld"
                        ref={inputChangePackOldRef}
                        onKeyPress={async e => {
                            if (e.charCode === 13) {
                                let req = axios.get(address + "/api/v1_0/not_shipped_pack/?qr=" + inputChangePackOldRef.current.value);
                                req.catch(e => {
                                    setNotificationErrorText(e.response.data.detail);
                                    inputChangePackOldRef.current.value = "";
                                    setTimeout(() => {
                                        setNotificationErrorText("");
                                    }, 2000);
                                })                                
                                let awaited = await req;
                                
                                if (awaited.data.id) {
                                    setForceFocus("inputChangePackNew");
                                }
                            }
                        }
                    }
                    />

                    <Input 
                        id="inputChangePackNew"
                        ref={inputChangePackNewRef}
                        onKeyPress={async e => {
                            if (e.charCode === 13) {
                                setModalChangePack(false);
                                let old = inputChangePackOldRef.current.value;
                                let new_ = inputChangePackNewRef.current.value;
                                let req = await axios.get(address + "/api/v1_0/packs/?qr=" + old);

                                setModalChangePackAgree([() => {
                                    setForceFocus("inputQr");
                                    axios.patch(address + "/api/v1_0/packs/" + req.data.id, {"qr": new_})
                                        .then(() => setModalChangePackAgree(false))
                                        .catch(e => setNotificationErrorText(e.response.data.detail))
                                }])
                                
                        }
                    }}
                    />

                    {/* <TextField
                        placeholder="QR для замены"
                        onChange={async e => {
                            setValueQrToChangePack(e.target.value);
                        }}
                        onKeyPress={async e => {
                                if (e.charCode === 13) {
                                    let req = axios.get(address + "/api/v1_0/not_shipped_pack/?qr=" + valueQrToChangePack);
                                    let awaited = await req;
                                    
                                    if (awaited.data.id) {
                                        console.log("123")
                                    }
                                }
                            }
                        }
                        value={valueQrToChangePack}
                        outlined
                        forceFocus
                        autoFocus
                    />

                    <TextField
                        placeholder="QR новой"
                        onChange={async e => {
                            setValueQrToChangeNewPack(e.target.value);
                        }}
                        onKeyPress={async e => {
                                if (e.charCode === 13) {
                                    axios.patch(address + "/api/v1_0/packs/" +  valueQrToChangePack, {"qr": valueQrToChangeNewPack})
                                        
                                    }
                            }
                        }
                        value={valueQrToChangePack}
                        outlined
                        forceFocus
                        autoFocus
                    /> */}
                </ModalWindow>
            }

            {modalAgree && 
                <ModalWindow
                    title="Подтвердите действие"
                    description="Вы действительно хотите удалить объект?"
                >
                    <Button onClick={() => {axios.delete((address + "/api/v1_0/cubes/" + modalAgree)).then(() => setModalAgree(false))}}>
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Удалить
                    </Button>

                    <Button onClick={() => {setModalAgree(false)}}>
                        Отмена
                    </Button>
                </ModalWindow>
            }

            {modalDisassemble && 
                <ModalWindow
                    title="Разобрать куб?"
                    description="Введите QR куба для разбора"
                >
                    <Button onClick={() => {setModalDisassemble(false); setForceFocus("inputQr")}}>
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Отмена
                    </Button>

                    <Input  
                        id="inputDisassemble"
                        ref={inputDisassembleRef}
                        onKeyPress={async e => {
                            if (e.charCode === 13) {
                                let req = axios.get(address + "/api/v1_0/cubes/?qr=" + inputDisassembleRef.current.value);
                                req.catch(e => {
                                    setNotificationErrorText(e.response.data.detail);
                                    inputDisassembleRef.current.value = "";
                                    setTimeout(() => {
                                        setNotificationErrorText("");
                                    }, 2000);
                                })
                                let awaited = await req;

                                if (awaited.data.id) {
                                    setModalDisassemble(false);
                                    setModalAgree(awaited.data.id);
                                }
                            }
                        }}
                    />

                    {/* <TextField
                        placeholder="QR..."
                        onChange={async e => {
                            setValueQrToDisassemble(e.target.value);
                        }}
                        onKeyPress={async e => {
                                if (e.charCode === 13) {
                                    let req = axios.get(address + "/api/v1_0/cubes/?qr=" + valueQrToDisassemble);
                                    let awaited = await req;
                                    
                                    console.log(awaited);

                                    if (awaited.data.id) {
                                        setModalDisassemble(false);
                                        setModalAgree(awaited.data.id);
                                    }
                                }
                            }
                        }
                        value={valueQrToDisassemble}
                        outlined
                        forceFocus
                        autoFocus

                        
                    /> */}
                </ModalWindow>
            }

            {modalDelete2Pallet && 
                <ModalWindow
                    title="Удаление двух паллет"
                    description="Вы действительно хотите удалить две паллеты?"
                >
                    <Button onClick={() => {
                        axios.delete(address + "/api/v1_0/remove_two_multipacks_to_refresh_wrapper")
                        .then(() => setReturnNotificationText(notificationText), setNotificationText("Паллеты успешно удалены"), setTimeout(returnNotification, 2000), setModalDelete2Pallet(false))
                            .catch(e => console.log(e.responce))
                    }}>
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Удалить
                    </Button>
                    <Button onClick={() => setModalDelete2Pallet(false)} theme="secondary">
                        <img className={classes.modalButtonIcon} src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                        Отмена
                    </Button>
                </ModalWindow>
            }

            {modalPackingTableError  && 
                <ModalWindow
                    title="Ошибочный вывоз"
                    description={modalPackingTableError}
                >
                    <Button onClick={() => {
                        axios.patch(address + "/api/v1_0/flush_packing_table_with_remove")
                            .then(() => setModalPackingTableError(false), setValueQrModalPackingTable(""))
                            .catch(e => {
                                console.log(e.response);
                                setNotificationErrorText(e.response.data.detail)
                            })
                    }}>
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Удалить продукцию
                    </Button>
                    <Button onClick={() => {
                        axios.patch(address + "/api/v1_0/flush_packing_table")
                            .then(() => setModalPackingTableError(false), setRedBackground(false), setValueQrModalPackingTable(""))
                            .catch(e => setNotificationErrorText(e.responce.data.detail))
                    }}>
                        Отмена
                    </Button>
                    <Input
                        id="inputPackingTable"
                        ref={inputPackingTableRef}
                        placeholder="QR..."
                        onKeyPress={e => {
                            if (e.charCode === 13) {
                                axios.patch(address + "/api/v1_0/flush_packing_table_with_identify?qr=" + inputPackingTableRef.current.value)
                                    .then(() => {
                                        setModalPackingTableError(false);
                                        setRedBackground(false);
                                        if (inputPackingTableRef.current) inputPackingTableRef.current.value = "";
                                        setReturnNotificationText(notificationText);
                                        setNotificationText("Успешно идентифицировано");
                                        setTimeout(returnNotification, 2000);
                                    })
                                    .catch(e => setNotificationErrorText(e.response.data.detail))
                            }
                        }}
                    />

                    {/* <TextField
                        placeholder="QR..."
                        onChange={async e => {
                            setValueQrModalPackingTable(e.target.value);
                        }}
                        onKeyPress={e => {
                                if (e.charCode === 13) {
                                    axios.patch(address + "/api/v1_0/flush_packing_table_with_identify?qr=" + valueQrModalPackingTable)
                                        .then(() => {
                                            setModalPackingTableError(false);
                                            setRedBackground(false);
                                            setValueQrModalPackingTable("");
                                            setReturnNotificationText(notificationText);
                                            setNotificationText("Успешно идентифицировано");
                                            setTimeout(returnNotification, 2000);
                                        })
                                        .catch(e => setNotificationErrorText(e.response.data.detail[0].msg))
                                }
                            }
                        }
                        hidden={false}
                        value={valueQrModalPackingTable}
                        outlined
                        forceFocus
                        autoFocus

                        
                    /> */}
                </ModalWindow>
            }

            {modalDeletion && (
                <ModalWindow
                    title="Удаление объекта"
                    description="Вы действительно хотите удалить данный объект?"
                >
                    <Button onClick={() => {
                        setModalDeletion(false);
                        modalDeletion[0](modalDeletion[1])
                    }}>
                        <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                        Удалить
                    </Button>
                    <Button onClick={() => setModalDeletion(false)} theme="secondary">
                        <img className={classes.modalButtonIcon} src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                        Отмена
                    </Button>
                </ModalWindow>
            )}
            {modalError && (
                <ModalWindow
                    title="Ошибка"
                    description="Вы используете QR вне куба. Пожалуйста перейдите в куб для редактирования."
                >
                    <Button onClick={() => setModalError(false)}>Сбросить ошибку</Button>
                </ModalWindow>
            )}
            {modalCube && (
                <ModalWindow
                    title="Формирование неполного куба"
                    description="Из всех паллет и пачек в очереди будет сформирован куб. Подтверждаете?"
                >
                    <div style={{ display: "grid", gap: "2rem" }}>
                        <div>
                            <Input
                                id={"inputQrCube"}
                                ref={inputQrCubeRef}
                            />
                            {/* <TextField
                                placeholder="QR..."
                                onChange={async e => {
                                    setinputQrCubeRef.current.value(e.target.value);
                                }}
                                value={inputQrCubeRef.current.value}
                                outlined
                                forceFocus
                                autoFocus
                            /> */}
                        </div>
                        <div style={{ display: "flex", gap: "2rem" }}>
                            <Button onClick={() => {
                                if (inputQrCubeRef.current.value) {
                                    setForceFocus("inputQr");
                                    setModalCube(false);
                                    createIncompleteCube();
                                    inputQrCubeRef.current.value = "";
                                }
                            }}>
                                <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                                Создать
                            </Button>
                            <Button onClick={() => {
                                setForceFocus("inputQr");
                                setModalCube(false);
                                inputQrCubeRef.current.value = "";
                            }} theme="secondary">
                                <img className={classes.modalButtonIcon} src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                                Отмена
                            </Button>
                        </div>
                    </div>
                </ModalWindow>
            )}

            <div className={classes.header}>
                <div className={classes.headerInfo}>
                    <HeaderInfo title="Партия №:" amount={batchSettings.batchNumber} />
                    <HeaderInfo title="Дата" amount={batchSettings.batchDate ? batchSettings.batchDate.join(".") : null} />
                    <HeaderInfo title="Куб:" amount={batchSettings.multipacks} suffix="паллеты" />
                    <HeaderInfo title="Паллета:" amount={batchSettings.packs} suffix="пачки" />
                    <HeaderInfo title="Пинцет:" amount={batchSettings.multipacksAfterPintset} suffix="паллеты" />
                </div>

                <div className={classes.headerCenter}>
                    <Button onClick={() => { setPage("batch_params") }} >Новая партия</Button>

                    <Button onClick={() => {
                        setModalDisassemble(true);
                        setForceFocus("inputDisassemble");
                    }}>Разобрать куб по его QR</Button>

                    <Button onClick={() => { setModalCube([createIncompleteCube]); setForceFocus("inputQrCube") }} >Сформировать неполный куб</Button>
                
                    <Button onClick={() => {
                        setModalDelete2Pallet(true);
                        
                    }}>Удалить 2 паллеты для перезагрузки обмотчика</Button>

                    <Button onClick={() => { setModalChangePack(true); setForceFocus("inputChangePackOld") }} >Заменить пачку на упаковке</Button>
                </div>

                {/* <div className={classes.headerRight}> </div> */}
                <Button onClick={() => setPage("create")}>Новый куб</Button>
                <InputTextQr
                    id="inputQr"
                    setNotification={setNotificationText}
                    setNotificationError={setNotificationErrorText}
                    mode={mode}
                    forceFocus={!modalCube && !modalPackingTableError}
                    hidden={!extended}
                    ref={inputQrRef}
                />

            </div>

            <div className={classes.tableContainer}>
                <div>
                    <Text className={classes.tableTitle} type="title2">Очередь кубов</Text>
                    <TableAddress
                        columns={tableProps.cube.columns}
                        setError={() => setModalError(true)}
                        setModal={setModalDeletion}
                        type="cubes"
                        extended={extended}
                        address="/api/v1_0/cubes_queue"
                        buttonEdit="/edit"
                        buttonDelete="/trash"
                    />
                </div>

                <div>
                    <Text className={classes.tableTitle} type="title2">Очередь паллет</Text>
                    <TableAddress
                        columns={tableProps.multipack.columns}
                        setError={() => setModalError(true)}
                        setModal={setModalDeletion}
                        type="multipacks"
                        address="/api/v1_0/multipacks_queue"
                        buttonEdit="/edit"
                        buttonDelete="/trash"
                    />
                </div>

                <div>
                    <Text className={classes.tableTitle} type="title2">Очередь пачек</Text>
                    <TableAddress
                        columns={tableProps.pack.columns}
                        setError={() => setModalError(true)}
                        setModal={setModalDeletion}
                        type="packs"
                        address="/api/v1_0/packs_queue"
                        buttonDelete="/trash"
                    />
                </div>
            </div>

            <NotificationPanel
                notifications={
                    notificationText && (
                        <Notification
                            description={notificationText}
                        />
                    )
                }
            />

            {/* 
            <ColumnError /> */}

            <div className={classes.footer}>
                <div style={{ display: "flex" }}>
                    <div>
                        <div className={classes.switchTitle}>
                            Режим управления:
                        </div>
                        <div className={classes.switchContainer}>
                            Автоматический
                        <Switch mode={mode} onClick={updateMode} />
                            Ручной
                        </div>
                    </div>

                    <div style={{display: "flex", gap: "321px"}}> 
                        <NotificationPanel
                            errors={
                                [
                                    notificationPintsetErrorText && (
                                        <Notification
                                            title="Ошибка после пинцета"
                                            description={notificationPintsetErrorText}
                                            error
                                        > <Button onClick={() => flushPintsetError()}>Сбросить ошибку</Button>
                                        </Notification>
                                    ),
                                ]
                            }
                        />

                        <NotificationPanel
                            errors={
                                [
                                    notificationErrorText && (
                                        <Notification
                                            title="Ошибка"
                                            description={notificationErrorText}
                                            onClose={() => setNotificationErrorText("")}
                                            error
                                        />
                                    ),

                                    notificationColumnErrorText && (
                                        <Notification
                                            title="Ошибка колонны"
                                            description={notificationColumnErrorText}
                                            error
                                        > <Button onClick={() => flushStateColumn()}>Сбросить ошибку</Button>  </Notification>
                                    )
                                ]
                            }
                        />
                    </div>

                    

                </div>



                <div>
                    <div className={classes.switchTitle} style={{ textAlign: 'right' }}>
                        Вид интерфейса:
                    </div>
                    <div className={classes.switchContainer}>
                        Сжатый
                    <Switch onClick={() => setExtended(!extended)} />
                        Расширенный
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Main;