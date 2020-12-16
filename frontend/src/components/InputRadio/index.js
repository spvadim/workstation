import React from "react";
import { createUseStyles } from "react-jss";
import imgCheckMark from 'src/assets/images/check-mark.svg';

const useStyles = createUseStyles({
    root: {
        '& input:checked + div': {
            backgroundSize: 'auto !important',
        },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
    },
    input: {
        display: 'none',
    },
    mark: {
        '& svg': {
            height: '100%',
            width: '100%',
        },
        height: '1.5em',
        width: '1.5em',
        padding: 1,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: '50%',
        backgroundSize: 0,
        backgroundImage: `url(${imgCheckMark})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
});

function InputRadio({ name, htmlFor, children, onClick, className, ...restProps }) {
    const classes = useStyles();

    return (
        <label className={['input-radio', classes.root, className].join(' ')}
            name={name}
            htmlFor={htmlFor}
            {...restProps}>

            {children}
            <input
                className={classes.input}
                name={name}
                id={htmlFor}
                type="radio"
                onClick={onClick} />

            <div className={classes.mark} />

        </label>

    );
}

export default InputRadio;