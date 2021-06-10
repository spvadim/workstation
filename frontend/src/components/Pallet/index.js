import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import Block from "../../components/Block/index.js";

const useStyles = createUseStyles({
    // columnsContainer: {
    //     display: 'flex',
    //     position: 'relative',
    //     gap: "10%",
    //     justifyContent: 'space-around',
    //     paddingLeft: "2em",
    //     paddingRight: "4em", 
    // },

    // buildCol: {
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "flex-end",
    //     position: "relative",
    // },

    // buildRow: {
    //     display: "flex",
    //     alignItems: "center",
    //     position: "relative",
    //     "& > :nth-of-type(2)": {
    //         position: 'absolute',
    //         left: "50%",
    //         bottom: 6,
    //     }
    // },

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
            left: "14.5%",
            bottom: "10%",
        }
    },

    columnsContainer: {
        display: 'flex',
        position: 'relative',
        // gap: "10%",
        // paddingRight: "4em", 
    },
})



const Pallet = React.memo(({pallet, zIndex, onlyGray, size}) => {
    const classes = useStyles();

    const [mode, setMode] = useState(0); // 0 : edge, 1 : blue, 2 : gray, 3 : yellow

    const changeModeLogic = () => {
        if (mode === 0) setMode(1)
        else if (mode === 1) setMode(0)
        else if (mode === 2) setMode(3)
        else if (mode === 3) setMode(2)
    };

    const onAdd = () => {
        setMode(2)
    }

    const onDelete = () => {
        setMode(0)
    }

    function buildPallet(pallet, onlyGray, size) {
        if (!pallet) return
        
        console.log(pallet)

        let allColumns = [];
        let swap = false;
        let firstColumn = [];
        let secondColumn = [];
    
        for (let i = 1; i <= pallet.pack_ids.length; i++) {
            let block = (onAdd, onEdit, onDelete) => <Block key={pallet.pack_ids[i-1]} 
                                                            id={pallet.pack_ids[i-1]} 
                                                            onClick={changeModeLogic}
                                                            onAdd={onAdd}
                                                            onEdit={onEdit}
                                                            onDelete={onDelete}
                                                            controlledMode={mode}
                                                            style={{marginBottom: "-9%", zIndex: pallet.pack_ids.length - i}} 
                                                            onlyGray={onlyGray} 
                                                            size={size} />;

            if (i === 1) {
                firstColumn.push(block(onAdd, null, onDelete))
            } else if (i % 2 !== 0) {
                firstColumn.push(block(null, null, null))
            } else {
                secondColumn.push(block(null, null, null))
            }
        }
    
        allColumns.push((
            <div style={swap ? {zIndex: 40} : null} className={classes.buildRow}>
                <div style={swap ? {} : null} className={classes.buildCol}>{firstColumn}</div>
                <div style={swap ? {} : null} className={classes.buildCol}>{secondColumn}</div>
            </div>
        ))
    
        return allColumns
    }
    
    // function buildPallets(pallets, onlyGray, size) {
    //     return pallets.map(pallet => buildPallet(pallet, onlyGray, size))
    // }

    // let columns = buildPallets(pallets, onlyGray, size);

    return (
        <div style={{zIndex: 40+zIndex}} className={classes.columnsContainer}>
            {buildPallet(pallet, onlyGray, size)}
        </div>
        
    );
})

export default Pallet