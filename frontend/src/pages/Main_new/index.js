import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import { createUseStyles } from 'react-jss';
import Block from "../../components/Block/index.js";
import address from "../../address.js";
import TableAddress from "../../components/Table/TableAddress.js";
import BigView from "../../components/BigView/index.js";
import Pallet from "../../components/Pallet/index.js";
import {PalletOnPackingTable, PalletOnFork, PalletOnWinder, PacksOnAssemble, PacksOnPintset} from "../../components/Pallet/packing_table.js";
import {useHistory} from 'react-router-dom';
import ModalWindow from '../../components/ModalWindow';
import imgOk from 'src/assets/images/ok.svg';
import imgCross from 'src/assets/images/cross.svg';
import Input from '../../components/InputText/Input';
import { Button, Text, Link, NotificationPanel, Switch, TextField } from "src/components";
import {Notification} from '../../components/Notification';
import InputTextQr from '../../components/InputText/InputTextQr';
import {Notification_new} from '../../components/Notification_new';

const useStyles = createUseStyles({
	container: {
        maxWidth: 1900,
        // margin: "0 auto",
        padding: "0 36px",
        height: "100%",
    },

    btn: {
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontSize: 18,
        fontWeight: 500,
        backgroundColor: "#f7ee55",
        borderRadius: 10,
        border: "1px solid #000",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        "&:hover": {
            backgroundColor: "#f7ce55",
        },
    },

    btn_border: {
        background: "none",
        "&:hover": {background: "none"}
    },

    "& input.btn": {
        color: "#000",
        cursor: "auto",
    },

    checkboxGroup: {
        flex: "none",
        "& input": {
            display: 'none',
        },
        "& input:checked+label:after": {
            left: 28,
            background: "#f7ee55",
        },
        "& label": {
            display: 'block',
            width: 61,
            height: 34,
            borderRadius: 100,
            border: "3px solid #000",
            position: 'relative',
            cursor: 'pointer',
        },
        "& label:after": {
            content: "",
            display: 'block',
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "1px solid #000",
            background: "#000",
            position: "absolute",
            left: 3,
            top: "50%",
            transform: "translateY(-50%)",
            transition: "all 0.3s ease",
        },
    },

    notificationPanel: {
        position: 'fixed',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        maxHeight: "40%",
        overflowY: 'scroll',
        padding: 5,
        zIndex: 99,
        bottom: 90,
        left: 27,
        maxWidth: 260,
        backgroundColor: "#d4d4d4",
        borderRadius: 7,
    },

    header: {
        position: 'relative',
    },

    header__container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",
    },

    header__info: {
        display: 'flex',
        alignItems: "start",
        flexWrap: 'wrap',
        flex: 3,
    },

    header__infoItem: {
        marginRight: 35,
        marginTop: 10,
        listStyle: 'none',
        "&:last-child": {
            marginRight: 0,
        },
    },

    header__infoItemName: {
        fontWeight: 400,
    },

    header__infoItemDesc: {
        fontSize: 18,
        "& strong": {
            fontSize: 24,
        },
    },

    header__buttonList: {
        display: 'flex',
        alignItems: "center",
        flex: 5,
        marginTop: -12,
        marginLeft: 12,
    },

    header__button: {
        marginRight: 12,
        marginTop: 12,
        minHeight: 115,
        flex: 1,
        "&:last-child": {
            marginRight: 0,
        },
        boxSizing: 'border-box',
    },

    header__qr: {
        width: 177,
        textAlign: "left",
        color: "#aaaaaa",
        justifyContent: "flex-start",
        marginLeft: 12,
    },

    box: {
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
    },

    main: {
        height: "100%",
        flex: 1,
        display: "flex",
        alignItems: "stretch",
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 20,
    },

    buildCol: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
    },

    buildRow: {
        display: "flex",
        alignItems: "center",
        position: "relative",
        "& > :nth-of-type(2)": {
            position: 'absolute',
            left: "50%",
            bottom: 6,
        }
    },

    variantsBox: {
        display: 'flex',
        flexDirection: "column",
        flex: "1",
        position: 'relative',
        justifyContent: 'space-evenly',
    },

    variants: {
        marginTop: 'auto',
    },

    variants__list: {
        // display: "grid",
        // gridTemplateColumns: "repeat(5, 1fr)",
        // gap: "30px 30px",
        // listStyle: "none",
        display: 'flex',
        flex: 2,
        position: 'relative',
        listStyle: "none",
        justifyContent: 'space-around',
        width: "100%",
    },

    variants__list_no: {
        display: "none",
    },

    variants__item: {
        height: "fit-content",
        minWidth: "10%",
        "& input": {
            display: 'none',
        },
        "& input:checked+.variants__item-label": {
            background: "#f7ee55",
        },
    },

    variants__itemLabel: {
        height: "100%",
        position: 'relative',
        width: "100%",
        minHeight: 151,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#fff",
        cursor: "pointer",
        padding: "20px 0",
        borderRadius: 20,
        border: "1px solid #000",
        transition: "background 0.3s ease",
        "&:hover": {
            background: "#f7ce55",
        },
        '&.active': {
            background: "#f7ce55",
        }
    },

    variants__itemTitle: {
        textAlign: "center",
        fontWeight: 700,
        fontSize: 18,
        padding: "0 5px",
    },

    variants__itemContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        height: "100%",
        width: "100%",
        padding: "0 10px",
        // marginTop: 15,
        "& svg": {
            maxWidth: "100%",
        },
    },

    tableContainer: {
        '& > div': {
            flexBasis: 0,
            flexGrow: 1,
            height: 600,
        },
        maxWidth: "30%",
        flexGrow: 1,
        display: 'flex',
        paddingRight: 22,
    },

    tableTitle: {
        marginLeft: 12,
    },

    more: {
        fontWeight: 600,
        width: 28,
        "&:before": {
            content: '"+"',
        }
    },

    columnsContainer: {
        display: 'flex',
        position: 'relative',
        gap: "10%",
        justifyContent: 'space-around',
        paddingLeft: "2em",
        paddingRight: "4em",
    },

    content: {
        display: 'flex',
        flex: 5,
        justifyContent: 'space-around',
        // maxWidth: "90%",
        alignItems: 'center',
    },

    footer: {
        position: 'absolute',
        width: '100%',
        boxSizing: 'border-box',
        bottom: 0,
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
});

const bigViewModes = {
    pintset: 'pintset',
    pallet: 'pallet',
    onWinder: 'onWinder',
    onFork: 'onFork',
    onPackingTable: 'onPackingTable',
};

const tableProps = (extended) => ({
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
})

function Main() {
	const classes = useStyles();

    const history = useHistory();

    const [mode, setMode] = useState('auto');
    const [extended, setExtended] = useState(false);
    const [settings, setSettings] = useState(false);
    const [page, setPage] = useState('');

    const [modalAgree, setModalAgree] = useState(false);
    const [modalDisassemble, setModalDisassemble] = useState(false);
    const [modalCube, setModalCube] = useState(false);
    const [modalPackingTableError, setModalPackingTableError] = useState(false);
    const [modalDelete2Pallet, setModalDelete2Pallet]  = useState(false);
    const [modalChangePack, setModalChangePack] = useState(false);
    const [modalChangePackAgree, setModalChangePackAgree] = useState(false);
    const [modalDelPalletAgree, setModalDelPalletAgree] = useState(false);
    const [modalDelPackAgree, setModalDelPackAgree] = useState(false);
    const [modalEditPack, setModalEditPack] = useState(false);

    const [forceFocus, setForceFocus] = useState("inputQr");
    const [notificationText, setNotificationText] = useState("");
    const [notificationText2, setNotificationText2] = useState("");
    const [notificationErrorText, setNotificationErrorText] = useState("");
    const [returnNotificationText, setReturnNotificationText] = useState("");
    const [events, setEvents] = useState([]);

    const [packs, setPacks] = useState({
        underPintset: [],
        onAssemble_before: [],
        onAssemble_after: [],
    });

    const [pallets, setPallets] = useState({
        onFork: [],
        onWinder: [],
        onPackingTable: [],
        others: [],
    });

    const [dataBigView, setDataBigView] = useState({});
    const [dataTypeBigView, setDataTypeBigView] = useState("packs");

    const [bigViewMode, setBigViewMode] = useState("");

    const inputQrRef = useRef();
    const inputQrCubeRef = useRef();
    const inputDisassembleRef = useRef();
    const inputChangePackOldRef = useRef();
    const inputChangePackNewRef = useRef();
    const inputEditPackNewRef = useRef();

    const dictRefs = {
        inputQr: inputQrRef,
        inputQrCube: inputQrCubeRef,
        inputDisassemble: inputDisassembleRef,
        inputChangePackOld: inputChangePackOldRef,
        inputChangePackNew: inputChangePackNewRef,
        inputEditPackNewRef: inputEditPackNewRef,
    }

    const sortPacks = array => {
        let packs = {
            underPintset: [],
            onAssemble_before: [],
            onAssemble_after: [],
        }

        let countOnAssemble = 0;
        let maxCountOnAssemble = 12;
        array.forEach(item => {
            switch (item.status) {
                case "под пинцетом":
                    packs.underPintset.push(item);
                    break;
                case "на сборке":
                    countOnAssemble += 1;
                    if (countOnAssemble > maxCountOnAssemble) packs.onAssemble_after.push(item)
                    else packs.onAssemble_before.push(item);

                    break;

                default:
                    break;
            }
        })

        return packs
    };

    const sortPallets = async array => {
        let pallets = {
            onFork: [],
            onWinder: [],
            onPackingTable: [],
            others: [],
        };

        async function getPallet(id) {
            let response = await axios.get(address + "/api/v1_0/multipacks/" + id);
            return response.data;
        }

        const res = await Promise.all(array.map(async ({id}) => {
            return await getPallet(id)
        }));

        res.forEach((item) => {
            switch (item.status) {
                case "зашел на вилы":
                    pallets.onFork.push(item);
                    break;
                case "в обмотчике":
                    pallets.onWinder.push(item);
                    break;
                case "на упаковочном столе":
                    pallets.onPackingTable.push(item);
                    break;

                default:
                    pallets.others.push(item);
                    break;
            }
        })

        return pallets;
    }

    useEffect(() => {
        const request = () => {
            let request = axios.get(address + "/api/v1_0/events?processed=false&event_type=error")
            request.then(res => {
                setEvents(res.data.events);
            })
        }


        request();
        let timer = setInterval(() => {
            request();
        }, 1000);
        return () => clearInterval(timer);
    }, [])

    useEffect(() => {
        async function getPacks() {
            let response = await axios.get(address + "/api/v1_0/packs_queue")
            setPacks(sortPacks(response.data));
        }

        getPacks();

        const interval = setInterval(getPacks, 1000);
        return () => clearInterval(interval);
    }, [setPacks]);

    useEffect(() => {
        async function getPallets() {
            let response = await axios.get(address + "/api/v1_0/multipacks_queue")
            setPallets(await sortPallets(response.data));
        }

        getPallets();

        const interval = setInterval(getPallets, 1000);
        return () => clearInterval(interval);
    }, [setPallets]);

    useEffect(() => {
        async function getSettings() {
            let response = await axios.get(address + "/api/v1_0/current_batch");
            setSettings(response.data)
        }

        getSettings();
    }, []);

    function changeBigViewMode(mode) {
        let temp = [];
        if (mode === "pintset") {
            temp = {
                underPintset: [],
                onAssemble_after: [],
            };

            temp.underPintset = packs.underPintset.slice(2);
            temp.onAssemble_after = packs.onAssemble_after;
        } else if (mode === "pallet") {
            temp = {
                onAssemble_before: [],
            };

            temp.onAssemble_before = packs.onAssemble_before
        } else if (mode === "onWinder") {
            temp = {
                others: [],
            };

            temp.others = pallets.others;
        } else if (mode === "onFork") {
            temp = {
                onFork: [],
            };

            temp = pallets.onFork;
        }

        setDataBigView(temp);
        setBigViewMode(mode);
    }

    function buildPacks(columns, perColumn, onlyGray, size, packs) {
        let allColumns = [];
        let separatedColumns = [];
        let swap = false;
        let columnItems = [];

        columns.map(column => {
            for (let i = 1; i <= packs[column].length; i++) {
                columnItems.push((
                    <Block key={packs[column][i-1].id + "123"} id={packs[column][i-1].id} style={{marginBottom: "-9%", zIndex: packs[column].length - i}} onlyGray={onlyGray} size={size} />
                ))

                if (i % perColumn === 0) {
                    separatedColumns.push((<div style={swap ? {} : null} className={classes.buildCol}>{columnItems}</div>));
                    if (separatedColumns.length === 2) {
                        allColumns.push((<div style={swap ? {zIndex: i} : null} className={classes.buildRow}>{separatedColumns}</div>));
                        separatedColumns = [];
                    }

                    columnItems = [];
                    swap = !swap;
                }
            }

            return null
        })

        if (columnItems.length !== 0) {
            separatedColumns.push((<div style={swap ? {} : null} className={classes.buildCol}>{columnItems}</div>));
            allColumns.push((<div style={swap ? {zIndex: 30} : null} className={classes.buildRow}>{separatedColumns}</div>));
        }


        // console.log(allColumns)
        return allColumns
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

    const updateMode = () => {
        let newMode = mode === "auto" ? "manual" : "auto"
        axios.patch(address + "/api/v1_0/set_mode", { work_mode: newMode })
            .then(res => {
                setMode(res.data.work_mode);
                if (res.data.work_mode === "auto") {
                    // setReturnNotificationText("");
                    setNotificationText2("");
                } else {
                    // setReturnNotificationText("Сосканируйте QR куба для редактирования");
                    setNotificationText2("Сосканируйте QR куба для редактирования");
                }
            })
            .catch(e => {
                // TOD0: handle error
                console.log(e);
            })
    }

    useEffect (() => {
        let interval;
        let isExist = Object.keys(dictRefs).indexOf(forceFocus) !== -1;

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
        history.push('/batch_params')
    } else if (page === "create") {
        history.push('/create')
    } else if (page === "events") {
        history.push('/events')
    }

    const returnNotification = () => {
        setNotificationText(returnNotificationText);
    }

    const closeProcessEvent = id => {
        axios.patch(address + "/api/v1_0/events/" + id)
    }

    const delPallet = useCallback((id) => {
        setModalDelPalletAgree(id)
    }, [setModalDelPalletAgree])

    const delPack = useCallback((id) => {
        setModalDelPackAgree(id)
    }, [setModalDelPackAgree])

    const editPack = useCallback((id) => {
        setModalEditPack(id)
        setForceFocus("inputEditPackNewRef")
    }, [setModalEditPack])

    const editPallet = useCallback((row) => {
        history.push('/edit', { description: row, type: 'multipacks', extended})
    }, [extended, history])

    return (
		<div className={classes.box}>
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
                description="Информация про куб и пачки в нем будет удалена из системы. Куб нужно будет распаковать, необходимые пачки нужно будет подкинуть перед камерой-счетчиком. Подтверждаете?"
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

            {modalDelete2Pallet &&
            <ModalWindow
                title="Удаление паллет"
                description="Вы действительно хотите удалить паллет(ы)?"
            >
                <Button onClick={() => {
                    axios.delete(address + "/api/v1_0/remove_multipacks_to_refresh_wrapper")
                        .then(() => {
                            setReturnNotificationText(notificationText)
                            setNotificationText("Паллеты успешно удалены")
                            setTimeout(returnNotification, 2000)
                            setModalDelete2Pallet(false)
                        })
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
                description="На постах упаковки одну пачку можно заменить на другую. Для этого введите сначала QR старой пачки, потом QR новой пачки. Далее подтвердите свое действие"
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
            </ModalWindow>
            }

            {modalDelPalletAgree &&
            <ModalWindow
                title="Подтвердите действие"
                description="Вы действительно хотите удалить палету?"
            >
                <Button onClick={() => {
                    axios.delete(address + "/api/v1_0/multipacks/" + modalDelPalletAgree)
                        .then(res => console.log(res))
                        .catch(e => {console.log(e)});
                    setModalDelPalletAgree(false);
                }}>
                    <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                    Удалить
                </Button>

                <Button onClick={() => {setModalDelPalletAgree(false)}}>
                    Отмена
                </Button>
            </ModalWindow>
            }

            {modalDelPackAgree &&
            <ModalWindow
                title="Удаление объекта"
                description="Информация про данную упаковку и составляющие будет удалена из системы. Пачку(и) нужно будет подкинуть перед камерой-счетчиком. Подтверждаете?"
            >
                <Button onClick={() => {
                    axios.delete(address + "/api/v1_0/packs/" + modalDelPackAgree)
                        .then(res => console.log(res))
                        .catch(e => {console.log(e)});
                    setModalDelPackAgree(false);
                }}>
                    <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                    Удалить
                </Button>

                <Button onClick={() => {setModalDelPackAgree(false)}}>
                    Отмена
                </Button>
            </ModalWindow>
            }

            {modalEditPack &&
            <ModalWindow
                title="Замена пачки"
                description="На постах упаковки одну пачку можно заменить на другую. Для этого введите QR новой пачки. Далее подтвердите свое действие"
            >
                <Button onClick={() => {setModalEditPack(false); setForceFocus("inputQr")}}>
                    <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                    Отмена
                </Button>

                <Input
                    id="inputEditPackNew"
                    ref={inputEditPackNewRef}
                    onKeyPress={async e => {
                        if (e.charCode === 13) {
                            setModalEditPack(false);
                            let new_ = inputEditPackNewRef.current.value;

                            setModalChangePackAgree([() => {
                                setForceFocus("inputQr");
                                axios.patch(address + "/api/v1_0/packs/" + modalEditPack, {"qr": new_})
                                    .then(() => setModalChangePackAgree(false))
                                    .catch(e => setNotificationErrorText(e.response.data.detail))
                            }])
                        }
                    }}
                />
            </ModalWindow>
            }



			<header className={classes.header}>
                <div className={classes.notificationPanel}>
                    { events.map(event => {
                        return <Notification_new text={event.message}
                                                 onClose={() => closeProcessEvent(event.id)}
                        />
                    })
                    }
                    {events.length > 1 ? <Button onClick={() => events.map(event => closeProcessEvent(event.id))}>Сбросить все ошибки</Button> : null}
                    <Button onClick={() => setPage("events")} >Перейти на страницу с ошибками</Button>
                </div>

                <div className={[classes.container, classes.header__container].join(' ')}>
                    <ul className={classes.header__info}>
                        <li className={classes.header__infoItem}>
                            <h3 className={classes.header__infoItemName}>Партия №:</h3>
                            <p className={classes.header__infoItemDesc}><strong>{settings && settings.number.batch_number}</strong></p>
                        </li>
                        <li className={classes.header__infoItem}>
                            <h3 className={classes.header__infoItemName}>Куб:</h3>
                            <p className={classes.header__infoItemDesc}>
                                <strong>{settings && settings.params.multipacks}</strong>&#32;мультипака
                            </p>
                        </li>
                            <li className={classes.header__infoItem}>
                            <h3 className={classes.header__infoItemName}>Мультипак:</h3>
                            <p className={classes.header__infoItemDesc}><strong>{settings && settings.params.packs}</strong>&#32;пачeк</p>
                        </li>
                        <li className={classes.header__infoItem}>
                            <h3 className={classes.header__infoItemName}>Пинцет:</h3>
                            <p className={classes.header__infoItemDesc}>
                                <strong>{settings && settings.params.multipacks_after_pintset}</strong>&#32;мультипак
                            </p>
                        </li>
                    </ul>
                    <div className={classes.header__buttonList}>
                        <button
                            className={[classes.btn, classes.header__button].join(' ')}
                            onClick={() => { setPage("batch_params") }}
                        >Новая партия</button>

                        <button
                            className={[classes.btn, classes.header__button].join(' ')}
                            onClick={() => {
                                setModalDisassemble(true);
                                setForceFocus("inputDisassemble");
                            }}
                        >Разобрать куб по его QR</button>

                        <button
                            className={[classes.btn, classes.header__button].join(' ')}
                            onClick={() => { setModalCube([createIncompleteCube]); setForceFocus("inputQrCube") }}
                        >Сформировать неполный куб</button>

                        <button
                            className={[classes.btn, classes.header__button].join(' ')}
                            onClick={() => {
                                setModalDelete2Pallet(true);
                            }}
                        >Удалить паллет(ы) для перезагрузки обмотчика</button>

                        <button
                            className={[classes.btn, classes.header__button].join(' ')}
                            onClick={() => { setModalChangePack(true); setForceFocus("inputChangePackOld") }}
                        >Заменить пачку на упаковке</button>

                        <button
                            className={[classes.btn, classes.header__button].join(' ')}
                            onClick={() => setPage("create")}
                        >Новый куб</button>
                    </div>

                    <InputTextQr
                        id="inputQr"
                        placeholder="QR..."
                        className={[classes.btn, classes.btn_border, classes.header__qr].join(' ')}
                        setNotification={setNotificationText}
                        setNotificationError={setNotificationErrorText}
                        mode={mode}
                        forceFocus={!modalCube && !modalPackingTableError}
                        hidden={!extended}
                        ref={inputQrRef}
                    />
                </div>
            </header>

            <main className={[classes.container, classes.main].join(" ")}>
                <div className={classes.tableContainer}>
                    <div>
                        <span className={classes.tableTitle}>Очередь кубов</span>
                        <TableAddress
                            columns={tableProps(extended).columns}
                            setModal={() => {return}}
                            type="cubes"
                            extended={extended}
                            address="/api/v1_0/cubes_queue"
                            buttonEdit="/edit"
                            buttonDelete="/trash"
                        />
                    </div>
                </div>

                <div className={classes.variantsBox}>

                    <div className={classes.content}>
                        {bigViewMode === bigViewModes.onPackingTable && <PalletOnPackingTable
                            pallets={pallets.onPackingTable}
                            onDel={delPallet}
                            onEdit={editPallet}
                            bigView
                        />}
                        {bigViewMode === bigViewModes.onFork && <PalletOnFork
                            pallets={pallets.onFork}
                            onDel={delPallet}
                            onEdit={editPallet}
                            bigView
                        />}
                        {bigViewMode === bigViewModes.onWinder && <PalletOnWinder
                            pallets={pallets.others}
                            onDel={delPack}
                            onEdit={editPack}
                            bigView
                        />}
                        {bigViewMode === bigViewModes.pallet && <PacksOnAssemble
                            packs={packs.onAssemble_before}
                            onDel={delPack}
                            onEdit={editPack}
                            bigView
                        />}
                        {bigViewMode === bigViewModes.pintset && <div className={classes.buildCol}>
                            <div className={classes.buildRow}>
                                <PacksOnPintset
                                    packs={packs.onAssemble_after.slice(0, 2)}
                                    onDel={delPack}
                                    onEdit={editPack}
                                    bigView
                                />
                            </div>
                            <div className={classes.buildRow}>
                                <PacksOnPintset
                                    packs={packs.underPintset.slice(0, 2)}
                                    onDel={delPack}
                                    onEdit={editPack}
                                    bigView
                                />
                            </div>
                        </div>}
                    </div>

                    {/* <BigView data={dataBigView} dataType={dataTypeBigView} perColumn={bigViewMode === "pintset" ? Infinity : 3}/> */}

                    <ul className={classes.variants__list}>
                        <li className={classes.variants__item}
                            onClick={() => {changeBigViewMode(bigViewModes.pintset)}}>
                            <input type="radio" name="variants" id="variants-1" />
                            <label htmlFor="variants-1" className={[classes.variants__itemLabel, bigViewMode === bigViewModes.pintset && 'active'].join(' ')}>
                                <h3 className={classes.variants__itemTitle}>Пинцет</h3>
                                <div className={classes.buildCol}>
                                    <div className={classes.buildRow}>
                                        <div className={classes.variants__itemContainer}>
                                            <span className={classes.more} style={packs.onAssemble_after.length > 2 ? {display: "block"} : {display: "none"}}>{packs.onAssemble_after.length - 2}</span>
                                            <PacksOnPintset packs={packs.onAssemble_after.slice(0, 2)} />
                                            {/* {packs.onAssemble_after.slice(0, 2).map(() => <Block onlyGray size={[70, 25]} />)} */}
                                        </div>
                                    </div>
                                    <div className={classes.buildRow}>
                                        <div className={classes.variants__itemContainer}>
                                            <span className={classes.more} style={packs.underPintset.length > 2 ? {display: "block"} : {display: "none"}}>{packs.underPintset.length - 2}</span>
                                            <PacksOnPintset packs={packs.underPintset.slice(0, 2)} />
                                            {/* {packs.underPintset.slice(0, 2).map(() => <Block onlyGray size={[70, 25]} />)} */}
                                        </div>
                                    </div>
                                </div>

                            </label>
                        </li>
                        <li className={classes.variants__item}
                            onClick={() => {changeBigViewMode(bigViewModes.pallet)}}>
                            <input type="radio" name="variants" id="variants-2" />
                            <label htmlFor="variants-2" className={[classes.variants__itemLabel, bigViewMode === bigViewModes.pallet && 'active'].join(' ')}>
                                <h3 className={classes.variants__itemTitle}>Паллеты</h3>
                                <div className={classes.columnsContainer}>
                                    {/* {buildPacks(["onAssemble_before"], 3, true, [70, 25], packs)} */}
                                    <PacksOnAssemble packs={packs.onAssemble_before} />
                                </div>

                            </label>
                        </li>
                        <li className={classes.variants__item}
                            onClick={() => {changeBigViewMode(bigViewModes.onWinder)}}>
                            <input type="radio" name="variants" id="variants-3" />
                            <label htmlFor="variants-3" className={[classes.variants__itemLabel, bigViewMode === bigViewModes.onWinder && 'active'].join(' ')}>
                                <h3 className={classes.variants__itemTitle}>Обмотчик</h3>
                                <div className={classes.columnsContainer}>
                                    <PalletOnWinder pallets={pallets.others} />
                                    {/* {buildPacks(["others"], 3, true, [70, 25], pallets)} */}
                                </div>
                            </label>
                        </li>
                        <li className={classes.variants__item}
                            onClick={() => {changeBigViewMode(bigViewModes.onFork)}}>
                            <input type="radio" name="variants" id="variants-4" />
                            <label htmlFor="variants-4" className={[classes.variants__itemLabel, bigViewMode === bigViewModes.onFork && 'active'].join(' ')}>
                                <h3 className={classes.variants__itemTitle}>Вилы</h3>
                                <div className={classes.columnsContainer}>
                                    <div className={classes.buildCol}>
                                        <div className={classes.buildRow}>
                                            <span className={classes.more} style={pallets.onFork.length > 2 ? {display: "block"} : {display: "none"}}>{pallets.onFork.length - 2}</span>
                                            <PalletOnFork pallets={pallets.onFork} />
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </li>
                        <li className={classes.variants__item} onClick={() => {changeBigViewMode(bigViewModes.onPackingTable)}}>
                            <input type="radio" name="variants" id="variants-5" />
                            <label htmlFor="variants-5" className={[classes.variants__itemLabel, bigViewMode === bigViewModes.onPackingTable && 'active'].join(' ')}>
                                <h3 className={classes.variants__itemTitle}>Упаковочный стол</h3>
                                <div className={classes.variants__itemContainer}>
                                    <div className={classes.buildCol}>
                                        <div className={classes.buildRow}>
                                            <span className={classes.more} style={pallets.onPackingTable.length > 8 ? {display: "block"} : {display: "none"}}>{pallets.onPackingTable.length - 8}</span>
                                            <PalletOnPackingTable pallets={pallets.onPackingTable} />
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </li>
                    </ul>
                </div>
            </main>

            <NotificationPanel
                style={{marginLeft: 276}}
                notifications={
                    [notificationText && (
                        <Notification
                            description={notificationText}
                        />
                    ),
                        notificationText2 && (
                            <Notification
                                description={notificationText2}
                            />
                        )]
                }
                errors={
                    notificationErrorText && (
                        <Notification
                            error
                            description={notificationErrorText}
                        />
                    )
                }
            />

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
