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
		houseId int NOT NULL ,
		createdUserId int NOT NULL ,
		FOREIGN KEY (userId)
			REFERENCES user(id)
			ON DELETE SET NULL
			ON UPDATE NO ACTION,
		FOREIGN KEY (createdUserId)
			REFERENCES user(id)
			ON DELETE NO ACTION
			ON UPDATE NO ACTION,
		FOREIGN KEY (houseId)
			REFERENCES house(id)
			ON DELETE CASCADE
			ON UPDATE NO ACTION
);


INSERT INTO house (`name`) VALUES ('houseA');
INSERT INTO house (`name`) VALUES ('houseB');
INSERT INTO house (`name`) VALUES ('houseC');
INSERT INTO house (`name`) VALUES ('houseD');

INSERT INTO USER (`username`, `password`, `isAdmin`) VALUES ('adminuser', 'acc2018', '1');
INSERT INTO USER (`username`, `password`, `isAdmin`, `houseId`) VALUES ('user1', 'cscon18', '0', '1');
INSERT INTO USER (`username`, `password`, `isAdmin`, `houseId`) VALUES ('user2', 'cscon18', '0', '1');

INSERT INTO task (`description`, `done`, `userId`, `houseId`, `createdUserId`) VALUES ('task1', false, '1', '1', '1');
INSERT INTO task (`description`, `done`, `userId`, `houseId`, `createdUserId`) VALUES ('task2', true, '1', '1', '1');
INSERT INTO task (`description`, `done`, `userId`, `houseId`, `createdUserId`) VALUES ('task3', false, '2', '1', '1');
INSERT INTO task (`description`, `done`, `userId`, `houseId`, `createdUserId`) VALUES ('task4', false, null, '1', '1');