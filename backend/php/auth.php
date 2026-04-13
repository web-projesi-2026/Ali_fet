<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/db.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {

    // ── KAYIT ──────────────────────────────────────────
    case 'kayit':
        $ad_soyad = trim($_POST['ad_soyad'] ?? '');
        $email    = trim($_POST['email']    ?? '');
        $sifre    = $_POST['sifre']         ?? '';
        $tekrar   = $_POST['sifre_tekrar']  ?? '';

        if (empty($ad_soyad) || empty($email) || empty($sifre)) {
            echo json_encode(['success' => false, 'message' => 'Tüm alanları doldurunuz.']);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'message' => 'Geçerli bir e-posta giriniz.']);
            exit;
        }
        if (strlen($sifre) < 8) {
            echo json_encode(['success' => false, 'message' => 'Şifre en az 8 karakter olmalıdır.']);
            exit;
        }
        if ($sifre !== $tekrar) {
            echo json_encode(['success' => false, 'message' => 'Şifreler eşleşmiyor.']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id FROM kullanicilar WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'message' => 'Bu e-posta adresi zaten kayıtlı.']);
            exit;
        }

        $hash = password_hash($sifre, PASSWORD_BCRYPT);
        $pdo->prepare("INSERT INTO kullanicilar (ad_soyad, email, sifre) VALUES (?, ?, ?)")
            ->execute([$ad_soyad, $email, $hash]);

        echo json_encode(['success' => true, 'message' => 'Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.']);
        break;

    // ── GİRİŞ ──────────────────────────────────────────
    case 'giris':
        $email = trim($_POST['email'] ?? '');
        $sifre = $_POST['sifre']      ?? '';

        if (empty($email) || empty($sifre)) {
            echo json_encode(['success' => false, 'message' => 'E-posta ve şifre zorunludur.']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id, ad_soyad, email, sifre FROM kullanicilar WHERE email = ?");
        $stmt->execute([$email]);
        $kullanici = $stmt->fetch();

        if (!$kullanici || !password_verify($sifre, $kullanici['sifre'])) {
            echo json_encode(['success' => false, 'message' => 'E-posta veya şifre hatalı.']);
            exit;
        }

        $pdo->prepare("UPDATE kullanicilar SET son_giris = NOW() WHERE id = ?")
            ->execute([$kullanici['id']]);

        $_SESSION['kullanici_id']    = $kullanici['id'];
        $_SESSION['kullanici_adi']   = $kullanici['ad_soyad'];
        $_SESSION['kullanici_email'] = $kullanici['email'];

        echo json_encode([
            'success'   => true,
            'message'   => 'Giriş başarılı! Yönlendiriliyorsunuz.',
            'kullanici' => [
                'id'       => $kullanici['id'],
                'ad_soyad' => $kullanici['ad_soyad'],
                'email'    => $kullanici['email'],
            ]
        ]);
        break;

    // ── ÇIKIŞ ──────────────────────────────────────────
    case 'cikis':
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Çıkış yapıldı.']);
        break;

    // ── OTURUM KONTROL ─────────────────────────────────
    case 'kontrol':
        if (!empty($_SESSION['kullanici_id'])) {
            echo json_encode([
                'giris_yapti' => true,
                'kullanici'   => [
                    'id'       => $_SESSION['kullanici_id'],
                    'ad_soyad' => $_SESSION['kullanici_adi'],
                    'email'    => $_SESSION['kullanici_email'],
                ]
            ]);
        } else {
            echo json_encode(['giris_yapti' => false]);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Geçersiz istek.']);
}
?>
