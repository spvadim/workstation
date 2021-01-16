import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        width: 'max-content',
        alignItems: "center",
        position: "relative",
    },
    image: {
        width: 16,
        "&:hover + div": {
            opacity: 1,
        }
    },
    body: {
        position: "absolute",
        border: "1px solid black",
        left: 25,
        maxWidth: 500,
        overflowWrap: "break-word",
        borderRadius: 7,
        padding: "4px 6px",
        whiteSpace: "pre-line",
        backgroundColor: "white",
    },
});

const ToolTip = React.memo(({ text }) => {
    let classes = useStyles();
    
    return (
        <div className={classes.container}>
            <img src="./questionMark.svg" alt="questionMark" className={classes.image} />
            <div style={{position: "relative", opacity: 0}}>
                <span className={classes.body}>{text}</span>
            </div>
        </div>
    );
})

export default ToolTip;