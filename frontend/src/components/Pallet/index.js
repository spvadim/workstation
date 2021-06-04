import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import Block from "../../components/Block/index.js";

const useStyles = createUseStyles({
    columnsContainer: {
        display: 'flex',
        position: 'relative',
        gap: "10%",
        justifyContent: 'space-around',
        paddingLeft: "2em",
        paddingRight: "4em", 
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
})



const Pallet = React.memo(({pallets, onlyGray, size}) => {
    const classes = useStyles();

    function buildPallet(pallet, onlyGray, size) {
        if (!pallet) return
        
        let allColumns = [];
        let swap = false;
        let firstColumn = [];
        let secondColumn = [];
    
        for (let i = 1; i <= pallet.pack_ids.length; i++) {
            if (i % 2 !== 0) {
                firstColumn.push(<Block key={pallet.pack_ids[i-1] + "123"} id={pallet.pack_ids[i-1]} style={{marginBottom: "-9%", zIndex: pallet.pack_ids.length - i}} onlyGray={onlyGray} size={size} />)
            } else {
                secondColumn.push(<Block key={pallet.pack_ids[i-1] + "123"} id={pallet.pack_ids[i-1]} style={{marginBottom: "-9%", zIndex: pallet.pack_ids.length - i}} onlyGray={onlyGray} size={size} />)
            }
        }
    
        allColumns.push((
            <div style={swap ? {zIndex: 30} : null} className={classes.buildRow}>
                <div style={swap ? {} : null} className={classes.buildCol}>{firstColumn}</div>
                <div style={swap ? {} : null} className={classes.buildCol}>{secondColumn}</div>
            </div>
        ))
    
        return allColumns
    }
    
    function buildPallets(pallets, onlyGray, size) {
        return pallets.map(pallet => buildPallet(pallet, onlyGray, size))
    }

    let columns = buildPallets(pallets, onlyGray, size);

    return (
        <div className={classes.columnsContainer}>
            {columns}
        </div>
        
    );
})

export default Pallet