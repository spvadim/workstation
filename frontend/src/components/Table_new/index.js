import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { createUseStyles } from 'react-jss';
import address from "../../address.js";

const useStyles = createUseStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

const Table_new = React.memo(({ columns }) => {
    const classes = useStyles();

    console.log(columns.then(async res => await res))

    return (
        <>
            <div className={classes.header}>
                {1}
            </div>
        </>
    )
})

export default Table_new;