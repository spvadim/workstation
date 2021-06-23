"""
Add new settings for curtain delay for new method
"""
from app.config import (default_applikator_curtain_opening_delay_bad_height,
                        default_applikator_curtain_opening_delay_bad_label,
                        default_applikator_curtain_opening_delay_bad_packing)

name = '20210623075307'
dependencies = ['20210312063035']


def upgrade(db):
    db.system_settings.update_many({}, {
        '$set': {
            'general_settings.applikator_curtain_opening_delay_bad_height':
            default_applikator_curtain_opening_delay_bad_height.dict(),
            'general_settings.applikator_curtain_opening_delay_bad_label':
            default_applikator_curtain_opening_delay_bad_label.dict(),
            'general_settings.applikator_curtain_opening_delay_bad_packing':
            default_applikator_curtain_opening_delay_bad_packing.dict(),
        }
    })


def downgrade(db):
    db.system_settings.update_many({}, {
        '$unset': {
            'general_settings.applikator_curtain_opening_delay_bad_height': '',
            'general_settings.applikator_curtain_opening_delay_bad_label': '',
            'general_settings.applikator_curtain_opening_delay_bad_packing': ''
        }
    })
