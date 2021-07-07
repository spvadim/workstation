from odmantic import EmbeddedModel


class PlaceName(EmbeddedModel):
    title: str = "Название текущей линии"
    desc: str = "Введите название текущей линии"
    value: str
    value_type: str = "string"


class TimeZone(EmbeddedModel):
    title: str = "Часовой пояс"
    desc: str = (
        "Введите часовой пояс в часах (+ к UTC). "
        "Пример: если вы хотите использовать московское время, "
        "нужно ввести 3"
    )
    value: int
    value_type: str = "integer"


class LocationSettings(EmbeddedModel):
    title: str = "Параметры текущего местоположения"
    advanced: bool = False
    place_name: PlaceName
    time_zone: TimeZone
