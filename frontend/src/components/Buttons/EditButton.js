import React, { useState } from "react";
import { Redirect, Router } from "react-router-dom";

import "./index.css";

// http://141.101.196.127
let address = "";

const EditButton = React.memo (({ data, type }) => {
    let [page, setPage] = useState('');

    if (page === "edit") return <Redirect to={
        {
            pathname: "/edit",
            state: {
                description: data,
                type: type,
            }
        }
    } />

    return (
        <div className="icon-container"
             onClick={() => setPage("edit")}>
            <img className="icon" src="./edit.svg" alt="edit"/>
        </div>
    );
}, (prev, cur) => prev === cur ? false : true)

export default EditButton;