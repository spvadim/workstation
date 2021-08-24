import axios from "axios";
import { memo, useEffect, useState } from "react";
import address from "src/address";
import { Button } from "src/components";
import SettingsBlock from "./SettingsBlock";
import { Settings } from "./SettingsInterface";

import NotificationProvider from "src/components/NotificationProvider";

const SettingsComponent = memo(() => {
    const [settings, setSettings] = useState<Settings>();
    const [editSettings, setEditSettings] = useState<Settings>();

    const loadSettings = () => {
        axios.get(address + "/api/v1_0/settings")
            .then(res => {
                setSettings(res.data);
                setEditSettings(res.data);
                if (res.data.location_settings)
                    document.title = "Настройки: " + res.data.location_settings.place_name.value
        });
    }

    const saveSettings = () => axios.patch(address + "/api/v1_0/settings", editSettings)
        .then(() => NotificationProvider.createNotification("Успешно", "Настройки сохранены", "success"))
        .catch(e => NotificationProvider.createNotification("Ошибка", e.message, "danger", 10000))

    useEffect(loadSettings, []);

    const SettingsList = (): JSX.Element => {
        if (settings === undefined || editSettings === undefined) return <div/>;
        return SettingsBlock(settings, editSettings, setEditSettings);
    }

    return (
        <div className="settings-container">
            <SettingsList/>
            <Button className="centered" onClick={saveSettings}>Сохранить</Button>
        </div>
    )
})

export default SettingsComponent;