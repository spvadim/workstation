import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    paper: {},
});

const Paper = React.memo(({className, ...restProps}) => {
    const styles = useStyles();
    const _className = React.useMemo(() => [className, styles.paper].join(' '), [className]);
    return <div className={_className} {...restProps} />
});

export default Paper;