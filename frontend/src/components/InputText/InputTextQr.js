import React, { useState, useEffect } from 'react';
import axios from "axios";
import address from "../../address.js";
import { Redirect } from "react-router-dom";
import { TextField } from 'src/components';

import Input from "./Input";


const InputTextQr = React.forwardRef(({ setNotification, setNotificationError, mode, hidden, ...restProps }, ref) => {
    const [page, setPage] = useState("");
    const [cubeData, setCubeData] = useState({});

    if (page === "edit") return <Redirect to={
        {
            pathname: "/edit",
            state: {
                description: cubeData,
                type: "cubes",
            }
        }
    } />

    return (
        <Input 
            hidden={hidden}
            ref={ref}
            {...restProps}
            onKeyPress={e => {
                if ((e.charCode === 13) && mode === "manual") {
                    // console.log(ref.current.value);
                    axios.get(address + "/api/v1_0/cubes/?qr=" + ref.current.value)
                        .then (res => {
                            setCubeData(res.data);
                            setPage('edit');
                        })
                        .catch(e => {
                            setNotificationError(e.response.data.detail)
                            setTimeout(() => {
                                setNotificationError("")
                            }, 2000)
                        })

                    // axios.get(address + "/api/v1_0/cubes_queue")
                    //     .then(res => {
                    //         let finded = res.data.find(row => row.qr === ref.current.value);
                    //         if (finded) {
                    //             setCubeData(finded);
                    //             setPage("edit");
                    //         } else {
                    //             setNotificationError("Нет куба с таким QR");
                    //         }
                    //     })
                    //     .catch(e => setNotification(e.response.data.detail))

                    ref.current.value = "";
                } else if (e.charCode === 13) {
                    axios.patch(address + "/api/v1_0/add_qr_to_last_cube/?qr=" + ref.current.value)
                        .then(() => {
                            ref.current.value = "";
                        })
                        .catch(e => setNotificationError(e.response.data.detail))

                    ref.current.value = "";
                }
                
            }}
        />
    );

})

export default InputTextQr;
