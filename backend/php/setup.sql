-- ================================================
--  Ali Fet Web Projesi - Veritabanı Kurulum SQL
--  phpMyAdmin > SQL sekmesine yapıştırıp çalıştırın
-- ================================================

CREATE DATABASE IF NOT EXISTS alifet_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE alifet_db;

CREATE TABLE IF NOT EXISTS kullanicilar (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    ad_soyad    VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    sifre       VARCHAR(255)  NOT NULL,
    olusturulma DATETIME      DEFAULT CURRENT_TIMESTAMP,
    son_giris   DATETIME      NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
