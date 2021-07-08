import React, {useState, useCallback, useEffect} from 'react';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles({
    palletContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: '100%',
        width: '100%',
        padding: '0 10px',
        marginTop: 15,

        '& svg': {
            maxWidth: '100%',
        }
    },
    bigViewContainer: {
        overflow: 'hidden',
        '& g': {
            pointerEvents: 'bounding-box',
            cursor: 'pointer'
        },
    },
});

function chunk(items, size) {
    const result = []
    let group = []

    items.forEach((item, i) => {
        group.push(item)
        if ((i + 1) % 4 === 0) {
            result.push(group)
            group = []
        }
    })

    return result
}

function addEmptyItems(items, n, addItem) {
    while (items.length < n) {
        items.push(addItem)
    }

    return items
}

const Control = React.memo(({item, x = 0, y = 0, viewBox, onRemove, onAdd, onDel, onEdit}) => {
    return <svg fill={'none'} {...{x, y, viewBox}}>
        {!item && <g>
            {onAdd && <g onClick={onAdd}><image transform={'scale(0.14) translate(30)'} href={'add.svg'} /></g>}
            {onRemove && <g onClick={onRemove}><image transform={'scale(0.14) translate(100)'} href={'remove.svg'} /></g>}
        </g>}

        {item && <g>
            {onEdit && <g onClick={onEdit}><image transform={'scale(0.14)'} href={'edit.svg'} /></g>}
            {onDel && <g onClick={onDel}><image transform={'scale(0.14) translate(65)'} href={'del.svg'} /></g>}
            {onRemove && <g onClick={onRemove}><image transform={'scale(0.14) translate(130)'} href={'remove.svg'} /></g>}
        </g>}
    </svg>
});

const PackBlock = React.memo(({extended, isShortPacks, pack, bigView, onDel, onEdit, onAdd, x = 0, y = 0, controlKey, control, selected}) => {
    const isSelected = selected === controlKey
    const strokeWidth = bigView ? 1: 1;
    let strokeOpacity = 1;
    let fillFront = '#AFAFAF';
    let fillBack = '#E2E2E2';
    let stroke = '#A6A5A5';

    if (!pack && !bigView) {
        return null
    }

    if (!pack && bigView) {
        fillFront = 'none'
        fillBack = 'none'
        stroke = '#0057FF'
        strokeOpacity = isSelected ? 1 : 0.3
    }

    if (pack && pack.to_process) {
        fillFront = '#b22f2f';
        fillBack = '#CC3333';
    }

    if (pack && isSelected) {
        fillFront = '#F7CE55';
        fillBack = '#F7EE55';
    }

    return <svg {...{x, y}} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g
            onClick={() => {
                if (!bigView) return;
                control(controlKey, (<svg {...{x, y}}><Control
                    item={pack}
                    x={isShortPacks ? 50 : 180}
                    y={-19}
                    viewBox="0 0 165 44"
                    onRemove={() => {control(controlKey)}}
                    onDel={onDel && (() => {onDel(pack.id); control(controlKey)})}
                    onEdit={onEdit && (() => {onEdit(pack.id); control(controlKey)})}
                    onAdd={onAdd && (() => {onAdd(); control(controlKey)})}
                /></svg>))
            }}
        >
            {!isShortPacks && <g>
                <path {...{strokeWidth, strokeOpacity}} d="M44 1H556V86.3L512.5 112.3H0.5V27L44 1Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M256.5 27H0.5V112.3H512.5V27Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M256.5 27H0.5V112.3H512.5V27Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M0.5 27L44 1H556V86.3L512.5 112.3" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M556 1L512.5 27" stroke={stroke} strokeMiterlimit="10" />
            </g>}
            {isShortPacks && <g>
                <path {...{strokeWidth, strokeOpacity}} d="M44 1H300V86.3L256.5 112.3H0.5V27L44 1Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M256.5 27H0.5V112.3H256.5V27Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M256.5 27H0.5V112.3H256.5V27Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M0.5 27L44 1H300V86.3L256.5 112.3" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M300 1L256.5 27" stroke={stroke} strokeMiterlimit="10" />
            </g>}

            {bigView && pack && <g>
                <text x={5} y={107} fontFamily="sans-serif" fontSize="18" fill="black">{pack.qr}</text>
                {extended && <text x={5} y={45} fontFamily="sans-serif" fontSize="18" fill="black">{pack.id}</text>}
            </g>}
        </g>
    </svg>
});

const PacksOnPintset = React.memo(({extended, isShortPacks, packsTop, packsBottom, bigView = false, onDel, onEdit, onAdd}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    const [selected, setSelected] = useState(false)
    const [control, setControl] = useState(null)
    const select = useCallback((key, elem) => {
        setControl(selected === key ? null : elem)
        setSelected((selected === key || !elem) ? false : key)
    }, [setControl, setSelected, selected])

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 1000 600'} fill={'none'} transform={bigView ? '' : 'scale(1.3) translate(0, -15)'} >
            {bigView && packsTop.slice(isShortPacks ? 2 : 1).map((pack, i) => {
                return <PackBlock key={pack.id} controlKey={`top_overlimit_${i}`} x={770} y={240 - (85 * i)} pack={pack} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
            })}

            {isShortPacks && <PackBlock controlKey={'top_1'} x={200} y={240} pack={packsTop[1]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />}
            <PackBlock controlKey={'top_2'} x={isShortPacks ? 455 : 200} y={240} pack={packsTop[0]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />

            {bigView && packsBottom.slice(isShortPacks ? 2 : 1).map((pack, i) => {
                return <PackBlock key={pack.id} controlKey={`bottom_overlimit_${i}`} x={isShortPacks ? -110 : -380} y={380 - (85 * i)} pack={pack} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
            })}

            {isShortPacks && <PackBlock controlKey={'bottom_1'} x={200} y={380} pack={packsBottom[1]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />}
            <PackBlock controlKey={'bottom_2'} x={isShortPacks ? 455 : 200} y={380} pack={packsBottom[0]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />

            {bigView && <g transform={'translate(0, -100)'}>{control}</g>}
        </svg>
    </div>
});

const PacksOnAssemble = React.memo(({extended, isShortPacks, packs, bigView = false, onDel, onEdit, onAdd}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    const packs2 = addEmptyItems(packs.slice(), 12)

    const [selected, setSelected] = useState(false)
    const [control, setControl] = useState(null)
    const select = useCallback((key, elem) => {
        setControl(selected === key ? null : elem)
        setSelected((selected === key || !elem) ? false : key)
    }, [setControl, setSelected, selected])

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 1000 400'} fill={'none'} transform={bigView ? 'scale(0.7) translate(0, -30)' : 'scale(1.3) translate(10, -10)'}>
            {chunk(packs2, isShortPacks ? 4 : 2).map((group, i) => {
                if (isShortPacks) {
                    return <g key={group.map(item => item && item.id).join(' ')}>
                        <PackBlock controlKey={`${i}_1`} x={680} y={214 - (i * 85)} pack={group[0]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected, onAdd}} />
                        <PackBlock controlKey={`${i}_2`} x={308} y={214 - (i * 85)} pack={group[1]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected, onAdd}} />
                        <PackBlock controlKey={`${i}_3`} x={520} y={240 - (i * 85)} pack={group[2]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected, onAdd}} />
                        <PackBlock controlKey={`${i}_4`} x={108} y={240 - (i * 85)} pack={group[3]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected, onAdd}} />
                    </g>
                }

                return <g key={group.map(item => item && item.id).join(' ')}>
                    <PackBlock controlKey={`${i}_1`} x={308} y={214 - (i * 85)} pack={group[0]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected, onAdd}} />
                    <PackBlock controlKey={`${i}_2`} x={108} y={240 - (i * 85)} pack={group[1]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected, onAdd}} />
                </g>
            })}

            {bigView && control}
        </svg>
    </div>
});

const PalletBlock = React.memo(({extended, isShortPacks, pallet, bigView, onDel, onEdit, onAdd, x = 0, y = 0, controlKey, control, selected, showStatus}) => {
    const isSelected = selected === controlKey
    const strokeWidth = bigView ? 0.2: 1;
    let strokeOpacity = 1;
    let fillFront = '#AFAFAF';
    let fillBack = '#E2E2E2';
    let stroke = '#A6A5A5';

    if (!pallet && !bigView) {
        return null
    }

    if (!pallet && bigView) {
        fillFront = 'none'
        fillBack = 'none'
        stroke = '#0057FF'
        strokeOpacity = isSelected ? 1 : 0.3
    }

    if (pallet && pallet.to_process) {
        fillFront = '#b22f2f';
        fillBack = '#CC3333';
    }

    if (pallet && isSelected) {
        fillFront = '#F7CE55';
        fillBack = '#F7EE55';
    }

    return <svg {...{x, y}} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g
            onClick={() => {
                if (!bigView) return;
                control(controlKey, (<svg {...{x, y}}><Control
                    item={pallet}
                    x={isShortPacks ? 112 : 128}
                    y={52}
                    onRemove={() => {control(controlKey)}}
                    onDel={onDel && (() => {onDel(pallet.id); control(controlKey)})}
                    onEdit={onEdit && (() => {onEdit(pallet); control(controlKey)})}
                    onAdd={onAdd && (() => {onAdd(); control(controlKey)})}
                /></svg>))
            }}
        >
            {!isShortPacks && <g>
                <path {...{strokeWidth, strokeOpacity}} d="M119.814 53.7666H183.983V64.4854L178.517 67.7526H114.348V57.0338L119.814 53.7666Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M178.517 57.033H114.348V67.7518H178.517V57.033Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M178.517 57.033H114.348V67.7518H178.517V57.033Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.348 57.0338L119.814 53.7666H183.983V64.4854L178.517 67.7526" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M183.983 53.7659L178.517 57.033" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.285 57.0332H178.454V67.752L172.987 71.0192H108.818V60.3004L114.285 57.0332Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M172.987 60.3H108.818V71.0189H172.987V60.3Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M172.987 60.3H108.818V71.0189H172.987V60.3Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M108.818 60.3004L114.285 57.0332H178.454V67.752L172.987 71.0192" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M178.454 57.033L172.987 60.3001" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M119.814 43.3359H183.983V54.0548L178.517 57.3219H114.348V46.6031L119.814 43.3359Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M178.517 46.603H114.348V57.3219H178.517V46.603Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M178.517 46.603H114.348V57.3219H178.517V46.603Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.348 46.6031L119.814 43.3359H183.983V54.0548L178.517 57.3219" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M183.983 43.3359L178.517 46.6031" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.285 46.603H178.454V57.3219L172.987 60.589H108.818V49.8702L114.285 46.603Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M172.987 49.8704H108.818V60.5892H172.987V49.8704Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M172.987 49.8704H108.818V60.5892H172.987V49.8704Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M108.818 49.8702L114.285 46.603H178.454V57.3219L172.987 60.589" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M178.454 46.603L172.987 49.8702" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M119.814 32.6553H183.983V43.3741L178.517 46.6413H114.348V35.9224L119.814 32.6553Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M178.517 35.9219H114.348V46.6407H178.517V35.9219Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M178.517 35.9219H114.348V46.6407H178.517V35.9219Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.348 35.9224L119.814 32.6553H183.983V43.3741L178.517 46.6413" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M183.983 32.6548L178.517 35.922" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.285 35.9219H178.454V46.6407L172.987 49.9079H108.818V39.189L114.285 35.9219Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M172.987 39.1887H108.818V49.9075H172.987V39.1887Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M172.987 39.1887H108.818V49.9075H172.987V39.1887Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M108.819 39.189L114.286 35.9219H178.455V46.6407L172.988 49.9079" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M178.454 35.9216L172.987 39.1888" stroke={stroke} strokeMiterlimit="10" />
            </g>}
            {isShortPacks && <g>
                <path {...{strokeWidth, strokeOpacity}} d="M119.814 53.7666H151.983V64.4854L146.517 67.7526H114.348V57.0338L119.814 53.7666Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M146.517 57.033H114.348V67.7518H146.517V57.033Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M146.517 57.033H114.348V67.7518H146.517V57.033Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.348 57.0338L119.814 53.7666H151.983V64.4854L146.517 67.7526" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M151.983 53.7659L146.517 57.033" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.285 57.0332H146.454V67.752L140.987 71.0192H108.818V60.3004L114.285 57.0332Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M140.987 60.3H108.818V71.0189H140.987V60.3Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M140.987 60.3H108.818V71.0189H140.987V60.3Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M108.818 60.3004L114.285 57.0332H146.454V67.752L140.987 71.0192" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M146.454 57.033L140.987 60.3001" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M119.814 43.3359H151.983V54.0548L146.517 57.3219H114.348V46.6031L119.814 43.3359Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M146.517 46.603H114.348V57.3219H146.517V46.603Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M146.517 46.603H114.348V57.3219H146.517V46.603Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.348 46.6031L119.814 43.3359H151.983V54.0548L146.517 57.3219" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M151.983 43.3359L146.517 46.6031" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.285 46.603H146.454V57.3219L140.987 60.589H108.818V49.8702L114.285 46.603Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M140.987 49.8704H108.818V60.5892H140.987V49.8704Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M140.987 49.8704H108.818V60.5892H140.987V49.8704Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M108.818 49.8702L114.285 46.603H146.454V57.3219L140.987 60.589" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M146.454 46.603L140.987 49.8702" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M119.814 32.6553H151.983V43.3741L146.517 46.6413H114.348V35.9224L119.814 32.6553Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M146.517 35.9219H114.348V46.6407H146.517V35.9219Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M146.517 35.9219H114.348V46.6407H146.517V35.9219Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.348 35.9224L119.814 32.6553H151.983V43.3741L146.517 46.6413" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M151.983 32.6548L146.517 35.922" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M114.285 35.9219H146.454V46.6407L140.987 49.9079H108.818V39.189L114.285 35.9219Z" fill={fillFront} />
                <path {...{strokeWidth, strokeOpacity}} d="M140.987 39.1887H108.818V49.9075H140.987V39.1887Z" fill={fillBack} />
                <path {...{strokeWidth, strokeOpacity}} d="M140.987 39.1887H108.818V49.9075H140.987V39.1887Z" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M108.819 39.189L114.286 35.9219H146.455V46.6407L140.988 49.9079" stroke={stroke} strokeMiterlimit="10" />
                <path {...{strokeWidth, strokeOpacity}} d="M146.454 35.9216L140.987 39.1888" stroke={stroke} strokeMiterlimit="10" />
            </g>}

            {bigView && pallet && <svg x={110} y={0}>
                <text y={42} fontFamily="sans-serif" fontSize="2.3" fill="black">{pallet.qr}</text>
                {showStatus && <text y={49} fontFamily="sans-serif" fontSize="2.3" fill="black">{pallet.status}</text>}
                {extended && <text y={70} fontFamily="sans-serif" fontSize="2.3" fill="black">{pallet.id}</text>}
            </svg>}
        </g>
    </svg>
})

const PalletOnWinder = React.memo(({extended, isShortPacks, pallets, bigView = false, onDel, onEdit, onAdd}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    const pallets2 = addEmptyItems(pallets.slice(), pallets.length + 1)

    let scale = 7 / (isShortPacks ? pallets2.length : pallets2.length * 2)
    if (scale > 1.5) {
        scale = 1.5
    }
    let translateY = Math.round(40 / scale)

    const [selected, setSelected] = useState(false)
    const [control, setControl] = useState(null)
    const select = useCallback((key, elem) => {
        setControl(selected === key ? null : elem)
        setSelected((selected === key || !elem) ? false : key)
    }, [setControl, setSelected, selected])

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 400 80' } fill={'none'} transform={bigView ? `translate(0, ${translateY})` : `scale(2.5)`}>
            <g transform={`scale(${scale})`}>
                {pallets2.reverse().map((pallet, m) => {
                    const n = isShortPacks ? m : m * 2

                    return <PalletBlock
                        key={pallet ? pallet.id : 'empty'}
                        controlKey={`${m}`}
                        x={-60 + (40 * n)}
                        y={-20}
                        pallet={pallet}
                        showStatus
                        {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}}
                    />
                })}

                {bigView && control}
            </g>
        </svg>
    </div>
});

const PalletOnFork = React.memo(({extended, isShortPacks, pallets, onDel, onEdit, onAdd, bigView = false}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    const [selected, setSelected] = useState(false)
    const [control, setControl] = useState(null)
    const select = useCallback((key, elem) => {
        setControl(selected === key ? null : elem)
        setSelected((selected === key || !elem) ? false : key)
    }, [setControl, setSelected, selected])

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 400 80'} fill={'none'} transform={bigView ? 'scale(1.7) translate(0, -30)' : 'scale(5) translate(0, -5)'} >
            {bigView && pallets.slice(isShortPacks ? 2 : 1).map((pallet, i) => {
                return <PalletBlock key={pallet.id} controlKey={`overlimit_${i}`} x={isShortPacks ? 10 : -10} y={0 - (32 * i)} pallet={pallet} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />
            })}

            {bigView && pallets.length === (isShortPacks ? 2 : 1) && <PalletBlock controlKey={`overlimit_${0}`} x={isShortPacks ? 10 : -10} y={0} pallet={null} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />}

            {isShortPacks && <PalletBlock controlKey={'1'} x={isShortPacks ? 48 : -12} pallet={pallets[1]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />}
            <PalletBlock controlKey={'2'} x={isShortPacks ? 80 : 60} pallet={pallets[0]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />

            {bigView && control}
        </svg>
    </div>
})

const PalletOnPackingTable = React.memo(({extended, isShortPacks, pallets, onDel, onEdit, onAdd, bigView = false}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    const [selected, setSelected] = useState(false)
    const [control, setControl] = useState(null)
    const select = useCallback((key, elem) => {
        setControl(selected === key ? null : elem)
        setSelected((selected === key || !elem) ? false : key)
    }, [setControl, setSelected, selected])

    if (isShortPacks) {
        return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
            <svg width={width} height={height} viewBox={'0 0 400 80'} fill={'none'} transform={bigView ? 'scale(1.4)' : 'scale(3) translate(-10)'}>
                {bigView && pallets.slice(8).map((pallet, i) => {
                    return <PalletBlock key={pallet.id} controlKey={`overlimit_${i}`} x={0} y={7 - (32 * i)} pallet={pallet} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                })}

                <PalletBlock controlKey={'1'} x={50} y={7} pallet={pallets[5]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />
                <PalletBlock controlKey={'2'} x={50} y={-25} pallet={pallets[7]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />

                <PalletBlock controlKey={'3'} x={93} pallet={pallets[4]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />
                <PalletBlock controlKey={'4'} x={93} y={-32} pallet={pallets[6]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />

                <PalletBlock controlKey={'5'} x={114} y={7} pallet={pallets[1]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />
                <PalletBlock controlKey={'6'} x={114} y={-25} pallet={pallets[3]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />

                <PalletBlock controlKey={'7'} x={157} pallet={pallets[0]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />
                <PalletBlock controlKey={'8'} x={157} y={-32} pallet={pallets[2]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />

                {bigView && control}
            </svg>
        </div>
    }

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 400 80'} fill={'none'} transform={bigView ? 'scale(1.4)' : 'scale(3) translate(-5)'}>
            {bigView && pallets.slice(4).map((pallet, i) => {
                return <PalletBlock key={pallet.id} controlKey={`overlimit_${i}`} x={-30} y={7 - (32 * i)} pallet={pallet} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
            })}

            <PalletBlock controlKey={'1'} x={83} y={0} pallet={pallets[0]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />
            <PalletBlock controlKey={'2'} x={83} y={-32} pallet={pallets[1]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />

            <PalletBlock controlKey={'3'} x={50} y={7} pallet={pallets[2]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />
            <PalletBlock controlKey={'4'} x={50} y={-25} pallet={pallets[3]} {...{bigView, isShortPacks, onDel, onEdit, onAdd, control: select, extended, selected}} />

            {bigView && <g transform={'translate='}>{control}</g>}
        </svg>
    </div>
})

export {
    PacksOnPintset,
    PacksOnAssemble,
    PalletOnWinder,
    PalletOnFork,
    PalletOnPackingTable,
}
