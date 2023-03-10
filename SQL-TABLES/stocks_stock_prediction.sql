-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: stocks
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `stock_prediction`
--

DROP TABLE IF EXISTS `stock_prediction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_prediction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `open` float(11,4) NOT NULL,
  `high` float(11,4) NOT NULL,
  `low` float(11,4) NOT NULL,
  `close` float(11,4) NOT NULL,
  `stockid` int NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_data` (`stockid`,`date`) /*!80000 INVISIBLE */,
  KEY `FK_stockid_idx` (`stockid`),
  CONSTRAINT `stockid` FOREIGN KEY (`stockid`) REFERENCES `stock` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_prediction`
--

LOCK TABLES `stock_prediction` WRITE;
/*!40000 ALTER TABLE `stock_prediction` DISABLE KEYS */;
INSERT INTO `stock_prediction` VALUES (1,200.0000,250.0000,180.0000,217.0000,1,'2023-02-17'),(2,200.0000,250.0000,180.0000,189.0000,1,'2023-02-16'),(3,200.0000,250.0000,180.0000,225.0000,1,'2023-02-15'),(4,200.0000,250.0000,180.0000,230.0000,1,'2023-02-13'),(5,200.0000,250.0000,180.0000,175.0000,1,'2023-02-10'),(6,200.0000,250.0000,180.0000,193.0000,1,'2023-02-09'),(7,200.0000,250.0000,180.0000,205.0000,1,'2023-02-08'),(9,300.0000,350.0000,280.0000,283.0000,3,'2023-02-17'),(10,200.0000,250.0000,180.0000,250.0000,1,'2023-02-14'),(11,200.0000,250.0000,180.0000,200.0000,1,'2023-02-23');
/*!40000 ALTER TABLE `stock_prediction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-01 19:30:09
