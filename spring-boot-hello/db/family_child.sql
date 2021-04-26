DROP TABLE IF EXISTS `family_child`;

CREATE TABLE `family_child` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `family_id` bigint(20) NOT NULL,
  `child_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `family_child`
ADD INDEX `ix_family_child_family_id` (`family_id` ASC);

ALTER TABLE `family_child`
ADD INDEX `ix_family_child_child_id` (`child_id` ASC);
