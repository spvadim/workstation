import React from "react";
import { createUseStyles } from "react-jss";

let useStyles = createUseStyles({
    touchPanelButtonNumber: {
        fontFamily: "'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        border: "2px solid black",
        borderRadius: 5,
        display: "flex",
        width: 58,
        height: 58,
        fontWeight: 900,
        fontSize: 30,
        cursor: "pointer",
        outline: "none",
        backgroundColor: "white",
        "&:focus": {
            backgroundColor: "#F7EE55",
        }

    },
    number: {
        margin: "auto",
    }
    
})

function TouchPanelButtonNumber({ number, callback }) {
    let classes = useStyles();

    return (
        <button className={classes.touchPanelButtonNumber} onClick={() => callback(number)}>
            <span className={classes.number}>{number}</span>
        </button>
    );
}

export default TouchPanelButtonNumber;