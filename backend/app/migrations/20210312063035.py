from app.config import default_mail_settings
"""
Add email settings to existing settings
"""
name = '20210312063035'
dependencies = ['20210302104647_pack_states']


def upgrade(db):
    db.system_settings.update_many(
        {}, {'$set': {
            'mail_settings': default_mail_settings.dict()
        }})


def downgrade(db):
    db.system_settings.update_many({}, {'$unset': {"mail_settings": ""}})
