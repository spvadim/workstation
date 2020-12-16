import React from 'react';
import { createUseStyles } from 'react-jss';
import { borderRadius } from 'src/theme';

const useStyles = createUseStyles({
    root: ({ outlined }) => ({
        ...outlined && {
            borderRadius: borderRadius.normal,
            paddingLeft: 18,
            paddingRight: 18,
        },
        ...!outlined && {
            borderStyle: 'none',
            borderBottomStyle: 'solid',
        },
        fontFamily: 'Gilroy',
        backgroundColor: 'transparent',
        outline: 'none',
        borderWidth: 1,
    }),
})

function TextField({ className, outlined, ...restProps }) {
    const classes = useStyles({ outlined });

    return <input className={['text-field', classes.root, className].join(' ')} {...restProps} />
}

export default TextField