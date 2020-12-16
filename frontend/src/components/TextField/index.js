import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    root: ({ outlined }) => ({
        ...!outlined && { 
            borderStyle: 'none',
            borderBottomStyle: 'solid',
            borderWidth: 1,
        },
        outline: 'none',
    }),
})

function TextField({ className, outlined, ...restProps }) {
    const classes = useStyles({ outlined });

    return <input className={['text-field', classes.root, className].join(' ')} {...restProps} />
}

export default TextField