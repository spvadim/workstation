import { float } from "@zxing/library/esm/customTypings";

export interface Setting {
    desc: string,
    title: string,
    value: string | number | boolean | number[] | float,
    value_type: "string" | "integer" | "bool" | "list" | "float"
}

export interface Settings {
    id: string,
    general_settings: {
        title: string,
        advanced: boolean,
        pintset_stop: Setting,
        sync_request: Setting,
        sync_raise_damper: Setting,
        send_applikator_tg_message: Setting,
        report_max_days: Setting,
        report_max_cubes: Setting,
        applikator_curtain_opening_delay: Setting,
        applikator_curtain_opening_delay_bad_height: Setting,
        applikator_curtain_opening_delay_bad_label: Setting,
        applikator_curtain_opening_delay_bad_packing: Setting,
        camera_counter_curtain_opening_delay: Setting,
        dropping_mechanism_opening_delay: Setting,
        ftp_url: Setting,
        video_time_delta: Setting,
        camera_list: Setting,
        check_cube_qr: Setting,
        delete_non_empty_packs: Setting
    },
    location_settings: {
        title: string,
        advanced: boolean,
        place_name: Setting,
        time_zone: Setting
    },
    erd_settings: {
        title: string,
        advanced: boolean,
        erd_ip: Setting,
        erd_snmp_port: Setting,
        erd_community_string: Setting,
        erd_red_oid: Setting,
        erd_yellow_oid: Setting,
        erd_green_oid: Setting,
        erd_buzzer_oid: Setting,
        erd_fifth_oid: Setting
    },
    second_erd_settings: {
        title: string,
        advanced: boolean,
        erd_ip: Setting,
        erd_snmp_port: Setting,
        erd_community_string: Setting,
        erd_first_oid: Setting,
        erd_second_oid: Setting,
        erd_third_oid: Setting,
        erd_fourth_oid: Setting,
        erd_fifth_oid: Setting,
        delay_before_damper: Setting,
        delay_before_ejector: Setting,
        delay_after_ejector: Setting
    },
    pintset_settings: {
        title: string,
        advanced: boolean,
        pintset_ip: Setting,
        pintset_rack: Setting,
        pintset_slot: Setting,
        pintset_db_name: Setting,
        pintset_starting_byte: Setting,
        pintset_reading_length: Setting,
        pintset_byte_number: Setting,
        pintset_bit_number: Setting,
        pintset_turning_off_value: Setting,
        pintset_turning_on_value: Setting,
        pintset_curtain_opening_duration: Setting
    },
    telegram_settings: {
        title: string,
        advanced: boolean,
        tg_token: Setting,
        tg_chat: Setting
    },
    mail_settings: {
        title: string,
        advanced: boolean,
        send_email: Setting,
        use_credentials: Setting,
        mail_username: Setting,
        mail_password: Setting,
        mail_server: Setting,
        mail_port: Setting,
        mail_ssl: Setting,
        mail_tls: Setting,
        mail_from: Setting,
        mail_to: Setting
    },
    desync_settings: {
        title: string,
        advanced: boolean,
        max_packs_multiplier: Setting,
        max_packs_on_assembly_multiplier: Setting,
        max_multipacks_exited_pintset_multiplier: Setting,
        max_wrapping_multipacks: Setting,
        max_multipacks_entered_pitchfork_multiplier: Setting,
        max_multipacks_on_packing_table_multiplier: Setting
    }
}