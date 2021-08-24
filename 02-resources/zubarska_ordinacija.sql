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

-- Dumping data for table zubarska_ordinacija.administrator: ~0 rows (approximately)
DELETE FROM `administrator`;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`) VALUES
	(1, 'monmari98', '$2b$11$wai8pNoGdulCRv4LOdoQjuvM0Z3JqW7Qfewc8Vj2xOBv8RwCSzDCW'),
	(2, 'Marija', '$2b$11$icNVIIcTwcILkxdEXHJNKOn4/jliQSnkj93DpX6rtL7/kNnFkvieG');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.cart
DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total_price` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.cart: ~0 rows (approximately)
DELETE FROM `cart`;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.category: ~0 rows (approximately)
DELETE FROM `category`;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.login_log
DROP TABLE IF EXISTS `login_log`;
CREATE TABLE IF NOT EXISTS `login_log` (
  `login_log_id` int unsigned NOT NULL AUTO_INCREMENT,
  `log` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `administrator_id` int unsigned DEFAULT '0',
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`login_log_id`),
  KEY `fk_login_log_administrator_id` (`administrator_id`),
  CONSTRAINT `fk_login_log_administrator_id` FOREIGN KEY (`administrator_id`) REFERENCES `administrator` (`administrator_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.login_log: ~0 rows (approximately)
DELETE FROM `login_log`;
/*!40000 ALTER TABLE `login_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `login_log` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.medical_record
DROP TABLE IF EXISTS `medical_record`;
CREATE TABLE IF NOT EXISTS `medical_record` (
  `medical_record_id` int unsigned NOT NULL AUTO_INCREMENT,
  `tooth` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `patient_id` int unsigned NOT NULL,
  PRIMARY KEY (`medical_record_id`) USING BTREE,
  UNIQUE KEY `uq_medical_record_patient_id` (`patient_id`),
  CONSTRAINT `fk_medical_record_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.medical_record: ~0 rows (approximately)
DELETE FROM `medical_record`;
/*!40000 ALTER TABLE `medical_record` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.patient: ~0 rows (approximately)
DELETE FROM `patient`;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.price_age
DROP TABLE IF EXISTS `price_age`;
CREATE TABLE IF NOT EXISTS `price_age` (
  `price_age_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `age` int unsigned NOT NULL DEFAULT '0',
  `amount` decimal(10,2) unsigned NOT NULL,
  `price_name_id` int unsigned NOT NULL,
  PRIMARY KEY (`price_age_id`),
  KEY `fk_price_age_price_name_id` (`price_name_id`),
  CONSTRAINT `fk_price_age_price_name_id` FOREIGN KEY (`price_name_id`) REFERENCES `price_name` (`price_name_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.price_age: ~0 rows (approximately)
DELETE FROM `price_age`;
/*!40000 ALTER TABLE `price_age` DISABLE KEYS */;
/*!40000 ALTER TABLE `price_age` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.price_name
DROP TABLE IF EXISTS `price_name`;
CREATE TABLE IF NOT EXISTS `price_name` (
  `price_name_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `category_id` int unsigned NOT NULL,
  PRIMARY KEY (`price_name_id`) USING BTREE,
  UNIQUE KEY `uq_price_name` (`name`),
  KEY `fk_price_name_category_id` (`category_id`),
  CONSTRAINT `fk_price_name_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.price_name: ~0 rows (approximately)
DELETE FROM `price_name`;
/*!40000 ALTER TABLE `price_name` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.service: ~0 rows (approximately)
DELETE FROM `service`;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
/*!40000 ALTER TABLE `service` ENABLE KEYS */;

-- Dumping structure for table zubarska_ordinacija.service_medical_record
DROP TABLE IF EXISTS `service_medical_record`;
CREATE TABLE IF NOT EXISTS `service_medical_record` (
  `service_medical_record_id` int unsigned NOT NULL AUTO_INCREMENT,
  `service_id` int unsigned NOT NULL,
  `medical_record_id` int unsigned NOT NULL,
  PRIMARY KEY (`service_medical_record_id`),
  KEY `fk_service_medical_record_service_id` (`service_id`),
  KEY `fk_service_medical_record_medical_record_id` (`medical_record_id`),
  CONSTRAINT `fk_service_medical_record_medical_record_id` FOREIGN KEY (`medical_record_id`) REFERENCES `medical_record` (`medical_record_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_service_medical_record_service_id` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table zubarska_ordinacija.service_medical_record: ~0 rows (approximately)
DELETE FROM `service_medical_record`;
/*!40000 ALTER TABLE `service_medical_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_medical_record` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
