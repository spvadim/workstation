import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { createUseStyles } from 'react-jss';
import Block from "../../components/Block/index.js";
import address from "../../address.js";
import TableAddress from "../../components/Table/TableAddress.js";
import BigView from "../../components/BigView/index.js";
import Pallet from "../../components/Pallet/index.js";

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
        marginTop: -12,
        marginLeft: 12,
    },

    header__button: {
        marginRight: 12,
        marginTop: 12,
        flex: 1,
        "&:last-child": {
            marginRight: 0,
        },
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
});

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

    const [extented, setExtended] = useState(false);
    const [settings, setSettings] = useState(false);

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

    const sortPallets = array => {
        let pallets = {
            onFork: [],
            onWinder: [],
            onPackingTable: [],
            others: [],
        };

        array.forEach(async (it) => {
            async function getPallet() {
                let response = axios.get(address + "/api/v1_0/multipacks/" + it.id);
                return response;
            }

            let item = await getPallet();
            item = item.data

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
        async function getPacks() {
            let response = await axios.get(address + "/api/v1_0/packs_queue")
            setPacks(sortPacks(response.data));
        }

        getPacks();
    }, []);

    useEffect(() => {
        async function getPallets() {
            let response = await axios.get(address + "/api/v1_0/multipacks_queue")
            setPallets(sortPallets(response.data));
        }

        getPallets();
    }, []);

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

    

    return (
		<div className={classes.box}>
			<header className={classes.header}>
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
                        <button className={[classes.btn, classes.header__button].join(' ')}>Новая партия</button>
                        <button className={[classes.btn, classes.header__button].join(' ')}>Сформировать неполный куб</button>
                    </div>
                    <input className={[classes.btn, classes.btn_border, classes.header__qr].join(' ')} placeholder="QR..." />
                </div>
            </header>

            <main className={[classes.container, classes.main].join(" ")}>
                <div className={classes.tableContainer}>
                    <div>
                        <span className={classes.tableTitle}>Очередь кубов</span>
                        <TableAddress
                            columns={tableProps(extented).columns}
                            setModal={() => {return}}
                            type="cubes"
                            extended={extented}
                            address="/api/v1_0/cubes_queue"
                            buttonEdit="/edit"
                            buttonDelete="/trash"
                        />
                    </div>
                </div>
                    
                <div className={classes.variantsBox}>
                    <BigView data={dataBigView} dataType={dataTypeBigView} perColumn={bigViewMode === "pintset" ? Infinity : 3}/>
                    <ul className={classes.variants__list}>
                        <li className={classes.variants__item}
                            onClick={() => {changeBigViewMode("pintset"); setDataTypeBigView("packs")}}>
                            <input type="radio" name="variants" id="variants-1" />
                            <label htmlFor="variants-1" className={classes.variants__itemLabel}>
                                <h3 className={classes.variants__itemTitle}>Пинцет</h3>
                                <div className={classes.buildCol}>
                                    <div className={classes.buildRow}>
                                        <div className={classes.variants__itemContainer}>
                                            <span className={classes.more} style={packs.onAssemble_after.length > 2 ? {display: "block"} : {display: "none"}}>{packs.onAssemble_after.length - 2}</span>
                                            {packs.onAssemble_after.slice(0, 2).map(() => <Block onlyGray size={[70, 25]} />)}
                                        </div>
                                    </div>
                                    <div className={classes.buildRow}>
                                        <div className={classes.variants__itemContainer}>
                                            <span className={classes.more} style={packs.underPintset.length > 2 ? {display: "block"} : {display: "none"}}>{packs.underPintset.length - 2}</span> 
                                            {packs.underPintset.slice(0, 2).map(() => <Block onlyGray size={[70, 25]} />)}
                                        </div>
                                    </div>
                                </div>
                                
                            </label>
                        </li>
                        <li className={classes.variants__item}
                            onClick={() => {changeBigViewMode("pallet"); setDataTypeBigView("packs")}}>
                            <input type="radio" name="variants" id="variants-2" />
                            <label htmlFor="variants-2" className={classes.variants__itemLabel}>
                                <h3 className={classes.variants__itemTitle}>Паллеты</h3>
                                <div className={classes.columnsContainer}>
                                    {buildPacks(["onAssemble_before"], 3, true, [70, 25], packs)}
                                </div>

                            </label>
                        </li>
                        <li className={classes.variants__item}
                            onClick={() => {changeBigViewMode("onWinder"); setDataTypeBigView("packs")}}>
                            <input type="radio" name="variants" id="variants-3" />
                            <label htmlFor="variants-3" className={classes.variants__itemLabel}>
                                <h3 className={classes.variants__itemTitle}>Обмотчик</h3>
                                <div className={classes.columnsContainer}>
                                    {buildPacks(["others"], 3, true, [70, 25], pallets)}
                                </div>
                            </label>
                        </li>
                        <li className={classes.variants__item}
                            onClick={() => {changeBigViewMode("onFork"); setDataTypeBigView("pallets")}}>
                            <input type="radio" name="variants" id="variants-4" />
                            <label htmlFor="variants-4" className={classes.variants__itemLabel}>
                                <h3 className={classes.variants__itemTitle}>Вилы</h3>
                                <div className={classes.columnsContainer}>
                                    {/* {buildPallets(["onFork"], 2, true, [70, 25], pallets)} */}
                                    {/* {buildPallets(pallets.onFork, true, [70, 25])} */}
                                    <Pallet pallets={pallets.onFork} onlyGray size={[70, 25]} />
                                </div>
                            </label>
                        </li>
                        <li className={classes.variants__item}>
                            <input type="radio" name="variants" id="variants-5" />
                            <label htmlFor="variants-5" className={classes.variants__itemLabel}>
                                <h3 className={classes.variants__itemTitle}>Упаковочный стол</h3>
                                <div className={classes.variants__itemContainer}>

                                </div>
                            </label>
                        </li>
                    </ul>
                </div>
            </main>

		</div>
	);
}

export default Main;
