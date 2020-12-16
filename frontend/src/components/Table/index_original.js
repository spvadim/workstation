import React from "react";
import { createUseStyles } from "react-jss";
import { borderRadius, color } from "src/theme";
import { Scrollbars } from 'src/components';
import imgTrash from "src/assets/images/trash.svg";
import imgEdit from "src/assets/images/edit.svg";

const spacing = 12;
const headHeight = 21;

const useStyles = createUseStyles({
    root: {
        '&::-webkit-scrollbar': {
            // display: 'none',
        },
        '& .scrollbars_track-vertical': {
            height: `calc(100% - ${spacing}px)`,
        },
        height: '100%',
        position: 'relative',
    },
    table: {
        borderSpacing: `0 ${spacing}px`,
        width: '100%',
        marginTop: -spacing,
    },
    head: {
        display: 'flex',
        fontWeight: 400,
        fontSize: 18,
        paddingLeft: 12,
    },
    body: {
        '& > tr > td:last-child': {
            borderTopRightRadius: borderRadius.normal,
            borderBottomRightRadius: borderRadius.normal,
        },
        '& > tr > td:first-child': {
            borderTopLeftRadius: borderRadius.normal,
            borderBottomLeftRadius: borderRadius.normal,
        },
        '& > tr > td:not(:last-child)': {
            borderRightStyle: 'none',
        },
        '& > tr > td': {
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: color.borderGrey,
            backgroundColor: '#FFF',
            height: 52,
            paddingLeft: 12,
            paddingRight: 12,
            fontSize: 14,
        },
    },
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

function Table({ rows, columns, className, buttonEdit, buttonDelete, onEdit, onDelete }) {
    const columnNames = React.useMemo(() => columns.map(({ name }) => name), [columns]);
    const classes = useStyles();
    const headRef = React.useRef(null);
    const bodyRef = React.useRef(null);

    React.useEffect(() => {
        if (!bodyRef.current) {
            return;
        }
        const tr = bodyRef.current.children[0];

        if (!tr) {
            return;
        }
        Array.from(headRef.current.children).forEach((headCell, index) => {
            headCell.style.width = tr.children[index].clientWidth + 'px';
        });
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
            <div style={{ height: `calc(100% - ${(2 * spacing) + headHeight}px)` }}>
                <Scrollbars>
                    <table className={classes.table}>
                        <tbody className={classes.body} ref={bodyRef}>
                            {
                                rows.map((row, index) => (
                                    <tr key={index}>
                                        {
                                            columnNames.map(name => (
                                                <td key={name}>{row[name]}</td>
                                            ))
                                        }
                                        {
                                            buttonEdit && <td className={classes.editCell} onClick={() => onEdit && onEdit(row)} />
                                        }
                                        {
                                            buttonDelete && <td className={classes.deleteCell} onClick={() => onDelete && onDelete(row)} />
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Scrollbars>
            </div>
        </div>
    )
}

export default Table;