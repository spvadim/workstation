name = '20210302104647_pack_states'
dependencies = []


def upgrade(db):
    db.pack.update_many({'in_queue': True},
                        {'$set': {
                            "status": "под пинцетом"
                        }})
    db.pack.update_many({'in_queue': False}, {'$set': {"status": "на сборке"}})


def downgrade(db):
    db.pack.update_many({}, {'$unset': {"status": ""}})
