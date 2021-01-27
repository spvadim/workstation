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

function TextField({ className, outlined, width, forceFocus, hidden, ...restProps }) {
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

    let style = {
        width: width,
        opacity: 100,
    }

    if (hidden) { style.opacity = 0 }

    return <input ref={ref} className={['text-field', classes.root, className].join(' ')} style={style} {...restProps} />
}

export default TextField