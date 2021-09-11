import axios from "axios";
import address from "src/address";

import { Batch, BatchPut } from "src/interfaces/Batches";
import { Settings } from "src/interfaces/SettingsInterface";

const api = address + "/api/v1_0/"

class BatchesClass {
    static data: Batch[] | undefined;
    static load = () => axios.get<Batch[]>(api + "batches");
    static put = (batch: BatchPut) => axios.put<BatchPut>(api + "batches", batch);
}

class SettingsClass {
    static data: Settings | undefined;
    static loadSettngs = () => axios.get<Settings>(api + "settings")
    static saveSettings = () => axios.patch<Settings>(api + "settings", SettingsClass.data)
    static saveOption = (group: string, option: string, value: any) => SettingsClass.data[group][option].value = value;
}

class DataProvider {
    static Settings = SettingsClass;
    static Batches = BatchesClass;
}

export default DataProvider;