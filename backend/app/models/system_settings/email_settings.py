from odmantic import EmbeddedModel
from pydantic import EmailStr


class SendEmail(EmbeddedModel):
    title: str = "Дублировать ли лог МПЗВ на почту"
    desc: str = "Выберите, дублировать ли лог МПЗВ на почту"
    value: bool = True
    value_type: str = "bool"


class UseCredentials(EmbeddedModel):
    title: str = "Использовать ли логин/пароль для аутентификации"
    desc: str = (
        "Выберите, использовать ли логин/пароль для аутентификации " "на SMTP сервере"
    )
    value: bool = False
    value_type: str = "bool"


class MailUsername(EmbeddedModel):
    title: str = "Логин для SMTP сервера"
    desc: str = (
        "Некоторые SMTP сервера разделяют логин и адрес отправителя. "
        "Если используемый SMTP сервер этого не делает, используйте "
        "вместо логина адрес отправителя"
    )
    value: str = "someusername"
    value_type: str = "string"


class MailPassword(EmbeddedModel):
    title: str = "Пароль для SMTP сервера"
    desc: str = "Введите пароль для SMTP сервера"
    value: str = "somepassword"
    value_type: str = "string"


class MailServer(EmbeddedModel):
    title: str = "SMTP сервер"
    desc: str = "Введите адрес SMTP сервера"
    value: str = "smtp.tn.ru"
    value_type: str = "string"


class MailPort(EmbeddedModel):
    title: str = "Порт SMTP сервера"
    desc: str = "Введите порт SMTP сервера"
    value: int = 25
    value_type: str = "integer"


class MailSSL(EmbeddedModel):
    title: str = "Использовать ли SSL"
    desc: str = "Выберите, использовать ли SSL"
    value: bool = False
    value_type: str = "bool"


class MailTLS(EmbeddedModel):
    title: str = "Использовать ли TLS"
    desc: str = "Выберите, использовать ли TLS"
    value: bool = False
    value_type: str = "bool"


class MailFrom(EmbeddedModel):
    title: str = "Адрес отправителя письма"
    desc: str = "Введите адрес отправителя письма"
    value: EmailStr = "forward2axon.expert@tn.ru"
    value_type: str = "string"


class MailTo(EmbeddedModel):
    title: str = "Адрес получателя письма"
    desc: str = "Введите адрес получателя пиьсма"
    value: EmailStr = "shafievd@tn.ru"
    value_type: str = "string"


class MailSettings(EmbeddedModel):
    title: str = "Настройки электронной почты"
    advanced: bool = True
    send_email: SendEmail = SendEmail()
    use_credentials: UseCredentials = UseCredentials()
    mail_username: MailUsername = MailUsername()
    mail_password: MailPassword = MailPassword()
    mail_server: MailServer = MailServer()
    mail_port: MailPort = MailPort()
    mail_ssl: MailSSL = MailSSL()
    mail_tls: MailTLS = MailTLS()
    mail_from: MailFrom = MailFrom()
    mail_to: MailTo = MailTo()
