import React from "react";
import { createUseStyles } from 'react-jss';
import Block from "../../components/Block/index.js";
import Pallet from "../../components/Pallet/index.js";

const useStyles = createUseStyles({
    content: {
        display: 'flex',
        justifyContent: 'space-around',
        maxWidth: "90%",
        alignItems: 'center',
    },

    buildCol: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        marginTop: 200
    },

    buildRow: {
        display: "flex",
        alignItems: "center",
        position: "relative",
        "& > :nth-of-type(2)": {
            position: 'absolute',
            left: "50%",
            bottom: 26,
        }
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

    columnsContainer: {
        display: 'flex',
        position: 'relative',
        // gap: "10%",
        // paddingRight: "4em",
    },

    columnsContainer2: {
        display: 'flex',
        position: 'relative',
        gap: "5%",
        paddingLeft: "2em",
        paddingBottom: "1em",
        paddingRight: "4em",
        flexWrap: "wrap-reverse",
    },

})

const BigView = React.memo(({ data, dataType, perColumn=4 }) => {
    const classes = useStyles();
    let columns = Object.keys(data);

    function buildPacks() {
         return columns.map(column => {
            let allColumns = [];
            let separatedColumns = [];
            let swap = false;
            let columnItemsTemp = [];
            for (let i = 1; i <= data[column].length; i++) {
                columnItemsTemp.push((
                    <Block key={data[column][i-1].id}
                           id={data[column][i-1].id}
                           style={{marginBottom: "-9%", zIndex: data[column].length - i}} />
                ))

                if (i % perColumn === 0) {
                    separatedColumns.push((<div style={swap ? {} : null} className={classes.buildCol}><span>{column}</span> {columnItemsTemp}</div>));
                    if (separatedColumns.length === 2) {
                        allColumns.push((<div style={swap ? {zIndex: i} : null} className={classes.buildRow}>{separatedColumns}</div>));
                        separatedColumns = [];
                    }

                    columnItemsTemp = [];
                    swap = !swap;
                }
            }

            if (columnItemsTemp.length !== 0) {
                separatedColumns.push((<div style={swap ? {} : null} className={classes.buildCol}><span>{column}</span> {columnItemsTemp}</div>));
                allColumns.push((<div style={swap ? {zIndex: 30} : null} className={classes.buildRow}>{separatedColumns}</div>));
            }

            return allColumns
        })
    }

    // function buildPallet(pallet, onlyGray, size) {
    //     if (!pallet) return
    //
    //     let allColumns = [];
    //     let swap = false;
    //     let firstColumn = [];
    //     let secondColumn = [];
    //
    //     for (let i = 1; i <= pallet.pack_ids.length; i++) {
    //         let block = <Block key={pallet.pack_ids[i-1] + "_"}
    //                            id={pallet.pack_ids[i-1]}
    //                            onClick={() => console.log(123)}
    //                            style={{marginBottom: "-9%", zIndex: pallet.pack_ids.length - i}}
    //                            onlyGray={onlyGray}
    //                            size={size} />;
    //
    //         if (i % 2 !== 0) {
    //             firstColumn.push(block)
    //         } else {
    //             secondColumn.push(block)
    //         }
    //     }
    //
    //     allColumns.push((
    //         <div style={swap ? {zIndex: 30} : null} className={classes.buildRow}>
    //             <div style={swap ? {} : null} className={classes.buildCol}>{firstColumn}</div>
    //             <div style={swap ? {} : null} className={classes.buildCol}>{secondColumn}</div>
    //         </div>
    //     ))
    //
    //     return allColumns
    // }

    function buildPallets(pallets, onlyGray, size) {
        return pallets.map((pallet, i) => <Pallet key={pallet.id} zIndex={i} pallet={pallet} onlyGray={onlyGray} size={size}/>)
    }

    return (
        <div className={classes.content}>
            <div className={dataType === "palletsPackingTable" ? classes.columnsContainer2 : classes.columnsContainer}>
                {dataType === "packs" ? buildPacks() : buildPallets(data, false, [301, 113])}
            </div>


        </div>
    )
})

export default BigView
