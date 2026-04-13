/* ============================================================
   main.js  –  Ali Fet Portfolio + Auth Session Manager
   ============================================================ */

// Auth PHP yolu (pages/ klasöründen veya root'tan çalışır)
function authPath() {
    // Sayfanın pages/ altında mı yoksa root'ta mı olduğunu tespit et
    const inPages = window.location.pathname.includes('/pages/');
    return inPages ? '../backend/php/auth.php' : 'backend/php/auth.php';
}

// ── PRELOADER ─────────────────────────────────────────────────
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) setTimeout(() => preloader.classList.add('hidden'), 500);
    authKontrol();
    particlesOlustur();
    scrollAnimasyon();
    typingEffect();
});

// ── AUTH: Oturum Kontrol & Navbar Güncelle ────────────────────
async function authKontrol() {
    try {
        const res  = await fetch(authPath() + '?action=kontrol');
        const data = await res.json();
        navbarGuncelle(data.giris_yapti, data.kullanici);
    } catch (e) {
        navbarGuncelle(false, null);
    }
}

function navbarGuncelle(girisYapti, kullanici) {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;

    if (girisYapti && kullanici) {
        navRight.innerHTML = `
            <div class="kullanici-menu">
                <button class="btn btn-outline kullanici-btn" id="kullaniciBtn">
                    <i class="fas fa-user-circle"></i> ${kullanici.ad_soyad.split(' ')[0]}
                    <i class="fas fa-chevron-down" style="font-size:0.7rem;"></i>
                </button>
                <div class="dropdown-menu" id="dropdownMenu">
                    <div class="dropdown-header">
                        <strong>${kullanici.ad_soyad}</strong>
                        <small>${kullanici.email}</small>
                    </div>
                    <hr style="border-color:rgba(255,255,255,0.1);margin:0.5rem 0;">
                    <a href="#" class="dropdown-item"><i class="fas fa-user"></i> Profilim</a>
                    <a href="#" class="dropdown-item"><i class="fas fa-cog"></i> Ayarlar</a>
                    <hr style="border-color:rgba(255,255,255,0.1);margin:0.5rem 0;">
                    <a href="#" class="dropdown-item cikis-btn" id="cikisBtn">
                        <i class="fas fa-sign-out-alt"></i> Çıkış Yap
                    </a>
                </div>
            </div>
            <a href="${rootUrl('iletisim')}" class="btn btn-secondary">İletişime Geç</a>
        `;

        document.getElementById('kullaniciBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('dropdownMenu').classList.toggle('open');
        });
        document.addEventListener('click', () => {
            document.getElementById('dropdownMenu')?.classList.remove('open');
        });
        document.getElementById('cikisBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const res  = await fetch(authPath(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'action=cikis'
                });
                const data = await res.json();
                if (data.success) {
                    bildirimGoster('Çıkış yapıldı. Görüşmek üzere!', 'success');
                    setTimeout(() => navbarGuncelle(false, null), 1000);
                }
            } catch (_) {
                bildirimGoster('Bağlantı hatası!', 'error');
            }
        });

    } else {
        navRight.innerHTML = `
            <a href="${rootUrl('giris')}" class="btn btn-outline">
                <i class="fas fa-sign-in-alt"></i> Giriş Yap
            </a>
            <a href="${rootUrl('kayit')}" class="btn btn-primary">
                <i class="fas fa-user-plus"></i> Kayıt Ol
            </a>
            <a href="${rootUrl('iletisim')}" class="btn btn-secondary">İletişime Geç</a>
        `;
    }
}

// pages/ içinden root'a doğru URL üret
function rootUrl(page) {
    const inPages = window.location.pathname.includes('/pages/');
    return inPages ? `../pages/${page}.html` : `pages/${page}.html`;
}

// ── GİRİŞ FORMU ───────────────────────────────────────────────
const girisForm = document.getElementById('girisForm');
if (girisForm) {
    (async () => {
        try {
            const res  = await fetch(authPath() + '?action=kontrol');
            const data = await res.json();
            if (data.giris_yapti) window.location.href = indexUrl();
        } catch (_) {}
    })();

    girisForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn    = girisForm.querySelector('button[type=submit]');
        const orijin = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş yapılıyor…';
        btn.disabled  = true;

        const body = new URLSearchParams({
            action: 'giris',
            email:  document.getElementById('email').value,
            sifre:  document.getElementById('sifre').value,
        });

        try {
            const res  = await fetch(authPath(), { method: 'POST', body });
            const data = await res.json();
            if (data.success) {
                bildirimGoster(data.message, 'success');
                setTimeout(() => window.location.href = indexUrl(), 1200);
            } else {
                bildirimGoster(data.message, 'error');
                btn.innerHTML = orijin; btn.disabled = false;
            }
        } catch (_) {
            bildirimGoster('Sunucuya bağlanılamadı!', 'error');
            btn.innerHTML = orijin; btn.disabled = false;
        }
    });
}

// ── KAYIT FORMU ───────────────────────────────────────────────
const kayitForm = document.getElementById('kayitForm');
if (kayitForm) {
    (async () => {
        try {
            const res  = await fetch(authPath() + '?action=kontrol');
            const data = await res.json();
            if (data.giris_yapti) window.location.href = indexUrl();
        } catch (_) {}
    })();

    kayitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn    = kayitForm.querySelector('button[type=submit]');
        const orijin = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kayıt yapılıyor…';
        btn.disabled  = true;

        const body = new URLSearchParams({
            action:       'kayit',
            ad_soyad:     document.getElementById('ad_soyad').value,
            email:        document.getElementById('email').value,
            sifre:        document.getElementById('sifre').value,
            sifre_tekrar: document.getElementById('sifre_tekrar').value,
        });

        try {
            const res  = await fetch(authPath(), { method: 'POST', body });
            const data = await res.json();
            if (data.success) {
                bildirimGoster(data.message, 'success');
                setTimeout(() => window.location.href = '../pages/giris.html', 1500);
            } else {
                bildirimGoster(data.message, 'error');
                btn.innerHTML = orijin; btn.disabled = false;
            }
        } catch (_) {
            bildirimGoster('Sunucuya bağlanılamadı!', 'error');
            btn.innerHTML = orijin; btn.disabled = false;
        }
    });

    // Şifre uyum kontrolü
    const s1 = document.getElementById('sifre');
    const s2 = document.getElementById('sifre_tekrar');
    if (s1 && s2) {
        s2.addEventListener('input', () => {
            s2.style.borderColor = (s2.value && s2.value !== s1.value) ? '#e17055' : '';
        });
    }
}

function indexUrl() {
    const inPages = window.location.pathname.includes('/pages/');
    return inPages ? '../index.html' : 'index.html';
}

// ── BİLDİRİM TOAST ────────────────────────────────────────────
function bildirimGoster(mesaj, tip = 'info') {
    let container = document.getElementById('bildirim-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'bildirim-container';
        container.style.cssText = `position:fixed;top:90px;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:0.75rem;`;
        document.body.appendChild(container);
    }
    const renk = tip === 'success' ? '#00b894' : tip === 'error' ? '#e17055' : '#6c5ce7';
    const icon = tip === 'success' ? 'fa-check-circle' : tip === 'error' ? 'fa-times-circle' : 'fa-info-circle';
    const toast = document.createElement('div');
    toast.style.cssText = `background:rgba(30,39,46,0.97);border-left:4px solid ${renk};color:#dfe6e9;padding:1rem 1.5rem;border-radius:12px;backdrop-filter:blur(10px);box-shadow:0 8px 32px rgba(0,0,0,0.4);font-size:0.95rem;max-width:360px;animation:slideIn 0.3s ease;display:flex;align-items:center;gap:0.75rem;`;
    toast.innerHTML = `<i class="fas ${icon}" style="color:${renk};font-size:1.2rem;flex-shrink:0;"></i>${mesaj}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity 0.4s'; setTimeout(()=>toast.remove(),400); }, 3500);
}

const toastStyle = document.createElement('style');
toastStyle.textContent = `@keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}`;
document.head.appendChild(toastStyle);

// ── NAVBAR SCROLL ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.5)' : '0 2px 20px rgba(0,0,0,0.3)';
});

// ── MOBİL MENÜ ────────────────────────────────────────────────
(function () {
    const btn      = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navRight = document.querySelector('.nav-right');
    if (!btn) return;

    // Karartma katmanı oluştur
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;display:none;';
    document.body.appendChild(overlay);

    function menuAc() {
        navLinks?.classList.add('active');
        navRight?.classList.add('active');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    function menuKapat() {
        navLinks?.classList.remove('active');
        navRight?.classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
        navLinks?.classList.contains('active') ? menuKapat() : menuAc();
    });

    // Overlay'e tıklayınca kapat
    overlay.addEventListener('click', menuKapat);

    // Menü linkine tıklayınca kapat
    navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', menuKapat));
})();

// ── PARTİKÜLLER ───────────────────────────────────────────────
function particlesOlustur() {
    const container = document.querySelector('.particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `left:${Math.random()*100}%;animation-delay:${Math.random()*15}s;animation-duration:${10+Math.random()*10}s;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;`;
        container.appendChild(p);
    }
}

// ── SCROLL ANİMASYON ──────────────────────────────────────────
function scrollAnimasyon() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ── TYPİNG EFFECT ─────────────────────────────────────────────
function typingEffect() {
    const el = document.querySelector('.typing-text span');
    if (!el) return;
    const metinler = ['Web Developer', 'PHP Developer', 'UI/UX Enthusiast', 'Problem Solver'];
    let mi = 0, ci = 0, siliyor = false;
    setInterval(() => {
        const metin = metinler[mi];
        el.textContent = siliyor ? metin.slice(0, --ci) : metin.slice(0, ++ci);
        if (!siliyor && ci === metin.length) setTimeout(() => siliyor = true, 1500);
        else if (siliyor && ci === 0) { siliyor = false; mi = (mi+1) % metinler.length; }
    }, 100);
}

// ── SKILL BARS ────────────────────────────────────────────────
document.querySelectorAll('.skill-bar').forEach(bar => {
    new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) bar.style.width = bar.dataset.width || '0%'; });
    }, { threshold: 0.5 }).observe(bar);
});
