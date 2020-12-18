import React from 'react';
import { createUseStyles } from 'react-jss';
import imgFooterLogo from 'src/assets/images/footer-logo.svg';
import { color } from 'src/theme';

const useStyles = createUseStyles({
    Footer: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 14,
        color: color.textGrey,
        marginBottom: 22,
    },
});

function Footer() {
    const classes = useStyles();
    return <div className={classes.Footer}>
        <img src={imgFooterLogo} />
        ПАК Верификации 2D кодов
    </div>
}

export default Footer;