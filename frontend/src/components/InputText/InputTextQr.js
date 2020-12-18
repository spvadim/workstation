import React, { useState, useEffect } from 'react';
import axios from "axios";
import address from "../../address.js";
import { TextField } from 'src/components';

let timer;
const InputTextQr = React.memo(({ setNotification, setNotificationError, ...restProps }) => {
    const [value, setValue] = useState("");
    const [idCube, setIdCube] = useState("");
    const [valueFlag, setValueFlag] = useState(false);
    const [flagSetQr, setFlagSetQr] = useState(false);

    useEffect(() => { // это чтобы checkCudeQr выполнился только после 2 секунд бездействия
        if (valueFlag) {
            clearTimeout(timer);
            if (flagSetQr) {
                timer = setTimeout(setQrCube, 1000);
            } else {
                timer = setTimeout(checkCubeByQr, 1000);
            }
            setValueFlag(false)
        }
    }, [valueFlag])

    const setQrCube = () => {
        setNotification("Введите QR для идентификации куба")
        setValue("");
        axios.patch(address + "/api/v1_0/cubes/" + idCube, { "qr": value })
            .then(res => {
                setFlagSetQr(false);
            })
            .catch(res => {
                if (res.response.status === 400) {
                    setNotificationError("QR не уникален!")
                } else {
                    setNotificationError(res.responce.data.detail)
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
                    setNotificationError("Куб не найден");
                    setValue("");
                }
                else setNotificationError(res.responce.data.detail)
            })
    }

    return (
        <TextField
            placeholder="QR..."
            onChange={async e => {
                setValueFlag(true);
                setValue(e.target.value);
            }}
            value={value}
            outlined
            forceFocus
            autoFocus
            {...restProps}
        />
    );
})

export default InputTextQr;