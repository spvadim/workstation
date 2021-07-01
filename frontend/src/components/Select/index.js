import React from "react";
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    select: {
        maxWidth: 256,
        fontSize: "x-large",
    },

    selectContainer: {
        display: 'flex',
        flexDirection: 'column',
    },

    label: {
        marginBottom: 5,
    },
})

const Select = React.memo(({ rows, label, callback }) => {
    const classes = useStyles();

    return (
        <div className={classes.selectContainer}>
            <label className={classes.label}>{label}:</label>
            <select onChange={e => callback(e.target.value)} className={classes.select}>
                {rows.map(row => <option className={classes.option}
                                         key={row}>{row}</option>)}
            </select>
        </div>
        
    );
})

export default Select