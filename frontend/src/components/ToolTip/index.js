import React, { useState, useRef } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        alignItems: "center",
        position: "relative",
        
        "&:hover": {
            cursor: "pointer",
        }
    },
    image: {
        width: 24,
        outline: "none",
    },
    body: {
        outlined: "none",
        position: "absolute",
        border: "1px solid black",
        overflowWrap: "break-word",
        width: "300px",
        borderRadius: 7,
        padding: "4px 6px",
        whiteSpace: "pre-line",
        backgroundColor: "white",
    },
});

const ToolTip = React.memo(({ text, ...restProps }) => {
    let classes = useStyles();
    
    const [hidden, setHidden] = useState(true);
    const ref = useRef(null);
    
    return (
        <div ref={ref} className={classes.container} {...restProps}>
            <img src="./questionMark.svg"
                 alt="questionMark"
                 className={classes.image}
                 onClick={() => {setHidden(!hidden)}}
                 onBlur={() => {setHidden(true)}}
                 tabIndex={ 0 } />
            <div style={{position: "relative", zIndex: 99, display: hidden ? "none" : null}}>
                <span className={classes.body}>{text}</span>
            </div>
        </div>
    );
})

export default ToolTip;