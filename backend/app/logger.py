import datetime
import logging
import sys
from pprint import pformat

from loguru import logger
from loguru._defaults import LOGURU_FORMAT


class InterceptHandler(logging.Handler):
    """
    Default handler from examples in loguru documentaion.
    """
    def emit(self, record: logging.LogRecord):
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where originated the logged message
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth,
                   exception=record.exc_info).log(level, record.getMessage())


class Rotator:
    def __init__(self, *, size, at):
        now = datetime.datetime.now()

        self._size_limit = size
        self._time_limit = now.replace(hour=at.hour,
                                       minute=at.minute,
                                       second=at.second)

        if now >= self._time_limit:
            # The current time is already past the target time so it would rotate already.
            # Add one day to prevent an immediate rotation.
            self._time_limit += datetime.timedelta(days=1)

    def should_rotate(self, message, file):
        file.seek(0, 2)
        if file.tell() + len(message) > self._size_limit:
            return True
        if message.record["time"].timestamp() > self._time_limit.timestamp():
            self._time_limit += datetime.timedelta(days=1)
            return True
        return False


def format_record(record: dict) -> str:
    """
    Custom format for loguru loggers.
    Uses pformat for log any data like request/response body during debug.
    Works with logging if loguru handler it.
    """

    format_string = LOGURU_FORMAT
    if record["extra"].get("payload") is not None:
        record["extra"]["payload"] = pformat(record["extra"]["payload"],
                                             indent=4,
                                             compact=True,
                                             width=88)
        format_string += "\n<level>{extra[payload]}</level>"

    format_string += "{exception}\n"
    return format_string


def make_filter(name):
    def filter(record):
        return record["extra"].get("name") == name

    return filter


def init_logging():
    """
    Replaces logging handlers with a handler for using the custom handler.
    WARNING!
    if you call the init_logging in startup event function,
    then the first logs before the application start will be in the old format
    """

    # disable handlers for specific uvicorn loggers
    # to redirect their output to the default uvicorn logger
    intercept_handler = InterceptHandler()
    loggers = (logging.getLogger(name)
               for name in logging.root.manager.loggerDict
               if name.startswith("uvicorn."))
    for uvicorn_logger in loggers:
        uvicorn_logger.handlers = [intercept_handler]

    # change handler for default uvicorn logger
    logging.getLogger("uvicorn").handlers = [intercept_handler]

    # rotator = Rotator(size=5e+8, at=datetime.time(0, 0, 0))

    # set logs output, level and format
    logger.configure(handlers=[{
        "sink": sys.stdout,
        "level": logging.DEBUG,
        "format": format_record,
        "enqueue": True
    }, {
        "sink": "logs/deep_logs.log",
        "level": logging.DEBUG,
        "format": format_record,
        "filter": make_filter('deep'),
        # "rotation": rotator.should_rotate,
        "enqueue": True
    }, {
        "sink": "logs/wdiot_logs.log",
        "level": logging.DEBUG,
        "format": format_record,
        "filter": make_filter('wdiot'),
        # "rotation": rotator.should_rotate,
        "enqueue": True
    }, {
        "sink": "logs/erd_logs.log",
        "level": logging.DEBUG,
        "format": format_record,
        "filter": make_filter('erd'),
        # "rotation": rotator.should_rotate,
        "enqueue": True
    }, {
        "sink": "logs/tg_logs.log",
        "level": logging.DEBUG,
        "format": format_record,
        "filter": make_filter('tg'),
        # "rotation": rotator.should_rotate,
        "enqueue": True
    }, {
        "sink": "logs/email_logs.log",
        "level": logging.DEBUG,
        "format": format_record,
        "filter": make_filter('email'),
        # "rotation": rotator.should_rotate,
        "enqueue": True
    }])
