import React, { useEffect, useMemo, useState, useCallback, useContext } from "react";
import axios from 'axios';

import SwitchMode from "../../components/SwitchMode/index.js";
import TableAddress from "../../components/Table/TableAddress.js";
import InputTextQr from "../../components/InputText/InputTextQr.js";
import ModalWindow from "../../components/ModalWindow/index.js";
import ColumnError from "../../components/ColumnError/index.js";
import Notification from "../../components/Notification/index.js";
import { Button, Text, Link, NotificationPanel } from "src/components";

import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

import address from "../../address.js";
import { createUseStyles } from "react-jss";
import { HeaderInfo } from './HeaderInfo';

axios.patch(address + "/api/v1_0/set_mode", { work_mode: "auto" });

const QrLink = ({ children }) => <Link href={children}>{children}</Link>;

const getTableProps = (auto) => ({
    cube: {
        buttonEdit: "/edit",
        buttonDelete: "/trash",
        columns: auto ?
            [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", Component: QrLink },
                { name: "id", title: "id", width: 200 },
            ] : [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", Component: QrLink },
            ],
        address: address + "/api/v1_0/cubes_queue",
        type: "cubes",
    },

    multipack: {
        buttonEdit: "/edit",
        buttonDelete: "/trash",
        columns: auto ?
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
        address: address + "/api/v1_0/multipacks_queue",
        type: "multipacks",
    },

    pack: {
        buttonDelete: "/trash",
        columns: auto ?
            [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", Component: QrLink },
                { name: "id", title: "id", width: 200 },
            ] : [
                { name: "created_at", title: "Создано", width: 123 },
                { name: "qr", title: "qr", Component: QrLink },
            ],
        address: address + "/api/v1_0/packs_queue",
        type: "packs",
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
});

function Main(props) {
    const [mode, setMode] = useState('auto');
    const [page, setPage] = useState('');
    const [modalDeletion, setModalDeletion] = useState(false);
    const [modalError, setModalError] = useState(true);
    const [notificationText, setNotificationText] = useState("");
    const [cookies] = useCookies();
    const classes = useStyles({ mode });
    const tableProps = useMemo(() => getTableProps(mode === 'auto'), [mode]);

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
                    <Button onClick={() => setModalDeletion(false)}>Удалить</Button>
                    <Button onClick={() => setModalDeletion(false)} theme="secondary">Отмена</Button>
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
                    <InputTextQr label="QR: " autoFocus={true} setNotification={setNotificationText} className={classes.qrInput} />
                </div>
            </div>

            <div className={classes.tableContainer}>
                <div>
                    <Text className={classes.tableTitle} type="tableTitle">Очередь кубов</Text>
                    <TableAddress {...tableProps.cube} setError={(error) => setModalError(true)} setModal={setModalDeletion} />
                </div>

                <div>
                    <Text className={classes.tableTitle} type="tableTitle">Очередь мультипаков</Text>
                    <TableAddress {...tableProps.multipack} setError={(error) => setModalError(true)} setModal={setModalDeletion} />
                </div>

                <div>
                    <Text className={classes.tableTitle} type="tableTitle">Очередь пачек</Text>
                    <TableAddress {...tableProps.pack} setError={(error) => setModalError(true)} setModal={setModalDeletion} />
                </div>
            </div>
            <NotificationPanel />
            {/* 
            <ColumnError /> */}

            <div className={classes.footer}>
                <div>
                    <div className={classes.switchTitle}>
                        Режим управления:
                    </div>
                    <div className={classes.switchContainer}>
                        Автоматический
                    <SwitchMode onClick={updateMode} />
                        Ручной
                    </div>
                </div>

                <div>
                    <div className={classes.switchTitle} style={{ textAlign: 'right' }}>
                        Вид интерфейса:
                    </div>
                    <div className={classes.switchContainer}>
                        Сжатый
                    <SwitchMode onClick={updateMode} />
                        Расширенный
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Main;