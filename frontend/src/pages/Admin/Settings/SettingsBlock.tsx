import { Setting, Settings } from "./SettingsInterface";
import "./SettingsBlock.scss";
import ToolTip from "src/components/ToolTip";
import React, { useState } from "react";

const SettingsBlock = (settings: Settings
    , setSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    let groups = Object.keys(settings).map((groupName) => {
        let group = settings[groupName];
        if (typeof group === "object")
            return SettingsGroup(group, groupName, settings, setSettings);
    })

    return (
        <div key={settings.id}>
            {groups}
        </div>
    )
}

const SettingsGroup = (group: any, groupName: string, settings: Settings
    , setSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    let options = Object.keys(group).map((optionName) => {
        let option: Setting = group[optionName];
        if (typeof option === "object")
            return SettingsOption(option, optionName, groupName, settings, setSettings);
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

const SettingsOption = (option: Setting, optionName: string,
    groupName: string, settings: Settings
    , setSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    let editField = SettingsOptionInputString;
    if (option.value_type === "bool") editField = SettingsOptionInputBool;
    if (option.value_type === "list") editField = SettingsOptionInputList;

    return (
        <div className="row" key={optionName}>
            <span className="cell1" title={option.desc}>{option.title}:
                <ToolTip text={option.desc} style={{marginLeft: 5}} />
            </span>
            {editField(optionName, groupName, settings, setSettings)}
        </div>
    )
}

const SettingsOptionInputBool = (optionName:string, groupName:string, settings: Settings
    , setSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>) => {
    return (
        <select className="input"
                onBlur={(e) => {
                    let temp = Object.assign({}, settings);
                    temp[groupName][optionName].value = e.target.value === "true"
                    setSettings(temp);
                }}>
            <option selected={settings[groupName][optionName].value}>true</option>
            <option selected={!settings[groupName][optionName].value}>false</option>
        </select>
    )
}

const SettingsOptionInputString = (optionName:string, groupName:string, settings: Settings
    , setSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>) => {
    const [value, setValue] = useState<string>(settings[groupName][optionName].value);

    return (
        <input className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => {
            let temp = Object.assign({}, settings);
            temp[groupName][optionName].value = temp[groupName][optionName].value_type === "integer" ? +value : value;
            setSettings(temp);
        }}/>
    )
}

const SettingsOptionInputList = (optionName:string, groupName:string, settings: Settings
    , setSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element =>
        listEditor(optionName, groupName, settings, setSettings)

const listEditor = (optionName:string, groupName:string, settings: Settings
    , setSettings: React.Dispatch<React.SetStateAction<Settings|undefined>>): JSX.Element => {
    const elements: number[] = settings[groupName][optionName].value;
    const setElements = (newValue: number[]) => {
        let tmp = Object.assign({}, settings);
        tmp[groupName][optionName].value = newValue;
        setSettings(tmp);
    }
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

export default SettingsBlock;