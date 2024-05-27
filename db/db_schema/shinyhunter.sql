/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `method` (
    `mtd_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `mtd_name` varchar(100) NOT NULL,
    `mtd_odds` int(4) unsigned NOT NULL,
    `mtd_charm_odds` int(4) unsigned NOT NULL,
    PRIMARY KEY (`mtd_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `method`;

INSERT INTO `method` (`mtd_name`, `mtd_odds`, `mtd_charm_odds`) VALUES ('Masuda', 683, 512), ('Random Encounter', 8192, 2371), ('Soft Reset', 8192, 2371);


CREATE TABLE IF NOT EXISTS `user` (
    `usr_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `usr_first_name` varchar(100) NOT NULL,
    `usr_last_name` varchar(100) NOT NULL,
    `usr_username` varchar(150) NOT NULL,
    `usr_password` varchar(255) NOT NULL,
    `usr_salt` varchar(255) NOT NULL,
    `usr_avatar` varchar(150) NOT NULL,
    `usr_stg_dark` bit NOT NULL DEFAULT 0,
    `usr_stg_notify` bit NOT NULL DEFAULT 1,
    `usr_stg_text` bit NOT NULL DEFAULT 0,
    PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `user`;

CREATE TABLE IF NOT EXISTS `hunt` (
    `hnt_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `pkm_name` varchar(18) NOT NULL,
    `usr_id` int(10) unsigned NOT NULL,
    `gam_name` varchar(18)  NOT NULL,
    `mtd_id` int(10) unsigned NOT NULL,
    `hnt_start_date_string` varchar(100) NOT NULL,
    `hnt_end_date_string` varchar(100) DEFAULT NULL,
    `hnt_time_s` int(10) unsigned NOT NULL DEFAULT 0,
    `hnt_count` int(6) unsigned NOT NULL DEFAULT 0,
    `hnt_inc` int(2) unsigned NOT NULL DEFAULT 1,
    `hnt_charm` int(1) NOT NULL DEFAULT 0,
    `hnt_nnm` varchar(18) DEFAULT NULL,
    `pkm_sprite` varchar(60) NOT NULL,
    KEY `FK_MTD_ID` (`mtd_id`),
    KEY `FK_USR_ID` (`usr_id`),
    CONSTRAINT `FK_MTD_ID` FOREIGN KEY (`mtd_id`) REFERENCES `method` (`mtd_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_USR_ID` FOREIGN KEY (`usr_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    PRIMARY KEY (`hnt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
DELETE FROM `hunt`;
INSERT INTO `hunt` (`pkm_name`, `usr_id`, `gam_name`, `mtd_id`, `hnt_start_date_string`, `hnt_end_date_string`, `hnt_time_s`, `hnt_count`, `hnt_inc`, `hnt_charm`, `hnt_nnm`, `pkm_sprite`) 
VALUES ('pikachu', 1, 'Pokemon Black', '1', '2020-05-11T00:00:00.000Z', '2020-05-12T00:00:00.000Z', 500, 500, 5, 0, 'test1', '/images/bleachg2.png'), 
('pikachu', 1, 'Pokemon Black', '1', '2020-05-11T00:00:00.000Z', '2020-05-12T00:00:00.000Z', 500, 500, 5, 0, 'test2', '/images/bleachg2.png'),
('pikachu', 1, 'Pokemon Black', '1', '2020-05-11T00:00:00.000Z', '2020-05-12T00:00:00.000Z', 500, 500, 5, 0, 'test3', '/images/bleachg2.png');





/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
