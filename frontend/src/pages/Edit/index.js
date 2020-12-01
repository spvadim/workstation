import React, { useState, useMemo } from 'react';
import { Redirect } from "react-router-dom";
import './index.css';

import TableData from "../../components/Table/TableData.js";
import Button from "../../components/Buttons/Button.js";

function Edit({ description, type }) {

    let [addTableData, setAddTableData] = useState([
        {
            EAN13: "добавляемое",
            QR: "................",
            created_at: "......",
            id: "12412542135"
        },
        {
            EAN13: "добавл4яемое",
            QR: "......12..........",
            created_at: "..42....",
            id: "2354635645734",
        },
        {
            EAN13: "56234634",
            QR: "......12..........",
            created_at: "..42....",
            id: "df234t",
        }
    ]);

    let [removeTableData, setRemoveTableData] = useState([
        {
            EAN13: "удаляемое",
            QR: "................",
            created_at: "......",
            id: "234b28734b",
        },
        {
            EAN13: "удаля235емое",
            QR: ".........35.......",
            created_at: "...35...",
            id: "h23874b8273v625f",
        }
    ]);
    let [containTableData, setContainTableData] = useState([
        {
            EAN13: "567",
            QR: "................",
            created_at: "......",
            id: "0vf92438b52",
        },
        {
            EAN13: "123",
            QR: "......43..........",
            created_at: "...3...",
            id: "230849283b52g956gh",
        }
    ]);

    let [page, setPage] = useState('');

    let tableSettings = {
        description: useMemo(() =>({
                            title: type,
                            type: type,
                            addFields: [],
                        }), []),
        
        addTable: useMemo(() => ({
                            title: "Добавляемое",
                            name: "addTable",
                            type: type,
                            addFields: "/delete",
                        }), []),

        removeTable: useMemo(() => ({
                            title: "Удаляемое",
                            name: "removeTable",
                            type: type,
                            addFields: "/return",
                        }), []),

        containTable: useMemo(() => ({
                            title: "Содержимое",
                            type: type,
                            addFields: "/remove",
                        }), []),

    }

    const deleteRow = (row) => {
        let temp = addTableData.filter((obj) => obj.id !== row.id);
        setAddTableData(temp);
    }

    const returnRow = (row) => {
        let foo = containTableData.slice();
        foo.push(row);

        let bar = removeTableData.filter((obj) => obj.id !== row.id)        

        setContainTableData(foo);
        setRemoveTableData(bar);
    }

    const removeRow = (row) => {
        let foo = removeTableData.slice();
        foo.push(row);

        let bar = containTableData.filter((obj) => obj.id !== row.id);

        setRemoveTableData(foo);
        setContainTableData(bar);

    }

    const submitChanges = () => {
        console.log("Принять изменения")
        setPage("/main");
    }

    const closeChanges = () => {
        console.log("Отменить изменения")
        setPage("/main");
    }

    if (page === "/main") return <Redirect to={
        {
            pathname: "/main",
            state: {
                partyNumber: null,
                settings: {
                    multipacks: null,
                    packs: null,
                },
            }
        }
    } />

    return (
        <div className="container-edit">
            <div className="column">
                <TableData settings={tableSettings.description} 
                            data={[description]}  />

                <div>
                    <Button text={"Принять изменения"}
                            callback={submitChanges} />
                    <Button text={"Отменить изменения"}
                            callback={closeChanges} />
                </div>

                <div className="add-remove-pack">

                    <TableData data={addTableData} 
                                settings={tableSettings.addTable} 
                                callback={(row) => {deleteRow(row)}}  />
                    <TableData data={removeTableData} 
                                settings={tableSettings.removeTable} 
                                callback={(row) => {returnRow(row)}}  />
                    
                </div>

            </div>

            <div className="column">
                <TableData data={containTableData} 
                            settings={tableSettings.containTable} 
                            callback={(row) => {removeRow(row)}} />

            </div>

        </div>
    );
}

export default Edit;