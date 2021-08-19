#!/bin/bash
branch=$(git rev-parse --abbrev-ref HEAD)
echo "Here all the branches"
git branch
echo "Current branch is '$branch'. To change branch run 'git checkout <branch_name>' or 'git checkout -b <branch_name>' if branch is not in list above"
# read -p "Than switch to '$branch'. Press Enter to continue"
# git checkout $branch
read -p "Than pull changes from '$branch'. Press Enter to continue"
git pull origin $branch
# echo "Press Enter to continue or input 'delete_all' to delete all docker containers"
# read delete_all
# if [[ "$delete_all" == "delete_all" ]]; then
#     echo "try to delete"
# fi
read -p "Than rebuild docker containers. Press Enter to continue"
sudo COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
echo "Delete all not needed docker objects"
sudo docker system prune --force
read -p "Than restarting docker containers. Press Enter to continue"
echo "Restarting"
sudo docker-compose down

# rename all logs to start new one
tmp_env=$(date +%FT%H-%M-%S)
sudo mv logs/deep_logs.log logs/deep_logs.$tmp_env.log
sudo mv logs/email_logs.log logs/email_logs.$tmp_env.log
sudo mv logs/erd_logs.log logs/erd_logs.$tmp_env.log
sudo mv logs/tg_logs.log logs/tg_logs.$tmp_env.log
sudo mv logs/wdiot_logs.log logs/wdiot_logs.$tmp_env.log

sudo COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose up -d
echo "Running migrations"
sudo docker-compose run --entrypoint /migrate.sh --rm docker-fastapi
