import React from 'react';
import { createUseStyles } from 'react-jss';

const iconHeight = 57;
const verticalPadding = 18;

const useStyles = createUseStyles({
    root: {
        position: 'absolute',
        bottom: "5em",
        zIndex: 2,
        height: (2 * verticalPadding) + iconHeight,
    },
    container: {
        position: 'absolute',
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: 26,
        left: 36,
        bottom: verticalPadding - 12,
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

const NotificationPanel = React.memo(({ notifications, errors, ...restprops }) =>  {
    const classes = useStyles();
    return (
        <div className={['notification-panel', classes.root].join(' ')} {...restprops}>
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
})

export default NotificationPanel;