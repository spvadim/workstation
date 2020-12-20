import React from 'react';
import ReactDOM from 'react-dom';


const root = document.getElementById('root');

function Portal({ children }) {
    const modalRoot = React.useMemo(() => {
        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.top = 0;
        el.style.display = 'flex';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
        el.style.zIndex = 1;
        return el;
    }, []);

    React.useEffect(() => {
        root.appendChild(modalRoot);
        return () => root.removeChild(modalRoot);
    }, []);

    return ReactDOM.createPortal(
        children,
        modalRoot,
    );
}

export default Portal;