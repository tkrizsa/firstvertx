--@xld-modelVersion	: 7d9189f9f40e5fb1d88f0ddd8ab7252c
--@xld-versionHint 	: initial

CREATE TABLE `auth.actor._x_.credent.email` (
	`aceId` 			INT AUTO_INCREMENT NOT NULL,
	`actorId` 			INT  NOT NULL,
	`credentEmailId` 	INT  NOT NULL,
	PRIMARY KEY(`aceId`),
	FOREIGN KEY (`actorId`) REFERENCES `auth.actor` (`actorId`) ,
	FOREIGN KEY (`credentEmailId`) REFERENCES `auth.credent.email` (`credentId`)
)


