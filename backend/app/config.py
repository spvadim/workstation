import os

from app.models.system_settings.email_settings import MailSettings
from app.models.system_settings.erd_settings import (
    ERDBuzzerOID, ERDCommunityString, ERDFifthOID, ERDFirstOID, ERDFourthOID,
    ERDGreenOID, ERDIp, ERDRedOID, ERDSecondOID, ERDSettings, ERDSNMPPort,
    ERDThirdOID, ERDYellowOID, SecondERDSettings)
from app.models.system_settings.general_settings import (
    CurtainOpeningDelay, DaysToDelete, GeneralSettings, PintsetStop,
    ReportMaxCubes, ReportMaxDays, SendApplikatorTgMessage)
from app.models.system_settings.location_settings import (LocationSettings,
                                                          PlaceName, TimeZone)
from app.models.system_settings.pintset_settings import (
    PintsetBitNumber, PintsetByteNumber, PintsetDbName, PintsetIp, PintsetRack,
    PintsetReadingLength, PintsetSettings, PintsetSlot, PintsetStartingByte,
    PintsetTurningOffValue, PintsetTurningOnValue)
from app.models.system_settings.system_settings import SystemSettings
from app.models.system_settings.telegram_settings import (TGChat, TGSettings,
                                                          TGToken)

# set deafult location settings
default_place_name = PlaceName(value=os.getenv('DEFAULT_PLACE'))
default_time_zone = TimeZone(value=os.getenv('TZ'))
default_location_settings = LocationSettings(place_name=default_place_name,
                                             time_zone=default_time_zone)
# set default general settings
default_days_to_delete = DaysToDelete(
    value=os.getenv('DROP_DATA_INTERVAL_DAYS'))
default_send_applikator_tg_message = SendApplikatorTgMessage(
    value=os.getenv('SEND_TG_MESSAGE_AFTER_APPLIKATOR'))
default_pintset_stop = PintsetStop(value=os.getenv('PINTSET_STOP'))
default_report_max_days = ReportMaxDays(value=os.getenv('REPORT_MAX_DAYS'))
default_report_max_cubes = ReportMaxCubes(value=os.getenv('REPORT_MAX_CUBES'))
default_applikator_curtain_opening_delay = CurtainOpeningDelay(
    value=os.getenv('APPLIKATOR_CURTAIN_OPENING_DELAY'),
    title='Задержка открытия шторки после аппликатора',
    desc='Введите задержку открытия шторки после аппликатора в секундах')
default_camera_counter_curtain_opening_delay = CurtainOpeningDelay(
    title='Задержка открытия шторки после камеры-счетчика',
    desc='Введите задержку открытия шторки после камеры-счетчика в секундах')
default_dropping_mechanism_opening_delay = CurtainOpeningDelay(
    title='Задержка открытия скидывающего механизма',
    desc='Введите задержку открытия скидывающего механизма в секундах')
default_general_settings = GeneralSettings(
    days_to_delete=default_days_to_delete,
    send_applikator_tg_message=default_send_applikator_tg_message,
    pintset_stop=default_pintset_stop,
    report_max_days=default_report_max_days,
    report_max_cubes=default_report_max_cubes,
    applikator_curtain_opening_delay=default_applikator_curtain_opening_delay,
    camera_counter_curtain_opening_delay=default_camera_counter_curtain_opening_delay,
    dropping_mechanism_opening_delay=default_dropping_mechanism_opening_delay)

# set default pintset settings
default_pintset_ip = PintsetIp(value=os.getenv('PINTSET_IP'))
default_pintset_rack = PintsetRack(value=os.getenv('PINTSET_RACK'))
default_pintset_slot = PintsetSlot(value=os.getenv('PINTSET_SLOT'))
default_pintset_db_name = PintsetDbName(value=os.getenv('PINTSET_DB_NAME'))
default_pintset_starting_byte = PintsetStartingByte(
    value=os.getenv('PINTSET_STARTING_BYTE'))
default_pintset_reading_length = PintsetReadingLength(
    value=os.getenv('PINTSET_READING_LENGTH'))
default_pintset_byte_number = PintsetByteNumber(
    value=os.getenv('PINTSET_BYTE_NUMBER'))
default_pintset_bit_number = PintsetBitNumber(
    value=os.getenv('PINTSET_BIT_NUMBER'))
default_pintset_turning_off_value = PintsetTurningOffValue(
    value=os.getenv('PINTSET_TURNING_OFF_VALUE'))
default_pintset_turning_on_value = PintsetTurningOnValue(
    value=os.getenv('PINTSET_TURNING_ON_VALUE'))
default_pintset_settings = PintsetSettings(
    pintset_ip=default_pintset_ip,
    pintset_rack=default_pintset_rack,
    pintset_slot=default_pintset_slot,
    pintset_db_name=default_pintset_db_name,
    pintset_starting_byte=default_pintset_starting_byte,
    pintset_reading_length=default_pintset_reading_length,
    pintset_byte_number=default_pintset_byte_number,
    pintset_bit_number=default_pintset_bit_number,
    pintset_turning_off_value=default_pintset_turning_off_value,
    pintset_turning_on_value=default_pintset_turning_on_value)

# set default erd settings
default_erd_ip = ERDIp(value=os.getenv('ERD_IP'))
default_erd_snmp_port = ERDSNMPPort(value=os.getenv('ERD_SNMP_PORT'))
default_erd_community_string = ERDCommunityString(
    value=os.getenv('ERD_COMMUNITY_STRING'))
default_erd_red_oid = ERDRedOID(value=os.getenv('ERD_OID_RED'))
default_erd_yellow_oid = ERDYellowOID(value=os.getenv('ERD_OID_YELLOW'))
default_erd_green_oid = ERDGreenOID(value=os.getenv('ERD_OID_GREEN'))
default_erd_buzzer_oid = ERDBuzzerOID(value=os.getenv('ERD_OID_BUZZER'))
default_erd_settings = ERDSettings(
    erd_ip=default_erd_ip,
    erd_snmp_port=default_erd_snmp_port,
    erd_community_string=default_erd_community_string,
    erd_red_oid=default_erd_red_oid,
    erd_yellow_oid=default_erd_yellow_oid,
    erd_green_oid=default_erd_green_oid,
    erd_buzzer_oid=default_erd_buzzer_oid,
    erd_fifth_oid=ERDFifthOID())
default_second_erd_settings = SecondERDSettings(
    erd_ip=ERDIp(),
    erd_snmp_port=ERDSNMPPort(),
    erd_community_string=ERDCommunityString(),
    erd_first_oid=ERDFirstOID(),
    erd_second_oid=ERDSecondOID(),
    erd_third_oid=ERDThirdOID(),
    erd_fourth_oid=ERDFourthOID(),
    erd_fifth_oid=ERDFifthOID())

# set default telegram settings
default_tg_token = TGToken(value=os.getenv('TG_TOKEN'))
default_tg_chat = TGChat(value=os.getenv('TG_CHAT'))
default_tg_settings = TGSettings(tg_token=default_tg_token,
                                 tg_chat=default_tg_chat)
# set default email settings
default_mail_settings = MailSettings()

# set default settings
default_settings = SystemSettings(
    location_settings=default_location_settings,
    general_settings=default_general_settings,
    pintset_settings=default_pintset_settings,
    erd_settings=default_erd_settings,
    second_erd_settings=default_second_erd_settings,
    telegram_settings=default_tg_settings,
    mail_settings=default_mail_settings)
