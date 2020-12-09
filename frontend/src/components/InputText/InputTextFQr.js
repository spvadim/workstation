import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./index.css";
import address from "../../address.js";

let timer;
const InputTextQr = React.memo(({ label, autoFocus=false }) => {
    const [value, setValue] = useState("");
    const [idCube, setIdCube] = useState("");
    const [valueFlag, setValueFlag] = useState(false);
    const [flagSetQr, setFlagSetQr] = useState(false);

    useEffect(() => { // это чтобы checkCudeQr выполнился только после 2 секунд бездействия
        if (valueFlag) {
            clearTimeout(timer);
            console.log(flagSetQr, idCube)
            if (flagSetQr) {
                timer = setTimeout(setQrCube, 1000);
            } else {
                timer = setTimeout(checkCubeByQr, 1000);
            }
            setValueFlag(false)
        }
    }, [valueFlag])

    const setQrCube = () => {
        console.log("Введите QR");
        setValue("");
        axios.patch(address + "/api/v1_0/cubes/" + idCube, {"qr": value})
        .then(res => {
            setFlagSetQr(false);
            console.log(res)
        })
        .catch(res => {
            if (res.response.status === 400) {
                console.log("qr не уникален!")
            } else {
                console.log(res.responce.data.detail)
            }
        })

    }

    const checkCubeByQr = () => {
        axios.get(address + "/api/v1_0/find_cube_by_included_qr/" + value)
        .then(res => {
            if (res.data.qr) {
                console.log("Куб уже идентифицирован!")
            } else {
                setIdCube(res.data.id);
                setFlagSetQr(true)
            }
        })
        .catch(res => console.log(res.response))
    }

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