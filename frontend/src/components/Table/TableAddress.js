import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';

import Loader from "../Loader";
import Table from './index';

const TableAddress = React.memo(({
    address, type, setError, setModal, columns, buttonEdit, buttonDelete
}) => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const request = () => {
            let request = axios.get(address);
            request.then(res => {
                setTableData(res.data);
            })
            request.catch(e => { console.log(e) })
            request.finally(() => setLoading(false));
        };
        request();
        const interval = setInterval(request, 1000);
        return () => clearInterval(interval);
    }, [address]);

    const deleteRow = (id) => {
        // http://141.101.196.127
        let address = "http://141.101.196.127";

        axios.delete(address + "/api/v1_0/" + type + "/" + id)
            .then(res => console.log(res))
            .catch(e => { setError(e); console.log(e) })
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
            onEdit={row => history.push('/edit', { description: row, type, })}
            onDelete={row => setModal([deleteRow, row.id])}
        />
    );
})





export default TableAddress;