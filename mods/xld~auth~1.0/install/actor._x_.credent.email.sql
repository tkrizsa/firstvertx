--@xld-modelVersion	: f75106966609f99fe76647bddab20df5
--@xld-versionHint 	: initial

CREATE TABLE actor_x_CredentEmail (
	`aceId` 			INT AUTO_INCREMENT NOT NULL,
	`actorId` 			INT  NOT NULL,
	`credentEmailId` 	INT  NOT NULL,
	PRIMARY KEY(`aceId`),
	FOREIGN KEY (`actorId`) REFERENCES `actor` (`actorId`) ,
	FOREIGN KEY (`credentEmailId`) REFERENCES `credentEmail` (`credentId`)
)



