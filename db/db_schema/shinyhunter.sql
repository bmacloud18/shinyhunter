/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `game` (
    `gam_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `gam_name` varchar(100) NOT NULL,
    `gam_avatar` varchar(150) NOT NULL,
    PRIMARY KEY (`pkm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `game`;
INSERT INTO `game` (`gam_name`, `gam_avatar`) VALUES
    ('Red', 'Red.jpeg');


CREATE TABLE IF NOT EXISTS `pokemon` (
    `pkm_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `pkm_name` varchar(100) NOT NULL,
    `pkm_avatar` varchar(150) NOT NULL,
    `pkm_type` varchar(100) NOT NULL,
    PRIMARY KEY (`pkm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `pokemon`;
INSERT INTO `pokemon` (`pkm_name`, `pkm_avatar`, `pkm_type`) VALUES
    ('Bulbasaur', 'Bulbasaur.png', 'grass');

CREATE TABLE IF NOT EXISTS `hunt` (
    `hnt_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `pkm_id` int(10) unsigned NOT NULL,
    `usr_id` int(10) unsigned NOT NULL,
    `gam_id` int(10) unsigned NOT NULL,
    `hnt_method` varchar(100) NOT NULL,
    `hnt_start_date_string` varchar(100) NOT NULL,
    `hnt_end_date_string` varchar(100) NOT NULL,
    `hnt_time_ms` int(10) unsigned NOT NULL,
    `hnt_count` int(10) unsigned NOT NULL,
    `hnt_increment` int(2) unsigned NOT NULL,
    `hnt_charm` bit NOT NULL DEFAULT 0,
    KEY `FK_PKM_ID` (`pkm_id`),
    KEY `FK_USR_ID` (`usr_id`),
    KEY `FK_GAM_ID` (`gam_id`),
    CONSTRAINT `FK_PKM_ID` FOREIGN KEY (`pkm_id`) REFERENCES `pokemon` (`pkm_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_USR_ID` FOREIGN KEY (`usr_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_GAM_ID` FOREIGN KEY (`gam_id`) REFERENCES `game` (`gam_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    PRIMARY KEY (`hnt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `hunt`;

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
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
