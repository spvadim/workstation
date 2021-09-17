import { Setting, Settings } from "../../../interfaces/SettingsInterface";
import "./Settings.scss";
import ToolTip from "src/components/ToolTip";
import React, { useState } from "react";
import DataProvider from "src/components/DataProvider";

const SettingsList = (settings: Settings): JSX.Element => {
    let groups = Object.keys(settings).map((groupName) => {
        let group = settings[groupName];
        if (typeof group === "object")
            return SettingsGroup(group, groupName, settings);
    })

    return (
        <div key={settings.id}>
            {groups}
        </div>
    )
}

const SettingsGroup = (group: any, groupName: string, settings: Settings): JSX.Element => {
    let options = Object.keys(group).map((optionName) => {
        let option: Setting = group[optionName];
        if (typeof option === "object")
            return SettingsOption(option, optionName, groupName, settings);
    })

    return (
        <div key={groupName}>
            <span className="title">{group.title}:</span>
            <div className="setting-inner">
                {options}
            </div>
        </div>
    )
}

const SettingsOption = (option: Setting, optionName: string, groupName: string, settings: Settings): JSX.Element => {
    let editField = SettingsOptionInputString;
    if (option.value_type === "bool") editField = SettingsOptionInputBool;
    if (option.value_type === "list") editField = SettingsOptionInputList;
    if (option.value_type === "integer") editField = SettingsOptionInputInteger;

    return (
        <div className="row" key={optionName}>
            <span className="cell1" title={option.desc}>{option.title}:
                <ToolTip text={option.desc} style={{marginLeft: 5}} />
            </span>
            {editField(optionName, groupName, settings)}
        </div>
    )
}

const SettingsOptionInputBool = (optionName:string, groupName:string, settings: Settings) => {
    return (
        <select className="input"
                onBlur={e => DataProvider.Settings.saveOption(groupName, optionName, e.target.value === "true")}>
            <option selected={settings[groupName][optionName].value}>true</option>
            <option selected={!settings[groupName][optionName].value}>false</option>
        </select>
    )
}

const SettingsOptionInputString = (optionName:string, groupName:string, settings: Settings) => {
    const [value, setValue] = useState<string>(settings[groupName][optionName].value);

    return (
        <input className="input"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={() => DataProvider.Settings.saveOption(groupName, optionName, value)}/>
    )
}

const SettingsOptionInputInteger = (optionName:string, groupName:string, settings: Settings) => {
    const [value, setValue] = useState<number>(settings[groupName][optionName].value);

    return (
        <input className="input"
            value={value}
            onChange={e => setValue(+e.target.value)}
            onBlur={() => DataProvider.Settings.saveOption(groupName, optionName, +value)}/>
    )
}

const SettingsOptionInputList = (optionName:string, groupName:string, settings: Settings): JSX.Element =>
        listEditor(optionName, groupName, settings)

const listEditor = (optionName:string, groupName:string, settings: Settings): JSX.Element => {
    const elements: number[] = settings[groupName][optionName].value;
    const setElements = (newValue: number[]) => DataProvider.Settings.saveOption(groupName, optionName, newValue)
    const [extended, setExtended] = useState(false)
    const toggle = () => setExtended(!extended);

    const listFull = (extended: boolean, toggle: () => void, elements: number[]): JSX.Element => {
        const [source, setSource] = useState(elements);
        const [newItem, setNewItem] = useState<number|"">("");
        if (!extended) return <></>;

        const add = () => {
            if (newItem === "") return;
            let tmp = source.slice();
            tmp.push(newItem);
            setSource(tmp.sort());
            setNewItem("");
        }

        const change = (e: any) => {
            let key = e.nativeEvent.data;
            if ("0" <= key && key <= "9" )
                setNewItem(e.target.value);
        }

        const save = () => {
            setElements(source);
            toggle();
        }

        const cancel = () => {
            setSource(settings[groupName][optionName].value);
            toggle();
        }

        return (
            <div className="list-container-extended">
                <div className="list-container-inner">
                    {source.map(x => listElement(x, source, setSource))}
                </div>
                <div className="input-container">
                    <input className="input-small" type="text" value={newItem} onChange={change}/>
                    <button onClick={add}>Добавить</button>
                    <button className="save-button" onClick={save}>Сохранить</button>
                    <button onClick={cancel}>Отмена</button>
                </div>
            </div>
        )
    }

    const listElement = (n: number, source: number[]
        , setSource: React.Dispatch<React.SetStateAction<number[]>>): JSX.Element => {
        const del = () => {
            let tmp = source.slice();
            tmp.splice(tmp.indexOf(n),1)
            setSource(tmp);
        }

        return (
            <div className="flex-between-center list-element">
                <div>{n}</div>
                <div onClick={del}>❌</div>
            </div>
        )
    }

    return (
        <div className="list-container-preview">
            {listFull(extended, toggle, elements)}
            <div className="list-container-preview-text" onClick={toggle} >
                <div>[{elements.join(", ")}]</div><div>✏️</div>
            </div>
        </div>
    )
}

export default SettingsList;