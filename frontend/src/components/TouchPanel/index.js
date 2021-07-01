import React from 'react';
import { createUseStyles } from "react-jss";
import TouchPanelButtonNumber from "../Buttons/TouchPanelButtonNumber";
import TouchPanelButton from "../Buttons/TouchPanelButton";


let useStyles = createUseStyles({
    touchPanel: {
        backgroundColor: "white",
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        width: 230,
        height: "max-content",
        padding: 15,
        paddingRight: 0,
        border: "1px solid #A4A4A4",
        borderRadius: 10,
    }
})

function TouchPanel({ addNumber, deleteNumber }) {
    let classes = useStyles();

    return (
        <div className={classes.touchPanel}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => <TouchPanelButtonNumber key={n} number={n} callback={addNumber}/>)}
            <TouchPanelButton callback={deleteNumber} />
        </div>
    );
}

export default TouchPanel;