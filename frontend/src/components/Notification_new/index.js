import React from 'react';
import { createUseStyles, withTheme } from 'react-jss';

const useStyles = createUseStyles({
    notification: {
        backgroundColor: ({ error }) => error ? "#fea1a1" : "white",
        borderRadius: 15,
        position: 'relative',
        border: "1px solid gray",
        padding: "10px 15px",
        minWidth: 200,
        wordWrap: "break-word",
    },

    cross: {
        backgroundImage: 'url("/cross.svg")',
        width: 16,
        // marginLeft: 'auto',
        // marginRight: 0,
        margin: 2,
        float: 'right',
        height: 16,
        textAlign: 'right',
        "&:hover": {
            cursor: 'pointer',
        },
    },
});

export const Notification_new = React.memo(({ text, error, onClose }) => {
    const classes = useStyles({ error });

    return (
        <div className={classes.notification}>
            {onClose && 
                <div className={classes.cross} onClick={() => onClose()} />
            }
            {text}
        </div>
    )
})


