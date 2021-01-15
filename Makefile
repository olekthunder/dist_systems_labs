ROOT_DIR:=$(shell pwd)


lab1:
	cd labs/lab1; \
	docker-compose up -d --build lab1; sleep 2; \
	docker exec -it lab1 /bin/bash -c \
		"/code/wait-for-it.sh localhost:27017 && mongo localhost:27017 /code/script.js"; \
	docker-compose down; \
	cd $(ROOT_DIR);

lab2:
	cd labs/lab2; \
	docker-compose up -d --build lab2; \
	docker exec -it lab2 /bin/bash -c "./wait-for-it.sh localhost:7687 \
		&& cypher-shell -u neo4j -p test -f commands.cypher"; \
	docker-compose down; \
	cd $(ROOT_DIR);
