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
        height: '100%',
        position: 'relative',
    },
    table: {
        borderSpacing: `0 ${spacing}px`,
        width: '100%',
    },
    head: {
        display: 'flex',
        fontWeight: 400,
        fontSize: 18,
        paddingLeft: 12,
    },
    body: ({ columnAmount, buttonEdit, buttonDelete }) => ({
        ...(buttonEdit && buttonDelete) && {
            [`& > div:nth-child(${columnAmount}n - 1)`]: {
                // borderTopLeftRadius: borderRadius.normal,
                // borderBottomLeftRadius: borderRadius.normal,
            },
        },
        ...(buttonEdit || buttonDelete) && {
            [`& > div:nth-child(${columnAmount}n - 0)`]: {
                // borderTopLeftRadius: borderRadius.normal,
                // borderBottomLeftRadius: borderRadius.normal,
            },
        },
        [`& > div:nth-child(${columnAmount}n + 1)`]: {
            borderTopLeftRadius: borderRadius.normal,
            borderBottomLeftRadius: borderRadius.normal,
        },
        [`& > div:nth-child(${columnAmount}n)`]: {
            borderTopRightRadius: borderRadius.normal,
            borderBottomRightRadius: borderRadius.normal,
        },
        '& > div': {
            borderStyle: 'solid',
            borderRightStyle: 'none',
            borderWidth: 1,
            borderColor: color.borderGrey,
            backgroundColor: '#FFF',
            height: 52,
            paddingLeft: 12,
            paddingRight: 12,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
        },
        display: 'grid',
        gridTemplateColumns: `repeat(${columnAmount}, auto)`,
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

function Table({ rows, columns, className, buttonEdit, buttonDelete, onEdit, onDelete }) {
    const columnNames = React.useMemo(() => columns.map(({ name }) => name), [columns]);
    const headRef = React.useRef(null);
    const bodyRef = React.useRef(null);

    const columnAmount = React.useMemo(() => {
        let amount = columnNames.length;

        if (buttonEdit) {
            amount += 1;
        }
        if (buttonDelete) {
            amount += 1;
        }
        return amount;
    }, [columnNames]);

    const classes = useStyles({ columnAmount, buttonEdit, buttonDelete });

    React.useEffect(() => {
        if (!bodyRef.current) {
            return;
        }
        const bodyCells = bodyRef.current.children;

        if (!bodyCells.length) {
            return;
        }
        Array.from(headRef.current.children).forEach((headCell, index) => {
            headCell.style.width = bodyCells[index].clientWidth + 'px';
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
                    <div className={classes.body} ref={bodyRef}>
                        {
                            rows.map((row, index) => (
                                <React.Fragment key={index}>
                                    {
                                        columnNames.map(name => (
                                            <div key={name}>{row[name]}</div>
                                        ))
                                    }
                                    {
                                        buttonEdit && <div className={classes.editCell} onClick={() => onEdit && onEdit(row)} />
                                    }
                                    {
                                        buttonDelete && <div className={classes.deleteCell} onClick={() => onDelete && onDelete(row)} />
                                    }
                                </React.Fragment>
                            ))
                        }
                    </div>
                </Scrollbars>
            </div>
        </div>
    )
}

export default Table;