import React from 'react';
import { createUseStyles } from 'react-jss';
import { color } from 'src/theme';

const useStyles = createUseStyles({
    root: {
        color: color.linkBlue,
        textDecoration: 'none',
    },
});

function Link({ className, ...restProps }) {
    const classes = useStyles();
    return <a className={['link', classes.root, className].join(' ')} {...restProps} />;
}

export default Link;