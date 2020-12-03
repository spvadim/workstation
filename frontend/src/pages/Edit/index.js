import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import { Redirect } from "react-router-dom";
import './index.css';

import TableData from "../../components/Table/TableData.js";
import Button from "../../components/Buttons/Button.js";

// http://141.101.196.127
let address = "";

function Edit({ description, type, batch }) {

    let [containTableData, setContainTableData] = useState("/loader");
    let [bigPack, setBigPack] = useState({});

    console.log(batch)

    useEffect(() => {
        axios.get(address + "/api/v1_0/" + type + "/" + description.id)
        .then(async res => {

            if (type === "multipacks") {
                setBigPack(res.data)
                setContainTableData(await getPacks(res.data.pack_ids))
            }
        })
    }, [])

    const getPacks = async (ids) => {
        let packs = [];
        for (let i = 0; i < ids.length; i++) {
            let request = await axios.get(address + "/api/v1_0/packs/" + ids[i]);
            let data = request.data;
            packs.push({
                qr: data.qr,
                barcode: data.barcode,
                created_at: data.created_at,
                id: data.id,
            })
        }

        return packs;
    }

    let [addTableData, setAddTableData] = useState([]);
    let [removeTableData, setRemoveTableData] = useState([]);

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
        if (containTableData.length === 0) {
            axios.delete(address + "/api/v1_0/" + type + "/" + description.id)
            .then(setPage("/main"))
        } else if (containTableData !== "/loader") {
            let temp = {};
            Object.assign(temp, bigPack);
            temp.pack_ids = containTableData.map((obj) => obj.id);
            axios.patch(address + "/api/v1_0/" + type + "/" + description.id, temp)
            .then(setPage("/main"))
        } else {
            setPage("/main")
        }
    }

    const closeChanges = () => {
        console.log("Отменить изменения")
        setPage("/main");
    }

    if (page === "/main") return <Redirect to={
        {
            pathname: "/main",
            state: batch
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