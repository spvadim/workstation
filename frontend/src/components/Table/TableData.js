import React from "react";

// import DeleteButton from "../Buttons/DeleteButton.js";
import Table from './index';

const TableData = React.memo(({
    columns, buttonEdit, buttonDelete, rows, className, onDelete, hideTracksWhenNotNeeded
}) => {

    // const createRow = (row) => {
    //     return (
    //         <tr>
    //             {columns.map((col) => { // :) // 0_0
    //                 if (col === "/delete") return <td><DeleteButton callback={() => {callback(row)}} /></td>
    //                 else if (col === "/return") return <td><DeleteButton callback={() => {callback(row)}} /></td>
    //                 else if (col === "/remove") return <td><DeleteButton callback={() => {callback(row)}} /></td>
    //                 else if (row[col]) return <td>{row[col]}</td>
    //                 else return <td>{null}</td>
    //             })}
    //         </tr>
    //     );
    // };

    return (
        <Table
            className={className}
            columns={columns}
            rows={rows}
            buttonEdit={buttonEdit}
            buttonDelete={buttonDelete}
            onEdit={console.log}
            onDelete={onDelete}
            hideTracksWhenNotNeeded={hideTracksWhenNotNeeded}
        />
    );
})

export default TableData;