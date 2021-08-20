#!/bin/bash
read -p "Перейдем в домашнюю папку для начала"
cd ~
read -p "Сначала надо создать ключ, надо нажимать везде Enter и заводить стандартные значения. Жми Enter сейчас чтобы продолжить"
ssh-keygen -t ed25519 -C "git-reader@axon.expert"
echo "----"
cat ~/.ssh/id_ed25519.pub
echo "----"
read -p "Выше между ---- выведен закрытый ключ. Его надо целиком скопировать и добавить в ключи на гитхабе пользователя axon-git-reader. Как добавишь - жми Enter"
ssh -T git@github.com
read -p "Только что была проверка на то, что коннект корректный. Если что-то пошло не так - чини ). И жми Enter для продолжения"
read -p "Сначала поапдейтим всё на всякий случай. Жми Enter"
sudo apt-get update
sudo apt-get upgrade
sudo apt-get update
read -p "Теперь установим git, docker и docker-compose"
sudo apt-get install git
sudo apt-get install docker
sudo apt-get install docker-compose
read -p "Если всё ок - жми Enter для установки pip3"
sudo apt-get install python3-pip
read -p "Теперь надо поудалять докер и докер-компоуз и установить их из pip3, не спрашивай, так надо, жми Enter и со всем соглашайся"
sudo apt-get remove docker
sudo apt-get remove docker-compose 
sudo pip3 install docker
sudo pip3 install docker-compose
read -p "Если до сих пор всё успешно прошло - закачиваем наш ПАК"
git clone git@github.com:axon-expert/workstation.git
cd workstation
read -p "Теперь самое интересное - собираем наш ПАК и запускаем его. Жми Enter и подожди некоторое время"
sudo COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
sudo COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose up -d

