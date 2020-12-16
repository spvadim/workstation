import React from 'react';
import { createUseStyles } from 'react-jss';
import { borderRadius, color as themeColor } from 'src/theme';

const useStyles = createUseStyles({
    root: ({ color }) => ({
        fontSize: 18,
        fontFamily: 'Gilroy',
        borderRadius: borderRadius.normal,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: themeColor.black,
        minHeight: 48,
        paddingLeft: 17,
        paddingRight: 17,
        outline: 'none',
        cursor: 'pointer',
        ...color === 'yellow' && { backgroundColor: themeColor.yellow },
        ...color === 'black' && { backgroundColor: themeColor.back }
    }),
});

const Button = React.memo(({ className, color, ...restProps }) => {
    const classes = useStyles({ color });
    const _className = React.useMemo(() => ['button', classes.root, className].join(' '), [className]);
    return <button className={_className} {...restProps} />
});

export default Button;