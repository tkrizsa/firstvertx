ALTER TABLE `partner`
MODIFY `partnerId` INT NOT NULL AUTO_INCREMENT,
MODIFY `partnerName` VARCHAR(100) NOT NULL ,
MODIFY `partnerStatus` ENUM('programmer','customer','stranger') NOT NULL 
