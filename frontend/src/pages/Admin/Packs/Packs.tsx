import axios from 'axios';
import address from "../../../address.js";

import "../index.scss";
import Table from "../../../components/Table/index.js";
import { Button } from "src/components/index";
import { useEffect, useState } from 'react';

const bathesParamsTableProps = [
    {name: "number", title: "№", width: 48},
    {name: "packs", title: "Пачек в паллете"},
    {name: "multipacks", title: "Паллет в кубе"},
    {name: "multipacks_after_pintset", title: "Паллет после пинцета"},
]

const rowDelete = (id: string) => {
    axios.delete(address + "/api/v1_0/batches_params/" + id)
}

const Packs = () => {
    const [batchesParams, setBatchesParams] = useState([]);

    const [modalAddBatchParams, setModalAddBatchParams] = useState(false);
    const [newPacks, setNewPacks] = useState(false);
    const [newMultipacks, setNewMultipacks] = useState(false);
    const [newPalletAfterPintset, setNewPalletAfterPintset] = useState(false);
    
    useEffect(() => {
        const request = () => {
            let request = axios.get(address + "/api/v1_0/batches_params");
            request.then(res => setBatchesParams(res.data))
        };
        request();
        const interval = setInterval(request, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div style={{padding: 20}}>
                {modalAddBatchParams && 
                <ModalWindow
                    title="Добавление"
                    description="Введите параметры партии"
                >
                    <div>
                        <TextField
                                placeholder="Пачек в паллете"
                                onChange={async e => {
                                    setNewPacks(e.target.value);
                                }}
                                hidden={false}
                                outlined
                                autoFocus
                        />
                        <TextField
                                placeholder="Паллет в кубе"
                                onChange={async e => {
                                    setNewMultipacks(e.target.value);
                                }}
                                hidden={false}
                                outlined
                                autoFocus
                        />
                        <TextField
                                placeholder="Паллет после пинцета"
                                onChange={async e => {
                                    setNewPalletAfterPintset(e.target.value);
                                }}
                                hidden={false}
                                outlined
                                autoFocus
                        />
                    </div>


                    <Button onClick={() => {
                        if (newPacks && newMultipacks && newPalletAfterPintset) {
                            axios.put(address + "/api/v1_0/batches_params", {
                                packs: newPacks,
                                multipacks: newMultipacks,
                                multipacks_after_pintset: newPalletAfterPintset,
                            })
                                .then(() => {
                                    setNewPalletAfterPintset("");
                                    setNewPacks("");
                                    setNewMultipacks("");
                                    setModalAddBatchParams(false);
                                })
                        }
                        
                    }}>
                        <img src={imgOk} style={{ width: 25 }} />
                        Добавить
                    </Button>
                    <Button onClick={() => {
                        setNewPalletAfterPintset("");
                        setNewPacks("");
                        setNewMultipacks("");
                        setModalAddBatchParams(false);
                    }} theme="secondary">
                        <img src={imgCross} style={{ filter: 'invert(1)', width: 22 }} />
                        Отмена
                    </Button>
                </ModalWindow>}
            </div>
            <div>
                <Button onClick={() => setModalAddBatchParams(true)}>Создать новые параметры партии</Button>
                <Table columns={bathesParamsTableProps}
                    rows={batchesParams.map((param, index) => {
                        let temp = {};
                        Object.assign(temp, param);
                        temp.number = batchesParams.length - index;
                        return temp;
                    })}
                    className={"bathesParams"}
                    buttonDelete={"/trash"}
                    buttonVisible={"/visible"}
                    onVisible={(row) => {
                        axios.patch(address + "/api/v1_0/batches_params/" + row.id, {visible: !row.visible})
                    }}
                    onDelete={(row) => rowDelete(row.id)} />
            </div>
        </>
    )
}

export default Packs;