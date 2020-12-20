import React from 'react';
import { createUseStyles } from 'react-jss';
import { Paper } from 'src/components';
import imgError from 'src/assets/images/error.svg';
import imgNotification from 'src/assets/images/notification.svg';

const iconHeight = 57;
const verticalPadding = 18;

const useStyles = createUseStyles({
    root: {
        position: 'relative',
        height: (2 * verticalPadding) + iconHeight,
    },
    container: {
        position: 'absolute',
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: 26,
        left: 36,
        bottom: verticalPadding,
    },
    column: {
        display: 'grid',
        rowGap: '6px',
        alignContent: 'flex-end',
    },
    icon: {
        height: iconHeight,
        width: 67,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        cursor: 'pointer',
    }
});

function NotificationPanel({ notifications, errors }) {
    const classes = useStyles();
    return (
        <div className={['notification-panel', classes.root].join(' ')}>
            <div className={classes.container}>
                <div className={classes.column}>
                    {/* <Paper className={classes.icon} style={{ backgroundImage: `url(${imgNotification})` }} /> */}
                    {notifications}
                </div>
                <div className={classes.column}>
                    {/* <Paper className={classes.icon} style={{ backgroundImage: `url(${imgError})` }} /> */}
                    {errors}
                </div>
            </div>
        </div>
    )
}

export default NotificationPanel;