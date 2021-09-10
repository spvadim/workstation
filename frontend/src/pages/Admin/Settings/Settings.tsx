import axios from "axios";
import { useEffect, useState } from "react";
import address from "src/address";
import { Button } from "src/components/index";
import SettingsBlock from "./SettingsBlock";
import { Settings } from "./SettingsInterface";

import NotificationProvider from "src/components/NotificationProvider";

const SettingsComponent = () => {
    const [settings, setSettings] = useState<Settings>();
    
    const loadSettngs = () => {
        axios.get(address + "/api/v1_0/settings")
            .then(res => {
                setSettings(res.data);
                if (res.data.location_settings)
                    document.title = "Настройки: " + res.data.location_settings.place_name.value
        });
    }

    useEffect(loadSettngs, [])

    const saveSettings = () => axios.patch(address + "/api/v1_0/settings", settings)
        .then(() => NotificationProvider.createNotification("Успешно", "Настройки сохранены", "success"))
        .catch(e => NotificationProvider.createNotification("Ошибка", e.message, "danger", 10000))

    const SettingsList = (): JSX.Element => {
        if (settings === undefined) return <div/>;
        return SettingsBlock(settings, setSettings);
    }

    return (
        <div className="settings-container">
            <SettingsList />
            <Button className="centered" onClick={saveSettings}>Сохранить</Button>
        </div>
    )
}

export default SettingsComponent;