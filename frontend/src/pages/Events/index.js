import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { createUseStyles } from 'react-jss';
import address from "../../address.js";
import Table from '../../components/Table/index.js';
import TableAddress from "../../components/Table/TableAddress.js";
import Select from "../../components/Select/index.js";
import { resetWarningCache } from "prop-types";
import { Redirect } from "react-router-dom";
import { Button } from "src/components";

const useStyles = createUseStyles({
    tableContainer: {
        maxWidth: "70%",
        margin: "0 auto",
        height: '85%',
        flexGrow: 1,
    },

    container: {
        margin: "0 auto",
        height: "100%",
        position: 'relative',
    },

    filterContainer: {
        width: "70%",
        paddingTop: "1em",
        marginBottom: "1em",
        margin: "0 auto",
        display: 'flex',
        alignItems: "center",
        gap: "2em",
    },

    label: {
        marginBottom: 5,
    },

    dateContainer: {
        display: 'flex',
        flexDirection: 'column',
        "& input": {
            fontSize: "x-large",
        },
    },

    pageContainer: {
        display: 'flex',
        listStyle: 'none',
        width: "100%",
        alignItems: "center",
        gap: "1rem",
        "& li": {
            width: 32,
            display: "flex",
            flexDirection: 'column-reverse',
            alignItems: 'center',
            height: 32,
            textAlign: 'center',
            backgroundColor: "white",
            borderRadius: 7,
            border: "1px solid"
        },
        "& li:hover": {
            cursor: 'pointer',
        },
    },
});

const tableProps = () => ({
    columns: 
        [
            { name: "time", title: "Время", width: "10%" },
            { name: "time_on_video", title: "Время на видео", width: "10%" },
            { name: "message", title: "Сообщение" },
            { name: "event_type", title: "Тип ошибки", width: "15%" },
            { name: "processed", title: "Видимость", width: "10%" },
            { name: "camera_number", title: "Номер камеры", width: '5%' },
        ]
})

function Events() {
    const classes = useStyles();
    const date_ = new Date();

    const [redirectPage, setRedirectPage] = useState();

    const [page, setPage] = useState(1);
    const [typeError, setTypeError] = useState("none");
    const [processed, setProcessed] = useState("none");
    const [date, setDate] = useState(date_.getFullYear() + "-" + ((date_.getMonth() + 1).toString().length === 1 ? "0" + (date_.getMonth() + 1) : 
                                        (date_.getMonth() + 1)) + "-" + (date_.getDate().toString().length === 1 ? "0" + date_.getDate() : date_.getDate()));
    const [tableData, setTableData] = useState([]);
    const [eventsCount, setEventsCount] = useState(null);

    const perPage = 30;

    let reqAddress ="/api/v1_0/events?" + `skip=${perPage * (page-1)}&` +
                                          `limit=${perPage * page}&`
                                    
    if (typeError !== "none") reqAddress += `event_type=${typeError}&` 
    if (processed !== "none") reqAddress += `processed=${processed}&`
    if (date !== "none") reqAddress += `events_begin=${date + "T00:00:00"}&` +
                                       `events_end=${date + "T23:59:59"}&`

    const tableRef = useRef(null);

    const generatePages = () => {
        let pages = Math.ceil(eventsCount / perPage);
        let pagesArray = [];

        for (let i = 1; i <= pages; i++) {
            pagesArray.push((
                <li style={i === page ? {backgroundColor: "#f4f665"} : null}
                    onClick={() => setPage(i)}
                    key={i}>{i}</li>
                    
            ))
        }   

        return pagesArray
    };

    useEffect(() => {
        let request = async () => {
            axios.get(address + reqAddress)
                 .then(res => {
                    if (eventsCount !== res.data.amount) setEventsCount(res.data.amount);
                    if (tableData !== res.data.events) setTableData(res.data.events);
                 })
        };

        request();
        let timer = setInterval(() => {
            request();
        }, 1000)

        return () => clearInterval(timer)
    }, [typeError, processed, date, page])
    
    useEffect(() => {
        tableRef.current.scrollTop = 0;
    }, [typeError, processed, date, page])

    useEffect(() => {
        setPage(1)
    }, [typeError, processed, date])

    if (redirectPage) {
        return (
            <Redirect to="/" />
        );
    }

    return (
        <div className={classes.container}>
            <div className={classes.filterContainer}>
                <Button style={{height: 32}} onClick={() => setRedirectPage("main")} >На главную</Button>
                <Select rows={["none", "desync", "error", "manual_intervention"]}
                        label={"Тип ошибки"}
                        callback={mode => setTypeError(mode)} />
                <Select rows={["none", "true", "false"]}
                        label={"Видимость"}
                        callback={mode => setProcessed(mode)} />
                <div className={classes.dateContainer}>
                    <label className={classes.label}>Дата:</label>
                    <input type="date" value={date.split(" ")[0]} onChange={e => setDate(e.target.value)} />
                </div>
            </div>
            <div className={classes.tableContainer}>
                <Table
                    bodyRef={tableRef}
                    columns={tableProps().columns}
                    rows={tableData}
                />
                <ul className={classes.pageContainer}>
                    {generatePages()}
                </ul>
            </div>
        </div>
    )
}

export default Events;