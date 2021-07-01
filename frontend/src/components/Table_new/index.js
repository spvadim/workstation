import React from "react";
import { useStyles } from './styles';

const Table_new = React.memo(({ columns, rows, className }) => {
    const classes = useStyles();

    return (
        <table className={className}>
            <thead>
                <tr>
                    {columns.map(column => <th style={column.width ? {width: column.width} : null}
                                               className={classes.columnCell}
                                               key={column.name + "_key"}>{column.title}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows.map(row => {
                    return <tr key={row.id ? row.id : null}>
                        {columns.map(column => <th className={classes.rowCell}>{row[column.name]}</th>)}
                    </tr>
                })}
            </tbody>
        </table>
    )
})

export default Table_new;