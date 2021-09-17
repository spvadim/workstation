import { useEffect, useReducer } from "react";
import { Button } from "src/components/index";
import SettingsBlock from "./SettingsBlock";

import DataProvider from "src/components/DataProvider";
import NotificationProvider from "src/components/NotificationProvider";

const SettingsComponent = () => {
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const loadSettings = () => {DataProvider.Settings.loadSettngs()
        .then(res => {
            DataProvider.Settings.data = res.data;
            if (res.data.location_settings)
                document.title = "Настройки: " + res.data.location_settings.place_name.value
            forceUpdate();
        })}
    
    const saveSettings = () => DataProvider.Settings.saveSettings()
        .then(() => NotificationProvider.createNotification("Успешно", "Настройки сохранены", "success"))
        .catch(e => NotificationProvider.createNotification("Ошибка", e.message, "danger", 10000))

    useEffect(loadSettings, [])

    const SettingsList = (): JSX.Element => {
        if (DataProvider.Settings.data === undefined) return <div/>;
        return SettingsBlock(DataProvider.Settings.data);
    }

    return (
        <div className="settings-container">
            <SettingsList />
            <Button className="centered" onClick={saveSettings}>Сохранить</Button>
        </div>
    )
}

export default SettingsComponent;