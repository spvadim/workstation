import React from "react";
import { createUseStyles } from "react-jss";
import { color } from "src/theme";

const height = 34;

const useStyles = createUseStyles({
    root: {
        width: 61,
        height: 34,
        borderWidth: 3,
        borderStyle: 'solid',
        borderRadius: height / 2,
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 3,
        paddingRight: 3,
        marginLeft: 12,
        marginRight: 12,
        cursor: "pointer",
    },
    input: {
        '&:checked + div': {
            backgroundColor: color.yellow,
            marginLeft: 'auto',
            transform: 'translateX(27px)',
        },
        opacity: 0,
        position: 'absolute',
    },
    thumb: {
        transition: '0.1s',
        boxSizing: 'border-box',
        backgroundColor: color.black,
        width: 22,
        height: 22,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: '50%',
        position: 'absolute',
    },
})

const Switch = React.memo(({ onClick, mode, className, ...restProps }) => {
    const classes = useStyles();
    return (
        <label className={['switch', classes.root, className].join(' ')} {...restProps}>
            <input type="checkbox" checked={mode && mode === "manual"} onClick={onClick} className={classes.input}  />
            <div className={['switch_thumb', classes.thumb].join(' ')} />
        </label>
    );
})

export default Switch;