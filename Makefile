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
		&& cypher-shell -u neo4j -p test -f commands.cypher" \
		&& echo "Browser running at localhost:7474, user: neo4j, pass: test"; \
	cd $(ROOT_DIR);

lab3:
	cd labs/lab3; \
	docker-compose up -d lab3 \
	&& docker-compose run cqlsh bin/bash -c "./wait-for-it.sh lab3:7000 && cqlsh lab3"; \
	cd $(ROOT_DIR);


clean:
	for n in 1 2 3; do \
		cd "labs/lab$$n"; \
		pwd; \
		docker-compose down; \
		cd $(ROOT_DIR); \
	done
