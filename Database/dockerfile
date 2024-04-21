FROM mysql:8.3.0

# Will change after development
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQ_DATABASE=IC_Moves

COPY ./schema.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

CMD [ "mysqld" ]