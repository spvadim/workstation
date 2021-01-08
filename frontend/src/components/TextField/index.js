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

function TextField({ className, outlined, forceFocus, hidden, ...restProps }) {
    const classes = useStyles({ outlined });
    const ref = React.useRef(null);


    React.useEffect(() => {
        if (!forceFocus || !ref.current) {
            return
        }
        const interval = setInterval(() => {
            if (document.activeElement.tagName !== 'INPUT') {
                ref.current.focus();
            }
            if (['checkbox', 'button', 'radio'].includes(document.activeElement.type)) {
                ref.current.focus();
            }
        }, 300);
        return () => clearInterval(interval);
    }, [forceFocus, ref.current]);

    return <input ref={ref} className={['text-field', classes.root, className].join(' ')} style={hidden ? {opacity: 0} : null} {...restProps} />
}

export default TextField