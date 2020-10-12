FROM mongo

ENV MONGO_INITDB_ROOT_USERNAME dbadmin
ENV MONGO_INITDB_ROOT_PASSWORD dbadminpassword
ENV MONGO_INITDB_DATABASE admin

COPY init-mongo.js /docker-entrypoint-initdb.d/
COPY script.js /code/
COPY wait-for-it.sh /code/