/*CREATE DATABASE chat;*/

USE chat;

DROP TABLE IF EXISTS `messages`;

CREATE TABLE messages (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `text` MEDIUMTEXT NOT NULL,
  `username` INTEGER NOT NULL DEFAULT 0,
  `roomname` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

/* Create other tables and define schemas for them here! */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(256) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `rooms`;

CREATE TABLE `rooms` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `roomname` VARCHAR(256) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
);

ALTER TABLE `messages` ADD FOREIGN KEY (username) REFERENCES `users` (`id`);
ALTER TABLE `messages` ADD FOREIGN KEY (roomname) REFERENCES `rooms` (`id`);

INSERT INTO users (username) values ('Anonymous');
INSERT INTO rooms (roomname) values ('Lobby');

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

