from typing import List, Optional

from odmantic import EmbeddedModel


class FtpUrl(EmbeddedModel):
    title: str = "Ссылка на FTP сервер"
    desc: str = "Введите ссылку на FTP сервер"
    value: str = "ftp://10.14.2.21/empty"
    value_type: str = "string"


class DaysToDelete(EmbeddedModel):
    title: str = "Период хранения данных в базе"
    desc: str = "Введите количество дней хранения данных в базе"
    value: int
    value_type: str = "integer"


class PintsetStop(EmbeddedModel):
    title: str = "Остановка пинцета"
    desc: str = "Выберите, останавливать ли пинцет в случае ошибок"
    value: bool
    value_type: str = "bool"


class SyncRequest(EmbeddedModel):
    title: str = "Запрос синхронизации"
    desc: str = "Выберите, запрашивать ли синхронизацию в случае ошибок"
    value: bool = True
    value_type: str = "bool"


class SyncRaiseDamper(EmbeddedModel):
    title: str = "Поднимать ли шторку во время синхронизации"
    desc: str = "Выберите, поднимать ли шторку во время синхронизации"
    value: bool = False
    value_type: str = "bool"


class SendApplikatorTgMessage(EmbeddedModel):
    title: str = "Отправка сообщения в тг после ошибки на аппликаторе"
    desc: str = (
        "Выберите, отправлять ли сообщение в тг в случае " "ошибки на аппликаторе"
    )
    value: bool
    value_type: str = "bool"


class CurtainOpeningDelay(EmbeddedModel):
    title: str
    desc: str
    value: Optional[int]
    value_type: str = "integer"


class ReportMaxDays(EmbeddedModel):
    title: str = "Максимальное количество дней отчета"
    desc: str = "Введите максимальное количество дней для отчета"
    value: int
    value_type: str = "integer"


class ReportMaxCubes(EmbeddedModel):
    title: str = "Максимальное количество кубов в отчете"
    desc: str = "Введите максимальное количество кубов в отчете"
    value: int
    value_type: str = "integer"


class VideoTimeDelta(EmbeddedModel):
    title: str = "Дельта для поиска времени на видео"
    desc: str = "Введите дельту в секундах"
    value: int = 60
    value_type: str = "integer"


class CameraList(EmbeddedModel):
    title: str = "Список номеров камер"
    desc: str = "Введите список камер"
    value: List[int] = [1, 2, 4, 6, 7]
    value_type: str = "list"


class CheckCubeQr(EmbeddedModel):
    title: str = "Проверка QR куба"
    desc: str = "Выберите, проверять ли QR куба"
    value: bool = False
    value_type: str = "bool"


class DeleteNonEmptyPacks(EmbeddedModel):
    title: str = "Удаление не пустых пачек при превышении допустимого количества пачек во время подъема пинцета"
    desc: str = "Выберите, удалять ли не пустые пачки"
    value: bool = False
    value_type: str = "bool"


class GeneralSettings(EmbeddedModel):
    title: str = "Общие настройки"
    advanced: bool = False
    pintset_stop: PintsetStop
    sync_request: SyncRequest = SyncRequest()
    sync_raise_damper: SyncRaiseDamper = SyncRaiseDamper()
    send_applikator_tg_message: SendApplikatorTgMessage
    report_max_days: ReportMaxDays
    report_max_cubes: ReportMaxCubes
    applikator_curtain_opening_delay: CurtainOpeningDelay
    applikator_curtain_opening_delay_bad_height: Optional[CurtainOpeningDelay]
    applikator_curtain_opening_delay_bad_label: Optional[CurtainOpeningDelay]
    applikator_curtain_opening_delay_bad_packing: Optional[CurtainOpeningDelay]
    camera_counter_curtain_opening_delay: Optional[CurtainOpeningDelay]
    dropping_mechanism_opening_delay: Optional[CurtainOpeningDelay]
    ftp_url: FtpUrl = FtpUrl()
    video_time_delta: VideoTimeDelta = VideoTimeDelta()
    camera_list: CameraList = CameraList()
    check_cube_qr: CheckCubeQr = CheckCubeQr()
    delete_non_empty_packs: DeleteNonEmptyPacks = DeleteNonEmptyPacks()
