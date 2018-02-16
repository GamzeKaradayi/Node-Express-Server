create database houseworkup DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;

create user 'houseworkdbuser'@'localhost' identified by 'houseworkdbuser';

create user 'houseworkdbuser'@'%' identified by 'houseworkdbuser';

GRANT ALL PRIVILEGES ON *.* TO 'houseworkdbuser'@'localhost'  WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON *.* TO 'houseworkdbuser'@'%'  WITH GRANT OPTION;

FLUSH PRIVILEGES;