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
            <g onClick={onAdd}><image transform={'scale(0.14) translate(30)'} href={'add.svg'} /></g>
            <g onClick={onRemove}><image transform={'scale(0.14) translate(100)'} href={'remove.svg'} /></g>
        </g>}

        {item && <g>
            <g onClick={onEdit}><image transform={'scale(0.14)'} href={'edit.svg'} /></g>
            <g onClick={onDel}><image transform={'scale(0.14) translate(65)'} href={'del.svg'} /></g>
            <g onClick={onRemove}><image transform={'scale(0.14) translate(130)'} href={'remove.svg'} /></g>
        </g>}
    </svg>
});

const PackBlock = React.memo(({extended, isShortPacks, pack, bigView, onDel, onEdit, x = 0, y = 0, controlKey, control, selected}) => {
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
                    x={isShortPacks ? 50 : 150}
                    y={-19}
                    viewBox="0 0 165 44"
                    onRemove={() => {control(controlKey)}}
                    onDel={() => {onDel(pack.id); control(controlKey)}}
                    onEdit={() => {onEdit(pack.id); control(controlKey)}}
                /></svg>))
            }}
            transform={isShortPacks ? '' : 'scale(2, 1)'}
        >
            <path {...{strokeWidth, strokeOpacity}} d="M44 1H300V86.3L256.5 112.3H0.5V27L44 1Z" fill={fillFront} />
            <path {...{strokeWidth, strokeOpacity}} d="M256.5 27H0.5V112.3H256.5V27Z" fill={fillBack} />
            <path {...{strokeWidth, strokeOpacity}} d="M256.5 27H0.5V112.3H256.5V27Z" stroke={stroke} strokeMiterlimit="10" />
            <path {...{strokeWidth, strokeOpacity}} d="M0.5 27L44 1H300V86.3L256.5 112.3" stroke={stroke} strokeMiterlimit="10" />
            <path {...{strokeWidth, strokeOpacity}} d="M300 1L256.5 27" stroke={stroke} strokeMiterlimit="10" />

            {bigView && pack && <g transform={isShortPacks ? '' : 'scale(0.5, 1)'}>
                <text x={5} y={107} fontFamily="sans-serif" fontSize="18" fill="black">{pack.qr}</text>
                {extended && <text x={5} y={45} fontFamily="sans-serif" fontSize="18" fill="black">{pack.id}</text>}
            </g>}
        </g>
    </svg>
});

const PacksOnPintset = React.memo(({extended, isShortPacks, packs, bigView = false, onDel, onEdit}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 130 : 19

    const [selected, setSelected] = useState(false)
    const [control, setControl] = useState(null)
    const select = useCallback((key, elem) => {
        setControl(selected === key ? null : elem)
        setSelected((selected === key || !elem) ? false : key)
    }, [setControl, setSelected, selected])

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 1000 400'} fill={'none'} transform={bigView ? 'scale(2.9) translate(0, 50)' : 'scale(4.5) translate(0, 5)'} >
            {isShortPacks && <PackBlock controlKey={'1'} x={200} y={0} pack={packs[1]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />}
            <PackBlock controlKey={'2'} x={isShortPacks ? 455 : 200} y={0} pack={packs[0]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />

            {bigView && control}
        </svg>
    </div>
});

const PacksOnAssemble = React.memo(({extended, isShortPacks, packs, bigView = false, onDel, onEdit}) => {
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
                        <PackBlock controlKey={`${i}_1`} x={680} y={214 - (i * 85)} pack={group[0]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                        <PackBlock controlKey={`${i}_2`} x={308} y={214 - (i * 85)} pack={group[1]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                        <PackBlock controlKey={`${i}_3`} x={520} y={240 - (i * 85)} pack={group[2]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                        <PackBlock controlKey={`${i}_4`} x={108} y={240 - (i * 85)} pack={group[3]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                    </g>
                }

                return <g key={group.map(item => item && item.id).join(' ')}>
                    <PackBlock controlKey={`${i}_1`} x={308} y={214 - (i * 85)} pack={group[0]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                    <PackBlock controlKey={`${i}_2`} x={108} y={240 - (i * 85)} pack={group[1]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                </g>
            })}

            {bigView && control}
        </svg>
    </div>
});

const PalletBlock = React.memo(({extended, isShortPacks, pallet, bigView, onDel, onEdit, x = 0, y = 0, controlKey, control, selected}) => {
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
                    x={isShortPacks ? 112 : 237}
                    y={52}
                    onRemove={() => {control(controlKey)}}
                    onDel={() => {onDel(pallet.id); control(controlKey)}}
                    onEdit={() => {onEdit(pallet); control(controlKey)}}
                /></svg>))
            }}
            transform={isShortPacks ? '' : 'scale(2, 1)'}
        >
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

            {bigView && pallet && <svg x={110} y={0}>
                <text y={42} fontFamily="sans-serif" fontSize="2.3" fill="black" transform={isShortPacks ? '' : 'scale(0.5, 1)'}>{pallet.qr}</text>
                {extended && <text y={70} fontFamily="sans-serif" fontSize="2.3" fill="black" transform={isShortPacks ? '' : 'scale(0.5, 1)'}>{pallet.id}</text>}
            </svg>}
        </g>
    </svg>
})

const PalletOnWinder = React.memo(({extended, isShortPacks, pallets, bigView = false, onDel, onEdit}) => {
    const classes = useStyles();
    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    const pallets2 = addEmptyItems(pallets.slice(), pallets.length + 1)

    let scale = 7 / (isShortPacks ? pallets2.length : pallets2.length * 2)
    if (scale > 1.5) {
        scale = 1.5
    }
    let translateY = Math.round(40 / scale)
    // let translateY = 0
    // let translateX = (bigView ? 300 : 35) - ((pallets2.length - 1) * (isShortPacks ? 60 : 120))
    let translateX = 0

    const [selected, setSelected] = useState(false)
    const [control, setControl] = useState(null)
    const select = useCallback((key, elem) => {
        setControl(selected === key ? null : elem)
        setSelected((selected === key || !elem) ? false : key)
    }, [setControl, setSelected, selected])



    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 400 80' } fill={'none'} transform={bigView ? `translate(${translateX}, ${translateY})` : `scale(2.5) translate(${translateX}, -8)`}>
            <g transform={`scale(${scale})`}>
                {pallets2.reverse().map((pallet, m) => {
                    const n = isShortPacks ? m : m * 2

                    return <PalletBlock
                        controlKey={`${m}`}
                        x={-60 + (40 * n)}
                        y={-20}
                        pallet={pallet}
                        {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}}
                    />
                })}

                {bigView && control}
            </g>
        </svg>
    </div>
});

const PalletOnFork = React.memo(({extended, isShortPacks, pallets, onDel, onEdit, bigView = false}) => {
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
        <svg width={width} height={height} viewBox={'0 0 400 80'} fill={'none'} transform={bigView ? 'scale(1.7) translate(0, -30)' : 'scale(5) translate(5, -5)'} >
            {isShortPacks && <PalletBlock controlKey={'1'} x={isShortPacks ? 40 : -32} pallet={pallets[1]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />}
            <PalletBlock controlKey={'2'} x={isShortPacks ? 72 : -64} pallet={pallets[0]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />

            {bigView && control}
        </svg>
    </div>
})

const PalletOnPackingTable = React.memo(({extended, isShortPacks, pallets, onDel, onEdit, bigView = false}) => {
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
            <svg width={width} height={height} viewBox={'0 0 400 80'} fill={'none'} transform={bigView ? 'scale(1.4) translate(400)' : 'scale(3) translate(37)'}>
                <PalletBlock controlKey={'1'} x={-107} y={7} pallet={pallets[6]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                <PalletBlock controlKey={'2'} x={-107} y={-25} pallet={pallets[8]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />

                <PalletBlock controlKey={'3'} x={-64} pallet={pallets[5]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                <PalletBlock controlKey={'4'} x={-64} y={-32} pallet={pallets[7]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />

                <PalletBlock controlKey={'5'} x={-43} y={7} pallet={pallets[1]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                <PalletBlock controlKey={'6'} x={-43} y={-25} pallet={pallets[4]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />

                <PalletBlock controlKey={'7'} pallet={pallets[0]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
                <PalletBlock controlKey={'8'} y={-32} pallet={pallets[2]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />

                {bigView && control}
            </svg>
        </div>
    }

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 400 80'} fill={'none'} transform={bigView ? 'scale(1.4) translate(150)' : 'scale(3) translate(10)'}>
            <PalletBlock controlKey={'1'} x={-80} y={0} pallet={pallets[0]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
            <PalletBlock controlKey={'2'} x={-80} y={-32} pallet={pallets[1]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />

            <PalletBlock controlKey={'3'} x={-123} y={7} pallet={pallets[2]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />
            <PalletBlock controlKey={'4'} x={-123} y={-25} pallet={pallets[3]} {...{bigView, isShortPacks, onDel, onEdit, control: select, extended, selected}} />

            {bigView && control}
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
