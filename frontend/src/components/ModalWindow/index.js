import React from 'react';
import { Paper } from 'src/components';
import Portal from './Portal';
import imgError from 'src/assets/images/error.svg';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    root: {
        padding: 50,
        width: 807,
        height: 625,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center'
    },
    icon: {
        height: 169,
    },
    title: {
        fontSize: 48,
        fontWeight: 700,
    },
    description: {
        fontSize: 38,
        fontWeight: 400,
    },
    actions: {
        '& > .button': {
            fontSize: 24,
        },
        display: 'grid',
        columnGap: 15,
        gridAutoFlow: 'column',
        gridAutoColumns: '1fr',
        height: 66,
    },
});

function ModalWindow({ title, description, children }) {
    const classes = useStyles();

    return (
        <Portal>
            <Paper className={classes.root}>
                <img className={classes.icon} src={imgError} />
                <div className={classes.title}>{title}</div>
                <div className={classes.description}>{description}</div>
                <div className={classes.actions}>{children}</div>
            </Paper>
        </Portal>
    )
}

export default ModalWindow;