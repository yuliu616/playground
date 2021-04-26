DROP TABLE IF EXISTS `family`;

CREATE TABLE `family` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL DEFAULT 1,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP,
  `father_id` bigint(20) DEFAULT NULL,
  `mother_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `family` 
ADD INDEX `ix_family_father_id` (`father_id` ASC);

ALTER TABLE `family` 
ADD INDEX `ix_family_mother_id` (`mother_id` ASC);
