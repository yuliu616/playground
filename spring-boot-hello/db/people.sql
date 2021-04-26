DROP TABLE IF EXISTS `people`;

CREATE TABLE `people` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL DEFAULT 1,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_active` bit(1) NOT NULL DEFAULT b'0',
  `first_name` varchar(120) DEFAULT NULL,
  `last_name` varchar(120) DEFAULT NULL,
  `nickname` varchar(120) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `height_in_cm` decimal(8,2) NULL,
  `weight_in_kg` decimal(8,4) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `people`
ADD INDEX `ix_people_gender` (`gender` ASC);

ALTER TABLE `people`
ADD INDEX `ix_people_date_of_birth` (`date_of_birth` ASC);

ALTER TABLE `people`
ADD INDEX `ix_people_first_name` (`first_name` ASC);

ALTER TABLE `people`
ADD INDEX `ix_people_last_name` (`last_name` ASC);

ALTER TABLE `people`
ADD INDEX `ix_people_nickname` (`nickname` ASC);
