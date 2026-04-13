<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Yalnızca POST isteği kabul edilir.']);
    exit;
}

$ad    = trim($_POST['ad']    ?? '');
$email = trim($_POST['email'] ?? '');
$konu  = trim($_POST['konu']  ?? '');
$mesaj = trim($_POST['mesaj'] ?? '');

if (empty($ad) || empty($email) || empty($mesaj)) {
    echo json_encode(['success' => false, 'message' => 'Ad, e-posta ve mesaj alanları zorunludur.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Geçerli bir e-posta adresi giriniz.']);
    exit;
}

// Mesajı veritabanına kaydet (isteğe bağlı - tablo eklenirse)
// $pdo->prepare("INSERT INTO mesajlar (ad, email, konu, mesaj) VALUES (?,?,?,?)")
//     ->execute([$ad, $email, $konu, $mesaj]);

// E-posta gönderimi (sunucu destekliyorsa)
$alici   = 'alifet@example.com'; // Kendi e-postanızı yazın
$baslik  = "Yeni İletişim Mesajı: " . ($konu ?: 'Genel');
$icerik  = "Ad: $ad\nE-posta: $email\nKonu: $konu\n\nMesaj:\n$mesaj";
$headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

// mail($alici, $baslik, $icerik, $headers); // Aktif etmek için başındaki // kaldırın

echo json_encode(['success' => true, 'message' => 'Mesajınız alındı. En kısa sürede dönüş yapacağım!']);
?>
