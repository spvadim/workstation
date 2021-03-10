import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';

import Loader from "../Loader";
import Table from './index';
import baseAddress from 'src/address';

const TableAddress = React.memo(({
    address, type, setError, setNotification, notification, setModal, extended, columns, buttonEdit, buttonDelete
}) => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const request = () => {
            let request = axios.get(baseAddress + address);
            request.then(res => {
                let rows = [];
                if (setNotification && res.data.length !== 0 && !res.data[res.data.length - 1].qr) {
                    setNotification("Надо отсканировать QR куба");
                } else if (notification === "Надо отсканировать QR куба") {
                    setNotification("");
                }

                for (let i = res.data.length - 1; i >= 0; i--) {
                    let row = {};
                    Object.assign(row, res.data[i]);
                    row.index = i + 1;
                    rows.push(row);
                }

                // if (type === "packs") {
                //     // data = res.data.map((obj, index) => {obj.index = index + 1; return obj});
                //     data = getTableDataReversed(res.data);
                // } else {
                //     data = res.data
                // }

                setTableData(rows);
            })
            request.finally(() => setLoading(false));
        };
        request();
        const interval = setInterval(request, 1000);
        return () => clearInterval(interval);
    }, [address, setNotification, notification]);

    const deleteRow = (id) => {
        axios.delete(baseAddress + "/api/v1_0/" + type + "/" + id)
            .then(res => console.log(res))
            .catch(e => {setError(e); console.log(e)})
    }
    if (loading) {
        return <Loader style={{ display: 'block', margin: 'auto' }} />
    }

    return (
        <Table
            columns={columns}
            rows={tableData}
            buttonEdit={buttonEdit}
            buttonDelete={buttonDelete}
            onEdit={row => history.push('/edit', { description: row, type, extended})}
            onDelete={row => setModal([deleteRow, row.id])}
        />
    );
})





export default TableAddress;