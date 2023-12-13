/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `pokemon` (
    `pkm_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `pkm_name` varchar(100) NOT NULL,
    PRIMARY KEY (`pkm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `pokemon`;
INSERT INTO `pokemon` (`pkm_name`, `address_city`, `address_state`, `address_street`, `address_zip`, `ven_map`, `ven_map_parking`) VALUES
    ('Bank of America Stadium', 'Charlotte', 'NC', '2343 Bank Street', '28908', 'BOA_Stadium.png', 'BOA_Stadium_Lot.png'),
    ('Lucas Oil Stadium', 'Indianapolis', 'IN', '534 Oil Blvd', '63230', 'LO_Stadium.png', 'LO_Stadium_Lot.png'),
    ('Arrowhead Stadium', 'Kansas City', 'MO', '523 Not Kansas Rd', '34028', 'Arrowhead_Stadium.png', 'Arrowhead_Stadium_Lot.jpeg'),
    ('PNC Arena', 'Raleigh', 'NC', 'Wolf Lane', '27505', 'PNC_Arena.jpg', 'PNC_Arena_Lot.jpeg');

CREATE TABLE IF NOT EXISTS `hunt` (
    `hnt_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `pkm_id` int(10) unsigned NOT NULL,
    `hnt_id` int(10) unsigned NOT NULL,
    `start_date_string` varchar(100) NOT NULL,
    `end_date_string` varchar(100) NOT NULL,
    `hnt_time_ms` int(10) unsigned NOT NULL,
    KEY `FK_PKM_ID` (`pkm_id`),
    CONSTRAINT `FK_PKM_ID` FOREIGN KEY (`pkm_id`) REFERENCES `pokemon` (`pkm_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    PRIMARY KEY (`hnt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `hunt`;
INSERT INTO `hunt` (`evt_name`, `evt_descr`, `ven_id`, `date_string`, `evt_bathroom_map`, `evt_vendor_map`, `evt_services_map`) VALUES
    ('Panthers vs. Texans', 'Football game between the Carolina Panthers and Houston Texans', 1, '2023-12-06T10:34:56.789Z', 'evt_1_bathroom.png', 'evt_1_vendor.png', 'evt_1_services.png'),
    ('Panthers vs. Vikings', 'Football game between the Carolina Panthers and Houston Texans', 1, '2023-12-13T12:34:56.789Z', 'evt_1_bathroom.png', 'evt_2_vendor.png', 'evt_1_services.png'),
    ('Taylor Swift Concert', 'Come see Taylor Swift perform Live at Arrowhead Stadium in Kansas City!', 3, '2023-12-06T12:34:56.789Z', 'evt_3_bathroom.png', 'evt_3_vendor.png', 'evt_3_services.png'),
    ('Pitbull Concert', 'Come see Pitbull perform Live at PNC Arena in Raleigh!', 4, '2023-11-06T12:34:56.789Z', 'evt_4_bathroom.png', 'evt_4_vendor.png', 'evt_4_services.png');

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
