ROOT_DIR:=$(notdir $(shell pwd))


lab1:
	cd labs/lab1; docker-compose up -d --build lab1; sleep 2; \
	docker exec -it lab1_lab1_1 /bin/bash -c \
	"/code/wait-for-it.sh localhost:27017 && mongo localhost:27017 /code/script.js"; \
	cd ../..;

down:
	docker-compose down