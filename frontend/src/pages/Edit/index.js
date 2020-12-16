import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import { Redirect } from "react-router-dom";
import './index.css';
import { useCookies } from "react-cookie";

import TableData from "../../components/Table/TableData.js";
import Button from "../../components/Buttons/Button.js";
import address from "../../address.js";
import InputTextAddPack from "../../components/InputText/InputTextAddPack.js";
import Notification from "../../components/Notification/index.js";
import SwitchMode from "../../components/SwitchMode/index.js";

function Edit({ description, type }) {
    let [containTableData, setContainTableData] = useState("/loader");
    let [addTableData, setAddTableData] = useState([]);
    let [removeTableData, setRemoveTableData] = useState([]);

    let [page, setPage] = useState('');
    let [notificationText, setNotificationText] = useState("");
    let [bigPackData, setBigPackData] = useState({});
    let [inputMode, setInputMode] = useState("add");

    let [cookies] = useCookies();

    useEffect(() => {
        axios.get(address + "/api/v1_0/" + type + "/" + description.id)
        .then(async res => {
            setBigPackData(res.data);
            console.log("bigPackData: ", res.data)
            if (type === "multipacks") {
                setContainTableData(await getPacks(res.data.pack_ids));
            } else if (type === "cubes") {
                setContainTableData( await getPacksFromMultipacks(Object.keys(res.data.multipack_ids_with_pack_ids)) );
            }
        })
    }, [])

    const getPacksFromMultipacks = async (ids) => {
        let packsIds = [];
        for (let i = 0; i < ids.length; i++) {
            let request = await axios.get(address + "/api/v1_0/multipacks/" + ids[i]);
            let data = request.data;
            packsIds.push(data.pack_ids)
        }

        return getPacks(packsIds.flat())
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

    let tableSettings = {
        description: useMemo(() =>({
                            title: type,
                            type: type,
                            columns: type === "cubes" ? ["created_at", "qr", "id"] : ["created_at", "qr", "status", "id"],
                            addFields: [],
                        }), []),
        
        addTable: useMemo(() => ({
                            title: "Добавляемое",
                            name: "addTable",
                            type: type,
                            columns: ["barcode", "qr"],
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

    const submitChanges = () => {
        if (containTableData.length === 0) {
            axios.delete(address + "/api/v1_0/" + type + "/" + description.id)
            .then(setPage("/main"))

        } else if (containTableData !== "/loader") {
            updateBigPack();
        } else {
            setPage("/main")
        }
    }

    const removeRow = (from, row) => {
        if (from === "addTable") {
            let temp = addTableData.slice();
            setAddTableData( temp.filter( (obj) => obj.qr !== row.qr ) )
        } else if (from === "removeTable") {
            let temp = removeTableData.slice();
            setRemoveTableData( temp.filter( (obj) => obj.id !== row.id ) )
        } else if (from === "containTable") {
            let unique = true;
            for (let i = 0; i < removeTableData.length; i++) {
                if (removeTableData[i].qr === row.qr) unique = false
            }

            if ( unique ) {
                let temp = removeTableData.slice();
                temp.push(row);
                setRemoveTableData(temp);
            }
        }
    }

    const addPack = (row) => {
        let temp = addTableData.slice();
        temp.push(row);
        setAddTableData(temp);
    }

    const updateMultipack = async () => {
        let checkedOverflow = checkOverflow();
        
        let ids = [];
        if (checkedOverflow) {
            ids = await createPacks();
            
        }

        console.log("removetabledata: ", removeTableData)
        let packsId = bigPackData.pack_ids
                                .concat(ids)
                                .filter((id) => {
                                    let ids = removeTableData.map(obj => obj.id);
                                    return ids.indexOf(id) < 0
                                });

        console.log("ids: ", ids)
        console.log("packsId: ", packsId)

        axios.patch(address + "/api/v1_0/multipacks/" + description.id, {pack_ids: packsId})
        .then(res => {
            console.log("res: ", res);
            deletePacks(removeTableData.map(obj => obj.id));

            console.log("checkedOverflow: ", checkedOverflow);
            console.log("addtable length: ", addTableData.length)
            if (!checkedOverflow && addTableData.length !== 0) setNotificationText("Достигли предела")
            else if (addTableData.length === 0) setPage("/main")
        })
        .catch(e => console.log(e))
        
    }  

    const updateCube = async () => {
        let checkedOverflow = checkOverflow();

        let multipacks = bigPackData.multipack_ids_with_pack_ids;
        let packsIdToCreate;
        if (checkedOverflow) packsIdToCreate = await createPacks();
        
        let newMultipacks = {};
        Object.assign(newMultipacks, multipacks);

        for (let mp in multipacks) {
            let diff = bigPackData.packs_in_multipacks - multipacks[mp].length;

            let packsDeleted = [];
            let packsId = multipacks[mp].filter(packId => {
                let ids = removeTableData.map(obj => obj.id);
                let findIndex = ids.indexOf(packId);
                if (findIndex >= 0) packsDeleted.push(packId);
                return findIndex < 0
            })

            deletePacks(packsDeleted);

            diff += packsDeleted.length;

            let packsIdToMultipack = [];
            
            if (checkedOverflow) {
                for (let i = 0; i < diff; i++) {
                    let id = packsIdToCreate.shift();
                    
                    if (!id) break;
    
                    packsIdToMultipack.push(id);
                }
            }

            packsId = packsId.concat(packsIdToMultipack);
            
            await axios.patch(address + "/api/v1_0/multipacks/" + mp, {pack_ids: packsId})
            .then(res => {
                newMultipacks[mp] = res.data.pack_ids;
                console.log("put to multipack ", mp, " : ", res.data);
            })
            .catch(e => console.log(e))
        }

        console.log("newmultipacks: ", newMultipacks);

        await axios.patch(address + "/api/v1_0/cubes/" + description.id, {multipack_ids_with_pack_ids: newMultipacks})
        .then(res => console.log("update cube: ", res.data))
        .catch(e => console.log(e))

        console.log("checkedoverflow: ", checkedOverflow)
        if (!checkedOverflow && addTableData.length !== 0) setNotificationText("Достигли предела")
        else setPage("/main");
    }

    const updateBigPack = async () => {
        if (type === "multipacks") {
            updateMultipack();
        } else if (type === "cubes") {
            updateCube();
        }
    }

    const createPacks = async () => {
        let ids = new Promise(async (res) => {
            let ids = [];
            for (let i = 0; i < addTableData.length; i++) {
                let flag = false;
                let req = axios.put(address + "/api/v1_0/packs", {qr: addTableData[i].qr, barcode: addTableData[i].barcode, batch_number: cookies.batchNumber, in_queue: false});
                req.then(res => console.log("pack created: ", res.data))
                req.catch(e => {console.log(e); flag=true});
                if (flag) break 
                else {
                    let temp = await req;
                    ids.push(temp.data.id)
                }
            }
            res(ids)
        })
        return  ids;
    }

    const checkOverflow = () => {
        if (type === "multipacks") {
            console.log("cookie packs: ", cookies.packs)
            console.log("addtable length: ", addTableData.length)
            console.log("bigpack packs length: ", bigPackData.pack_ids.length)
            
            return addTableData.length + bigPackData.pack_ids.length <= cookies.packs  
        } else if (type === "cubes") {
            let multipacksCheck = ( Object.keys(bigPackData.multipack_ids_with_pack_ids).length ) <= bigPackData.multipacks_in_cubes;

            let packsCount = 0;
            for (let multipack in bigPackData.multipack_ids_with_pack_ids) {
                packsCount += bigPackData.multipack_ids_with_pack_ids[multipack].length;
            }

            let packsCheck = packsCount - removeTableData.length < bigPackData.multipacks_in_cubes * bigPackData.packs_in_multipacks;
            console.log("countpacks: ", packsCount);
            console.log("removetable length: ", removeTableData.length);


            // console.log("packsCheck: ", packsCheck)
            // console.log("multipacksCheck: ", multipacksCheck)
            // console.log("multipacks in cube: ", bigPackData.multipacks_in_cubes)
            // console.log("packs in multipack: ", bigPackData.packs_in_multipacks)
            return multipacksCheck && packsCheck
        }
    }

    const deletePacks = (ids) => {
        ids.map(id => {
            axios.delete(address + "/api/v1_0/packs/" + id)
            .then(res => console.log("deleted: ", res.data))
            .catch(e => console.log(e))
        })
    }

    const removePack = (pack) => {
        let findResult = [];
        
        findResult = containTableData.find((elem, index, array) => {
            return elem.qr === pack.qr
        })

        if (findResult) {
            let temp = removeTableData.slice();
            temp.push(findResult);
            setRemoveTableData(temp);
        }
    }

    const switchMode = () => {
        if (inputMode === "add") setInputMode("remove")
        else setInputMode("add")
    }

    const closeChanges = () => {
        setPage("/main");
    }

    if (page === "/main") return <Redirect to="/main" />

    return (
        <div className="container-edit">
            <div className="column">
                <div style={{display: "flex", gap: "1rem"}}>
                    Добавить
                    <SwitchMode callback={switchMode} />
                    Удалить
                </div>
                <TableData settings={tableSettings.description} 
                            data={[description]}  />

                <div>
                    <Button text={"Принять изменения"}
                            callback={submitChanges} />
                    <Button text={"Отменить изменения"}
                            callback={closeChanges} />
                    <InputTextAddPack callback={(p) => inputMode === "add" ? addPack(p) : removePack(p)} />
                </div>

                <div className="add-remove-pack">

                    <TableData data={addTableData} 
                                settings={tableSettings.addTable} 
                                callback={(row) => {removeRow("addTable", row)}}  />
                    <TableData data={removeTableData} 
                                settings={tableSettings.removeTable} 
                                callback={(row) => {removeRow("removeTable", row)}}  />
                    
                </div>

                <Notification text={notificationText} />
            </div>

            <div className="column">
                <TableData data={containTableData} 
                            settings={tableSettings.containTable} 
                            callback={(row) => {removeRow("containTable", row)}} />

            </div>

        </div>
    );
}

export default Edit;