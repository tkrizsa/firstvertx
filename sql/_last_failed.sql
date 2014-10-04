
CREATE TABLE actor_x_CredentEmail (
	`aceId` 			INT AUTO_INCREMENT NOT NULL,
	`actorId` 			VARCHAR(250)  NOT NULL,
	`credentEmailId` 	VARCHAR(32)  NOT NULL,
	PRIMARY KEY(`aceId`),
	FOREIGN KEY (`actorId`) REFERENCES `actor` (`actorId`) 
)


--	FOREIGN KEY (`credentEmailId`) REFERENCES `credentEmail` (`credentId`)

