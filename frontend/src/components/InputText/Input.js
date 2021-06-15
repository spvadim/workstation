import React, { useState } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    input: {
        padding: "5px 10px",
        borderRadius: 7,
        border: "1px solid #A4A4A4",
        outline: "none",
        fontSize: 18,
    },
    inputHidden: {
        opacity: ({ hidden }) => hidden ? 0 : 100,
    }
});

const Input = React.forwardRef(({ hidden, className, ...restProps }, ref) => {
    const clss = useStyles({ hidden });

    return (
        <input ref={ref} className={[clss.inputHidden, className ?? clss.input].join(' ')} {...restProps} />
    );
})

export default Input;
