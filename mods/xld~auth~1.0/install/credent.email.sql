--@xld-modelVersion	: fba7797124dad5bfe985150bf1490c48
--@xld-versionHint 	: initial

CREATE TABLE credentEmail (
	`credentId` 	INT AUTO_INCREMENT NOT NULL,
	`email` 		VARCHAR(250)  NOT NULL,
	`password` 		VARCHAR(32)  NOT NULL,
	PRIMARY KEY(`credentId`)
)
