import React from 'react';
import './index.css';

import Table from "../../components/Table/index.js";

function Edit(props) {
    console.log(props);

    return (
        <div className="container-edit">
            <div className="column">
                <Table  title={props.type}
                        columns={[
                            "Время",
                            "ID",
                            "QR",
                        ]}
                        data={
                            {
                                "type": props.type,
                                "rows": [
                                    {
                                        "Время": props["Время"],
                                        "QR": props.QR,
                                        "ID": props.ID,
                                    },
                                ]
                            }                           
                        } />

                <div className="add-remove-pack">
                    <Table  title={"Добавляемые пачки"}
                            columns={[
                                "EAN13",
                                "QR",
                                "Время",
                                "ID",
                            ]}
                            data={
                                {
                                    "type": "",
                                    "rows": [
                                        {
                                            "EAN13": ".",
                                            "QR": ".",
                                            "Время": ".",
                                            "ID": "",
                                        },
                                    ]
                                }                           
                            } />

                    <Table  title={"Удаляемые пачки"}
                            columns={[
                                "EAN13",
                                "QR",
                                "Время",
                                "ID",
                            ]}
                            data={
                                {
                                    "type": "",
                                    "rows": [
                                        {
                                            "EAN13": ".",
                                            "QR": ".",
                                            "Время": ".",
                                            "ID": "",
                                        },
                                    ]
                                }                           
                            } />
                </div>

            </div>

            <div className="column">
                <Table  title={"Мультипаки"}
                        columns={[
                            "/number",
                            "EAN13",
                            "QR",
                            "Время",
                            "ID",
                        ]}
                        data={
                            {
                                "type": "",
                                "rows": [
                                    {
                                        "EAN13": ".",
                                        "QR": ".",
                                        "Время": ".",
                                        "ID": "",
                                    },
                                ]
                            }                           
                        } />
            </div>

        </div>
    );
}

export default Edit;