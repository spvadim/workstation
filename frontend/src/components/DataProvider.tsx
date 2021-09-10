import axios from "axios";
import address from "src/address";

import { Settings } from "src/pages/Admin/Settings/SettingsInterface";

class SettingsClass {
    static data: Settings | undefined;
    static loadSettngs = () => axios.get(address + "/api/v1_0/settings")
    static saveSettings = () => axios.patch(address + "/api/v1_0/settings", SettingsClass.data)
    static saveOption = (group: string, option: string, value: any) => SettingsClass.data[group][option].value = value;
}

class DataProvider {
    static Settings = SettingsClass;
}

export default DataProvider;