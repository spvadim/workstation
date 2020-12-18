import React from "react";
import { createUseStyles } from "react-jss";
import { borderRadius, color } from "src/theme";
import { Scrollbars } from 'src/components';
import imgTrash from "src/assets/images/trash.svg";
import imgEdit from "src/assets/images/edit.svg";

const spacing = 12;
const headHeight = 50;

const getColumnTemplate = ({ columns, buttonEdit, buttonDelete }) => {
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
}

const useStyles = createUseStyles({
    root: {
        height: '100%',
        position: 'relative',
    },
    table: {
        height: `calc(100% - ${(2 * spacing) + headHeight + 5}px)`,
    },
    head: ({ columns, buttonEdit, buttonDelete }) => ({
        display: 'grid',
        gridTemplateColumns: getColumnTemplate({ columns, buttonEdit, buttonDelete }),
        alignItems: 'center',
        height: 50,
        fontWeight: 400,
        fontSize: 18,
        paddingLeft: 12,
    }),
    body: ({ columns, buttonEdit, buttonDelete }) => ({
        '& > div': {
            display: 'grid',
            gridTemplateColumns: getColumnTemplate({ columns, buttonEdit, buttonDelete }),
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

function Table({
    rows, columns, className, buttonEdit, buttonDelete, onEdit, onDelete, hideTracksWhenNotNeeded
}) {
    const headRef = React.useRef(null);
    const bodyRef = React.useRef(null);

    const classes = useStyles({ columns, buttonEdit, buttonDelete });

    return (
        <div className={['table', classes.root, className].join(' ')}>
            <div className={classes.head} ref={headRef}>
                {
                    columns.map(column => (
                        <div key={column.name}>{column.title}</div>
                    ))
                }
            </div>
            <div className={classes.table}>
                <Scrollbars hideTracksWhenNotNeeded={hideTracksWhenNotNeeded}>
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