import "./index.scss";

import SettingsComponent from "./Settings/Settings";
import Packs from "./Packs/Packs";

const Admin = () => {
    return (
        <div className="container">
            <SettingsComponent/>
            <Packs />
        </div>
    );
}

export default Admin;