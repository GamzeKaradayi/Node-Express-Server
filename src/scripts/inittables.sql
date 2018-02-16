CREATE TABLE house (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(20) NOT NULL
);

CREATE TABLE user (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username varchar(20) NOT NULL,
    password varchar(20) NOT NULL,
		isAdmin TINYINT(1) NOT NULL DEFAULT 0,
    houseId int,
		FOREIGN KEY (houseId)
			REFERENCES house(id)
			ON DELETE SET NULL
			ON UPDATE NO ACTION
);

CREATE TABLE task (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    description varchar(50) NOT NULL,
		done TINYINT(1) NOT NULL DEFAULT 0,
		userId int,
		FOREIGN KEY (userId)
			REFERENCES user(id)
			ON DELETE SET NULL
			ON UPDATE NO ACTION
);