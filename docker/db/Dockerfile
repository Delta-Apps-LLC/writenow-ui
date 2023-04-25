FROM postgres:14-alpine

COPY ./init.sql /docker-entrypoint-initdb.d/init.sql

#CMD ["postgres", "-c", "log_statement=all", "-c", "log_connections=true", "-c", "log_destination=stderr"]
