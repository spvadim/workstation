import React, { useState, useEffect, useMemo } from "react";
import "./index.css";

import DeleteButton from "../Buttons/DeleteButton.js";

const TableData = React.memo(({ settings, callback, data }) => {
    let { title, addFields, type } = settings;

    let columns = data.length !== 0 ? Object.keys(data[0]).concat(addFields) : [];    

    const createRow = (row) => {
        return (
            <tr>
                {columns.map((col) => { // :)
                    if (col === "/delete") return <td><DeleteButton callback={() => {callback(row)}} /></td>
                    else if (col === "/return") return <td><DeleteButton callback={() => {callback(row)}} /></td>
                    else if (col === "/remove") return <td><DeleteButton callback={() => {callback(row)}} /></td>
                    else if (row[col]) return <td>{row[col]}</td>
                    else return <td>{null}</td>
                })}
            </tr>
        );
    };

    return (
        <table>
            <thead>
                <caption style={{display: "flex"}} className="table-caption">{title}</caption>
                <tr>
                    {columns.map((name) => {
                            return <td>{name[0] === "/" ? null : name}</td>
                        })}
                </tr>
            </thead>
            <tfoot></tfoot>
            <tbody>
                {data.map((row) => createRow(row))}
            </tbody>

            
        </table>
    );

})

export default TableData;