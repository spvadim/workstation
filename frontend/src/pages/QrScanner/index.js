import React, {useEffect, useMemo, useRef, useState} from 'react';
// import address from '../../address.js';
import { useStyles } from "./styles";
import Table_new from '../../components/Table_new';

import { BrowserQRCodeReader } from '@zxing/library';

function Scanner() {
    const classes = useStyles();
    const [videoStream, setVideoStream] = useState();
    const [qrList, setQrList] = useState([]);

    const rows = useMemo(() => {
        return qrList.map((qr, i) => ({index: i+1, qr: qr, id: qr + "_key"}))
    }, [qrList]);

    const resultRef = useRef(null);

    useEffect(() => {
        let active = true;
        get();
        return () => { active = false }

        async function get() { // Получение видео потока с камеры после разрешения пользователя
            const res = await navigator.mediaDevices.getUserMedia({video: true});
            if (!active) { return }
            setVideoStream(res);
        }
    }, [])

    useEffect(() => {
        if (!videoStream || !resultRef) return

        const codeReader = new BrowserQRCodeReader(1000);
        const getResult = (result) => {
            // resultRef.current.textContent = `result: ${result}`
            if (result) setQrList(prev => {
                if (prev.indexOf(result.text) !== -1) return prev // Во избежание одинаковых значений

                let temp = prev.slice();
                temp.push(result.text);
                return temp
            })
        }

        codeReader
            .decodeFromStream(videoStream, 'scan-stream', getResult)
            .catch(e => console.log(e))

    }, [videoStream, resultRef])

    console.log("rows: ", rows)

    return (
        <div className={classes.container}>
            <h1>Сканер QR</h1>
            <h3>Поочередно отсканируйте пачки</h3>

            <video style={{width: "100%"}} id="scan-stream" />
            <p ref={resultRef} />

            <Table_new
                columns={[
                    {name: "index", title: "№", width: 64},
                    {name: "qr", title: "QR",}
                ]}
                className={classes.table}
                rows={rows}

            />
        </div>
    )
}

export default Scanner;