-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.26 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for zubarska_ordinacija
CREATE DATABASE IF NOT EXISTS `zubarska_ordinacija` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `zubarska_ordinacija`;

-- Dumping structure for table zubarska_ordinacija.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.administrator: ~2 rows (approximately)
DELETE FROM `administrator`;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`) VALUES
	(1, 'monmari98', '$2b$11$O7easSMGuRIf1TRm7l77YOZlFGTfQGXz/WI20ZEMe/ebrBA0.q3YS'),
	(2, 'Marija', '$2b$11$icNVIIcTwcILkxdEXHJNKOn4/jliQSnkj93DpX6rtL7/kNnFkvieG');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.cart
DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_price` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.cart: ~0 rows (approximately)
DELETE FROM `cart`;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` (`cart_id`, `created_at`, `total_price`) VALUES
	(4, '2021-08-25 17:05:58', 12600.00),
	(5, '2021-08-25 17:07:37', 12600.00),
	(6, '2021-08-25 17:11:48', 12600.00),
	(7, '2021-08-25 17:17:52', 12600.00),
	(8, '2021-08-25 17:18:56', 12600.00),
	(9, '2021-08-25 17:19:52', 12600.00),
	(10, '2021-08-25 17:20:45', 12600.00),
	(11, '2021-08-25 17:31:40', 12600.00),
	(12, '2021-08-25 17:33:34', 12600.00),
	(13, '2021-08-25 17:33:59', 12600.00),
	(14, '2021-08-25 17:35:52', 13500.00),
	(15, '2021-08-25 17:44:05', 13500.00),
	(16, '2021-08-25 17:45:06', 13500.00),
	(17, '2021-08-25 17:48:09', 13500.00),
	(18, '2021-08-25 17:50:05', 13500.00),
	(19, '2021-08-25 17:51:33', 13500.00),
	(20, '2021-08-25 17:53:28', 13500.00),
	(21, '2021-08-25 18:12:54', 13500.00),
	(22, '2021-08-25 18:13:59', 13500.00),
	(23, '2021-08-25 18:15:48', 13500.00),
	(24, '2021-08-25 18:16:55', 27000.00),
	(25, '2021-08-25 18:49:04', 27000.00),
	(26, '2021-08-25 18:49:45', 40500.00),
	(27, '2021-08-25 18:50:42', 40500.00),
	(28, '2021-08-25 18:53:47', 40500.00),
	(29, '2021-08-25 18:55:23', 40500.00),
	(30, '2021-08-25 18:55:43', 40500.00),
	(31, '2021-08-25 19:00:18', 0.00),
	(32, '2021-08-25 19:02:12', 11110.00),
	(33, '2021-08-25 19:23:36', 0.00);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.category: ~5 rows (approximately)
DELETE FROM `category`;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`, `description`) VALUES
	(1, 'preventivna intervencija', 'obicna mala plomba'),
	(2, 'redovna intervencija', 'Veca plomba sa rekonstrukcijom'),
	(3, 'hirurška intervencija', 'jedan koren'),
	(5, 'hirurška intervencija 2', 'dva korena'),
	(6, 'proteza', 'cela gornja vilica');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.login_log
DROP TABLE IF EXISTS `login_log`;
CREATE TABLE IF NOT EXISTS `login_log` (
  `login_log_id` int unsigned NOT NULL AUTO_INCREMENT,
  `log` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `administrator_id` int unsigned DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`login_log_id`),
  KEY `fk_login_log_administrator_id` (`administrator_id`),
  CONSTRAINT `fk_login_log_administrator_id` FOREIGN KEY (`administrator_id`) REFERENCES `administrator` (`administrator_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.login_log: ~4 rows (approximately)
DELETE FROM `login_log`;
/*!40000 ALTER TABLE `login_log` DISABLE KEYS */;
INSERT INTO `login_log` (`login_log_id`, `log`, `administrator_id`, `created_at`) VALUES
	(1, 'Unknown password :aaaaaaaa', 1, '2021-08-24 19:21:27'),
	(3, 'Unknown username: nek', NULL, '2021-08-24 19:22:49'),
	(28, 'Unknown password: dasdas', 1, '2021-08-24 23:50:28'),
	(29, 'Unknown username: asdsadasda', NULL, '2021-08-24 23:53:22');
/*!40000 ALTER TABLE `login_log` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.medical_record
DROP TABLE IF EXISTS `medical_record`;
CREATE TABLE IF NOT EXISTS `medical_record` (
  `medical_record_id` int unsigned NOT NULL AUTO_INCREMENT,
  `tooth` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `patient_id` int unsigned NOT NULL,
  PRIMARY KEY (`medical_record_id`) USING BTREE,
  KEY `fk_medical_recors_patient_id` (`patient_id`),
  CONSTRAINT `fk_medical_recors_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.medical_record: ~4 rows (approximately)
DELETE FROM `medical_record`;
/*!40000 ALTER TABLE `medical_record` DISABLE KEYS */;
INSERT INTO `medical_record` (`medical_record_id`, `tooth`, `patient_id`) VALUES
	(1, 'gornja leva 4.', 1),
	(4, 'donji desni kutnjak', 1),
	(5, 'donja desna 8-ica', 3),
	(7, 'nesto', 2),
	(8, 'jos nesto', 2),
	(9, 'nasna', 2),
	(11, 'zuuuuuub', 4),
	(12, 'zuuuuuub', 4);
/*!40000 ALTER TABLE `medical_record` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.patient
DROP TABLE IF EXISTS `patient`;
CREATE TABLE IF NOT EXISTS `patient` (
  `patient_id` int unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `is_active` tinyint unsigned NOT NULL DEFAULT '1',
  `jmbg` varchar(13) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `age` int unsigned NOT NULL,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `uq_patient_jmbg` (`jmbg`),
  UNIQUE KEY `uq_patient_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.patient: ~4 rows (approximately)
DELETE FROM `patient`;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` (`patient_id`, `first_name`, `last_name`, `is_active`, `jmbg`, `email`, `age`) VALUES
	(1, 'marija', 'simic', 1, '0103998710093', 'marija.simic.17@singimail.rs', 23),
	(2, 'aaa', 'aaaa', 1, '0908776158824', 'neki@random.mail', 12),
	(3, 'nads', 'jkladsn', 1, '7676776765543', 'adsj@sad.ew', 78),
	(4, 'NovoIme', 'prezime', 0, '0101001010101', 'msa@ams.sam', 42);
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.photo
DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `medical_record_id` int DEFAULT NULL,
  PRIMARY KEY (`photo_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.photo: ~0 rows (approximately)
DELETE FROM `photo`;
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `image_path`, `medical_record_id`) VALUES
	(1, 'adsassdads', NULL),
	(2, 'pppppp', NULL),
	(4, 'static/uploads/2021/80/9d534b38-5d43-4f9d-a9cf-d513e9eb22f7Teeth.jpg', 11),
	(6, 'static/uploads/2021/80/5dec10c1-ce70-4173-9979-b2feb0dc51d0Teeth.jpg', 12),
	(7, 'static/uploads/2021/80/9b89677f-a2e8-45fd-9ab0-9137a2618a62Teeth.jpg', 12);
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.price_age
DROP TABLE IF EXISTS `price_age`;
CREATE TABLE IF NOT EXISTS `price_age` (
  `price_age_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` enum('pružanje usluge za decu','pružanje usluge za penzionere','pruzanje usluga za odrasle') CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'pruzanje usluga za odrasle',
  `age` int unsigned DEFAULT '0',
  `amount` decimal(10,2) unsigned NOT NULL,
  `price_name_id` int unsigned NOT NULL,
  PRIMARY KEY (`price_age_id`),
  KEY `fk_price_age_price_name_id` (`price_name_id`),
  CONSTRAINT `fk_price_age_price_name_id` FOREIGN KEY (`price_name_id`) REFERENCES `price_name` (`price_name_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.price_age: ~8 rows (approximately)
DELETE FROM `price_age`;
/*!40000 ALTER TABLE `price_age` DISABLE KEYS */;
INSERT INTO `price_age` (`price_age_id`, `name`, `age`, `amount`, `price_name_id`) VALUES
	(1, 'pružanje usluge za decu', 12, 1000.00, 1),
	(2, 'pružanje usluge za penzionere', 65, 1500.00, 1),
	(3, 'pruzanje usluga za odrasle', 0, 2500.00, 1),
	(4, 'pružanje usluge za decu', 12, 3400.00, 2),
	(5, 'pruzanje usluga za odrasle', 0, 6900.00, 2),
	(6, 'pružanje usluge za penzionere', 65, 10000.00, 6),
	(7, 'pružanje usluge za decu', 12, 15000.00, 6),
	(8, 'pruzanje usluga za odrasle', 0, 3200.00, 2),
	(10, 'pruzanje usluga za odrasle', 12, 5555.00, 5);
/*!40000 ALTER TABLE `price_age` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.price_name
DROP TABLE IF EXISTS `price_name`;
CREATE TABLE IF NOT EXISTS `price_name` (
  `price_name_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `category_id` int unsigned NOT NULL,
  PRIMARY KEY (`price_name_id`) USING BTREE,
  KEY `fk_price_name_category_id` (`category_id`),
  CONSTRAINT `fk_price_name_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.price_name: ~6 rows (approximately)
DELETE FROM `price_name`;
/*!40000 ALTER TABLE `price_name` DISABLE KEYS */;
INSERT INTO `price_name` (`price_name_id`, `name`, `category_id`) VALUES
	(1, 'izdvojeno pružanje usluge', 1),
	(2, 'izdvojeno pružanje usluge', 2),
	(3, 'pružanje usluge u paketu', 3),
	(5, 'pružanje usluge u paketu', 5),
	(6, 'protetika', 6),
	(7, 'fiksna proteza', 6);
/*!40000 ALTER TABLE `price_name` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.service
DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `service_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `stock_number` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `category_id` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`service_id`),
  UNIQUE KEY `uq_service_name` (`name`),
  UNIQUE KEY `uq_service_stock_number` (`stock_number`),
  KEY `fk_service_category_id` (`category_id`),
  CONSTRAINT `fk_service_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.service: ~5 rows (approximately)
DELETE FROM `service`;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` (`service_id`, `name`, `description`, `stock_number`, `category_id`, `is_active`) VALUES
	(1, 'popravka keca', 'mali karijes', '029129212', 1, 1),
	(2, 'popravka cetvorke', 'veliki karijes plus blaga rekonstrukcija', '912921021', 2, 1),
	(3, 'rekonstrukcija', 'vadjenje zivca rekonstrukcija zuba plus krunica', '992812812', 5, 1),
	(5, 'dasdasdsasad', 'dasdsadasdasadsasfcv3 f v3f', '324321412', 5, 1),
	(6, 'vadjenje osmice', 'hirursko vadjenje osmice iz vilice cekicem', '666666666', 3, 1);
/*!40000 ALTER TABLE `service` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.service_medical_record
DROP TABLE IF EXISTS `service_medical_record`;
CREATE TABLE IF NOT EXISTS `service_medical_record` (
  `service_medical_record_id` int unsigned NOT NULL AUTO_INCREMENT,
  `service_id` int unsigned NOT NULL,
  `medical_record_id` int unsigned NOT NULL,
  `cart_id` int unsigned NOT NULL,
  PRIMARY KEY (`service_medical_record_id`),
  KEY `fk_service_medical_record_service_id` (`service_id`),
  KEY `fk_service_medical_record_medical_record_id` (`medical_record_id`),
  CONSTRAINT `fk_service_medical_record_medical_record_id` FOREIGN KEY (`medical_record_id`) REFERENCES `medical_record` (`medical_record_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_service_medical_record_service_id` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.service_medical_record: ~5 rows (approximately)
DELETE FROM `service_medical_record`;
/*!40000 ALTER TABLE `service_medical_record` DISABLE KEYS */;
INSERT INTO `service_medical_record` (`service_medical_record_id`, `service_id`, `medical_record_id`, `cart_id`) VALUES
	(1, 1, 1, 0),
	(2, 2, 1, 0),
	(3, 3, 4, 0),
	(4, 6, 5, 0),
	(5, 2, 7, 31),
	(6, 2, 8, 31),
	(7, 2, 9, 31),
	(8, 5, 9, 32),
	(9, 5, 9, 32);
/*!40000 ALTER TABLE `service_medical_record` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
