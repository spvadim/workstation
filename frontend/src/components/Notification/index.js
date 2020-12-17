import React from 'react';
import { createUseStyles } from 'react-jss';
import { Paper, Text } from 'src/components';
import imgNotification from 'src/assets/images/notification.svg';
import imgError from 'src/assets/images/error.svg';
import imgCross from 'src/assets/images/cross.svg';

const useStyles = createUseStyles({
    rootNotification: {
        width: 301,
        paddingLeft: 21,
        paddingRight: 21,
    },
    rootNotificationImage: {
        width: 377,
        textAlign: 'center',
        paddingLeft: 21,
        paddingRight: 21,
        display: 'flex',
        flexDirection: 'column',
    },
    rootNotificationError: {
        display: 'flex',
    },
    header: {
        '& > .text': {
            marginLeft: 9,
        },
        display: 'flex',
    },
    description: {
        marginTop: 11,
        fontSize: 18,
    },
    actions: {
        '& > .button': {
            fontSize: 18,
            padding: 14,
        },
        display: 'grid',
        columnGap: 11,
        gridAutoFlow: 'column',
        gridAutoColumns: '1fr',
        marginTop: 11,
        // height: 66,
    },
});

export function Notification({ title, description, error, className, children, onClose, ...restProps }) {
    const classes = useStyles();

    return (
        <Paper className={['notification', classes.rootNotification, className].join(' ')} {...restProps}>
            <div className={classes.header}>
                <img src={error ? imgError : imgNotification} />
                <Text type="title2">{title}</Text>
                {onClose && <img src={imgCross} onClick={onClose} style={{ marginLeft: 'auto' }} />}
            </div>
            <div className={classes.description}>
                {description}
            </div>
            {children && (
                <div className={classes.actions}>{children}</div>
            )}
        </Paper>
    )
}

export function NotificationImage({ title, description, children, className, ...restProps }) {
    const classes = useStyles();

    return (
        <Paper className={['notification-image', classes.rootNotificationImage, className].join(' ')} {...restProps}>
            <Text type="title2">{title}</Text>
            {children}
            <div className={classes.description}>
                {description}
            </div>
        </Paper>
    )
}

// export function NotificationError({ title, description, className, children, ...restProps }) {
//     const classes = useStyles();

//     return (
//         <Paper className={['notification-error', classes.rootNotificationError, className].join(' ')} {...restProps}>
//             <div>
//                 <div className={classes.header}>
//                     <img src={imgError} /><Text type="title2">{title}</Text>
//                 </div>
//                 <div className={classes.description}>
//                     {description}
//                 </div>
//             </div>
//             {children}
//         </Paper>
//     )
// }