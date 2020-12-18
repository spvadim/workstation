import React from 'react';
import { Scrollbars as ScrollbarsBase } from 'react-custom-scrollbars';
import { createUseStyles } from 'react-jss';
import { color } from 'src/theme';

const useStyles = createUseStyles({
    thumb: {
        borderWidth: 1,
        borderRadius: 3,
        borderStyle: 'solid',
        backgroundColor: color.yellow,
        boxSizing: 'border-box',
    },
    thumbVertical: {
        height: '21px !important',
        width: '5px !important',
    },
    trackVertical: {
        '&::after': {
            content: '""',
            backgroundColor: color.trackGrey,
            left: 2,
            position: 'absolute',
            width: 1,
            zIndex: -1,
            height: '100%',
            top: 0,
        },
        height: '100%',
        top: 0,
        right: 0,
        width: '5px !important',
    },
});

function Scrollbars(props) {
    const classes = useStyles();

    return (
        <ScrollbarsBase
            renderThumbVertical={thumbProps => (
                <div className={[classes.thumb, classes.thumbVertical].join(' ')} {...thumbProps} />
            )}
            renderThumbHorizontal={thumbProps => <div />}
            renderTrackVertical={trackProps => (
                <div className={['scrollbars_track-vertical', classes.trackVertical].join(' ')} {...trackProps} />
            )}
            thumbSize={21}
            {...props}
        />
    );
}

export default Scrollbars;