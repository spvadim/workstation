import { Setting, Settings } from "./SettingsInterface";
import "./SettingsBlock.scss";
import ToolTip from "src/components/ToolTip";

const SettingsBlock = (settings: Settings, editSettings: Settings
    , setEditSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    let groups = Object.keys(settings).map((groupName) => {
        let group = settings[groupName];
        if (typeof group === "object")
            return SettingsGroup(group, groupName, editSettings, setEditSettings);
    })

    return (
        <div key={settings.id}>
            {groups}
        </div>
    )
}

const SettingsGroup = (group: any, groupName: string, editSettings: Settings
    , setEditSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    let options = Object.keys(group).map((optionName) => {
        let option: Setting = group[optionName];
        if (typeof option === "object")
            return SettingsOption(option, optionName, groupName, editSettings, setEditSettings);
    })

    return (
        <div>
            <span className="title">{group.title}:</span>
            <div className="setting-inner">
                {options}
            </div>
        </div>
    )
}

const SettingsOption = (option: Setting, optionName: string,
    groupName: string, editSettings: Settings
    , setEditSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    return (
        <div className="row">
            <span className="cell1" title={option.desc}>{option.title}:
                <ToolTip text={option.desc} style={{marginLeft: 5}} />
            </span>
            {option.value_type === "bool" ?
                SettingsOptionInputBool(optionName, groupName, editSettings, setEditSettings)
            : SettingsOptionInputString(optionName, groupName, editSettings, setEditSettings)}
        </div>
    )
}

const SettingsOptionInputBool = (optionName:string, groupName:string, editSettings: Settings
    , setEditSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>) => {
    return (
        <select className="input"
                onChange={(e) => {
                    let temp = Object.assign({}, editSettings);
                    temp[groupName][optionName].value = e.target.value === "true"
                    setEditSettings(temp);
                }}>
            <option selected={editSettings[groupName][optionName].value}>true</option>
            <option selected={!editSettings[groupName][optionName].value}>false</option>
        </select>
    )
}

const SettingsOptionInputString = (optionName:string, groupName:string, editSettings: Settings
    , setEditSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>) => {
    return (
        <input className="input"
        value={editSettings[groupName][optionName].value}
        onChange={(e) => {
            let temp = Object.assign({}, editSettings);
            temp[groupName][optionName].value = temp[groupName][optionName].value_type === "integer" ? +e.target.value : e.target.value;
            setEditSettings(temp);
        }}/>
    )
}

export default SettingsBlock;