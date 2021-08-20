import axios from "axios";
import { useEffect, useState } from "react";
import address from "src/address";
import { Button, NotificationPanel } from "src/components";
import SettingsBlock from "./SettingsBlock";
import { Settings } from "./SettingsInterface";

const SettingsComponent = () => {
    
    useEffect(() => {
        axios.get(address + "/api/v1_0/settings")
             .then(res => {
                setSettings(res.data);
                setEditSettings(res.data);
                if (res.data.location_settings) {
                    document.title = "Настройки: " + res.data.location_settings.place_name.value
                }
             });
    }, []);

    const [settings, setSettings] = useState<Settings>();
    const [editSettings, setEditSettings] = useState<Settings>();
    const [notificationText, setNotificationText] = useState("");
    const [notificationErrorText, setNotificationErrorText] = useState("");

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
                        .then(() => {
                            setNotificationText("Успешно");
                            setTimeout(() => setNotificationText(""), 2000)
                        })
                        .catch(e => {
                            setNotificationErrorText(e.response.data.detail[0].msg);
                            setTimeout(() => setNotificationText(""), 2000)
                        })
                }} > Сохранить </Button>
                <NotificationPanel
                    errors={
                        notificationErrorText && (
                            <Notification
                                error
                                description={notificationErrorText}
                            />
                        )
                    }  
                    notifications={
                        notificationText && (
                            <Notification
                                description={notificationText}
                            />
                        )
                    }
                />
            </div>
        </div>
    )
}

export default SettingsComponent;