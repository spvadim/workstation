from app.db.system_settings import get_system_settings
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema


async def send_email(subject: str, body: str) -> bool:
    settings = await get_system_settings()
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

    message = MessageSchema(subject=subject,
                            recipients=[mail_settings.mail_to.value],
                            body=body,
                            subtype="html")

    fm = FastMail(conf)
    await fm.send_message(message)

    return True
