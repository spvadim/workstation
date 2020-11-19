import React from 'react';
import './index.css';

import Table from "../../components/Table/index.js";

function Edit({ type, QR, ID, Время }) {

    return (
        <div className="container-edit">
            <div className="column">
                <Table  title={type}
                        columns={[
                            "Время",
                            "ID",
                            "QR",
                        ]}
                        data={
                            {
                                "type": type,
                                "rows": [
                                    {
                                        "Время": Время,
                                        "QR": QR,
                                        "ID": ID,
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