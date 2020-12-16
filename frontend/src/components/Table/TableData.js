import React, { useState, useEffect, useMemo } from "react";

import Loader from "../Loader/index.js";
import DeleteButton from "../Buttons/DeleteButton.js";

const TableData = React.memo(({ settings, callback, data }) => {
    let { title, addFields, type } = settings;

    let columns = [];
    if (data !== "/loader") {
        if (settings.columns) {
            columns = settings.columns.concat(addFields);
        } else if (data.length !== 0) {
            columns = Object.keys(data[0]).concat(addFields);
        }
    }

    const createRow = (row) => {
        return (
            <tr>
                {columns.map((col) => { // :)
                    if (col === "/delete") return <td><DeleteButton callback={() => { callback(row) }} /></td>
                    else if (col === "/return") return <td><DeleteButton callback={() => { callback(row) }} /></td>
                    else if (col === "/remove") return <td><DeleteButton callback={() => { callback(row) }} /></td>
                    else if (row[col]) return <td>{row[col]}</td>
                    else return <td>{null}</td>
                })}
            </tr>
        );
    };

    return (
        <table>
            <thead>
                <caption style={{ display: "flex" }} className="table-caption">{title}</caption>
                <tr>
                    {data === "/loader" ? null : columns.map((name) => <td>{name[0] === "/" ? null : name}</td>)}
                </tr>
            </thead>
            <tfoot></tfoot>
            <tbody>
                {data === "/loader" ? <Loader /> : data.map((row) => createRow(row))}
            </tbody>


        </table>
    );

})

export default TableData;