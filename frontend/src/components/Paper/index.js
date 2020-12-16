import React from 'react';
import { createUseStyles } from 'react-jss';
import { borderRadius, color } from 'src/theme';

const useStyles = createUseStyles({
    root: {
        backgroundColor: '#FFF',
        borderRadius: borderRadius.normal,
        borderColor: color.borderGrey,
        borderWidth: 0.3,
        borderStyle: 'solid',
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 12,
        paddingRight: 12,
    },
});

const Paper = React.memo(({className, ...restProps}) => {
    const classes = useStyles();
    const _className = React.useMemo(() => ['paper', classes.root, className].join(' '), [className]);
    return <div className={_className} {...restProps} />
});

export default Paper;