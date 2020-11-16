#!/usr/bin/env bash
set -eu
mongo -- "$DB_NAME" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);

    var user = '$DB_USER';
    var passwd = '${DB_PASSWORD-}' || user;
    db.createUser({user: user, pwd: passwd, roles: ["dbOwner"]});
EOF