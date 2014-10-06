--@xld-modelVersion	: 339c8500fd0f3b06d9a982f5cadc66a8
--@xld-versionHint 	: initial

CREATE TABLE `auth.credent.email` (
	`credentId` 	INT AUTO_INCREMENT NOT NULL,
	`email` 		VARCHAR(250)  NOT NULL,
	`password` 		VARCHAR(32)  NOT NULL,
	PRIMARY KEY(`credentId`)
)
