import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    root: {
        margin: 'auto',
        width: '3rem',
        height: '3rem',
    },
});

function Loader() {
    const classes = useStyles();

    return (
        <img className={['loader', classes.root].join(' ')} src="./loader.gif" alt="loader" />
    );
}

export default Loader;