import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./index.css";
import address from "../../address.js";

let timer;
const InputTextQr = React.memo(({ label, autoFocus=false }) => {
    const [value, setValue] = useState("");
    const [valueFlag, setValueFlag] = useState(true);

    useEffect(() => { // это чтобы checkCudeQr выполнился только после 2 секунд бездействия
        if (valueFlag) {
            clearTimeout(timer);
            timer = setTimeout(checkCubeByQr, 2000);
            setValueFlag(false)
        }
    }, [valueFlag])

    const checkCubeByQr = async () => {
        let temp = await axios.get(address + "/api/v1_0/find_cube_by_included_qr/" + value, {mode: "no-cors"})
        console.log(temp)
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