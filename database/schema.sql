CREATE DATABASE Memory_Game;
use Memory_Game;

# Creates the tables
CREATE TABLE Users(userID int auto_increment not null primary key, username varchar(20) not null unique, firstname varchar(20) not null, lastname varchar(25) not null, email varchar(30) not null unique, password varchar(64) not null, session_token varchar(64) unique);
CREATE TABLE Scores(scoreID int auto_increment not null primary key, score int not null, difficulty varchar(6) not null, userID int);