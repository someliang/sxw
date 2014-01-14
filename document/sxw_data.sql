SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `sxw` DEFAULT CHARACTER SET utf8 ;
USE `sxw` ;

-- -----------------------------------------------------
-- Table `sxw`.`sxw_user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sxw`.`sxw_user` ;

CREATE  TABLE IF NOT EXISTS `sxw`.`sxw_user` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `username` VARCHAR(255) NOT NULL ,
  `password` VARCHAR(255) NOT NULL ,
  `createdTime` TIMESTAMP NULL DEFAULT now() ,
  `is_admin` TINYINT(1) NOT NULL DEFAULT 0 ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
COMMENT = '用户表';


-- -----------------------------------------------------
-- Table `sxw`.`sxw_school`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sxw`.`sxw_school` ;

CREATE  TABLE IF NOT EXISTS `sxw`.`sxw_school` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `badge` VARCHAR(255) NULL ,
  `province` INT NOT NULL DEFAULT 0 ,
  `category` INT NOT NULL DEFAULT 0 ,
  `description` TEXT NOT NULL ,
  `summary` TEXT NULL ,
  `character` INT NOT NULL DEFAULT 0 ,
  `createdTime` TIMESTAMP NULL DEFAULT now() ,
  `name` VARCHAR(255) NOT NULL ,
  `popularity` INT NULL DEFAULT 0 ,
  `priority` INT NOT NULL DEFAULT 0 ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
COMMENT = '学校';


-- -----------------------------------------------------
-- Table `sxw`.`sxw_translation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sxw`.`sxw_translation` ;

CREATE  TABLE IF NOT EXISTS `sxw`.`sxw_translation` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `code` VARCHAR(255) NOT NULL ,
  `name` VARCHAR(255) NOT NULL ,
  `category` INT NOT NULL DEFAULT 0 ,
  `priority` INT NOT NULL DEFAULT 0 ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
COMMENT = '翻译表，信息映射';


-- -----------------------------------------------------
-- Table `sxw`.`sxw_school_detail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sxw`.`sxw_school_detail` ;

CREATE  TABLE IF NOT EXISTS `sxw`.`sxw_school_detail` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `location` INT NOT NULL DEFAULT 0 ,
  `vintage` DATE NOT NULL ,
  `grade` INT NOT NULL ,
  `shift` INT NOT NULL ,
  `admission` INT NOT NULL ,
  `average` INT NOT NULL ,
  `science` INT NOT NULL DEFAULT 0 ,
  `sxw_school_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_sxw_school_detail_sxw_school1_idx` (`sxw_school_id` ASC) ,
  CONSTRAINT `fk_sxw_school_detail_sxw_school1`
    FOREIGN KEY (`sxw_school_id` )
    REFERENCES `sxw`.`sxw_school` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '学校详情，包括调档线，平均线等。';


-- -----------------------------------------------------
-- Table `sxw`.`sxw_major`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sxw`.`sxw_major` ;

CREATE  TABLE IF NOT EXISTS `sxw`.`sxw_major` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `category` INT NOT NULL ,
  `description` TEXT NOT NULL ,
  `sxw_school_id` INT NOT NULL ,
  `name` VARCHAR(255) NOT NULL ,
  `science` INT NOT NULL DEFAULT 1 ,
  `priority` INT NOT NULL DEFAULT 0 ,
  `popularity` INT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_sxw_major_sxw_school1_idx` (`sxw_school_id` ASC) ,
  CONSTRAINT `fk_sxw_major_sxw_school1`
    FOREIGN KEY (`sxw_school_id` )
    REFERENCES `sxw`.`sxw_school` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '专业,专业类别：经济类、管理类、文学类、历史类、教育类、哲学类、艺术学、法学';


-- -----------------------------------------------------
-- Table `sxw`.`sxw_major_detail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sxw`.`sxw_major_detail` ;

CREATE  TABLE IF NOT EXISTS `sxw`.`sxw_major_detail` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `vintage` DATE NOT NULL ,
  `location` INT NOT NULL ,
  `grade` INT NOT NULL ,
  `shift` INT NOT NULL ,
  `admission` INT NOT NULL ,
  `average` INT NOT NULL ,
  `sxw_major_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_sxw_major_detail_sxw_major1_idx` (`sxw_major_id` ASC) ,
  CONSTRAINT `fk_sxw_major_detail_sxw_major1`
    FOREIGN KEY (`sxw_major_id` )
    REFERENCES `sxw`.`sxw_major` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '专业详情';


-- -----------------------------------------------------
-- Table `sxw`.`sxw_translation2school`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sxw`.`sxw_translation2school` ;

CREATE  TABLE IF NOT EXISTS `sxw`.`sxw_translation2school` (
  `sxw_translation_id` INT NOT NULL ,
  `sxw_school_id` INT NOT NULL ,
  `id` INT NOT NULL AUTO_INCREMENT ,
  INDEX `fk_sxw_translation_has_sxw_school_sxw_school1_idx` (`sxw_school_id` ASC) ,
  INDEX `fk_sxw_translation_has_sxw_school_sxw_translation1_idx` (`sxw_translation_id` ASC) ,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `fk_sxw_translation_has_sxw_school_sxw_translation1`
    FOREIGN KEY (`sxw_translation_id` )
    REFERENCES `sxw`.`sxw_translation` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sxw_translation_has_sxw_school_sxw_school1`
    FOREIGN KEY (`sxw_school_id` )
    REFERENCES `sxw`.`sxw_school` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `sxw` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
