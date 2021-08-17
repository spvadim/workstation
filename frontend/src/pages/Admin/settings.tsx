import { float } from "@zxing/library/esm/customTypings";

interface Setting<T> {
    desc: string,
    title: string,
    value: T,
    value_type: "string" | "integer" | "bool" | "list" | "float"
}

interface Settings {
    id: string,
    general_settings: {
        title: string,
        advanced: boolean,
        pintset_stop: Setting<boolean>,
        sync_request: Setting<boolean>,
        sync_raise_damper: Setting<boolean>,
        send_applikator_tg_message: Setting<boolean>,
        report_max_days: Setting<number>,
        report_max_cubes: Setting<number>,
        applikator_curtain_opening_delay: Setting<number>,
        applikator_curtain_opening_delay_bad_height: Setting<number>,
        applikator_curtain_opening_delay_bad_label: Setting<number>,
        applikator_curtain_opening_delay_bad_packing: Setting<number>,
        camera_counter_curtain_opening_delay: Setting<number>,
        dropping_mechanism_opening_delay: Setting<number>,
        ftp_url: Setting<string>,
        video_time_delta: Setting<number>,
        camera_list: Setting<number[]>,
        check_cube_qr: Setting<boolean>,
        delete_non_empty_packs: Setting<boolean>
    },
    location_settings: {
        title: string,
        advanced: boolean,
        place_name: Setting<string>,
        time_zone: Setting<number>
    },
    erd_settings: {
        title: string,
        advanced: boolean,
        erd_ip: Setting<string>,
        erd_snmp_port: Setting<number>,
        erd_community_string: Setting<string>,
        erd_red_oid: Setting<string>,
        erd_yellow_oid: Setting<string>,
        erd_green_oid: Setting<string>,
        erd_buzzer_oid: Setting<string>,
        erd_fifth_oid: Setting<string>
    },
    second_erd_settings: {
        title: string,
        advanced: boolean,
        erd_ip: Setting<string>,
        erd_snmp_port: Setting<number>,
        erd_community_string: Setting<string>,
        erd_first_oid: Setting<string>,
        erd_second_oid: Setting<string>,
        erd_third_oid: Setting<string>,
        erd_fourth_oid: Setting<string>,
        erd_fifth_oid: Setting<string>,
        delay_before_damper: Setting<float>,
        delay_before_ejector: Setting<float>,
        delay_after_ejector: Setting<float>
    },
    pintset_settings: {
        title: string,
        advanced: boolean,
        pintset_ip: Setting<string>,
        pintset_rack: Setting<number>,
        pintset_slot: Setting<number>,
        pintset_db_name: Setting<number>,
        pintset_starting_byte: Setting<number>,
        pintset_reading_length: Setting<number>,
        pintset_byte_number: Setting<number>,
        pintset_bit_number: Setting<number>,
        pintset_turning_off_value: Setting<boolean>,
        pintset_turning_on_value: Setting<boolean>,
        pintset_curtain_opening_duration: Setting<number>
    },
    telegram_settings: {
        title: string,
        advanced: boolean,
        tg_token: Setting<string>,
        tg_chat: Setting<string>
    },
    mail_settings: {
        title: string,
        advanced: boolean,
        send_email: Setting<boolean>,
        use_credentials: Setting<boolean>,
        mail_username: Setting<string>,
        mail_password: Setting<string>,
        mail_server: Setting<string>,
        mail_port: Setting<number>,
        mail_ssl: Setting<boolean>,
        mail_tls: Setting<boolean>,
        mail_from: Setting<string>,
        mail_to: Setting<string>
    },
    desync_settings: {
        title: string,
        advanced: boolean,
        max_packs_multiplier: Setting<number>,
        max_packs_on_assembly_multiplier: Setting<number>,
        max_multipacks_exited_pintset_multiplier: Setting<number>,
        max_wrapping_multipacks: Setting<number>,
        max_multipacks_entered_pitchfork_multiplier: Setting<number>,
        max_multipacks_on_packing_table_multiplier: Setting<number>
    }
}

export default Settings;