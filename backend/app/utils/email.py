from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from fastapi_mail.errors import ConnectionErrors
from loguru import logger

from ..db.system_settings import get_system_settings

email_logger = logger.bind(name="email")


async def send_email(subject: str, body: str) -> bool:
    settings = await get_system_settings()
    place_name = settings.location_settings.place_name.value
    mail_settings = settings.mail_settings

    if not mail_settings.send_email:
        return False

    conf = ConnectionConfig(
        MAIL_USERNAME=mail_settings.mail_username.value,
        MAIL_PASSWORD=mail_settings.mail_password.value,
        MAIL_FROM=mail_settings.mail_from.value,
        USE_CREDENTIALS=mail_settings.use_credentials.value,
        MAIL_SERVER=mail_settings.mail_server.value,
        MAIL_PORT=mail_settings.mail_port.value,
        MAIL_TLS=mail_settings.mail_tls.value,
        MAIL_SSL=mail_settings.mail_ssl.value,
    )

    message = MessageSchema(
        subject=f"{place_name} {subject}",
        recipients=[mail_settings.mail_to.value],
        body=body,
        subtype="html",
    )

    fm = FastMail(conf)
    email_logger.info("Попытка отправки email")
    try:
        await fm.send_message(message)
        email_logger.info("Email отправлен")
    except ConnectionErrors as e:
        email_logger.error(f"{e}")
        return False

    return True
