import os

from app.models.system_settings.erd_settings import (ERDBuzzerOID,
                                                     ERDCommunityString,
                                                     ERDGreenOID, ERDIp,
                                                     ERDRedOID, ERDSettings,
                                                     ERDSNMPPort, ERDYellowOID)
from app.models.system_settings.general_settings import (
    DaysToDelete, GeneralSettings, PintsetStop, SendApplikatorTgMessage)
from app.models.system_settings.location_settings import (LocationSettings,
                                                          PlaceName, TimeZone)
from app.models.system_settings.pintset_settings import (
    PintsetBitNumber, PintsetByteNumber, PintsetDbName, PintsetIp, PintsetRack,
    PintsetReadingLength, PintsetSettings, PintsetSlot, PintsetStartingByte,
    PintsetTurningOffValue, PintsetTurningOnValue)

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
default_general_settings = GeneralSettings(
    days_to_delete=default_days_to_delete,
    send_applikator_tg_message=default_send_applikator_tg_message,
    pintset_stop=default_pintset_stop)

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
    erd_buzzer_oid=default_erd_buzzer_oid)
