import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { createUseStyles } from "react-jss";
import axios from 'axios';
import address from "../../address.js";

import InputText from "../../components/InputText/Input";

const useStyles = createUseStyles({
    container: {
        padding: "100px 500px"
    },
});

function Test() {
    const classes = useStyles();
    const inputRef = useRef(null);
    const [a, setA] = useState(0);

    useEffect(() => {
        console.log(document.activeElement)

    })



    return (
        <div className={classes.container}>
            <h3>{a}</h3>
            <InputText ref={inputRef} />
            <button onClick={() => console.log()}>фокус</button>          
            <button onClick={() => {setA(a + 1); console.log(inputRef.current.value)}}>обновить</button>          
        </div>
    );
       
}

export default Test;