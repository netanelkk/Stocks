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
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` varchar(800) NOT NULL,
  `date` datetime NOT NULL,
  `link` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (1,'European markets close lower as investors assess monetary policy outlook; Stoxx 600 down 1%','European markets closed lower Friday as investors assess the economic outlook and the potential for further monetary policy tightening from the U.S. Federal Reserve. The pan-European Stoxx 600 index finished trading down 1%. Most sectors and major bourses closed in the red, with travel and leisure stocks leading losses, down by 3.8%. Oil and gas stocks bucked the trend with a 2.3% uptick, while telecoms stocks were 0.2% higher. The index closed higher on Thursday with the economic outlook and corporate earnings high on the agenda.','2023-02-06 21:28:00','https://www.cnbc.com/2023/02/10/european-markets-open-to-close-earnings-data-and-news.html'),(5,'There isn’t enough copper in the world — and the shortage could last till 2030','A copper deficit is set to inundate global markets throughout 2023 — and one analyst predicts the shortfall could potentially extend throughout the rest of the decade. The world is currently facing a global copper shortage, fueled by increasingly challenging supply streams in South America and higher demand pressures. Copper is a leading pulse check for economic health due to its incorporation in various uses such as electrical equipment and industrial machinery. A copper squeeze could be an indicator that global inflationary pressures will worsen, and subsequently compel central banks to maintain their hawkish stance for longer.','2023-02-06 21:28:00','https://www.cnbc.com/2023/02/07/there-isnt-enough-copper-in-the-world-shortage-could-last-until-2030.html'),(6,'BP posts record 2022 earnings to join Big Oil profit bonanza','Analysts polled by Refinitiv had expected net profit of $27.6 billion for full-year 2022. BP said its previous annual profit record was $26.3 billion in 2008. For the fourth quarter, BP posted net profit of $4.8 billion, narrowly beating analyst expectations of $4.7 billion. BP announced a further $2.75 billion share buyback, which it expects to complete prior to announcing its first-quarter 2023 results in early May. It also boosted its dividend by 10% to 6.61 cents per ordinary share.','2023-02-07 14:09:00','https://www.cnbc.com/2023/02/07/bp-earnings-q4-and-fy-2022.html'),(7,'Shell’s board of directors sued over climate strategy in a first-of-its-kind lawsuit','Shell’s directors are being personally sued for allegedly failing to adequately manage the risks associated with the climate emergency in a first-of-its-kind lawsuit that could have widespread implications for how other companies plan to cut emissions. Environmental law firm ClientEarth, in its capacity as a shareholder, filed the lawsuit against the British oil major’s board at the high court of England and Wales on Thursday.','2023-02-09 16:07:00','https://www.cnbc.com/2023/02/09/oil-shell-board-of-directors-sued-by-investors-over-climate-strategy.html'),(8,'10-year Treasury yield rises, traders look ahead to key U.S. inflation data','The 10-year Treasury yield rose Friday as investors looked to economic data and comments from Federal Reserve officials to assess the outlook for inflation and monetary policy. The 10-year Treasury yield was trading at 3.719% after rising by 4 basis points. The yield on the 2-year Treasury was down by under under 1 basis point at 4.5%. Yields and prices move in opposite directions. One basis point equals 0.01%.','2023-02-10 16:52:00','https://www.cnbc.com/2023/02/10/us-treasury-yields-investors-await-data-fed-speaker-remarks.html'),(9,'Chinese IPOs are coming back to the U.S.','BEIJING — Chinese startups are raising millions of dollars in U.S. stock market listings again, after a dry spell in the once-hot market. Hesai Group, which sells “lidar” tech for self-driving cars, listed on the Nasdaq Thursday. Shares soared nearly 11% in the debut. The company raised $190 million in its initial public offering, more than initial plans — and one of the largest listings since ride-hailing giant Didi raised $4.4 billion in its June 2021 IPO. That listing ran afoul of Chinese regulators, who ordered a cybersecurity review into Didi just days after its public listing. The company delisted later that year.','2023-02-10 15:22:00','https://www.cnbc.com/2023/02/10/chinese-ipos-are-coming-back-to-the-us.html');
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
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
