import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import "./index.css";

import { Redirect } from "react-router-dom";

import DeleteButton from "../Buttons/DeleteButton.js";
import EditButton from "../Buttons/EditButton.js"
import Loader from "../Loader/index.js"

const Table = React.memo(({ settings }) => {
    let { title, addFields, address, type } = settings;

    let [tableData, setTableData] = useState("/loader");

    useEffect(() => {
        setTimeout(() => {
            let request = axios.get(address);
            request.then(res => {
                setTableData(res.data);
            })
            request.catch(e => console.log(e))
        }, 1000)
    }, [tableData])
    
    let columns = tableData.length !== 0 ? Object.keys(tableData[0]).concat(addFields) : [];  

    const createRow = (row) => {
        return (
            <tr>
                {columns.map((col) => {
                    if (col === "/trash") {
                        return <td><DeleteButton callback={() => {deleteRow(type, row.id)}} /></td>;
                    } else if (col === "/edit") {
                        return <td><EditButton data={row} type={type} /></td>
                    } else if (row[col]) {
                        return <td>{row[col]}</td>;
                    } else {
                        return <td>{null}</td>;
                    }
                })}
            </tr>
        );
    }

    return (
        <table>
            <thead>
                <caption style={{display: "flex"}} className="table-caption">{title}</caption>
                <tr>
                    {tableData === '/loader' ? null : columns.map((name) => {
                            return (
                                <td>
                                    {name[0] === "/" ? null : name}
                                </td>
                            );
                        })}
                </tr>
            </thead>
            <tfoot></tfoot>
            <tbody>
                {tableData === "/loader" ? <Loader /> :  tableData.map((row) => {
                        return createRow(row)
                    })}
            </tbody>

            
        </table>
    );
})

function deleteRow(type, id) {
    let address = "http://141.101.196.127";
    console.log(type)
    axios.delete(address + "/api/v1_0/" + (type === "packs" ? "packs/" : 
                                           type === "multipacks" ? "multipacks/" : null) + id)
    .then(res => console.log(res))
    .catch(e => console.log(e))
}



export default Table;