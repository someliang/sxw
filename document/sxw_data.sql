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
INSERT INTO `sxw_school` VALUES (1,'/uploadImages/6d2dfd63b09a0d6578fe5e16cb71161e',4,10,'<p>亲,请在此处填写内容!!</p>','2222222',0,'2014-01-09 12:56:38','一般',NULL,23),(2,'/uploadImages/7d02d2ce3483bfa67c4ed873d14b56b9',4,11,'<p>三大大赛的的三大萨</p>','2222222',0,'2014-01-09 13:12:03','四川大学',NULL,23),(3,'/uploadImages/9ed8e4e630bd1b13b0980ef8194a8b5f',5,10,'<p>亲,请在此处填写内容!!333333333333333333333</p>','12333333333',0,'2014-01-09 13:14:03','231231232131231',NULL,2147483647),(4,'/uploadImages/ef6cc563a90b4fa33a590ab46d8c7e11',5,10,'<p>亲,请在此处填写内容!!</p>','所得到的等等等等等等等等迭代',0,'2014-01-09 13:14:53','的撒打死的',NULL,0),(5,'/uploadImages/9ff6e454bc9b082c8b8ff6702c7bcdb1',5,12,'<p>亲,请在此处填写内容!!</p>','22222222222',0,'2014-01-09 13:17:43','111111111111',NULL,2),(6,'/uploadImages/ca82704516e25436f12dafd20fb821e2',9,12,'<p>亲,请在此处填写内容!!</p>','23333333333',0,'2014-01-09 13:18:43','111111111111撒大三大的',NULL,2222),(7,'/uploadImages/86861afa3dcc2ddb3151b47c67dc969a',5,12,'<p>亲,请在此处填写内容!!</p>','1233',0,'2014-01-09 13:19:42','231123132321',NULL,12323123),(8,'/uploadImages/d2769b9739f8c00c19eb58737e835bf4',6,10,'<p>亲,请在此处填写内容!!</p>','23',0,'2014-01-09 13:20:42','213123',NULL,232),(9,'/uploadImages/cdbbf1cd76d2f1db719583ac88d06e42',6,14,'<p>亲,请在此处填写内容!!</p>','213213',0,'2014-01-09 13:21:27','12312312312',NULL,2312),(10,'/uploadImages/8c186832a407aba6ec072b98eb82b9b2',8,11,'<p>亲,请在此处填写内容!!</p>','23333333',0,'2014-01-09 13:24:07','撒大三大萨',NULL,23),(11,'/uploadImages/3fd17988279ce3e12f6caa59cf5a1aab',8,11,'<p>亲,请在此处填写内容!!</p>','23333333',0,'2014-01-09 13:24:18','撒大三大萨三大萨嗒',NULL,23),(12,'/uploadImages/a8c58ed3f8c3a05de1da5f7fbf27e306',8,11,'<p>亲,请在此处填写内容!!</p>','23333333',0,'2014-01-09 13:24:52','撒大三大萨三大萨嗒撒大三大',NULL,23),(21,'/uploadImages/5b6083ba715c5ea7a73ac937458e2624',5,11,'<p>亲,请在此处填写内容!!</p>','23',0,'2014-01-12 12:17:23','123123123',NULL,0),(22,'/uploadImages/4e7951054f4266df12775194aede077f',4,10,'<p>亲,请在此处填写内容!!22222</p>','22222222222',0,'2014-01-12 12:26:00','特诉他',NULL,23),(23,'/uploadImages/20f78f25d328ca754d9e5d363a0e21e6',4,10,'<p>亲,请在此处填写内容!!</p>','23123',0,'2014-01-12 12:27:40','2313123',NULL,23);
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
INSERT INTO `sxw_translation` VALUES (1,'grade','提前批',0,0),(2,'one','一本',1,0),(3,'two','二本',2,2),(4,'province','四川',0,0),(5,'province','北京',0,0),(6,'province','上海',0,0),(7,'province','云南',0,0),(8,'province','山西',0,0),(9,'province','陕西',0,0),(10,'schoolcategory','综合',0,0),(11,'schoolcategory','理工',0,0),(12,'schoolcategory','农林',0,0),(13,'schoolcategory','医药',0,0),(14,'schoolcategory','师范',0,0),(15,'schoolcategory','财经',0,0),(16,'schoolcategory','军事',0,0),(17,'schoolcategory','其他',0,0),(18,'character','985工程',0,0),(19,'character','211工程',0,0),(20,'character','教育部直属',0,0),(21,'character','中央部委',0,0),(22,'character','自主招生试点',0,0),(23,'majorcategory','经济学',0,0),(24,'majorcategory','哲学',0,0),(25,'majorcategory','管理学',0,0),(26,'majorcategory','法学',0,0),(27,'majorcategory','教育类',0,0),(28,'majorcategory','艺术类',0,0),(29,'grade','一本',0,0),(30,'grade','二本',0,0),(31,'grade','三本',0,0),(32,'grade','专科',0,0);
/*!40000 ALTER TABLE `sxw_translation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `sxw_translation2school`
--

LOCK TABLES `sxw_translation2school` WRITE;
/*!40000 ALTER TABLE `sxw_translation2school` DISABLE KEYS */;
INSERT INTO `sxw_translation2school` VALUES (18,1,57),(19,1,58),(20,1,59),(21,1,60),(18,2,62),(19,2,63),(18,3,64),(19,3,65),(20,3,66),(21,3,67),(22,3,68),(18,4,69),(19,4,70),(20,4,71),(21,4,72),(22,4,73),(18,5,74),(22,5,75),(18,6,76),(19,6,77),(20,6,78),(21,6,79),(22,6,80),(18,7,81),(21,7,82),(18,9,83),(21,9,84),(22,9,85),(18,11,86),(22,11,87),(18,12,88),(22,12,89),(18,12,90),(22,12,91),(18,21,101),(18,22,102),(20,22,103),(18,23,104),(19,23,105),(20,23,106),(21,23,107),(22,23,108);
/*!40000 ALTER TABLE `sxw_translation2school` ENABLE KEYS */;
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

-- Dump completed on 2014-01-13 20:56:55
