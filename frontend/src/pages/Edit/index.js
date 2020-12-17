import React, { useEffect, useState, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import axios from "axios";
import { Redirect } from "react-router-dom";

import TableData from "../../components/Table/TableData.js";
import address from "../../address.js";
import { Text, Switch, Button, Link } from 'src/components';
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
            height: 662,
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

const QrLink = ({ children }) => <Link href={children}>{children}</Link>;

const TextEditor = ({ children, style }) => {
    const classes = useStyles();
    return <input className={classes.textEditor} style={style} defaultValue={children} />
};

const LinkEditor = ({ children }) => {
    return <TextEditor style={{ color: color.linkBlue }}>{children}</TextEditor>
}

const getTableProps = (type) => ({
    description: {
        type: type,
        columns: [
            { name: "created_at", title: "Создано", width: 123, Component: TextEditor },
            { name: "qr", title: "qr", Component: LinkEditor },
            { name: "id", title: "id", width: 240, Component: TextEditor },
        ],
    },

    addTable: {
        name: "addTable",
        type: type,
        columns: [
            { name: "created_at", title: "Создано", width: 123 },
            { name: "barcode", title: "barcode", width: 130 },
            { name: "qr", title: "qr", width: 48, Component: () => <>...</> },
            { name: "id", title: "id" },
        ],
        buttonDelete: "/delete",
    },

    removeTable: {
        name: "removeTable",
        type: type,
        columns: [
            { name: "created_at", title: "Создано", width: 123 },
            { name: "barcode", title: "barcode", width: 130 },
            { name: "qr", title: "qr", width: 48, Component: () => <>...</> },
            { name: "id", title: "id" },
        ],
        buttonDelete: "/return",
    },

    containTable: {
        type: type,
        columns: [
            { name: "created_at", title: "Создано", width: 123 },
            { name: "qr", title: "qr", Component: QrLink },
            { name: "id", title: "id", width: 200 },
        ],
        buttonDelete: "/remove",
    },
});

function Edit({ description, type }) {
    const classes = useStyles();
    const tableProps = getTableProps(type);
    const [tableSwitch, setTableSwitch] = useState(false);

    let [containTableData, setContainTableData] = useState("/loader");

    useEffect(() => {
        axios.get(address + "/api/v1_0/" + type + "/" + description.id)
            .then(async res => {
                if (type === "multipacks") {
                    setContainTableData(await getPacks(res.data.pack_ids));
                } else if (type === "cubes") {
                    setContainTableData(await getMultipacks(Object.keys(res.data.multipack_ids_with_pack_ids)));
                }
            })
    }, [])

    const getMultipacks = async (ids) => {
        let multipacks = [];
        for (let i = 0; i < ids.length; i++) {
            let request = await axios.get(address + "/api/v1_0/multipacks/" + ids[i]);
            let data = request.data;
            multipacks.push({
                qr: data.qr,
                barcode: data.barcode,
                created_at: data.created_at,
                id: data.id,
            })
        }

        return multipacks;
    }

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

    let [addTableData, setAddTableData] = useState([]);
    let [removeTableData, setRemoveTableData] = useState([]);

    let [page, setPage] = useState('');

    const deleteRow = (row) => {
        let temp = addTableData.filter((obj) => obj.id !== row.id);
        setAddTableData(temp);
    }

    const returnRow = (row) => {
        let foo = containTableData.slice();
        foo.push(row);

        let bar = removeTableData.filter((obj) => obj.id !== row.id)

        setContainTableData(foo);
        setRemoveTableData(bar);
    }

    const removeRow = (row) => {
        let foo = removeTableData.slice();
        foo.push(row);

        let bar = containTableData.filter((obj) => obj.id !== row.id);

        setRemoveTableData(foo);
        setContainTableData(bar);

    }

    const submitChanges = () => {
        if (containTableData.length === 0) {
            axios.delete(address + "/api/v1_0/" + type + "/" + description.id)
                .then(setPage("/main"))

        } else if (containTableData !== "/loader") {
            let packs = containTableData.map((obj) => obj.id);
            let temp = { pack_ids: packs };
            axios.patch(address + "/api/v1_0/" + type + "/" + description.id, temp)
                .then(setPage("/main"))

        } else {
            setPage("/main")
        }
    }

    const closeChanges = () => {
        console.log("Отменить изменения")
        setPage("/main");
    }

    if (page === "/main") return <Redirect to="/main" />

    return (
        <div className={classes.Edit}>
            <Text type="title" className={classes.header}>Редактор</Text>

            <div className={classes.tableContainer}>
                <Switch onClick={() => setTableSwitch(!tableSwitch)} className={classes.switchTable} />
                <div>
                    <Text className={classes.tableTitle} type="title2">{type}</Text>
                    <TableData
                        className={classes.tableDescription}
                        rows={[description]}
                        hideTracksWhenNotNeeded
                        {...tableProps.description}
                    />

                    <div className={classes.buttonContainer}>
                        <Button onClick={submitChanges} className={classes.buttonSubmit}>
                            <img src={imgOk} /><span>Принять изменения</span>
                        </Button>
                        <Button onClick={closeChanges} theme="secondary">
                            <img src={imgCross} style={{ filter: 'invert(1)' }} /><span>Отменить изменения</span>
                        </Button>
                    </div>

                    <Text className={[classes.tableTitle, classes.titleContent].join(' ')} type="title2">Содержимое</Text>
                    <TableData
                        rows={typeof containTableData === 'string' ? [] : containTableData}
                        className={classes.tableContent}
                        onDelete={row => removeRow(row)}
                        hideTracksWhenNotNeeded
                        {...tableProps.containTable}
                    />
                </div>

                <div style={{ opacity: tableSwitch ? 0.4 : 1 }}>
                    <Text className={classes.tableTitle} type="title2">Добавляемое</Text>
                    <TableData
                        rows={addTableData}
                        onDelete={row => deleteRow(row)}
                        {...tableProps.addTable}
                    />
                </div>

                <div style={{ opacity: tableSwitch ? 1 : 0.4 }}>
                    <Text className={classes.tableTitle} type="title2">Удаляемое</Text>
                    <TableData
                        rows={removeTableData}
                        onDelete={row => returnRow(row)}
                        {...tableProps.removeTable}
                    />
                </div>
            </div>

            <div className={classes.footer}>
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
            </div>
        </div>
    );
}

export default Edit;