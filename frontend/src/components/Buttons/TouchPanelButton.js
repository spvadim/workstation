import React from "react";
import { createUseStyles } from "react-jss";
import imgArrow from 'src/assets/images/arrow.svg';

let useStyles = createUseStyles({
    touchPanelButton: {
        backgroundColor: "black",
        display: "flex",
        width: 144,
        height: 60,
        borderRadius: 5,
        cursor: "pointer",
    },
    arrow: {
        margin: "auto",
        height: 46,
        width: 46,
    }
})

function TouchPanelButton({ callback }) {
    let classes = useStyles();

    return (
        <div className={classes.touchPanelButton} onClick={callback}>
            <img className={classes.arrow} src={imgArrow} alt="arrow" />
        </div>
    );
}

export default TouchPanelButton;