import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    title: {
        fontSize: 36,
        fontWeight: 700,
    },
    title2: {
        fontSize: 24,
        fontWeight: 700,
    },
});

function Text({ className, type, ...restProps }) {
    const classes = useStyles();
    const fontType = type && classes[type];
    return <span className={['text', fontType, className].join(' ')} {...restProps} />
}

export default Text;