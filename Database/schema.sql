CREATE DATABASE Memory_Game;
use Memory_Game;

# Creates the tables
CREATE TABLE Users(userID int auto_increment not null primary key, username varchar(20) not null, firstname varchar(20) not null, lastname varchar(25) not null, email varchar(30) not null, password varchar(64) not null, session_token varchar(64) not null)