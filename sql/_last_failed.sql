
CREATE TABLE `auth.actor._x_.credent.email` (
	`aceId` 			INT AUTO_INCREMENT NOT NULL,
	`actorId` 			INT  NOT NULL,
	`credentEmailId` 	INT  NOT NULL,
	PRIMARY KEY(`aceId`),
	FOREIGN KEY (`actorId`) REFERENCES `actor` (`actorId`) ,
	FOREIGN KEY (`credentEmailId`) REFERENCES `credentEmail` (`credentId`)
)


