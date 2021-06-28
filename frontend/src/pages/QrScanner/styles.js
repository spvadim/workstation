import { createUseStyles } from 'react-jss';

export const useStyles = createUseStyles({
    container: {
        '& h1, h3': {
            marginLeft: '1rem',
            paddingTop: "1rem",
            marginBlockStart: 0,
            marginBlockEnd: 0,
        }
    },

    table: {
        width: "100%",
    }
});

