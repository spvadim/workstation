import React, { useState } from "react";
import "./index.css";

import { Redirect } from "react-router-dom";

import RemoveButton from "../Buttons/RemoveButton.js";
import EditButton from "../Buttons/EditButton.js"
import Loader from "../Loader/index.js";

function Table({ title, columns, data }) {
    let [page, setPage] = useState('');
    let [dataToEdit, setDataToEdit] = useState({});

    if (page === "edit") {
        return <Redirect to={
            {
                pathname: "/edit",
                state: dataToEdit,
            }
        } />
    }

    return (
        <table>
            <caption className="table-caption">{title}</caption>
            <thead>
                <tr>
                    {columns.map((name) => {
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
                {data["rows"].map((row) => {
                    return (
                        CreateRow(columns, row, data.type, setPage, setDataToEdit)
                    );
                })}
            </tbody>

            
        </table>
    );
}

function CreateRow(columns, data, type, setPage, setDataToEdit) {

    return (
        <tr>
            {columns.map((col) => {
                if (col === "/trash") {
                    return <td><RemoveButton /></td>;
                } else if (col === "/edit") {
                    data.type = type;
                    return <td><EditButton callback={() => {
                        setDataToEdit(data);
                        setPage("edit");
                    }} /></td>;

                } else if (data[col]) {
                    return <td>{data[col]}</td>;
                } else {
                    return <td>{null}</td>;
                }
            })}
        </tr>
    );
}

export default Table;