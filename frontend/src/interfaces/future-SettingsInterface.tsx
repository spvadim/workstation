import { float, int } from "@zxing/library/esm/customTypings";

export interface Setting {
    name: string,
    desc: string,
    title: string,
    value: string | int | boolean | int[] | float,
    value_type: "string" | "integer" | "bool" | "list" | "float"
}

export interface SettingsGroup {
    name: string,
    title: string,
    advanced: boolean,
    settings: Setting[]
}

export interface Settings {
    id: string,
    groups: SettingsGroup[]
}