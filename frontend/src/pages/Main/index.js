import React, { useEffect, useMemo, useState, useCallback, useContext } from "react";
import axios from 'axios';

import TableAddress from "../../components/Table/TableAddress.js";
import InputTextQr from "../../components/InputText/InputTextQr.js";
import ModalWindow from "../../components/ModalWindow/index.js";
import ColumnError from "../../components/ColumnError/index.js";
import { Notification, NotificationImage } from "../../components/Notification/index.js";
import { Button, Text, Link, NotificationPanel, Switch } from "src/components";
import imgCross from 'src/assets/images/cross.svg';
import imgOk from 'src/assets/images/ok.svg';
import imgScanner from 'src/assets/images/scanner.svg';
import imgScannerActive from 'src/assets/images/scanner-active.svg';
import imgQR from 'src/assets/images/qr.svg';

import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

import address from "../../address.js";
import { createUseStyles } from "react-jss";
import { HeaderInfo } from './HeaderInfo';

axios.patch(address + "/api/v1_0/set_mode", { work_mode: "auto" });

const QrLink = ({ children }) => <Link href={children}>{children}</Link>;

const getTableProps = (extended) => ({
    cube: {
        columns: extended ?
            [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", Component: QrLink },
                { name: "id", title: "id", width: 200 },
            ] : [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", Component: QrLink },
            ],
    },

    multipack: {
        columns: extended ?
            [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", width: 48, Component: () => <>...</> },
                { name: "status", title: "Статус" },
                { name: "id", title: "id", width: 200 },
            ] : [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", Component: QrLink },
                { name: "status", title: "Статус" },
            ],
    },

    pack: {
        columns: extended ?
            [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", Component: QrLink },
                { name: "id", title: "id", width: 200 },
            ] : [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", Component: QrLink },
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
            height: 662,
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

function Main(props) {
    const [mode, setMode] = useState('auto');
    const [extended, setExtended] = useState(false);
    const [page, setPage] = useState('');
    const [modalDeletion, setModalDeletion] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [notificationText, setNotificationText] = useState("");
    const [notificationErrorText, setNotificationErrorText] = useState("");
    const [cookies] = useCookies();
    const classes = useStyles({ mode });
    const tableProps = useMemo(() => getTableProps(extended), [extended]);

    if (page === "/") {
        return (
            <Redirect to="/" />
        );
    }

    const updateMode = () => {
        let newMode = mode === "auto" ? "manual" : "auto"
        axios.patch(address + "/api/v1_0/set_mode", { work_mode: newMode })
            .then(res => {
                setMode(newMode);
            })
            .catch(e => {
                // TODO: handle error
                console.log(e);
            })
    }


    return (
        <div className={classes.Main}>
            {modalDeletion && (
                <ModalWindow
                    title="Удаление объекта"
                    description="Вы действительно хотите удалить данный объект?"
                >
                    <Button onClick={() => setModalDeletion(false)}>
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

            <div className={classes.header}>
                <div className={classes.headerInfo}>
                    <HeaderInfo title="Партия №:" amount={cookies.batchNumber} />
                    <HeaderInfo title="Куб:" amount={cookies.multipacks} suffix="мультипака" />
                    <HeaderInfo title="Мультипак:" amount={cookies.packs} suffix="пачки" />
                    <HeaderInfo title="Пинцет:" amount={cookies.todo} suffix="мультипак" />
                </div>

                <div className={classes.headerCenter}>
                    <Button onClick={() => { setPage("/") }} >Новая партия</Button>

                    <Button onClick={() => { console.log("Сформировать неполный куб") }} >Сформировать неполный куб</Button>
                </div>

                <div className={classes.headerRight}>
                    <Button>Новый куб</Button>
                    <Button>Новый мультипак</Button>
                    <InputTextQr
                        setNotification={setNotificationText}
                        setNotificationError={setNotificationErrorText}
                        className={classes.qrInput}
                    />
                </div>
            </div>

            <div className={classes.tableContainer}>
                <div>
                    <Text className={classes.tableTitle} type="title2">Очередь кубов</Text>
                    <TableAddress
                        columns={tableProps.cube.columns}
                        setError={(error) => setModalError(true)}
                        setModal={setModalDeletion}
                        type="cubes"
                        address="/api/v1_0/cubes_queue"
                        buttonEdit="/edit"
                        buttonDelete="/trash"
                    />
                </div>

                <div>
                    <Text className={classes.tableTitle} type="title2">Очередь мультипаков</Text>
                    <TableAddress
                        columns={tableProps.multipack.columns}
                        setError={(error) => setModalError(true)}
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
                        setError={(error) => setModalError(true)}
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
                errors={
                    notificationErrorText && (
                        <Notification
                            title="Ошибка"
                            description={notificationErrorText}
                            error
                        />
                    )
                }
            />
            {/* 
            <ColumnError /> */}

            <div className={classes.footer}>
                <div>
                    <div className={classes.switchTitle}>
                        Режим управления:
                    </div>
                    <div className={classes.switchContainer}>
                        Автоматический
                    <Switch onClick={updateMode} />
                        Ручной
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