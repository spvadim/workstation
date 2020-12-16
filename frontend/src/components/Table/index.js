import React from "react";
import { createUseStyles } from "react-jss";
import { borderRadius, color } from "src/theme";
import { Scrollbars } from 'src/components';
import imgTrash from "src/assets/images/trash.svg";
import imgEdit from "src/assets/images/edit.svg";

const spacing = 12;
const headHeight = 50;

const useStyles = createUseStyles({
    root: {
        '& .scrollbars_track-vertical': {
            maxHeight: 488,
        },
        height: '100%',
        position: 'relative',
    },
    table: {
        height: `calc(100% - ${(2 * spacing) + headHeight + 5}px)`,
    },
    head: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        fontWeight: 400,
        fontSize: 18,
        paddingLeft: 12,
    },
    body: ({ columns, buttonEdit, buttonDelete }) => ({
        '& > div': {
            display: 'grid',
            gridTemplateColumns: (() => {
                let template = columns
                    .map(({ width }) => {
                        if (typeof width === 'number') {
                            return width + 'px';
                        }
                        if (typeof width === 'string') {
                            return width;
                        }
                        return '1fr';
                    })
                    .join(' ');

                if (buttonEdit) {
                    template += ' 40px';
                }
                if (buttonDelete) {
                    template += ' 40px';
                }
                return template;
            })(),
        },
        '& > div > div': {
            borderStyle: 'solid',
            borderRightStyle: 'none',
            borderWidth: 1,
            borderColor: color.borderGrey,
            height: 52,
            paddingLeft: 11,
            paddingRight: 11,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFF',
            overflow: 'hidden',
        },
        '& > div > div:first-child': {
            borderTopLeftRadius: borderRadius.normal,
            borderBottomLeftRadius: borderRadius.normal,
        },
        '& > div > div:last-child': {
            borderRightStyle: 'solid',
            borderTopRightRadius: borderRadius.normal,
            borderBottomRightRadius: borderRadius.normal,
        },
        marginRight: 14,
        display: 'grid',
        rowGap: spacing + 'px',
    }),
    editCell: {
        borderLeftStyle: 'none !important',
        backgroundImage: `url(${imgEdit})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 21,
        backgroundPosition: 'center',
        cursor: 'pointer',
    },
    deleteCell: {
        borderLeftStyle: 'none !important',
        backgroundImage: `url(${imgTrash})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 21,
        backgroundPosition: 'center',
        cursor: 'pointer',
    },
})

function resizeHeader(head, body) {
    const row = body.children[0];

    if (!row) {
        return;
    }
    Array.from(head.children).forEach((headCell, index) => {
        headCell.style.width = row.children[index].clientWidth + 'px';
    });
}

function Table({ rows, columns, className, buttonEdit, buttonDelete, onEdit, onDelete }) {
    const headRef = React.useRef(null);
    const bodyRef = React.useRef(null);

    const classes = useStyles({ columns, buttonEdit, buttonDelete });

    React.useEffect(() => {
        if (bodyRef.current) {
            resizeHeader(headRef.current, bodyRef.current);
        }
    }, [bodyRef.current, columns]);

    React.useEffect(() => {
        if (!bodyRef.current) {
            return;
        }
        const listener = () => resizeHeader(headRef.current, bodyRef.current);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [bodyRef.current]);

    return (
        <div className={['table', classes.root, className].join(' ')}>
            <div className={classes.head} style={{ display: 'flex' }} ref={headRef}>
                {
                    !!rows.length && columns.map(column => (
                        <div key={column.name}>{column.title}</div>
                    ))
                }
            </div>
            <div className={classes.table}>
                <Scrollbars>
                    <div className={classes.body} ref={bodyRef}>
                        {
                            rows.map((row, index) => (
                                <div key={index}>
                                    {
                                        columns.map(({ name, Component }) => (
                                            <div key={name}>
                                                {Component ? <Component>{row[name]}</Component> : row[name]}
                                            </div>
                                        ))
                                    }
                                    {
                                        buttonEdit && <div className={classes.editCell} onClick={() => onEdit && onEdit(row)} />
                                    }
                                    {
                                        buttonDelete && <div className={classes.deleteCell} onClick={() => onDelete && onDelete(row)} />
                                    }
                                </div>
                            ))
                        }
                    </div>
                </Scrollbars>
            </div>
        </div>
    )
}

export default Table;