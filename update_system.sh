#!/bin/bash
echo "Stopping everything"
sudo docker-compose down
echo "Delete all not needed docker objects"
sudo docker system prune --force
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
read -p "Than rebuild docker containers and run them. Press Enter to continue"
sudo COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose up --build -d
