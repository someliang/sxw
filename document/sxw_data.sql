-- MySQL dump 10.13  Distrib 5.1.41, for debian-linux-gnu (i486)
--
-- Host: localhost    Database: sxw
-- ------------------------------------------------------
-- Server version	5.1.41-3ubuntu12.6

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `character2school`
--

LOCK TABLES `character2school` WRITE;
/*!40000 ALTER TABLE `character2school` DISABLE KEYS */;
/*!40000 ALTER TABLE `character2school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sxw_major`
--

LOCK TABLES `sxw_major` WRITE;
/*!40000 ALTER TABLE `sxw_major` DISABLE KEYS */;
/*!40000 ALTER TABLE `sxw_major` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sxw_major_detail`
--

LOCK TABLES `sxw_major_detail` WRITE;
/*!40000 ALTER TABLE `sxw_major_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `sxw_major_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sxw_school`
--

LOCK TABLES `sxw_school` WRITE;
/*!40000 ALTER TABLE `sxw_school` DISABLE KEYS */;
/*!40000 ALTER TABLE `sxw_school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sxw_school_detail`
--

LOCK TABLES `sxw_school_detail` WRITE;
/*!40000 ALTER TABLE `sxw_school_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `sxw_school_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sxw_translation`
--

LOCK TABLES `sxw_translation` WRITE;
/*!40000 ALTER TABLE `sxw_translation` DISABLE KEYS */;
INSERT INTO `sxw_translation` VALUES (1,'grade','招生等级',0,0),(2,'one','一本',1,0),(3,'two','二本',2,2),(4,'province','四川',0,0),(5,'province','北京',0,0),(6,'province','上海',0,0),(7,'province','云南',0,0),(8,'province','山西',0,0),(9,'province','陕西',0,0),(10,'schoolcategory','综合',0,0),(11,'schoolcategory','理工',0,0),(12,'schoolcategory','农林',0,0),(13,'schoolcategory','医药',0,0),(14,'schoolcategory','师范',0,0),(15,'schoolcategory','财经',0,0),(16,'schoolcategory','军事',0,0),(17,'schoolcategory','其他',0,0),(18,'character','985工程',0,0),(19,'character','211工程',0,0),(20,'character','教育部直属',0,0),(21,'character','中央部委',0,0),(22,'character','自主招生试点',0,0);
/*!40000 ALTER TABLE `sxw_translation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sxw_user`
--

LOCK TABLES `sxw_user` WRITE;
/*!40000 ALTER TABLE `sxw_user` DISABLE KEYS */;
INSERT INTO `sxw_user` VALUES (1,'lonso','e10adc3949ba59abbe56e057f20f883e','2014-01-06 16:38:09',1);
/*!40000 ALTER TABLE `sxw_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-01-08  0:59:49
