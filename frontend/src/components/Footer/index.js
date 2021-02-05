import React from 'react';
import { createUseStyles } from 'react-jss';
import imgFooterLogo from 'src/assets/images/footer-logo.svg';
import { color } from 'src/theme';

const useStyles = createUseStyles({
    Footer: {
        position: 'fixed',
        width: '100%',
        bottom: "5%",
        zIndex: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 20,
        color: color.textGrey,
    },
});

function Footer() {
    const classes = useStyles();
    return <div className={classes.Footer}>
        <img src={imgFooterLogo} style={{height: "64px"}} />
        ПАК Верификации 2D кодов
    </div>
}

export default Footer;