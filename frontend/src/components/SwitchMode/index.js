import React from "react";
import "./index.css";

const SwitchMode = React.memo(({ callback }) => {
    return (
        <label className="switch">
            <input type="checkbox"
                   onClick={callback} />
            <span className="slider" />
        </label>
    );
})

// function SwitchMode({callback}) {
//     return (
//         <label className="switch">
//             <input type="checkbox"
//                    onClick={callback} />
//             <span className="slider" />
//         </label>
//     );
// }

export default SwitchMode;