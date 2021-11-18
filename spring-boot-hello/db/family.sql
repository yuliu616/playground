DROP TABLE IF EXISTS `ppl_family`;

CREATE TABLE `ppl_family` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL DEFAULT 1,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP,
  `father_id` bigint(20) NULL,
  `mother_id` bigint(20) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `ppl_family`
ADD INDEX `ix_ppl_family_father_id` (`father_id` ASC);

ALTER TABLE `ppl_family`
ADD INDEX `ix_ppl_family_mother_id` (`mother_id` ASC);
