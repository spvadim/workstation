import React, { useState, useEffect } from 'react';
import axios from "axios";
import address from "../../address.js";
import { Redirect } from "react-router-dom";
import { TextField } from 'src/components';

let timer;
const InputTextQr = React.memo(({ setNotification, setNotificationError, mode, extended, forceFocus, ...restProps }) => {
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
                        setNotificationError("Нет куба с таким QR");
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
        axios.patch(address + "/api/v1_0/cubes/" + idCube, { "qr": value })
            .then(() => {
                setFlagSetQr(false);
                setNotification("Куб успешно идентифицирован");
                setTimeout(() => {
                    setNotification("Сосканируйте QR мультипака/пачки для идентификации куба")
                }, 2000);
            })
            .catch(res => {
                if (res.response.status === 400) {
                    setNotificationError("QR не уникален!")
                } else {
                    setNotificationError(res.response.data.detail[0].msg)
                }
            })

    }

    const checkCubeByQr = () => {
        console.log("value: ", value)
        axios.get(address + "/api/v1_0/find_cube_by_included_qr/?qr=" + value.replace("/", "%2F"))
            .then(res => {
                if (res.data.qr) {
                    setNotificationError("Куб уже идентифицирован")
                } else {
                    setNotification("Куб найден, введите QR для идентификации")
                    setIdCube(res.data.id);
                    setFlagSetQr(true);
                    setValue("")
                }
            })
            .catch(res => {
                if (res.response.status === 404) {
                    setNotificationError("Куб не найден");
                    setValue("");
                }
                else setNotificationError(res.response.data.detail[0].msg)
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
        <TextField
            placeholder="QR..."
            onChange={async e => {
                setValueFlag(true);
                setValue(e.target.value);
            }}
            hidden={!extended}
            value={value}
            outlined
            forceFocus={forceFocus}
            autoFocus
            {...restProps}
        />
    );
})

export default InputTextQr;