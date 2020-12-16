import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./index.css";
import address from "../../address.js";
import { Redirect } from "react-router-dom";

let timer;
const InputTextQr = React.memo(({ label, autoFocus=false, setNotification, mode }) => {
    const [value, setValue] = useState("");
    const [idCube, setIdCube] = useState("");
    const [page, setPage] = useState("");
    const [cubeData, setCubeData] = useState({});
    const [valueFlag, setValueFlag] = useState(false);
    const [flagSetQr, setFlagSetQr] = useState(false);

    useEffect(() => { // это чтобы checkCudeQr выполнился только после 2 секунд бездействия
        if (mode === "auto" && valueFlag) {
            clearTimeout(timer);
            if (flagSetQr) {
                timer = setTimeout(setQrCube, 1000);
            } else {
                timer = setTimeout(checkCubeByQr, 1000);
            }
            setValueFlag(false)
        } else if (mode === "manual") {

            const func = () => {
                axios.get(address + "/api/v1_0/cubes_queue")
                .then(res => {
                    let finded = res.data.find(row => row.qr === value);
                    if (finded) {
                        setCubeData(finded);
                        setPage("edit");
                    } else {
                        setNotification("Нет куба с таким QR");
                        setValue("");
                    }
                })
                .catch(e => setNotification(e.detail))
            }

            clearTimeout(timer);
            setTimeout(func, 1000)
            setValueFlag(false)
        }

    }, [valueFlag])

    const setQrCube = () => {
        setNotification("Введите QR для идентификации куба")
        setValue("");
        axios.patch(address + "/api/v1_0/cubes/" + idCube, {"qr": value})
        .then(res => {
            setFlagSetQr(false);
        })
        .catch(res => {
            if (res.response.status === 400) {
                setNotification("QR не уникален!")
            } else {
                setNotification(res.response.data.detail)
            }
        })

    }

    const checkCubeByQr = () => {
        axios.get(address + "/api/v1_0/find_cube_by_included_qr/" + value)
        .then(res => {
            if (res.data.qr) {
                setNotification("Куб уже идентифицирован")
            } else {
                setNotification("Куб найден, введите QR для идентификации")
                setIdCube(res.data.id);
                setFlagSetQr(true);
                setValue("")
            }
        })
        .catch(res => {
            if (res.response.status === 404) {
                setNotification("Куб не найден");
                setValue("");
            } 
            else setNotification(res.responce.data.detail)
        })
    }

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
        <div>
            <label>{label}</label>
            <input type="text"
                    autoFocus={autoFocus}
                    onChange={async e => {
                        setValueFlag(true);

                        setValue(e.target.value);
                    }}
                    value={value} />
        </div>  
    );
})

export default InputTextQr;