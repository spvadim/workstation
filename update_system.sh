#!/bin/bash
branch="main"
echo "Stopping everything"
sudo docker-compose down
read -p "Than switch to '$branch'. Press Enter to continue"
git checkout $branch
read -p "Than pull changes from '$branch'. Press Enter to continue"
git pull origin $branch
read -p "Than rebuild docker containers and run them. Press Enter to continue"
sudo docker-compose up --build -d