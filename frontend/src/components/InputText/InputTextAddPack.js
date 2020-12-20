import React, { useState, useEffect } from "react";
import "./index.css";
let timer;
const InputTextAddPack = React.memo(({ callback }) => {
    const [value, setValue] = useState("");
    const [valueFlag, setValueFlag] = useState(false);

    useEffect(() => {
        if (valueFlag) {
            clearTimeout(timer);
            timer = setTimeout(() => callback({qr: value, barcode: "placeholder"}), 400);
            setValueFlag(false)
        }
    }, [valueFlag])

    return (
        <div>
            <label>qr: </label>
            <input type="text"
                    autoFocus
                    onChange={async e => {
                        setValueFlag(true);
                        setValue(e.target.value);
                    }}
                    value={value} />
        </div>
    );
})

export default InputTextAddPack;