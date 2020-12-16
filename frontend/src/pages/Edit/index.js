import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import { Redirect } from "react-router-dom";
import './index.css';

import TableData from "../../components/Table/TableData.js";
import Button from "../../components/Buttons/Button.js";
import address from "../../address.js";

function Edit({ description, type }) {

    let [containTableData, setContainTableData] = useState("/loader");

    useEffect(() => {
        axios.get(address + "/api/v1_0/" + type + "/" + description.id)
        .then(async res => {
            if (type === "multipacks") {
                setContainTableData(await getPacks(res.data.pack_ids));
            } else if (type === "cubes") {
                setContainTableData(await getMultipacks(Object.keys(res.data.multipack_ids_with_pack_ids)));
            }
        })
    }, [])

    const getMultipacks = async (ids) => {
        let multipacks = [];
        for (let i = 0; i < ids.length; i++) {
            let request = await axios.get(address + "/api/v1_0/multipacks/" + ids[i]);
            let data = request.data;
            multipacks.push({
                qr: data.qr,
                barcode: data.barcode,
                created_at: data.created_at,
                id: data.id,
            })
        }

        return multipacks;
    }

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
                            columns: ["created_at", "qr", "status", "id"],
                            addFields: [],
                        }), []),
        
        addTable: useMemo(() => ({
                            title: "Добавляемое",
                            name: "addTable",
                            type: type,
                            columns: ["created_at", "barcode", "qr", "id"],
                            addFields: "/delete",
                        }), []),

        removeTable: useMemo(() => ({
                            title: "Удаляемое",
                            name: "removeTable",
                            type: type,
                            columns: ["created_at", "barcode", "qr", "id"],
                            addFields: "/return",
                        }), []),

        containTable: useMemo(() => ({
                            title: "Содержимое",
                            type: type,
                            columns: ["created_at", "barcode", "qr", "id"],
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
            let packs = containTableData.map((obj) => obj.id);
            let temp = {pack_ids: packs};
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

    if (page === "/main") return <Redirect to="/main" />

    return (
        <div className="container-edit">
            <div className="column">
                <TableData settings={tableSettings.description} 
                            data={[description]}  />

                <div>
                    <Button onClick={submitChanges} >Принять изменения</Button>
                    <Button onClick={closeChanges} >Отменить изменения</Button>
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