-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: numericalmethod
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `bisection`
--

DROP TABLE IF EXISTS `bisection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bisection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fx` varchar(255) NOT NULL,
  `xl` float NOT NULL,
  `xr` float NOT NULL,
  `tolerance` float NOT NULL,
  `datecreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bisection`
--

LOCK TABLES `bisection` WRITE;
/*!40000 ALTER TABLE `bisection` DISABLE KEYS */;
INSERT INTO `bisection` VALUES (1,'x^4 - 13',1,2,0.000001,'2025-09-30 12:03:43'),(2,'x^4 - 13',3,5,0.0001,'2025-09-30 01:02:58'),(3,'x^4 - 13',1,2,0.000001,'2025-09-30 01:59:39'),(4,'x^4 - 9',1,2,0.0001,'2025-09-30 02:06:46'),(5,'x^4 - 13',5,6,0.0001,'2025-09-30 10:59:44'),(6,'x^4 - 13',5,6,0.0001,'2025-09-30 10:59:45'),(7,'x^4 - 13',5,6,0.0001,'2025-09-30 10:59:46'),(8,'x^4 - 13',2,9,0.00001,'2025-10-04 17:27:23'),(9,'x^4 - 2',7,12,0.000001,'2025-10-05 16:39:31'),(10,'x^3 - 5',1,9,0.00001,'2025-10-05 16:41:37'),(11,'43 * x - 180',-6604060000000,1429900000,0.0000000001,'2025-10-07 11:09:05');
/*!40000 ALTER TABLE `bisection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `falseposition`
--

DROP TABLE IF EXISTS `falseposition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `falseposition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fx` varchar(255) NOT NULL,
  `xl` float NOT NULL,
  `xr` float NOT NULL,
  `tolerance` float NOT NULL,
  `datecreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `falseposition`
--

LOCK TABLES `falseposition` WRITE;
/*!40000 ALTER TABLE `falseposition` DISABLE KEYS */;
INSERT INTO `falseposition` VALUES (1,'x^4 - 13',3,5,0.00001,'2025-10-07 10:35:39'),(2,'x^3 - 1',1,7,0.000001,'2025-10-07 10:37:48');
/*!40000 ALTER TABLE `falseposition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `graphical`
--

DROP TABLE IF EXISTS `graphical`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `graphical` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fx` varchar(255) NOT NULL,
  `xstart` double NOT NULL,
  `xend` double NOT NULL,
  `datecreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `graphical`
--

LOCK TABLES `graphical` WRITE;
/*!40000 ALTER TABLE `graphical` DISABLE KEYS */;
INSERT INTO `graphical` VALUES (1,'43 * x - 180',0,10,'2025-10-07 02:42:18'),(2,'43 * x - 180',1,20,'2025-10-07 02:47:20'),(3,'43 * x - 180',3,7,'2025-10-07 02:48:38'),(4,'43 * x - 180',2,8,'2025-10-07 02:50:45');
/*!40000 ALTER TABLE `graphical` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newtonraphson`
--

DROP TABLE IF EXISTS `newtonraphson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newtonraphson` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fx` varchar(255) NOT NULL,
  `guess` double NOT NULL,
  `tolerance` double NOT NULL,
  `datecreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newtonraphson`
--

LOCK TABLES `newtonraphson` WRITE;
/*!40000 ALTER TABLE `newtonraphson` DISABLE KEYS */;
INSERT INTO `newtonraphson` VALUES (1,'x^2-7',2,0.000001,'2025-10-10 00:48:32'),(2,'x^3 - x - 2',1,0.000001,'2025-10-10 00:49:24'),(3,'cos(x) - x',0.5,0.000001,'2025-10-10 00:49:42'),(4,'e^x - 3*x',1,0.000001,'2025-10-10 00:49:52'),(5,'x*e^x - 1',0,0.000001,'2025-10-10 00:50:22');
/*!40000 ALTER TABLE `newtonraphson` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onepoint`
--

DROP TABLE IF EXISTS `onepoint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onepoint` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fx` varchar(255) NOT NULL,
  `guess` double NOT NULL,
  `tolerance` double NOT NULL,
  `datecreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onepoint`
--

LOCK TABLES `onepoint` WRITE;
/*!40000 ALTER TABLE `onepoint` DISABLE KEYS */;
INSERT INTO `onepoint` VALUES (1,'(1 + x)^(1/3)',1,0.000001,'2025-10-10 02:37:34'),(2,'cos(x)',0.5,0.00001,'2025-10-10 02:38:35'),(3,'exp(-x)',0,0.000001,'2025-10-10 02:39:05');
/*!40000 ALTER TABLE `onepoint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `secant`
--

DROP TABLE IF EXISTS `secant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `secant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fx` varchar(255) NOT NULL,
  `x0` double NOT NULL,
  `x1` double NOT NULL,
  `tolerance` double NOT NULL,
  `datecreate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `secant`
--

LOCK TABLES `secant` WRITE;
/*!40000 ALTER TABLE `secant` DISABLE KEYS */;
INSERT INTO `secant` VALUES (1,'x^2 - 7',2,2.1,0.000001,'2025-10-11 23:16:34'),(2,'x^2 - 7',2,2.1,0.000001,'2025-10-11 23:16:37'),(3,'e^x - 2*x - 1',0,1,0.00001,'2025-10-11 23:17:32'),(4,'x^3 - x - 2',1,2,0.00001,'2025-10-11 23:17:48'),(5,'cos(x) - x',0.5,1,0.000001,'2025-10-11 23:18:18');
/*!40000 ALTER TABLE `secant` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-22  1:26:43
