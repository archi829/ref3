-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: insurance_db_dev
-- ------------------------------------------------------
-- Server version 8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrator`
--

DROP TABLE IF EXISTS `administrator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrator` (
  `admin_id` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrator`
--

LOCK TABLES `administrator` WRITE;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` VALUES ('ADM001','Admin User','admin@insurance.com','9999999999','System Admin',NULL),('ADM002','Junior Adjuster','j.adjuster@insurance.com',NULL,NULL,'$2b$10$oQmz7WTDSBeKHXiFZh3cg.lzgd0CyV3LtC8Ftsa9V4ILTYlO.MQk.');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_log`
--
DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `audit_log_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `user_type` ENUM('CUSTOMER', 'ADMIN') NOT NULL,
  `action_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(50) DEFAULT NULL COMMENT 'ID of the affected entity (e.g., claim_id, policy_id)',
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `details` JSON DEFAULT NULL COMMENT 'Optional details like data before/after change'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Audit log for sensitive user actions';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agent`
--

DROP TABLE IF EXISTS `agent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent` (
  `agent_id` varchar(50) NOT NULL,
  `agent_no` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `branch` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agent`
--

LOCK TABLES `agent` WRITE;
/*!40000 ALTER TABLE `agent` DISABLE KEYS */;
INSERT INTO `agent` VALUES ('AGENT001',NULL,'Agent Smith','smith.agent@example.com','9876500001',NULL),('AGENT002',NULL,'Agent Cooper','cooper.agent@example.com','9876500002',NULL),('AGT001','A001','Agent Smith','agent@insurance.com','8888888888','Mumbai Branch');
/*!40000 ALTER TABLE `agent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policy`
--
DROP TABLE IF EXISTS `policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policy` (
  `policy_id` varchar(50) NOT NULL,
  `policy_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `premium_amount` decimal(15,2) DEFAULT NULL,
  `coverage_details` text,
  `status` enum('PENDING_INITIAL_APPROVAL','PENDING_FINAL_APPROVAL','INACTIVE_AWAITING_PAYMENT','ACTIVE','DECLINED','EXPIRED') DEFAULT NULL,
  `policy_type` varchar(50) DEFAULT NULL,
  `previous_policy_id` varchar(50) DEFAULT NULL,
  `initial_approver_id` varchar(50) DEFAULT NULL,
  `initial_approval_date` timestamp NULL DEFAULT NULL,
  `final_approver_id` varchar(50) DEFAULT NULL,
  `final_approval_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`policy_id`),
  KEY `previous_policy_id` (`previous_policy_id`),
  KEY `fk_policy_initial_approver` (`initial_approver_id`),
  KEY `fk_policy_final_approver` (`final_approver_id`),
  CONSTRAINT `policy_ibfk_1` FOREIGN KEY (`previous_policy_id`) REFERENCES `policy` (`policy_id`),
  CONSTRAINT `fk_policy_initial_approver` FOREIGN KEY (`initial_approver_id`) REFERENCES `administrator` (`admin_id`),
  CONSTRAINT `fk_policy_final_approver` FOREIGN KEY (`final_approver_id`) REFERENCES `administrator` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policy`
--

LOCK TABLES `policy` WRITE;
/*!40000 ALTER TABLE `policy` DISABLE KEYS */;
INSERT INTO `policy` VALUES 
('POL_TEST_AGENT','2025-10-22',NULL,NULL,5000.00,NULL,'PENDING_INITIAL_APPROVAL','HOME',NULL,NULL,NULL,NULL,NULL),
('POL0001','2025-10-04','2025-01-01','2025-12-31',15000.00,'Comprehensive health coverage','ACTIVE','HEALTH',NULL,NULL,NULL,NULL,NULL),
('POL0002','2025-10-04','2025-02-01','2026-01-31',25000.00,'Term Life Insurance','ACTIVE','LIFE',NULL,NULL,NULL,NULL,NULL),
('POL1001','2025-01-01','2025-01-01','2025-12-31',12000.00,'Basic health coverage','ACTIVE','HEALTH',NULL,NULL,NULL,NULL,NULL),
('POL1002','2025-02-15','2025-02-15','2026-02-14',15000.00,'Standard car insurance','ACTIVE','CAR',NULL,NULL,NULL,NULL,NULL),
('POL1003','2025-03-01','2025-03-01','2030-02-28',50000.00,'Premium life insurance','ACTIVE','LIFE',NULL,NULL,NULL,NULL,NULL),
('POL1004','2025-10-19',NULL,NULL,18000.00,NULL,'ACTIVE','HEALTH',NULL,NULL,NULL,NULL,NULL),
('POL1005','2025-10-19',NULL,NULL,25000.00,NULL,'PENDING_INITIAL_APPROVAL','HEALTH',NULL,NULL,NULL,NULL,NULL),
('POL1006','2025-10-26','2025-11-01','2026-10-31',600.00,'Basic Home Insurance','INACTIVE_AWAITING_PAYMENT','HOME',NULL,'ADM001','2025-10-25 10:00:00','ADM002','2025-10-26 11:00:00');
/*!40000 ALTER TABLE `policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agent_policy`
--

DROP TABLE IF EXISTS `agent_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_policy` (
  `id` varchar(50) NOT NULL,
  `policy_id` varchar(50) DEFAULT NULL,
  `agent_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `policy_id` (`policy_id`),
  KEY `agent_id` (`agent_id`),
  CONSTRAINT `agent_policy_ibfk_1` FOREIGN KEY (`policy_id`) REFERENCES `policy` (`policy_id`),
  CONSTRAINT `agent_policy_ibfk_2` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agent_policy`
--

LOCK TABLES `agent_policy` WRITE;
/*!40000 ALTER TABLE `agent_policy` DISABLE KEYS */;
INSERT INTO `agent_policy` VALUES ('AP_POL_TEST_AGENT','POL_TEST_AGENT','AGT001'),('AP_POL001','POL0001','AGT001'),('AP_POL002','POL0002','AGT001');
/*!40000 ALTER TABLE `agent_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customer_id` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `notification_preference_channel` enum('EMAIL','SMS','BOTH','NONE') DEFAULT 'EMAIL',
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('CUST_1761038061124','New User','new@example.com',NULL,NULL,NULL,NULL,'$2b$10$FHYtKei3MqZ1jOEt2b4zG.NHUU7GWlUkFDljCbl8YtgmSx/DQUB1e','EMAIL'),('CUST_1761140956348','Aritra','test@gmail.com',NULL,NULL,NULL,NULL,'$2b$10$LPktkRIdBxiSv/EN2YAGauUxqi2FoWCj4a9HFy2RniRIl1pb4jUB.','EMAIL'),('CUST_TEST_01','Test User','test@example.com',NULL,NULL,NULL,NULL,'$2b$10$f9a/U.3q.L2jK6s.nL4/8uY1g.h8s3n.l5j.h5s.mK3o.p9y.u7o','EMAIL'),('CUST0001','Alice Johnson','alice.johnson@example.com','9876543210','123 Maple St','1980-01-15',NULL,'','EMAIL'),('CUST0002','Bob Smith','bob.smith@example.com','9876543211','234 Oak St','1975-05-20',NULL,'','EMAIL'),('CUST0003','Charlie Brown','charlie.brown@example.com','9876543212','345 Pine St','1988-03-10',NULL,'','EMAIL'),('CUST0004','David Lee','david.lee@example.com','9876543213','456 Cedar St','1990-07-25',NULL,'','EMAIL'),('CUST0005','Eva Green','eva.green@example.com','9876543214','567 Birch St','1982-12-01',NULL,'','EMAIL'),('CUST0006','Frank Wright','frank.wright@example.com','9876543215','678 Elm St','1979-09-10',NULL,'','EMAIL'),('CUST0007','Grace Hall','grace.hall@example.com','9876543216','789 Willow St','1985-11-30',NULL,'','EMAIL'),('CUST0008','Hannah Scott','hannah.scott@example.com','9876543217','890 Poplar St','1992-04-18',NULL,'','EMAIL'),('CUST0009','Ian King','ian.king@example.com','9876543218','901 Spruce St','1978-06-12',NULL,'','EMAIL'),('CUST001','John Doe','john@email.com','9876543210','123 Main St','1990-05-15','Male','','EMAIL'),('CUST0010','Jane Doe','jane.doe@example.com','9876543219','102 Ash St','1983-08-15',NULL,'','EMAIL'),('CUST0011','Kyle Young','kyle.young@example.com','9876543220','213 Fir St','1991-02-20',NULL,'','EMAIL'),('CUST0012','Laura Parker','laura.parker@example.com','9876543221','324 Chestnut St','1986-10-05',NULL,'','EMAIL'),('CUST0013','Mark Adams','mark.adams@example.com','9876543222','435 Walnut St','1984-03-22',NULL,'','EMAIL'),('CUST0014','Nina Clark','nina.clark@example.com','9876543223','546 Sycamore St','1977-07-07',NULL,'','EMAIL'),('CUST0015','Oliver Davis','oliver.davis@example.com','9876543224','657 Maple St','1989-09-17',NULL,'','EMAIL'),('CUST0016','Paula Edwards','paula.edwards@example.com','9876543225','768 Oak St','1981-01-29',NULL,'','EMAIL'),('CUST0017','Quinn Ford','quinn.ford@example.com','9876543226','879 Pine St','1993-05-13',NULL,'','EMAIL'),('CUST0018','Rachel Gomez','rachel.gomez@example.com','9876543227','980 Cedar St','1987-11-22',NULL,'','EMAIL'),('CUST0019','Steve Harris','steve.harris@example.com','9876543228','109 Birch St','1980-04-04',NULL,'','EMAIL'),('CUST002','Alice Johnson','alice@email.com','9123456789','789 Pine Ave','1985-08-10','Female','','EMAIL'),('CUST0020','Tina Johnson','tina.johnson@example.com','9876543229','210 Elm St','1982-06-30',NULL,'','EMAIL');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beneficiary`
--

DROP TABLE IF EXISTS `beneficiary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficiary` (
  `beneficiary_id` varchar(50) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `relationship` varchar(50) DEFAULT NULL,
  `customer_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`beneficiary_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `beneficiary_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiary`
--

LOCK TABLES `beneficiary` WRITE;
/*!40000 ALTER TABLE `beneficiary` DISABLE KEYS */;
INSERT INTO `beneficiary` VALUES ('BEN001','Jane Doe','jane@email.com','9111111111','Spouse','CUST001');
/*!40000 ALTER TABLE `beneficiary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_policy`
--

DROP TABLE IF EXISTS `customer_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_policy` (
  `customer_policy_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` varchar(50) NOT NULL,
  `policy_id` varchar(50) NOT NULL,
  PRIMARY KEY (`customer_policy_id`),
  KEY `fk_cp_customer` (`customer_id`),
  KEY `fk_cp_policy` (`policy_id`),
  CONSTRAINT `fk_cp_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `fk_cp_policy` FOREIGN KEY (`policy_id`) REFERENCES `policy` (`policy_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_policy`
--

LOCK TABLES `customer_policy` WRITE;
/*!40000 ALTER TABLE `customer_policy` DISABLE KEYS */;
INSERT INTO `customer_policy` VALUES (1,'CUST0001','POL1001'),(2,'CUST0002','POL1002'),(3,'CUST0003','POL1003'),(4,'CUST0004','POL1001'),(5,'CUST0005','POL1002'),(6,'CUST0006','POL1003'),(7,'CUST0007','POL1001'),(8,'CUST0008','POL1002'),(9,'CUST0009','POL1003'),(10,'CUST001','POL0001'),(11,'CUST0010','POL1001'),(12,'CUST0011','POL1002'),(13,'CUST0012','POL1003'),(14,'CUST0013','POL1001'),(15,'CUST0014','POL1002'),(16,'CUST0015','POL1003'),(17,'CUST0016','POL1001'),(18,'CUST0017','POL1002'),(19,'CUST0018','POL1003'),(20,'CUST0019','POL1001'),(21,'CUST002','POL0002'),(22,'CUST0020','POL1002'),(23,'CUST_1761038061124','POL1002');
/*!40000 ALTER TABLE `customer_policy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` varchar(50) NOT NULL,
  `customer_policy_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `payment_mode` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payment_customer_policy` (`customer_policy_id`),
  CONSTRAINT `fk_payment_customer_policy` FOREIGN KEY (`customer_policy_id`) REFERENCES `customer_policy` (`customer_policy_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES ('PAY_DEV_TEST',1,'Success','2025-10-19 06:39:52','Debit Card'),('PAY0001',1,'Success','2025-01-01 04:30:00','Credit Card'),('PAY0002',2,'Success','2025-03-15 05:30:00','Net Banking'),('PAY0003',3,'Success','2025-06-01 04:00:00','Cash'),('PAY0004',4,'Failed','2025-01-05 06:30:00','Credit Card'),('PAY0005',5,'Success','2025-03-18 04:40:00','Net Banking'),('PAY0006',6,'Success','2025-06-03 09:00:00','Cash'),('PAY0007',7,'Success','2025-01-09 02:55:00','Credit Card'),('PAY0008',8,'Success','2025-03-20 04:45:00','Net Banking'),('PAY0009',9,'Success','2025-06-07 07:30:00','Cash'),('PAY001',10,'SUCCESS','2025-10-04 06:03:47','UPI'),('PAY0010',11,'Success','2025-01-12 10:15:00','Credit Card'),('PAY0011',12,'Failed','2025-03-25 04:20:00','Net Banking'),('PAY0012',13,'Success','2025-06-10 06:25:00','Cash'),('PAY0013',14,'Success','2025-01-15 07:00:00','Credit Card'),('PAY0014',15,'Failed','2025-03-28 10:30:00','Net Banking'),('PAY0015',16,'Success','2025-06-12 08:50:00','Cash'),('PAY0016',17,'Success','2025-01-18 04:40:00','Credit Card'),('PAY0017',18,'Success','2025-03-30 03:30:00','Net Banking'),('PAY0018',19,'Failed','2025-06-15 02:30:00','Cash'),('PAY0019',20,'Success','2025-01-22 12:00:00','Credit Card'),('PAY0020',22,'Success','2025-04-02 12:30:00','Net Banking');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminder`
-- (This table is NEW for IWAS-F-041)
--

DROP TABLE IF EXISTS `reminder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reminder` (
  `notification_id` varchar(50) NOT NULL,
  `notification_date` timestamp NULL DEFAULT NULL,
  `status` enum('PENDING','SENT','FAILED') DEFAULT 'PENDING',
  `sent_timestamp` timestamp NULL DEFAULT NULL,
  `message` text,
  `type` varchar(50) DEFAULT NULL,
  `admin_id` varchar(50) DEFAULT NULL,
  `customer_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `admin_id` (`admin_id`),
  KEY `customer_id` (`customer_id`),
  KEY `idx_reminder_status_date` (`status`,`notification_date`),
  CONSTRAINT `reminder_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `administrator` (`admin_id`),
  CONSTRAINT `reminder_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminder`
--

LOCK TABLES `reminder` WRITE;
/*!40000 ALTER TABLE `reminder` DISABLE KEYS */;
/*!40000 ALTER TABLE `reminder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_reminder`
-- (This table now correctly follows the 'reminder' table)
--

DROP TABLE IF EXISTS `admin_reminder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_reminder` (
  `id` varchar(50) NOT NULL,
  `notification_id` varchar(50) DEFAULT NULL,
  `admin_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_id` (`notification_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `admin_reminder_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `reminder` (`notification_id`),
  CONSTRAINT `admin_reminder_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `administrator` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_reminder`
--

LOCK TABLES `admin_reminder` WRITE;
/*!40000 ALTER TABLE `admin_reminder` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_reminder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflows`
--

DROP TABLE IF EXISTS `workflows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflows` (
  `workflow_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`workflow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflows`
--

LOCK TABLES `workflows` WRITE;
/*!40000 ALTER TABLE `workflows` DISABLE KEYS */;
INSERT INTO `workflows` VALUES ('CLAIM_APPROVAL_V1','Standard Claim Approval','Initial workflow for claims under $500');
/*!40000 ALTER TABLE `workflows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflow_steps`
--

DROP TABLE IF EXISTS `workflow_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflow_steps` (
  `step_id` varchar(50) NOT NULL,
  `workflow_id` varchar(50) NOT NULL,
  `step_order` int NOT NULL,
  `step_name` varchar(100) DEFAULT NULL,
  `task_type` enum('MANUAL','API','RULE') DEFAULT NULL,
  `configuration` json DEFAULT NULL,
  `due_date` datetime DEFAULT (NOW() + INTERVAL 3 DAY),  
  `assigned_role` varchar(50) DEFAULT 'Unassigned', 
  PRIMARY KEY (`step_id`),
  UNIQUE KEY `workflow_id_step_order` (`workflow_id`,`step_order`),
  CONSTRAINT `workflow_steps_ibfk_1` FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`workflow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflow_steps`
--

LOCK TABLES `workflow_steps` WRITE;
/*!40000 ALTER TABLE `workflow_steps` DISABLE KEYS */;
INSERT INTO `workflow_steps` VALUES ('STEP_V1_1','CLAIM_APPROVAL_V1',1,'Assign Claim','RULE','{\"ruleName\": \"assignByAmount\", \"threshold\": 500, \"targetAdminId\": \"ADM002\"}'),('STEP_V1_2','CLAIM_APPROVAL_V1',2,'Manual Review','MANUAL','{\"assignedRole\": \"Junior Adjuster\"}'),('STEP_V1_3','CLAIM_APPROVAL_V1',3,'Notify Customer','API','{\"task\": \"sendNotification\", \"template\": \"claimApproved\"}');
/*!40000 ALTER TABLE `workflow_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `claim`
--

DROP TABLE IF EXISTS `claim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `claim` (
  `claim_id` varchar(50) NOT NULL,
  `policy_id` varchar(50) DEFAULT NULL,
  `customer_id` varchar(50) DEFAULT NULL,
  `description` text,
  `claim_date` date DEFAULT NULL,
  `claim_status` varchar(50) DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `status_log` text,
  `admin_id` varchar(50) DEFAULT NULL,
  `workflow_id` varchar(50) DEFAULT NULL,
  `current_step_order` int DEFAULT '1',
  `risk_score` int DEFAULT '0',
  PRIMARY KEY (`claim_id`),
  KEY `policy_id` (`policy_id`),
  KEY `customer_id` (`customer_id`),
  KEY `admin_id` (`admin_id`),
  KEY `fk_claim_workflow` (`workflow_id`),
  CONSTRAINT `claim_ibfk_1` FOREIGN KEY (`policy_id`) REFERENCES `policy` (`policy_id`),
  CONSTRAINT `claim_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `claim_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `administrator` (`admin_id`),
  CONSTRAINT `fk_claim_workflow` FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`workflow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `claim`
--

LOCK TABLES `claim` WRITE;
/*!40000 ALTER TABLE `claim` DISABLE KEYS */;
INSERT INTO `claim` VALUES ('CLM_1761039772069','POL1001','CUST_1761038061124','Annual_check-up','2025-10-21','DECLINED',250.00,'Claim submitted by user.\nClaim declined by admin ADM002.','ADM002',NULL,1),('CLM_1761141526405','POL0002','CUST_1761140956348','Health','2025-10-22','DECLINED',10000.00,'Claim submitted by user.\nClaim declined by admin ADM002.',NULL,NULL,1),('CLM_1761201732504','POL1003','CUST_1761038061124','TEST','2025-10-23','APPROVED',99.00,'Claim submitted by user.\nClaim approved by admin ADM002.',NULL,NULL,1),('CLM_1761206908731','POL1001','CUST_1761038061124','MED','2025-10-23','DECLINED',100.00,'Claim submitted by user.\nClaim declined by admin ADM002.',NULL,NULL,2),('CLM_1761213442232','POL1002','CUST_1761038061124','Workflow Test Correct Policy','2025-10-23','PENDING',300.00,'Claim submitted by user.','ADM002','CLAIM_APPROVAL_V1',2),('CLM_DEV_TEST','POL1001','CUST0001','Claim for physiotherapy session','2025-10-19','APPROVED',3000.00,'Claim submitted in dev.\nAssigned to adjuster.\nClaim approved by adjuster.','ADM002',NULL,1),('CLM001','POL0001','CUST_1761038061124','Medical treatment claim','2025-10-04','APPROVED',5000.00,'Claim submitted for review\nClaim approved by admin ADM002.','ADM001',NULL,1),('CLM002','POL0001','CUST001','Emergency surgery','2025-10-04','APPROVED',8000.00,'Claim approved after review','ADM001',NULL,1),('CLM003','POL1001','CUST0001','Claim for annual health check-up','2025-10-19','APPROVED',2500.00,'Claim submitted via API.\nAssigned to adjuster ADM002.\nClaim approved by ADM002. Payment pending.','ADM002',NULL,1),('CLM004','POL1002','CUST0002','Claim for cosmetic dental work','2025-10-19','DECLINED',7500.00,'Claim submitted via API.\nAssigned to adjuster ADM002.\nClaim declined by ADM002. Cosmetic procedures not covered.','ADM002',NULL,1);
/*!40000 ALTER TABLE `claim` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Triggers for table `claim`
--

DELIMITER $$
/*!50003 SET @saved_cs_client      = @@character_set_client */ $$
/*!50003 SET @saved_cs_results     = @@character_set_results */ $$
/*!50003 SET @saved_col_connection = @@collation_connection */ $$
/*!50003 SET character_set_client  = utf8mb4 */ $$
/*!50003 SET character_set_results = utf8mb4 */ $$
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ $$
/*!50003 SET @saved_sql_mode       = @@sql_mode */ $$
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ $$
CREATE TRIGGER `after_claim_status_update` AFTER UPDATE ON `claim` FOR EACH ROW BEGIN
    DECLARE v_notification_id VARCHAR(50);
    
    IF OLD.claim_status != NEW.claim_status THEN
        SET v_notification_id = CONCAT('NOTIF_', NEW.claim_id, '_STATUS');
        
        INSERT INTO reminder (notification_id, notification_date, status, message, type, customer_id)
        VALUES (v_notification_id, NOW(), 'PENDING',
                CONCAT('Your claim ', NEW.claim_id, ' status has been updated to: ', NEW.claim_status),
                'CLAIM_UPDATE', NEW.customer_id);
    END IF;
END $$
/*!50003 SET sql_mode              = @saved_sql_mode */ $$
/*!50003 SET character_set_client  = @saved_cs_client */ $$
/*!50003 SET character_set_results = @saved_cs_results */ $$
/*!50003 SET collation_connection  = @saved_col_connection */ $$

DELIMITER ;

--
-- Triggers for table `payment`
--

DELIMITER $$
/*!50003 SET @saved_cs_client      = @@character_set_client */ $$
/*!50003 SET @saved_cs_results     = @@character_set_results */ $$
/*!50003 SET @saved_col_connection = @@collation_connection */ $$
/*!50003 SET character_set_client  = utf8mb4 */ $$
/*!50003 SET character_set_results = utf8mb4 */ $$
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ $$
/*!50003 SET @saved_sql_mode       = @@sql_mode */ $$
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ $$
CREATE TRIGGER `after_payment_success` AFTER INSERT ON `payment` FOR EACH ROW BEGIN
    DECLARE v_notification_id VARCHAR(50);
    DECLARE v_customer_id VARCHAR(50);
    DECLARE v_policy_id VARCHAR(50);

    IF NEW.status = 'Success' THEN
        SELECT customer_id, policy_id 
        INTO v_customer_id, v_policy_id 
        FROM customer_policy 
        WHERE customer_policy_id = NEW.customer_policy_id;
        
        SET v_notification_id = CONCAT('NOTIF_', NEW.payment_id, '_SUCCESS');
        
        INSERT INTO reminder (notification_id, notification_date, status, message, type, customer_id)
        VALUES (v_notification_id, NOW(), 'PENDING',
                CONCAT('Payment successful for policy ', v_policy_id, ' via ', NEW.payment_mode),
                'PAYMENT_SUCCESS', v_customer_id);
    END IF;
END $$
/*!50003 SET sql_mode              = @saved_sql_mode */ $$
/*!50003 SET character_set_client  = @saved_cs_client */ $$
/*!50003 SET character_set_results = @saved_cs_results */ $$
/*!50003 SET collation_connection  = @saved_col_connection */ $$

DELIMITER ;

--
-- Triggers for table `policy`
--

DELIMITER $$
/*!50003 SET @saved_cs_client      = @@character_set_client */ $$
/*!50003 SET @saved_cs_results     = @@character_set_results */ $$
/*!50003 SET @saved_col_connection = @@collation_connection */ $$
/*!50003 SET character_set_client  = utf8mb4 */ $$
/*!50003 SET character_set_results = utf8mb4 */ $$
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ $$
/*!50003 SET @saved_sql_mode       = @@sql_mode */ $$
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ $$
CREATE TRIGGER `after_policy_insert` AFTER INSERT ON `policy` FOR EACH ROW BEGIN
    DECLARE v_notification_id VARCHAR(50);
    DECLARE v_customer_id VARCHAR(50);
    
    SELECT customer_id INTO v_customer_id 
    FROM customer_policy 
    WHERE policy_id = NEW.policy_id 
    LIMIT 1;
    
    SET v_notification_id = CONCAT('NOTIF_', NEW.policy_id, '_PAYMENT');
    
    INSERT INTO reminder (notification_id, notification_date, status, message, type, customer_id)
    VALUES (v_notification_id, DATE_ADD(NEW.start_date, INTERVAL -7 DAY), 'PENDING',
            CONCAT('Payment reminder for policy ', NEW.policy_id, '. Premium amount: Rs.', NEW.premium_amount),
            'PAYMENT_REMINDER', v_customer_id);
END $$
/*!50003 SET sql_mode              = @saved_sql_mode */ $$
/*!50003 SET character_set_client  = @saved_cs_client */ $$
/*!50003 SET character_set_results = @saved_cs_results */ $$
/*!50003 SET collation_connection  = @saved_col_connection */ $$

/*!50003 SET @saved_cs_client      = @@character_set_client */ $$
/*!50003 SET @saved_cs_results     = @@character_set_results */ $$
/*!50003 SET @saved_col_connection = @@collation_connection */ $$
/*!50003 SET character_set_client  = utf8mb4 */ $$
/*!50003 SET character_set_results = utf8mb4 */ $$
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ $$
/*!50003 SET @saved_sql_mode       = @@sql_mode */ $$
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ $$
CREATE TRIGGER `policy_renewal_reminder` AFTER INSERT ON `policy` FOR EACH ROW BEGIN
    DECLARE v_notification_id VARCHAR(50);
    DECLARE v_customer_id VARCHAR(50);
    
    SELECT customer_id INTO v_customer_id 
    FROM customer_policy 
    WHERE policy_id = NEW.policy_id 
    LIMIT 1;
    
    SET v_notification_id = CONCAT('NOTIF_', NEW.policy_id, '_RENEWAL');
    
    INSERT INTO reminder (notification_id, notification_date, status, message, type, customer_id)
    VALUES (v_notification_id, DATE_SUB(NEW.end_date, INTERVAL 30 DAY), 'PENDING',
            CONCAT('Policy ', NEW.policy_id, ' expires on ', NEW.end_date, '. Please renew to continue coverage.'),
            'RENEWAL_REMINDER', v_customer_id);
END $$
/*!50003 SET sql_mode              = @saved_sql_mode */ $$
/*!50003 SET character_set_client  = @saved_cs_client */ $$
/*!50003 SET character_set_results = @saved_cs_results */ $$
/*!50003 SET collation_connection  = @saved_col_connection */ $$

/*!50003 SET @saved_cs_client      = @@character_set_client */ $$
/*!50003 SET @saved_cs_results     = @@character_set_results */ $$
/*!50003 SET @saved_col_connection = @@collation_connection */ $$
/*!50003 SET character_set_client  = utf8mb4 */ $$
/*!50003 SET character_set_results = utf8mb4 */ $$
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ $$
/*!50003 SET @saved_sql_mode       = @@sql_mode */ $$
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ $$
CREATE TRIGGER `after_policy_insert_assign_agent` AFTER INSERT ON `policy` FOR EACH ROW BEGIN
    DECLARE new_agent_policy_id VARCHAR(50);
    
    SET new_agent_policy_id = CONCAT('AP_', NEW.policy_id);
    
    INSERT INTO agent_policy (id, policy_id, agent_id) 
    VALUES (new_agent_policy_id, NEW.policy_id, 'AGT001');
END $$
/*!50003 SET sql_mode              = @saved_sql_mode */ $$
/*!50003 SET character_set_client  = @saved_cs_client */ $$
/*!50003 SET character_set_results = @saved_cs_results */ $$
/*!50003 SET collation_connection  = @saved_col_connection */ $$

DELIMITER ;

-- Compatibility layer for legacy audit_log code
CREATE VIEW bhargavi_audit_log AS 
SELECT 
    audit_log_id as log_id,
    user_id,
    user_type,
    action_type,
    entity_id,
    details,
    timestamp
FROM audit_log;

DELIMITER //
CREATE TRIGGER instead_of_insert_bhargavi_audit_log
INSTEAD OF INSERT ON bhargavi_audit_log
FOR EACH ROW
BEGIN
    -- Convert user_type to uppercase and validate
    SET @valid_user_type = UPPER(NEW.user_type);
    IF @valid_user_type NOT IN ('CUSTOMER', 'ADMIN') THEN
        SET @valid_user_type = 'CUSTOMER'; -- Default fallback
    END IF;
    
    -- Convert text details to JSON object if not valid JSON
    IF NEW.details IS NOT NULL AND JSON_VALID(NEW.details) = 0 THEN
        SET @converted_details = JSON_OBJECT('legacy_text', NEW.details);
    ELSE
        SET @converted_details = NEW.details;
    END IF;
    
    INSERT INTO audit_log (user_id, user_type, action_type, entity_id, details)
    VALUES (NEW.user_id, @valid_user_type, NEW.action_type, NEW.entity_id, @converted_details);
END//
DELIMITER ;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
