import { Setting, SettingsGroup, Settings } from "./future-SettingsInterface";
import "./SettingsBlock.scss";
import ToolTip from "src/components/ToolTip";

const SettingsBlock = (settings: Settings, editSettings: Settings
    , setEditSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    return (
        <div key={settings.id}>
            {settings.groups.map((group) => SettingsGroup(group, editSettings, setEditSettings))}
        </div>
    )
}

const SettingsGroup = (group: SettingsGroup, editSettings: Settings
    , setEditSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    return (
        <div>
            <span className="title">{group.title}:</span>
            <div className="setting-inner">
                {group.settings.map((option) => SettingsOption(option, group.name, editSettings, setEditSettings))}
            </div>
        </div>
    )
}

const SettingsOption = (option: Setting, groupName: string, editSettings: Settings
    , setEditSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    return (
        <div className="row">
            <span className="cell1" title={option.desc}>{option.title}:
                <ToolTip text={option.desc} style={{marginLeft: 5}} />
            </span>
            {option.value_type === "bool" ?
                SettingsOptionInputBool(option.name, groupName, editSettings, setEditSettings)
            : SettingsOptionInputString(option.name, groupName, editSettings, setEditSettings)}
        </div>
    )
}

const SettingsOptionInputBool = (optionName:string, groupName:string, editSettings: Settings
    , setEditSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>) => {
    return (
        <select className="input"
                onChange={(e) => {
                    let temp = Object.assign({}, editSettings);
                    //TODO сделать присвоение с использованием элементов масива
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
            //TODO сделать присвоение с использованием элементов масива
            temp[groupName][optionName].value = temp[groupName][optionName].value_type === "integer" ? +e.target.value : e.target.value;
            setEditSettings(temp);
        }}/>
    )
}

export default SettingsBlock;