import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    buildBox: {
        overflow: 'visible',
        position: 'relative',
        "& .qr, & .id": {
            position: 'absolute',
            pointerEvents: 'none',
            top: 0,
            color: '#00060A',
            fontSize: 14,
            textAlign: 'center',
            maxWidth: '90%',
            zIndex: 30,
            left: '50%',
            transform: 'translateX(-50%)',
        },  
        "& .id": {
            top: 'auto',
            bottom: 0,
        },
    },

    buildBox__box: {
        // position: "absolute",
        // left: 0,
        // bottom: 0,
        "& svg": {
            display: 'block',
        },
        "&:hover": {
            cursor: 'pointer',
        },
    },

    buildBox__buttons: {
        position: 'absolute',
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 5,
    },

    buildBox__buttonsBox: {
        display: "flex",
        alignItems: "center",
    },

    buildBox__button: {
        cursor: "pointer",
        marginRight: 5,
    },

    description: {
        position: 'absolute',
        bottom: 0,
        left: "50%",
    },
});



const edgeBox = (classes, onClick, size) => {
    return (
        <div className={classes.buildBox__box}>
            <svg
                onClick={onClick}
                width={size ? size[0] : "301"}
                height={size ? null : "113"}
                viewBox="0 0 301 113"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M256.564 26.9556H1V112.11H256.564V26.9556Z"
                    stroke="#0057FF"
                    strokeOpacity="0.3"
                    strokeMiterlimit="10"
                />
                <path
                    d="M1.00098 26.9557L44.4269 1H299.991V86.1547L256.565 112.11"
                    stroke="#0057FF"
                    strokeOpacity="0.3"
                    strokeMiterlimit="10"
                />
                <path
                    d="M299.99 1L256.564 26.9557"
                    stroke="#0057FF"
                    strokeOpacity="0.3"
                    strokeMiterlimit="10"
                />
            </svg>
        </div>
    )
};

const blueBox = (classes, onClick, onAdd, size) => {
    return (
        <div className={classes.blue}>
            <div className={classes.buildBox__buttons}>
                <div className={classes.buildBox__buttonsBox}>
                    {onAdd && 
                        <div className={[classes.buildBox__button, classes.add].join(" ")}
                             onClick={onAdd}>
                            <img src="add.svg" alt="btn" />
                        </div>
                    }
                    {/* <div className={[classes.buildBox__button, classes.remove].join(" ")}>
                        <img src="remove.svg" alt="btn" />
                    </div> */}
                </div>
            </div>
            <div className={classes.buildBox__box}>
                <svg
                    width={size ? size[0] : "301"}
                    onClick={onClick}
                    height={size ? null : "113"}
                    viewBox="0 0 301 113"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                        <path
                        d="M256.564 26.9556H1V112.11H256.564V26.9556Z"
                        stroke="#0057FF"
                        strokeMiterlimit="10"
                        />
                        <path
                        d="M1.00098 26.9557L44.4269 1H299.991V86.1547L256.565 112.11"
                        stroke="#0057FF"
                        strokeMiterlimit="10"
                        />
                        <path
                        d="M299.99 1L256.564 26.9557"
                        stroke="#0057FF"
                        strokeMiterlimit="10"
                        />
                </svg>
            </div>
        </div>
    )
};

const grayBox = (classes, onClick, size, id) => {
    return (
        <div className={classes.buildBox__box}>
            <svg
                width={size ? size[0] : "301"}
                onClick={onClick}
                height={size ? null : "113"}
                viewBox="0 0 301 113"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M44 1H300V86.3L256.5 112.3H0.5V27L44 1Z"
                    fill="#AFAFAF"
                />
                <path
                    d="M256.5 27H0.5V112.3H256.5V27Z"
                    fill="#E2E2E2"
                />
                <path
                    d="M256.5 27H0.5V112.3H256.5V27Z"
                    stroke="#A6A5A5"
                    strokeMiterlimit="10"
                />
                <path
                    d="M0.5 27L44 1H300V86.3L256.5 112.3"
                    stroke="#A6A5A5"
                    strokeMiterlimit="10"
                />
                <path
                    d="M300 1L256.5 27"
                    stroke="#A6A5A5"
                    strokeMiterlimit="10"
                />
            </svg>
            <div className={classes.description}><span style={{position: 'relative', left: "-60%"}}>{id}</span></div>
        </div>
    )
};

const yellowBox = (classes, onClick, onEdit, onDelete, size, id) => {
    return (
        <div className={classes.yellow}>
            <div className={classes.buildBox__buttons}>
                <div className={classes.buildBox__buttonsBox}>
                    {onEdit &&
                        <div className={[classes.buildBox__button, classes.edit].join(" ")}>
                            <img src="edit.svg" alt="btn" />
                        </div>
                    }
                    {onDelete &&
                        <div className={[classes.buildBox__button, classes.del].join(" ")}
                             onClick={onDelete} >
                            <img src="del.svg" alt="btn" />
                        </div>
                    }
                    {/* <div className={[classes.buildBox__button, classes.remove].join(" ")}>
                        <img src="remove.svg" alt="btn" />
                    </div> */}
                </div>
            </div>
            <div className={classes.buildBox__box}>
            <svg
                width={size ? size[0] : "301"}
                onClick={onClick}
                height={size ? null : "113"}
                viewBox="0 0 301 113"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M44.5 1H300.5V86.3L257 112.3H1V27L44.5 1Z"
                    fill="#F7CE55"
                />
                <path d="M257 27H1V112.3H257V27Z" fill="#F7EE55" />
                <path
                    d="M257 27H1V112.3H257V27Z"
                    stroke="#A6A5A5"
                    strokeMiterlimit="10"
                />
                <path
                    d="M1 27L44.5 1H300.5V86.3L257 112.3"
                    stroke="#A6A5A5"
                    strokeMiterlimit="10"
                />
                <path
                    d="M300.5 1L257 27"
                    stroke="#A6A5A5"
                    strokeMiterlimit="10"
                />
            </svg>
            <div className={classes.description}><span style={{position: 'relative', left: "-60%"}}>{id}</span></div>
            </div>
        </div>
    )
};

const Block = React.memo(({ id, onlyGray, onAdd, onDelete, onEdit, onClick, size, controlledMode, ...restProps }) => {
    const classes = useStyles();

    const [mode, setMode] = useState(0); // 0 : edge, 1 : blue, 2 : gray, 3 : yellow 
    
    const changeModeLogic = mode => {
        if (controlledMode) return
        else if (mode === 0) setMode(1)
        else if (mode === 1) setMode(0)
        else if (mode === 2) setMode(3)
        else if (mode === 3) setMode(2)
    };

    const drawBlock = (mode) => {
        switch(mode) {
            case 0: return edgeBox(classes, onClick ? () => onClick() : 
                                                      () => changeModeLogic(mode), size)

            case 1: return blueBox(classes, onClick ? () => onClick() : 
                                                      () => changeModeLogic(mode), onAdd, size)

            case 2: return grayBox(classes, onClick ? () => onClick() : 
                                                      () => changeModeLogic(mode), size, id)

            case 3: return yellowBox(classes, onClick ? () => onClick() : 
                                                        () => changeModeLogic(mode), onEdit, onDelete, size, id)

            default: return
        }
    };

    // useEffect(() => {
    //     if (controlledMode) {
    //         setMode(controlledMode);
    //     }
    // }, [controlledMode])
    
    return (
        <div id={id} className={classes.buildBox} style={size ? {width: size[0], height: size[1]} : null} {...restProps}>
            {onlyGray ? grayBox(classes, () => {return}, size) :
                        drawBlock(controlledMode ? controlledMode : mode)}
        </div>
    )
})

export default Block;


