# Ali Fet Portfolio – Kurulum Kılavuzu

## 📁 Klasör Yapısı

```
web_proje/
├── index.html                ← Anasayfa
├── README.md
│
├── pages/
│   ├── hakkimda.html
│   ├── projeler.html
│   ├── blog.html
│   ├── iletisim.html
│   ├── giris.html            ← Giriş sayfası
│   └── kayit.html            ← Kayıt sayfası
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   ├── js/
│   │   └── main.js           ← Auth + tüm JS mantığı
│   └── img/                  ← Görseller buraya
│
└── backend/
    └── php/
        ├── auth.php           ← Kayıt / Giriş / Çıkış / Kontrol
        ├── contact.php        ← İletişim formu
        ├── db.php             ← Veritabanı bağlantısı
        └── setup.sql          ← Veritabanı kurulum SQL
```

## 🚀 Kurulum

### 1. Veritabanı Oluştur
`phpMyAdmin > SQL` sekmesine `backend/php/setup.sql` içeriğini yapıştırıp çalıştırın.

### 2. Bağlantı Ayarları
`backend/php/db.php` dosyasını düzenleyin:
```php
define('DB_USER', 'root');   // MySQL kullanıcı adı
define('DB_PASS', '');       // MySQL şifresi
```

### 3. Sunucuya Taşı
- **XAMPP** → `C:/xampp/htdocs/web_proje/`
- **WAMP**  → `C:/wamp64/www/web_proje/`

### 4. Aç
```
http://localhost/web_proje/
```

## ⚙️ Nasıl Çalışır?

| Durum | Navbar |
|---|---|
| Giriş yapılmamış | "Giriş Yap" + "Kayıt Ol" butonları |
| Giriş yapılmış | Kullanıcı dropdown → Profil / Çıkış |

- Giriş/Kayıt sayfası — oturum açıksa otomatik anasayfaya yönlendirir
- Şifreler **bcrypt** ile hashlenir
- Oturum **PHP $_SESSION** ile yönetilir
