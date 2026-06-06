# Ali Fet — Kişisel Portföy Web Sitesi

## 📁 Klasör Yapısı

alifet/
├── index.html                  ← Anasayfa
├── README.md
│
├── pages/
│   ├── hakkimda.html           ← Hakkımda
│   ├── projeler.html           ← Projeler (arama + filtre + CRUD)
│   ├── blog.html               ← Blog (arama + kategori filtresi)
│   ├── iletisim.html           ← İletişim formu + Hava Durumu API
│   ├── giris.html              ← Giriş sayfası
│   └── kayit.html              ← Kayıt sayfası
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   ├── js/
│   │   └── main.js             ← Auth + animasyon + tüm JS
│   └── img/
│       └── favicon.svg
│
└── backend/
    └── php/
        ├── auth.php            ← Kayıt / Giriş / Çıkış / Kontrol
        ├── contact.php         ← İletişim formu → DB
        ├── projeler.php        ← Proje CRUD + mesaj listeleme
        ├── db.php              ← PDO bağlantısı
        └── setup.sql           ← Veritabanı kurulum
```

---

## ⚙️ Kurulum

### Gereksinimler
- PHP 7.4+
- MySQL 5.7+ / MariaDB 10+
- Apache/Nginx (XAMPP veya WAMP yeterli)

### 1. Veritabanı Oluştur
`phpMyAdmin > SQL` sekmesine `backend/php/setup.sql` içeriğini yapıştırıp çalıştırın.

### 2. Bağlantı Ayarları
`backend/php/db.php` dosyasını düzenleyin:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'alifet_db');
define('DB_USER', 'root');   // MySQL kullanıcı adı
define('DB_PASS', '');       // MySQL şifresi
```

### 3. Sunucuya Kopyala
- **XAMPP** → `C:/xampp/htdocs/alifet/`
- **WAMP**  → `C:/wamp64/www/alifet/`

### 4. Tarayıcıda Aç
```
http://localhost/alifet/
```

---

## 🌤️ Hava Durumu API

[Open-Meteo](https://open-meteo.com/) kullanılmıştır.
- Ücretsiz, kayıt gerektirmez
- İstanbul koordinatlarına göre anlık veri çeker
- `iletisim.html` sayfasında sol panelde gösterilir

---

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknolojiler |
|--------|-------------|
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Backend | PHP 8, PDO |
| Veritabanı | MySQL / MariaDB |
| Harici API | Open-Meteo (hava durumu) |
| İkonlar | Font Awesome 6 |

---

## 📌 Notlar

- Şifreler **bcrypt** ile hashlenir
- SQL injection'a karşı **prepared statements** kullanılır
- PHP mevcut değilse projeler sayfası **statik veri** ile çalışmaya devam eder
- Tüm form validasyonları hem istemci hem sunucu tarafında yapılır

---

© 2024 Ali Fet. Tüm hakları saklıdır.
