import axios from "axios";
import address from "src/address";

class Settings {
    static data: Settings | undefined;

    static loadSettngs = () => axios.get(address + "/api/v1_0/settings")

    static saveSettings = () => axios.patch(address + "/api/v1_0/settings", Settings.data)
    static saveOption = (group: string, option: string, value: any) => {
        let temp = Object.assign({}, Settings.data);
        temp[group][option].value = value;
        Settings.saveSettings(temp);
        console.log(value)
    }
}

class DataProvider {
    static Settings = Settings;
}

export default DataProvider;