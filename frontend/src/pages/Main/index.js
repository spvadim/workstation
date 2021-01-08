import React, { useMemo, useState, useEffect } from "react";
import axios from 'axios';

import TableAddress from "../../components/Table/TableAddress.js";
import InputTextQr from "../../components/InputText/InputTextQr.js";
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
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
    const [batchSettings, setBatchSettings] = useState({});
    const [extended, setExtended] = useState(false);
    const [page, setPage] = useState('');
    const [modalDeletion, setModalDeletion] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalCube, setModalCube] = useState(false);
    const [modalDeletePallet, setModalDeletePallet]  = useState(false);
    const [valueQrCube, setValueQrCube] = useState('');
    const [notificationText, setNotificationText] = useState("");
    const [notificationErrorText, setNotificationErrorText] = useState("");
    const [notificationPintsetErrorText, setNotificationPintsetErrorText] = useState("");
    const [notificationColumnErrorText, setNotificationColumnErrorText] = useState("");
    const [notificationPackingTableErrorText, setNotificationPackingTableErrorText] = useState("");
    const [cookies] = useCookies();
    const classes = useStyles({ mode });
    const tableProps = useMemo(() => getTableProps(extended), [extended]);

    useEffect(() => {
        axios.get(address + "/api/v1_0/current_batch")
            .then(res => {
                setBatchSettings({
                    batchNumber: res.data.number,
                    multipacks: res.data.params.multipacks,
                    packs: res.data.params.packs,
                    multipacksAfterPintset: res.data.params.multipacks_after_pintset,
                })
            })
            .catch(e => setNotificationErrorText(e.response.detail))

        axios.get(address + "/api/v1_0/get_mode")
            .then(res => {
                setMode(res.data.work_mode);
                setNotificationText(res.data.work_mode === "auto" ?
                    // "Сосканируйте QR мультипака/пачки для идентификации куба" :
                    "Сосканируйте QR паллеты/пачки для идентификации куба" :
                    "Сосканируйте QR куба для редактирования")
            })
            .catch(e => setNotificationErrorText(e.response.data.detail))

        const request = () => {
            let request = axios.get(address + "/api/v1_0/get_state");
            request.then(res => {
                let temp = res.data;
                if (temp.state !== "normal") setNotificationColumnErrorText(temp.error_msg)
                else if (temp.pintset_state !== "normal") setNotificationPintsetErrorText(temp.pintset_error_msg)
                else if (temp.packing_table_state !== "normal") setNotificationPackingTableErrorText(temp.packing_table_error_msg)
            })
            request.catch(e => setNotificationErrorText(e.response.data.detail))
        };
        request();
        const interval = setInterval(request, 1000);
        return () => clearInterval(interval);
    }, [notificationColumnErrorText]);

    if (page === "batch_params") {
        return (
            <Redirect to="/batch_params" />
        );
    } else if (page === "create") {
        return (
            <Redirect to="/create" />
        );
    }

    const updateMode = () => {
        let newMode = mode === "auto" ? "manual" : "auto"
        axios.patch(address + "/api/v1_0/set_mode", { work_mode: newMode })
            .then(res => {
                setMode(res.data.work_mode);
                setNotificationText(res.data.work_mode === "auto" ?
                    "Сосканируйте QR паллеты/пачки для идентификации куба" :
                    "Сосканируйте QR куба для редактирования")
            })
            .catch(e => {
                // TOD0: handle error
                console.log(e);
            })
    }

    const setDefaultNotificationText = () => {
        if (mode === "auto") setNotificationText("Сосканируйте QR паллеты/пачки для идентификации куба")
        else if (mode === "manual") setNotificationText("Сосканируйте QR куба для редактирования")
    }

    const flushStateColumn = () => {
        axios.patch(address + "/api/v1_0/flush_state")
            .catch(e => setNotificationErrorText(e.response.detail[0].msg))
    }

    const flushPintsetError = () => {
        axios.patch(address + "/api/v1_0/flush_pintset")
            .then(res => {
                if (res.status === 200) {
                    setNotificationText("Ошибка с пинцета успешно сброшена");
                    setNotificationPintsetErrorText("");
                    setTimeout(() => setDefaultNotificationText(), 2000);
                }
            })
            .catch(res => setNotificationErrorText(res.response.detail[0].msg))
    }

    const createIncompleteCube = () => {
        axios.put(address + "/api/v1_0/cube_finish_manual/?qr=" + valueQrCube.replace("/", "%2F"))
            .then(() => {
                setNotificationText("Неполный куб успешно сформирован");
                setTimeout(() => {
                    setNotificationText("");
                }, 2000);
            })
            .catch(e => {
                setNotificationErrorText(e.response.data.detail)
            })
    }

    return (
        <div className={classes.Main}>
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
                    description="Вы действительно хотите создать неполный куб?"
                >
                    <div style={{ display: "grid", gap: "2rem" }}>
                        <div>
                            <TextField
                                placeholder="QR..."
                                onChange={async e => {
                                    setValueQrCube(e.target.value);
                                }}
                                value={valueQrCube}
                                outlined
                                forceFocus
                                autoFocus
                            />
                        </div>
                        <div style={{ display: "flex", gap: "2rem" }}>
                            <Button onClick={() => {
                                if (valueQrCube) {
                                    setModalCube(false);
                                    createIncompleteCube();
                                    setValueQrCube("")
                                }
                            }}>
                                <img className={classes.modalButtonIcon} src={imgOk} style={{ width: 25 }} />
                                Создать
                            </Button>
                            <Button onClick={() => {
                                setModalCube(false);
                                setValueQrCube("");
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
                    <HeaderInfo title="Куб:" amount={batchSettings.multipacks} suffix="паллеты" />
                    <HeaderInfo title="Паллета:" amount={batchSettings.packs} suffix="пачки" />
                    <HeaderInfo title="Пинцет:" amount={batchSettings.multipacksAfterPintset} suffix="паллеты" />
                </div>

                <div className={classes.headerCenter}>
                    <Button onClick={() => { setPage("batch_params") }} >Новая партия</Button>

                    <Button onClick={() => { setModalCube([createIncompleteCube]) }} >Сформировать неполный куб</Button>
                
                    <Button onClick={() => console.log()}>Удалить 2 паллеты для перезагрузки обмотчика</Button>
                </div>

                {/* <div className={classes.headerRight}> </div> */}
                <Button onClick={() => setPage("create")}>Новый куб</Button>
                <InputTextQr
                    setNotification={setNotificationText}
                    setNotificationError={setNotificationErrorText}
                    mode={mode}
                    forceFocus={!modalCube}
                    extended={extended}
                    className={classes.qrInput}
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
                        // buttonEdit="/edit"
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
                            title="Уведомление"
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
                                        title="Ошибка"
                                        description={notificationColumnErrorText}
                                        error
                                    > <Button onClick={() => flushStateColumn()}>Сбросить ошибку</Button>  </Notification>
                                )
                            ]
                        }
                    />

                    <NotificationPanel
                        errors={
                            [
                                notificationPintsetErrorText && (
                                    <Notification
                                        title="Ошибка"
                                        description={notificationPintsetErrorText}
                                        error
                                    > <Button onClick={() => flushPintsetError()}>Сбросить ошибку</Button>
                                    </Notification>
                                ),
                            ]
                        }
                    />

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