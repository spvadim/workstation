import React from 'react';
import { createUseStyles } from 'react-jss';
import { borderRadius, color } from 'src/theme';

const useStyles = createUseStyles({
    root: ({ theme }) => ({
        ...theme === 'primary' && {
            backgroundColor: color.yellow,
        },
        ...theme === 'secondary' && {
            backgroundColor: color.black,
            color: '#FFF',
        },
        fontSize: 18,
        fontFamily: 'Gilroy',
        fontWeight: 500,
        borderRadius: borderRadius.normal,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: color.black,
        minHeight: 48,
        paddingLeft: 17,
        paddingRight: 17,
        outline: 'none',
        cursor: 'pointer',
    }),
});

const Button = React.memo(({ className, theme, ...restProps }) => {
    const classes = useStyles({ theme: theme ?? 'primary' });
    const _className = React.useMemo(() => ['button', classes.root, className].join(' '), [className]);
    return <button className={_className} {...restProps} />
});

export default Button;