import React from 'react';
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    headerInfoItem: {
        flexGrow: 1,
        flexBasis: 0,
    },
    headerInfoTitle: {
        fontSize: 16,
        whiteSpace: 'nowrap',
    },
    headerInfoSuffix: {
        fontSize: 18,
    },
    headerInfoNumber: {
        fontSize: 24,
        fontWeight: 700,
    },
});

export function HeaderInfo({ title, amount, suffix }) {
    const classes = useStyles();

    return (
        <div className={classes.headerInfoItem}>
            <span className={classes.headerInfoTitle}>{title}</span>
            <br />
            <span className={classes.headerInfoNumber}>{amount ?? "N/A"}</span>
            &nbsp;<span className={classes.headerInfoSuffix}>{suffix}</span>
        </div>
    );
}