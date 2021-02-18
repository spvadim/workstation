import React, { useState, useEffect } from 'react';
import axios from "axios";
import address from "../../address.js";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({

});

const InputEdit = React.memo(({ value, onChange }) => {
    const classes = useStyles();
    const [value, setValue] = useState(value);

    return (
        <input value={value} onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
        }} />
    );
})

export default InputEdit;