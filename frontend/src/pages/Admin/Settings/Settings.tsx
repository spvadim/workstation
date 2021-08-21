import axios from "axios";
import { useEffect, useState } from "react";
import address from "src/address";
import { Button } from "src/components";
import SettingsBlock from "./SettingsBlock";
import { Settings } from "./SettingsInterface";

import NotificationProvider from "src/components/NotificationProvider";

const SettingsComponent = () => {
    
    useEffect(() => {
        axios.get(address + "/api/v1_0/settings")
             .then(res => {
                setSettings(res.data);
                setEditSettings(res.data);
                if (res.data.location_settings)
                    document.title = "Настройки: " + res.data.location_settings.place_name.value
             });
    }, []);

    const [settings, setSettings] = useState<Settings>();
    const [editSettings, setEditSettings] = useState<Settings>();

    const generateSettings = (): JSX.Element => {
        if (settings === undefined || editSettings === undefined) return <div/>;
        return SettingsBlock(settings, editSettings, setEditSettings);
    }

    return (
        <div className="settings-container">
            {(editSettings !== undefined) && Object.keys(editSettings).length !== 0 && generateSettings()}
            <div style={{display: "flex", alignItems: "center"}}>
                <Button style={{width: "max-content", height: "max-content"}} onClick={() => {
                    axios.patch(address + "/api/v1_0/settings", editSettings)
                        .then(() => NotificationProvider.createNotification("Успешно", "Настройки сохранены", "success"))
                        .catch(e => NotificationProvider.createNotification("Ошибка", e.response.data.detail[0].msg, "danger"))
                }} > Сохранить </Button>
            </div>
        </div>
    )
}

export default SettingsComponent;