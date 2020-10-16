ROOT_DIR:=$(notdir $(shell pwd))

lab1: _up
	sleep 2
	docker exec -it $(ROOT_DIR)_lab1_1 /bin/bash -c \
	"/code/wait-for-it.sh localhost:27017 && mongo localhost:27017 /code/script.js"

# run any lab in background
_up:
	docker-compose up -d --build $(MAKECMDGOALS)

down:
	docker-compose down