import React, {useState, useCallback} from 'react';
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

const PackBlock = React.memo(({isShortPacks, pack, bigView, onDel, onEdit, x = 0, y = 0, controlKey, control}) => {
    const [selected, setSelected] = useState(false);

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
        strokeOpacity = selected ? 1 : 0.3
    }

    if (pack && selected) {
        fillFront = '#F7CE55';
        fillBack = '#F7EE55';
    }

    return <svg {...{x, y}} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g
            onClick={() => {
                if (!bigView) return;
                setSelected(!selected);
                control(controlKey, (!selected && <svg {...{x, y}} transform={'scale(4)'}><Control
                    item={pack}
                    x={isShortPacks ? 10 : 150}
                    y={-13}
                    viewBox="0 0 110 33"
                    onRemove={() => {
                        setSelected(false)
                        control(controlKey)
                    }}
                    onDel={() => {onDel(pack.id); setSelected(false); control(controlKey)}}
                    onEdit={() => {onEdit(pack.id); setSelected(false); control(controlKey)}}
                /></svg>))
            }}
            transform={isShortPacks ? '' : 'scale(2, 1)'}
        >
            <path {...{strokeWidth, strokeOpacity}} d="M44 1H300V86.3L256.5 112.3H0.5V27L44 1Z" fill={fillFront} />
            <path {...{strokeWidth, strokeOpacity}} d="M256.5 27H0.5V112.3H256.5V27Z" fill={fillBack} />
            <path {...{strokeWidth, strokeOpacity}} d="M256.5 27H0.5V112.3H256.5V27Z" stroke={stroke} strokeMiterlimit="10" />
            <path {...{strokeWidth, strokeOpacity}} d="M0.5 27L44 1H300V86.3L256.5 112.3" stroke={stroke} strokeMiterlimit="10" />
            <path {...{strokeWidth, strokeOpacity}} d="M300 1L256.5 27" stroke={stroke} strokeMiterlimit="10" />
        </g>
    </svg>
});

const PacksOnPintset = React.memo(({isShortPacks, packs, bigView = false, onDel, onEdit}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 130 : 19

    const [selected, setSelected] = useState({})
    const control = useCallback((key, elem) => {
        const newSelected = {...selected}
        if (elem) {
            newSelected[key] = elem
        } else {
            Reflect.deleteProperty(newSelected, key)
        }
        setSelected(newSelected)
    }, [selected, setSelected])

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 1000 400'} fill={'none'} transform={bigView ? 'scale(2.9) translate(0, 50)' : 'scale(4.5) translate(0, 5)'} >
            {isShortPacks && <PackBlock controlKey={'1'} x={200} y={0} pack={packs[1]} {...{bigView, isShortPacks, onDel, onEdit, control}} />}
            <PackBlock controlKey={'2'} x={isShortPacks ? 455 : 200} y={0} pack={packs[0]} {...{bigView, isShortPacks, onDel, onEdit, control}} />

            {bigView && Object.entries(selected).map(([key, elem]) => {
                return <svg key={key}>{elem}</svg>
            })}
        </svg>
    </div>
});

const PacksOnAssemble = React.memo(({isShortPacks, packs, bigView = false, onDel, onEdit}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    const packs2 = addEmptyItems(packs.slice(), 12)

    const [selected, setSelected] = useState({})
    const control = useCallback((key, elem) => {
        const newSelected = {...selected}
        if (elem) {
            newSelected[key] = elem
        } else {
            Reflect.deleteProperty(newSelected, key)
        }
        setSelected(newSelected)
    }, [selected, setSelected])

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 1000 400'} fill={'none'} transform={bigView ? 'scale(0.7) translate(0, -30)' : 'scale(1.3) translate(10, -10)'}>
            {chunk(packs2, isShortPacks ? 4 : 2).map((group, i) => {
                if (isShortPacks) {
                    return <g key={group.map(item => item && item.id).join(' ')}>
                        <PackBlock controlKey={`${i}_1`} x={680} y={214 - (i * 85)} pack={group[0]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                        <PackBlock controlKey={`${i}_2`} x={308} y={214 - (i * 85)} pack={group[1]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                        <PackBlock controlKey={`${i}_3`} x={520} y={240 - (i * 85)} pack={group[2]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                        <PackBlock controlKey={`${i}_4`} x={108} y={240 - (i * 85)} pack={group[3]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                    </g>
                }

                return <g key={group.map(item => item && item.id).join(' ')}>
                    <PackBlock controlKey={`${i}_1`} x={308} y={214 - (i * 85)} pack={group[0]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                    <PackBlock controlKey={`${i}_2`} x={108} y={240 - (i * 85)} pack={group[1]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                </g>
            })}
            {bigView && Object.entries(selected).map(([key, elem]) => {
                return <svg key={key}>{elem}</svg>
            })}
        </svg>
    </div>
});

const PalletBlock = React.memo(({isShortPacks, pallet, bigView, onDel, onEdit, x = 0, y = 0, controlKey, control}) => {
    const [selected, setSelected] = useState(false);

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
        strokeOpacity = selected ? 1 : 0.3
    }

    if (pallet && selected) {
        fillFront = '#F7CE55';
        fillBack = '#F7EE55';
    }

    return <svg {...{x, y}} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g
            onClick={() => {
                if (!bigView) return;
                setSelected(!selected);
                control(controlKey, (!selected && <svg {...{x, y}}><Control
                    item={pallet}
                    x={isShortPacks ? 112 : 237}
                    y={41}
                    onRemove={() => {
                        setSelected(false)
                        control(controlKey)
                    }}
                    onDel={() => {onDel(pallet.id); setSelected(false); control(controlKey)}}
                    onEdit={() => {onEdit(pallet); setSelected(false); control(controlKey)}}
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
        </g>
        {selected && <Control
            item={pallet}
            x={isShortPacks ? 112 : 237}
            y={41}
            onRemove={() => { setSelected(false) }}
            onDel={() => {onDel(pallet.id); setSelected(false)}}
            onEdit={() => {onEdit(pallet); setSelected(false)}}
        />}
    </svg>
})

const PalletOnWinder = React.memo(({isShortPacks, pallets, bigView = false, onDel, onEdit}) => {
    const classes = useStyles();
    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    let scale = 2.4 / (isShortPacks ? pallets.length : pallets.length * 2)
    if (scale > 0.8) {
        scale = 0.8
    }
    let translateY = Math.round(60 / scale)

    const [selected, setSelected] = useState({})
    const control = useCallback((key, elem) => {
        const newSelected = {...selected}
        if (elem) {
            newSelected[key] = elem
        } else {
            Reflect.deleteProperty(newSelected, key)
        }
        setSelected(newSelected)
    }, [selected, setSelected])

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 1000 400' } fill={'none'} transform={bigView ? `translate(0, ${translateY})` : 'scale(1.5) translate(10)'}>
            <g transform={`scale(${scale})`}>
                {pallets.reverse().map((pallet, m) => {
                    const n = isShortPacks ? m : m * 2

                    return chunk(pallet.pack_ids, 6).map((group, i) => {
                        const group2 = addEmptyItems(group, 6)
                        return <g key={group.join(' ')}>
                            <PackBlock controlKey={`${m}_${i}_1`} x={(isShortPacks ? 160 : 320) + (372 * n)} y={214} pack={group2[0] && {id: group2[0]}} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                            <PackBlock controlKey={`${m}_${i}_2`} x={(372 * n)} y={240} pack={group2[1] && {id: group2[1]}} {...{bigView, isShortPacks, onDel, onEdit, control}} />

                            <PackBlock controlKey={`${m}_${i}_3`} x={(isShortPacks ? 160 : 320) + (372 * n)} y={129} pack={group2[2] && {id: group2[2]}} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                            <PackBlock controlKey={`${m}_${i}_4`} x={(372 * n)} y={155} pack={group2[3] && {id: group2[3]}} {...{bigView, isShortPacks, onDel, onEdit, control}} />

                            <PackBlock controlKey={`${m}_${i}_5`} x={(isShortPacks ? 160 : 320) + (372 * n)} y={44} pack={group2[4] && {id: group2[4]}} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                            <PackBlock controlKey={`${m}_${i}_6`} x={(372 * n)} y={70} pack={group2[5] && {id: group2[5]}} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                        </g>
                    })
                })}

                {bigView && Object.entries(selected).map(([key, elem]) => {
                    return <g key={key}>{elem}</g>
                })}
            </g>
        </svg>
    </div>
});

const PalletOnFork = React.memo(({isShortPacks, pallets, onDel, onEdit, bigView = false}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    const [selected, setSelected] = useState({})
    const control = useCallback((key, elem) => {
        const newSelected = {...selected}
        if (elem) {
            newSelected[key] = elem
        } else {
            Reflect.deleteProperty(newSelected, key)
        }
        setSelected(newSelected)
    }, [selected, setSelected])

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 400 80'} fill={'none'} transform={bigView ? 'scale(1.7) translate(0, -30)' : 'scale(5) translate(5, -5)'} >
            {isShortPacks && <PalletBlock controlKey={'1'} x={isShortPacks ? 40 : -32} pallet={pallets[1]} {...{bigView, isShortPacks, onDel, onEdit, control}} />}
            <PalletBlock controlKey={'2'} x={isShortPacks ? 72 : -64} pallet={pallets[0]} {...{bigView, isShortPacks, onDel, onEdit, control}} />

            {bigView && Object.entries(selected).map(([key, elem]) => {
                return <svg key={key}>{elem}</svg>
            })}
        </svg>
    </div>
})

const PalletOnPackingTable = React.memo(({isShortPacks, pallets, onDel, onEdit, bigView = false}) => {
    const classes = useStyles();

    const width = bigView ? 1300 : 120
    const height = bigView ? 435 : 79

    const [selected, setSelected] = useState({})
    const control = useCallback((key, elem) => {
        const newSelected = {...selected}
        if (elem) {
            newSelected[key] = elem
        } else {
            Reflect.deleteProperty(newSelected, key)
        }
        setSelected(newSelected)
    }, [selected, setSelected])

    if (isShortPacks) {
        return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
            <svg width={width} height={height} viewBox={'0 0 400 80'} fill={'none'} transform={bigView ? 'scale(1.4) translate(400)' : 'scale(3) translate(37)'}>
                <PalletBlock controlKey={'1'} x={-107} y={7} pallet={pallets[6]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                <PalletBlock controlKey={'2'} x={-107} y={-25} pallet={pallets[8]} {...{bigView, isShortPacks, onDel, onEdit, control}} />

                <PalletBlock controlKey={'3'} x={-64} pallet={pallets[5]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                <PalletBlock controlKey={'4'} x={-64} y={-32} pallet={pallets[7]} {...{bigView, isShortPacks, onDel, onEdit, control}} />

                <PalletBlock controlKey={'5'} x={-43} y={7} pallet={pallets[1]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                <PalletBlock controlKey={'6'} x={-43} y={-25} pallet={pallets[4]} {...{bigView, isShortPacks, onDel, onEdit, control}} />

                <PalletBlock controlKey={'7'} pallet={pallets[0]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
                <PalletBlock controlKey={'8'} y={-32} pallet={pallets[2]} {...{bigView, isShortPacks, onDel, onEdit, control}} />

                {bigView && Object.entries(selected).map(([key, elem]) => {
                    return <svg key={key}>{elem}</svg>
                })}
            </svg>
        </div>
    }

    return <div className={bigView ? classes.bigViewContainer : classes.palletContainer}>
        <svg width={width} height={height} viewBox={'0 0 400 80'} fill={'none'} transform={bigView ? 'scale(1.4) translate(150)' : 'scale(3) translate(10)'}>
            <PalletBlock controlKey={'1'} x={-80} y={0} pallet={pallets[0]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
            <PalletBlock controlKey={'2'} x={-80} y={-32} pallet={pallets[1]} {...{bigView, isShortPacks, onDel, onEdit, control}} />

            <PalletBlock controlKey={'3'} x={-123} y={7} pallet={pallets[2]} {...{bigView, isShortPacks, onDel, onEdit, control}} />
            <PalletBlock controlKey={'4'} x={-123} y={-25} pallet={pallets[3]} {...{bigView, isShortPacks, onDel, onEdit, control}} />

            {bigView && Object.entries(selected).map(([key, elem]) => {
                return <svg key={key}>{elem}</svg>
            })}
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
