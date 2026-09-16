/**
 * SIGAP - Modul Siswa (Student Portal)
 * Implementasi Layar S-01 sampai S-10:
 * S-01 Landing / Login
 * S-02 Registrasi
 * S-03 Dashboard Siswa
 * S-04 s.d S-07 Multi-Step Form Pengaduan Wizard
 * S-08 Konfirmasi Pengiriman Tiket
 * S-09 & S-10 Lacak Status Laporan
 */

import { store, KATEGORI_DATA } from './store.js';

export const StudentModule = {
  // State sementara untuk wizard pelaporan
  reportWizardState: {
    step: 1,
    kategori_id: null,
    kategori_nama: '',
    judul: '',
    waktu_kejadian: '',
    lokasi: '',
    deskripsi: '',
    is_anonymous: true,
    nama_pelapor: '',
    nisn: '',
    saksi: '',
    bukti_file: null,
    persetujuan: false
  },

  resetWizard() {
    this.reportWizardState = {
      step: 1,
      kategori_id: 3, // default: Perundungan Siber
      kategori_nama: 'Perundungan Siber (Cyberbullying)',
      judul: '',
      waktu_kejadian: '',
      lokasi: '',
      deskripsi: '',
      is_anonymous: true,
      nama_pelapor: '',
      nisn: '',
      saksi: '',
      bukti_file: null,
      persetujuan: false
    };
  },

  // ==========================================
  // S-01: Landing & Login Siswa
  // ==========================================
  renderLanding(container) {
    container.innerHTML = `
      <div class="min-h-screen flex flex-col justify-between bg-white text-slate-800">
        <!-- Top Banner Header -->
        <header class="border-b border-slate-100 py-3 px-6 lg:px-12 flex justify-between items-center bg-white sticky top-0 z-30">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 shadow-sm">
              <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="font-bold text-lg tracking-tight block leading-none">SIGAP</span>
              <span class="text-xs text-slate-500 font-medium">Sistem Pengaduan Sekolah</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <a href="#/lacak?from=login" class="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition">
              <i data-lucide="search" class="w-4 h-4"></i> Lacak Tiket
            </a>
            <a href="#/admin/login" class="text-sm font-semibold text-sky-800 hover:text-sky-950 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 transition flex items-center gap-1.5">
              <i data-lucide="lock" class="w-4 h-4"></i> Portal Guru & Admin
            </a>
          </div>
        </header>

        <!-- Main Onboarding Content (Grid 2 Kolom Sesuai Wireframe) -->
        <main class="max-w-6xl mx-auto w-full px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <!-- Kolom Kiri: Hero & Jaminan Kerahasiaan -->
          <div class="lg:col-span-6 space-y-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
              <i data-lucide="shield" class="w-3.5 h-3.5"></i> LAYANAN RESMI BIMBINGAN KONSELING
            </div>

            <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Ruang Suara Aman bagi Seluruh Warga Sekolah
            </h1>

            <p class="text-slate-600 text-base leading-relaxed">
              Sampaikan laporan perundungan, kekerasan fisik maupun verbal, atau keluhan lingkungan belajar dengan garansi kerahasiaan identitas dan perlindungan penuh.
            </p>

            <!-- Card Ilustrasi Perlindungan -->
            <div class="bg-gradient-to-b from-sky-50/60 to-slate-50 p-6 rounded-2xl border border-sky-100 relative overflow-hidden">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 flex-shrink-0">
                  <i data-lucide="heart-handshake" class="w-7 h-7"></i>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 text-sm">100% Rahasia & Terlindungi</h4>
                  <p class="text-xs text-slate-600 mt-0.5">
                    Setiap laporan diverifikasi langsung oleh Tim BK & Satgas Perlindungan Anak tanpa takut dihakimi.
                  </p>
                </div>
              </div>
            </div>

            <!-- Fitur Utama -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div class="p-2 rounded-lg bg-white border border-slate-200 text-sky-700">
                  <i data-lucide="lock" class="w-4 h-4"></i>
                </div>
                <div>
                  <h5 class="text-xs font-bold text-slate-900">Enkripsi Berlapis</h5>
                  <p class="text-[11px] text-slate-500 mt-0.5">Identitas pelapor terproteksi ketat secara sistemik.</p>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div class="p-2 rounded-lg bg-white border border-slate-200 text-sky-700">
                  <i data-lucide="clock" class="w-4 h-4"></i>
                </div>
                <div>
                  <h5 class="text-xs font-bold text-slate-900">Respons Terpadu</h5>
                  <p class="text-[11px] text-slate-500 mt-0.5">Penanganan langsung oleh Guru BK & Tim Satgas.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Kolom Kanan: Card Login / Akses Masuk -->
          <div class="lg:col-span-6 max-w-md mx-auto w-full">
            <div class="bg-white p-7 lg:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900">
                  <i data-lucide="shield" class="w-5 h-5"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-900">Masuk ke Portal</h3>
                  <p class="text-xs text-slate-500">Silakan masuk dengan akun siswa atau pendidik Anda.</p>
                </div>
              </div>

              <form id="studentLoginForm" class="space-y-4">
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">NISN / NIP *</label>
                    <span class="text-[11px] text-slate-400">10 atau 18 Digit</span>
                  </div>
                  <input 
                    type="text" 
                    id="loginIdentifier" 
                    required 
                    placeholder="Masukkan 10 digit NISN Anda"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0] focus:ring-2 focus:ring-[#A7D8F0]/30 transition"
                  />
                  <p class="text-[11px] text-slate-400 mt-1">Gunakan NIP jika Anda adalah staf pengajar atau wali kelas.</p>
                </div>

                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi *</label>
                    <a href="#" class="text-[11px] font-medium text-sky-600 hover:underline">Lupa kata sandi?</a>
                  </div>
                  <div class="relative">
                    <input 
                      type="password" 
                      id="loginPassword" 
                      required 
                      placeholder="••••••••"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0] focus:ring-2 focus:ring-[#A7D8F0]/30 transition"
                    />
                    <button type="button" id="togglePasswordBtn" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                      <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <input type="checkbox" id="rememberMe" class="rounded border-slate-300 text-sky-600 focus:ring-[#A7D8F0]">
                  <label for="rememberMe" class="text-xs text-slate-600">Ingat sesi saya di perangkat ini</label>
                </div>

                <button 
                  type="submit" 
                  class="w-full py-2.5 px-4 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <span>Masuk</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
              </form>

              <div class="text-center text-xs text-slate-600">
                Belum memiliki akun terdaftar? 
                <a href="#/register" class="font-bold text-sky-700 hover:underline">Daftar di sini</a>
              </div>

              <!-- Pembatas Atau -->
              <div class="relative flex py-1 items-center">
                <div class="flex-grow border-t border-slate-200"></div>
                <span class="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase">Atau</span>
                <div class="flex-grow border-t border-slate-200"></div>
              </div>

              <!-- Lacak Tanpa Login Button Sesuai Wireframe -->
              <div class="space-y-1.5">
                <a 
                  href="#/lacak?from=login" 
                  class="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 transition"
                >
                  <i data-lucide="search-check" class="w-4 h-4 text-sky-700"></i>
                  <span>Lacak status laporan tanpa login</span>
                </a>
                <p class="text-[11px] text-center text-slate-500">
                  Punya Kode Tiket Aduan Anonim? Periksa progres investigasi di sini.
                </p>
              </div>

              <div class="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5"></i>
                <span>Data Anda dienkripsi dan diproteksi sesuai standar perlindungan kerahasiaan data anak dan instansi pendidikan.</span>
              </div>
            </div>
          </div>
        </main>

        <!-- Footer -->
        <footer class="border-t border-slate-200 py-5 px-6 text-center text-xs text-slate-500 bg-white">
          <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <i data-lucide="shield-check" class="w-4 h-4 text-sky-600"></i>
              <span>Layanan aduan resmi bimbingan konseling dan kesiswaan. Kerahasiaan identitas terjamin.</span>
            </div>
            <div>
              © 2026 SIGAP — Sistem Informasi Pengaduan Pelajar. Politeknik Elektronika Negeri Surabaya.
            </div>
          </div>
        </footer>
      </div>
    `;

    lucide.createIcons();

    // Toggle Password
    const toggleBtn = container.querySelector('#togglePasswordBtn');
    const pwdInput = container.querySelector('#loginPassword');
    if (toggleBtn && pwdInput) {
      toggleBtn.addEventListener('click', () => {
        const isPwd = pwdInput.getAttribute('type') === 'password';
        pwdInput.setAttribute('type', isPwd ? 'text' : 'password');
      });
    }

    // Handle Login Form
    const loginForm = container.querySelector('#studentLoginForm');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = container.querySelector('#loginIdentifier').value.trim();
      
      // Jika NIP (18 digit), arahkan ke admin
      if (identifier.length >= 12) {
        window.location.hash = '#/admin/dashboard';
        return;
      }

      // Login Siswa Berhasil
      store.setCurrentUser({
        role: 'siswa',
        nama: 'Ananda Dimas Prasetya',
        nisn: identifier || '3125521007',
        sekolah: 'SMAN 1 Teladan'
      });
      window.location.hash = '#/dashboard';
    });
  },

  // ==========================================
  // S-02: Registrasi Siswa
  // ==========================================
  renderRegister(container) {
    container.innerHTML = `
      <div class="min-h-screen flex flex-col justify-between bg-white text-slate-800">
        <header class="border-b border-slate-100 py-3 px-6 lg:px-12 flex justify-between items-center bg-white">
          <a href="#/" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 shadow-sm">
              <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="font-bold text-lg tracking-tight block leading-none">SIGAP</span>
              <span class="text-xs text-slate-500 font-medium">Registrasi Akun Siswa</span>
            </div>
          </a>
          <a href="#/" class="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Masuk
          </a>
        </header>

        <main class="max-w-md mx-auto w-full px-4 py-8">
          <div class="bg-white p-7 lg:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 class="text-2xl font-bold text-slate-900">Daftar Akun Siswa</h3>
              <p class="text-xs text-slate-500 mt-1">Buat akun untuk memantau aduan dan berkomunikasi langsung dengan konselor sekolah.</p>
            </div>

            <form id="studentRegisterForm" class="space-y-4">
              <div>
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Nama Lengkap (Opsional)</label>
                <input 
                  type="text" 
                  id="regNama" 
                  placeholder="Boleh dikosongkan jika ingin privasi"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">NISN *</label>
                <input 
                  type="text" 
                  id="regNISN" 
                  required 
                  placeholder="10 digit nomor induk siswa nasional"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Asal Satuan Pendidikan / Sekolah *</label>
                <input 
                  type="text" 
                  id="regSekolah" 
                  required 
                  value="SMAN 1 Teladan"
                  placeholder="Contoh: SMAN 1 Teladan"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Kata Sandi *</label>
                <input 
                  type="password" 
                  id="regPassword" 
                  required 
                  placeholder="Minimal 6 karakter"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Konfirmasi Kata Sandi *</label>
                <input 
                  type="password" 
                  id="regPasswordConfirm" 
                  required 
                  placeholder="Ulangi kata sandi"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>

              <div class="pt-2">
                <button 
                  type="submit" 
                  class="w-full py-2.5 px-4 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
                >
                  <i data-lucide="user-plus" class="w-4 h-4"></i> Buat Akun Siswa
                </button>
              </div>
            </form>

            <div class="text-center text-xs text-slate-600">
              Sudah memiliki akun? 
              <a href="#/" class="font-bold text-sky-700 hover:underline">Masuk di sini</a>
            </div>
          </div>
        </main>

        <footer class="py-4 text-center text-xs text-slate-400">
          Kerahasiaan data siswa dilindungi Undang-Undang Perlindungan Data Pribadi.
        </footer>
      </div>
    `;

    lucide.createIcons();

    const regForm = container.querySelector('#studentRegisterForm');
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = container.querySelector('#regNama').value.trim();
      const nisn = container.querySelector('#regNISN').value.trim();
      const sekolah = container.querySelector('#regSekolah').value.trim();

      store.setCurrentUser({
        role: 'siswa',
        nama: nama || 'Ananda Dimas Prasetya',
        nisn: nisn || '3125521007',
        sekolah: sekolah || 'SMAN 1 Teladan'
      });
      alert('Registrasi berhasil! Selamat datang di SIGAP.');
      window.location.hash = '#/dashboard';
    });
  },

  // ==========================================
  // S-03: Dashboard Siswa
  // ==========================================
  renderDashboard(container) {
    const user = store.getCurrentUser() || {
      nama: 'Ananda Dimas Prasetya',
      sekolah: 'SMAN 1 Teladan'
    };

    const myReports = store.getAllLaporan().filter(l => l.is_active).slice(0, 4);
    const countTotal = myReports.length;
    const countMenunggu = myReports.filter(l => l.status === 'menunggu').length;
    const countProses = myReports.filter(l => l.status === 'diverifikasi' || l.status === 'ditindaklanjuti').length;
    const countSelesai = myReports.filter(l => l.status === 'selesai').length;

    container.innerHTML = `
      <div class="min-h-screen bg-slate-50 text-slate-800 pb-20 lg:pb-12">
        <!-- Top Navbar Siswa Sesuai Wireframe -->
        <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div class="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 shadow-sm">
                <i data-lucide="shield-check" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="font-bold text-base tracking-tight block leading-tight">SIGAP</span>
                <span class="text-[11px] text-slate-500">Sistem Pengaduan Sekolah</span>
              </div>
            </div>

            <!-- Desktop Nav Links -->
            <nav class="hidden lg:flex items-center gap-6 text-sm font-medium">
              <a href="#/dashboard" class="text-sky-700 font-semibold border-b-2 border-[#A7D8F0] pb-1">Beranda</a>
              <a href="#/buat-laporan" class="text-slate-600 hover:text-slate-900 transition">Buat Laporan</a>
              <a href="#/riwayat" class="text-slate-600 hover:text-slate-900 transition">Riwayat</a>
            </nav>

            <!-- User Avatar & Notif -->
            <div class="flex items-center gap-3">
              <button class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative">
                <i data-lucide="bell" class="w-4 h-4"></i>
                <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              </button>

              <div class="flex items-center gap-2 border-l border-slate-200 pl-3">
                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                  DP
                </div>
                <div class="hidden sm:block text-left">
                  <span class="text-xs font-bold text-slate-900 block leading-tight">${user.nama}</span>
                  <span class="text-[10px] text-emerald-600 font-medium">Siswa Terverifikasi</span>
                </div>
                <button id="logoutBtn" title="Keluar" class="text-slate-400 hover:text-red-600 ml-1">
                  <i data-lucide="log-out" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-6xl mx-auto px-4 lg:px-8 py-6 space-y-6">
          <!-- Greeting Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div class="text-xs text-slate-500 flex items-center gap-2 mb-1">
                <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                <span>Semester Ganjil 2026/2027</span>
              </div>
              <h2 class="text-2xl font-extrabold text-slate-900">Halo, ${user.nama}</h2>
              <p class="text-xs text-slate-600 mt-0.5">
                Selamat datang di ruang perlindungan siswa SIGAP. Setiap suara Anda didengar, dilindungi, dan ditindaklanjuti secara profesional oleh bimbingan konseling dan kesiswaan.
              </p>
            </div>

            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Status Akun: Siswa Terverifikasi (${user.sekolah})
            </div>
          </div>

          <!-- Hero CTA Card Sesuai Wireframe -->
          <div class="bg-gradient-to-r from-sky-50 to-blue-50/50 p-6 rounded-2xl border border-sky-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="space-y-2 max-w-xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-sky-700 shadow-sm">
                  <i data-lucide="shield-alert" class="w-5 h-5"></i>
                </div>
                <h3 class="text-base font-bold text-slate-900">Mengalami atau Menyaksikan Tindakan Tidak Menyenangkan?</h3>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Laporkan perundungan, kekerasan fisik/verbal, pemalakan, atau diskriminasi di lingkungan sekolah. Identitas Anda dijamin 100% aman, terlindungi undang-undang perlindungan saksi, dan bersifat rahasia.
              </p>
              <div class="flex flex-wrap gap-2 pt-1">
                <span class="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-600">
                  <i data-lucide="eye-off" class="w-3 h-3 text-sky-600"></i> Pilihan Mode Anonim Tersedia
                </span>
                <span class="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-600">
                  <i data-lucide="clock" class="w-3 h-3 text-sky-600"></i> Respons Cepat Tim BK &lt; 24 Jam
                </span>
              </div>
            </div>

            <div class="flex flex-col items-center gap-1 w-full md:w-auto">
              <a 
                href="#/buat-laporan" 
                class="w-full md:w-auto px-6 py-3 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
              >
                <i data-lucide="plus-circle" class="w-5 h-5"></i>
                <span>Buat Laporan Baru</span>
              </a>
              <span class="text-[11px] text-slate-500">Layanan bersifat gratis dan terlindungi</span>
            </div>
          </div>

          <!-- Stat Cards 4 Kolom Sesuai Wireframe -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-500 font-medium block">Total Laporan</span>
                <span class="text-2xl font-extrabold text-slate-900">${countTotal}</span>
                <span class="text-[11px] text-slate-400 block">aduan diajukan</span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <i data-lucide="archive" class="w-5 h-5"></i>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-500 font-medium block">Menunggu Tanggapan</span>
                <span class="text-2xl font-extrabold text-amber-600">${countMenunggu}</span>
                <span class="text-[11px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium inline-block mt-0.5">Penelaahan</span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <i data-lucide="clock" class="w-5 h-5"></i>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-500 font-medium block">Sedang Ditindak</span>
                <span class="text-2xl font-extrabold text-blue-600">${countProses}</span>
                <span class="text-[11px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium inline-block mt-0.5">Konseling</span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <i data-lucide="refresh-cw" class="w-5 h-5"></i>
              </div>
            </div>

            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-500 font-medium block">Selesai Ditangani</span>
                <span class="text-2xl font-extrabold text-emerald-600">${countSelesai}</span>
                <span class="text-[11px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium inline-block mt-0.5">Terselesaikan</span>
              </div>
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i data-lucide="check-circle" class="w-5 h-5"></i>
              </div>
            </div>
          </div>

          <!-- Riwayat Laporan Saya Sesuai Wireframe -->
          <div class="space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-base font-bold text-slate-900">Riwayat Laporan Saya</h3>
                <p class="text-xs text-slate-500">Pantau perkembangan dan tindak lanjut aduan yang telah Anda kirimkan secara berkala.</p>
              </div>

              <div class="flex items-center gap-2">
                <select class="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700">
                  <option>Semua Status</option>
                  <option>Menunggu</option>
                  <option>Diverifikasi</option>
                  <option>Ditindaklanjuti</option>
                  <option>Selesai</option>
                </select>
                <button class="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 flex items-center gap-1">
                  <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i> Urutkan: Terbaru
                </button>
              </div>
            </div>

            <!-- List Card Aduan -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${myReports.map(item => {
                let badgeClass = 'badge-status-menunggu';
                let statusLabel = 'Menunggu';
                if (item.status === 'diverifikasi') {
                  badgeClass = 'badge-status-diverifikasi';
                  statusLabel = 'Diverifikasi';
                } else if (item.status === 'ditindaklanjuti') {
                  badgeClass = 'badge-status-ditindaklanjuti';
                  statusLabel = 'Ditindaklanjuti';
                } else if (item.status === 'selesai') {
                  badgeClass = 'badge-status-selesai';
                  statusLabel = 'Selesai';
                }

                return `
                  <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition space-y-4">
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">#${item.ticket_code}</span>
                        <span class="text-xs px-2.5 py-0.5 rounded-full font-medium ${badgeClass}">● ${statusLabel}</span>
                      </div>

                      <div>
                        <div class="text-[11px] font-semibold text-sky-700 flex items-center gap-1 mb-1">
                          <i data-lucide="tag" class="w-3 h-3"></i> ${item.kategori_nama}
                        </div>
                        <h4 class="text-sm font-bold text-slate-900 leading-snug line-clamp-2">${item.judul}</h4>
                      </div>

                      <div class="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                        <div class="flex items-center gap-1.5">
                          <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                          <span>${item.tanggal}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                          <i data-lucide="${item.is_anonymous ? 'eye-off' : 'user'}" class="w-3.5 h-3.5"></i>
                          <span>Mode: ${item.is_anonymous ? 'Anonim' : 'Identitas Terbuka'}</span>
                        </div>
                      </div>

                      <!-- Catatan Konselor Singkat -->
                      <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                        <span class="font-semibold block text-[11px] text-slate-700 mb-0.5">Catatan Konselor:</span>
                        <p class="text-[11px] text-slate-500 italic line-clamp-2">"${item.catatan_konselor || 'Sedang dalam antrean telaah oleh koordinator konseling.'}"</p>
                      </div>
                    </div>

                    <div class="pt-2">
                      <a 
                        href="#/lacak?code=${item.ticket_code}&from=dashboard" 
                        class="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <span>Lihat Rincian & Status</span>
                        <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                      </a>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Banner Kontak Darurat PPKSP Sesuai Wireframe -->
          <div class="bg-red-50/50 p-5 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                <i data-lucide="phone-call" class="w-5 h-5"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">Butuh Bantuan Darurat Segera?</h4>
                <p class="text-xs text-slate-600">Hubungi Satuan Tugas PPKSP & Layanan Konseling Darurat Sekolah jika keselamatan Anda atau rekan dalam kondisi kritis.</p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <a href="tel:02177889900" class="px-3.5 py-2 rounded-xl bg-white border border-red-200 text-slate-800 text-xs font-bold flex items-center gap-2 hover:bg-red-50 transition">
                <i data-lucide="phone" class="w-3.5 h-3.5 text-red-600"></i> (021) 7788-9900
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition">
                <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> WhatsApp Satgas
              </a>
            </div>
          </div>
        </main>

        <!-- Bottom Navigation Mobile Siswa Sesuai Spesifikasi -->
        <nav class="student-bottom-nav">
          <a href="#/dashboard" class="flex flex-col items-center gap-1 text-sky-700 text-[11px] font-bold">
            <i data-lucide="home" class="w-5 h-5"></i> Beranda
          </a>
          <a href="#/buat-laporan" class="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 text-[11px]">
            <i data-lucide="plus-circle" class="w-5 h-5"></i> Buat Laporan
          </a>
          <a href="#/riwayat" class="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 text-[11px]">
            <i data-lucide="clock" class="w-5 h-5"></i> Riwayat
          </a>
          <a href="#/profil" class="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 text-[11px]">
            <i data-lucide="user" class="w-5 h-5"></i> Profil
          </a>
        </nav>
      </div>
    `;

    lucide.createIcons();

    // Logout
    const logoutBtn = container.querySelector('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        store.logout();
        window.location.hash = '#/';
      });
    }
  },

  // ==========================================
  // S-04 s.d S-07: Form Pengaduan Wizard 4 Langkah
  // ==========================================
  renderFormWizard(container) {
    if (!this.reportWizardState.kategori_id) {
      this.resetWizard();
    }

    const state = this.reportWizardState;

    container.innerHTML = `
      <div class="min-h-screen bg-slate-50 text-slate-800 pb-16">
        <!-- Header -->
        <header class="bg-white border-b border-slate-200 py-3 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <a href="#/dashboard" class="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke Beranda
          </a>
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-[#A7D8F0] flex items-center justify-center text-slate-900 font-bold text-xs">
              <i data-lucide="shield" class="w-4 h-4"></i>
            </div>
            <span class="text-sm font-bold text-slate-900">Formulir Pengaduan Insiden</span>
          </div>
          <div class="text-xs text-slate-500 hidden sm:block">
            Tersimpan Otomatis
          </div>
        </header>

        <main class="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <div class="text-center space-y-1">
            <h2 class="text-2xl font-extrabold text-slate-900">Formulir Pengaduan Insiden</h2>
            <p class="text-xs text-slate-500">Sampaikan laporan Anda dengan aman, rahasia, dan terenkripsi.</p>
          </div>

          <!-- Stepper Progress 1 sampai 4 Sesuai Wireframe -->
          <div class="flex items-center justify-between px-4 py-2">
            <div class="stepper-item ${state.step >= 1 ? (state.step > 1 ? 'completed' : 'active') : ''}">
              <div class="stepper-circle">${state.step > 1 ? '<i data-lucide="check" class="w-4 h-4"></i>' : '1'}</div>
              <span class="text-[11px] font-bold mt-1.5 ${state.step === 1 ? 'text-sky-800' : 'text-slate-500'}">Kategori</span>
            </div>

            <div class="stepper-item ${state.step >= 2 ? (state.step > 2 ? 'completed' : 'active') : ''}">
              <div class="stepper-circle">${state.step > 2 ? '<i data-lucide="check" class="w-4 h-4"></i>' : '2'}</div>
              <span class="text-[11px] font-bold mt-1.5 ${state.step === 2 ? 'text-sky-800' : 'text-slate-500'}">Detail Kejadian</span>
            </div>

            <div class="stepper-item ${state.step >= 3 ? (state.step > 3 ? 'completed' : 'active') : ''}">
              <div class="stepper-circle">${state.step > 3 ? '<i data-lucide="check" class="w-4 h-4"></i>' : '3'}</div>
              <span class="text-[11px] font-bold mt-1.5 ${state.step === 3 ? 'text-sky-800' : 'text-slate-500'}">Bukti & Saksi</span>
            </div>

            <div class="stepper-item ${state.step === 4 ? 'active' : ''}">
              <div class="stepper-circle">4</div>
              <span class="text-[11px] font-bold mt-1.5 ${state.step === 4 ? 'text-sky-800' : 'text-slate-500'}">Konfirmasi</span>
            </div>
          </div>

          <!-- Card Form Kontainer Wizard -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm" id="wizardContentContainer">
            ${this.getWizardStepHTML(state.step)}
          </div>

          <div class="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <i data-lucide="phone-call" class="w-3.5 h-3.5 text-red-500"></i>
            <span>Butuh bantuan langsung atau kondisi darurat? Hubungi Hotline Satgas: <strong>(021) 7788-9900</strong></span>
          </div>
        </main>
      </div>
    `;

    lucide.createIcons();
    this.attachWizardEvents(container);
  },

  getWizardStepHTML(step) {
    const state = this.reportWizardState;

    if (step === 1) {
      // S-04: Step 1 - Kategori
      return `
        <div class="space-y-5 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Langkah 1 dari 4</span>
              <h3 class="text-lg font-bold text-slate-900 mt-0.5">Pilih Kategori Kejadian</h3>
              <p class="text-xs text-slate-500">Pilih salah satu jenis insiden yang paling sesuai dengan peristiwa yang dialami atau disaksikan.</p>
            </div>
            <span class="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-semibold">Tahap Awal</span>
          </div>

          <!-- Notice Kerahasiaan Sesuai Wireframe -->
          <div class="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center gap-3 text-xs text-sky-900">
            <i data-lucide="shield-check" class="w-5 h-5 text-sky-700 flex-shrink-0"></i>
            <span>Kerahasiaan data dan perlindungan saksi/korban dijamin sesuai peraturan perlindungan anak dan Permendikbudristek PPKSP.</span>
          </div>

          <!-- 7 Kategori Radio Card Selection -->
          <div class="space-y-2.5" id="kategoriListContainer">
            ${KATEGORI_DATA.map(kat => `
              <label class="flex items-start gap-3 p-3.5 rounded-xl border ${state.kategori_id === kat.id ? 'border-sky-400 bg-sky-50/40 ring-2 ring-[#A7D8F0]/40' : 'border-slate-200 hover:border-slate-300'} cursor-pointer transition">
                <input 
                  type="radio" 
                  name="kategoriRadio" 
                  value="${kat.id}" 
                  ${state.kategori_id === kat.id ? 'checked' : ''} 
                  class="mt-1 text-sky-600 focus:ring-[#A7D8F0]"
                />
                <div class="flex-grow">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-bold text-slate-900">${kat.nama}</span>
                    ${state.kategori_id === kat.id ? '<span class="text-[10px] bg-sky-600 text-white font-bold px-2 py-0.5 rounded">Dipilih</span>' : ''}
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">${kat.deskripsi}</p>
                </div>
              </label>
            `).join('')}
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-slate-100">
            <a href="#/dashboard" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">Batal</a>
            <button id="btnStep1Next" class="px-6 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs shadow-sm flex items-center gap-2">
              <span>Lanjut</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    } else if (step === 2) {
      // S-05: Step 2 - Deskripsi Kejadian
      return `
        <div class="space-y-5 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Langkah 2 dari 4</span>
              <h3 class="text-lg font-bold text-slate-900 mt-0.5">Detail Kejadian & Kronologi</h3>
              <p class="text-xs text-slate-500">Ceritakan apa yang terjadi secara objektif untuk membantu tim penanganan.</p>
            </div>
            <span class="text-xs bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full font-semibold">${state.kategori_nama}</span>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-slate-700 block mb-1">Judul Ringkas Aduan *</label>
              <input 
                type="text" 
                id="inputJudul" 
                value="${state.judul}" 
                placeholder="Contoh: Ejekan dan intimidasi di grup media sosial angkatan"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-700 block mb-1">Perkiraan Waktu / Tanggal *</label>
                <input 
                  type="text" 
                  id="inputWaktu" 
                  value="${state.waktu_kejadian || 'Hari ini saat jam istirahat'}" 
                  placeholder="Contoh: 14 Mei 2024, pukul 10:00 WIB"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 block mb-1">Lokasi Kejadian *</label>
                <input 
                  type="text" 
                  id="inputLokasi" 
                  value="${state.lokasi || 'Kantin Sekolah / Ruang Kelas'}" 
                  placeholder="Contoh: Ruang kelas VIII-B atau Grup WhatsApp"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-xs font-bold text-slate-700">Narasi Deskripsi Lengkap *</label>
                <span id="charCounter" class="text-[11px] text-slate-400 font-mono">${state.deskripsi.length} / 1000 karakter</span>
              </div>
              <textarea 
                id="inputDeskripsi" 
                rows="5" 
                placeholder="Jelaskan kronologi kejadian: siapa yang terlibat, apa yang dikatakan atau dilakukan, dan dampaknya..."
                class="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
              >${state.deskripsi}</textarea>
              <p class="text-[11px] text-slate-400 mt-1">Sistem AI SIGAP akan menganalisis narasi ini untuk memberikan rekomendasi prioritas perlindungan.</p>
            </div>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-slate-100">
            <button id="btnStep2Prev" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5">
              <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali
            </button>
            <button id="btnStep2Next" class="px-6 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs shadow-sm flex items-center gap-2">
              <span>Lanjut ke Mode & Bukti</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    } else if (step === 3) {
      // S-06 & S-07: Step 3 - Mode Anonimitas & Bukti
      return `
        <div class="space-y-5 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Langkah 3 dari 4</span>
              <h3 class="text-lg font-bold text-slate-900 mt-0.5">Mode Identitas & Lampiran Bukti</h3>
              <p class="text-xs text-slate-500">Tentukan privasi Anda dan sertakan berkas bukti jika ada.</p>
            </div>
            <span class="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-semibold">Kerahasiaan Terjamin</span>
          </div>

          <!-- Pilihan Mode Anonim vs Terbuka Sesuai Wireframe & uiuxspesification.md -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-700 block">Pilihan Mode Pelaporan *</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label class="p-4 rounded-xl border ${state.is_anonymous ? 'border-sky-400 bg-sky-50/40 ring-2 ring-[#A7D8F0]/40' : 'border-slate-200'} cursor-pointer flex items-start gap-3">
                <input type="radio" name="modeAnonim" value="1" ${state.is_anonymous ? 'checked' : ''} class="mt-1 text-sky-600 focus:ring-[#A7D8F0]">
                <div>
                  <div class="flex items-center gap-1.5">
                    <i data-lucide="eye-off" class="w-4 h-4 text-sky-700"></i>
                    <span class="text-xs font-bold text-slate-900">Laporkan Secara Anonim</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Nama dan kontak Anda dirahasiakan sepenuhnya. Pantau tindak lanjut hanya via Kode Tiket.</p>
                </div>
              </label>

              <label class="p-4 rounded-xl border ${!state.is_anonymous ? 'border-sky-400 bg-sky-50/40 ring-2 ring-[#A7D8F0]/40' : 'border-slate-200'} cursor-pointer flex items-start gap-3">
                <input type="radio" name="modeAnonim" value="0" ${!state.is_anonymous ? 'checked' : ''} class="mt-1 text-sky-600 focus:ring-[#A7D8F0]">
                <div>
                  <div class="flex items-center gap-1.5">
                    <i data-lucide="user" class="w-4 h-4 text-sky-700"></i>
                    <span class="text-xs font-bold text-slate-900">Laporkan dengan Nama</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">Konselor dapat menghubungi Anda langsung untuk pendampingan konseling tatap muka.</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Input Nama jika Tidak Anonim -->
          <div id="identitasContainer" class="${state.is_anonymous ? 'hidden' : ''} p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <label class="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap Siswa</label>
              <input type="text" id="inputNamaPelapor" value="${state.nama_pelapor || 'Ananda Dimas Prasetya'}" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none">
            </div>
          </div>

          <!-- Saksi (Opsional) -->
          <div>
            <label class="text-xs font-bold text-slate-700 block mb-1">Saksi yang Mengetahui (Opsional)</label>
            <input 
              type="text" 
              id="inputSaksi" 
              value="${state.saksi}" 
              placeholder="Contoh: Teman sebangku atau saksi di kantin"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
            />
          </div>

          <!-- Area Upload Berkas Bukti Sesuai S-07 -->
          <div>
            <label class="text-xs font-bold text-slate-700 block mb-1">Unggah Berkas Bukti (Foto / Tangkapan Layar / Dokumen PDF)</label>
            <div class="border-2 border-dashed border-slate-300 hover:border-sky-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 transition">
              <input type="file" id="fileBuktiInput" class="hidden" accept="image/*,.pdf,.doc,.docx">
              <div class="flex flex-col items-center gap-2">
                <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                  <i data-lucide="upload-cloud" class="w-5 h-5"></i>
                </div>
                <div class="text-xs text-slate-700">
                  <span class="font-bold text-sky-700 hover:underline">Klik untuk mengunggah</span> atau seret berkas ke sini
                </div>
                <p class="text-[11px] text-slate-400">Format PNG, JPG, atau PDF (Maksimal 10 MB per berkas)</p>
                <div id="fileUploadStatus" class="text-xs font-semibold text-emerald-600 mt-1">
                  ${state.bukti_file ? `✓ Berkas terlampir: ${state.bukti_file}` : ''}
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-slate-100">
            <button id="btnStep3Prev" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5">
              <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali
            </button>
            <button id="btnStep3Next" class="px-6 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs shadow-sm flex items-center gap-2">
              <span>Tinjau Laporan</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    } else if (step === 4) {
      // Step 4 - Konfirmasi & Pengiriman
      return `
        <div class="space-y-5 animate-fade-in">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Langkah 4 dari 4</span>
              <h3 class="text-lg font-bold text-slate-900 mt-0.5">Konfirmasi & Kirim Laporan</h3>
              <p class="text-xs text-slate-500">Pastikan seluruh data yang Anda cantumkan telah sesuai sebelum dikirim ke konselor.</p>
            </div>
            <span class="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">Siap Kirim</span>
          </div>

          <!-- Rangkuman Laporan -->
          <div class="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div class="grid grid-cols-2 gap-2 text-xs border-b border-slate-200 pb-3">
              <div>
                <span class="text-slate-400 block text-[11px]">Kategori Insiden:</span>
                <span class="font-bold text-slate-900">${state.kategori_nama}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Mode Pelaporan:</span>
                <span class="font-bold ${state.is_anonymous ? 'text-slate-700' : 'text-sky-700'}">
                  ${state.is_anonymous ? 'Anonim (Rahasia Penuh)' : 'Identitas Terbuka'}
                </span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Perkiraan Waktu:</span>
                <span class="font-medium text-slate-800">${state.waktu_kejadian || '-'}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Lokasi:</span>
                <span class="font-medium text-slate-800">${state.lokasi || '-'}</span>
              </div>
            </div>

            <div>
              <span class="text-slate-400 block text-[11px] mb-1">Judul Aduan:</span>
              <p class="text-xs font-bold text-slate-900">${state.judul || '-'}</p>
            </div>

            <div>
              <span class="text-slate-400 block text-[11px] mb-1">Deskripsi Kronologi:</span>
              <p class="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">${state.deskripsi || '-'}</p>
            </div>

            ${state.bukti_file ? `
              <div class="flex items-center gap-2 text-xs text-emerald-700 pt-1">
                <i data-lucide="paperclip" class="w-4 h-4"></i>
                <span>Lampiran berkas: <strong>${state.bukti_file}</strong></span>
              </div>
            ` : ''}
          </div>

          <!-- Pernyataan Persetujuan Perlindungan -->
          <div class="flex items-start gap-3 p-3.5 rounded-xl bg-sky-50 border border-sky-200">
            <input type="checkbox" id="checkPersetujuan" class="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-[#A7D8F0]" checked>
            <label for="checkPersetujuan" class="text-xs text-slate-700 leading-relaxed">
              Saya menyatakan bahwa keterangan ini disampaikan dengan iktikad baik untuk menciptakan lingkungan sekolah yang aman dan bebas dari perundungan.
            </label>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-slate-100">
            <button id="btnStep4Prev" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5">
              <i data-lucide="arrow-left" class="w-4 h-4"></i> Perbaiki Data
            </button>
            <button id="btnSubmitReport" class="px-7 py-3 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm flex items-center gap-2">
              <i data-lucide="send" class="w-4 h-4"></i>
              <span>Kirim Laporan Sekarang</span>
            </button>
          </div>
        </div>
      `;
    }
  },

  attachWizardEvents(container) {
    const state = this.reportWizardState;

    if (state.step === 1) {
      // Step 1: Kategori
      const radios = container.querySelectorAll('input[name="kategoriRadio"]');
      radios.forEach(r => {
        r.addEventListener('change', (e) => {
          state.kategori_id = Number(e.target.value);
          const found = KATEGORI_DATA.find(k => k.id === state.kategori_id);
          state.kategori_nama = found ? found.nama : '';
          this.renderFormWizard(container);
        });
      });

      const nextBtn = container.querySelector('#btnStep1Next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (!state.kategori_id) {
            state.kategori_id = 3;
            state.kategori_nama = 'Perundungan Siber (Cyberbullying)';
          }
          state.step = 2;
          this.renderFormWizard(container);
        });
      }
    } else if (state.step === 2) {
      // Step 2: Detail
      const judulInput = container.querySelector('#inputJudul');
      const waktuInput = container.querySelector('#inputWaktu');
      const lokasiInput = container.querySelector('#inputLokasi');
      const descInput = container.querySelector('#inputDeskripsi');
      const charCounter = container.querySelector('#charCounter');

      descInput.addEventListener('input', () => {
        state.deskripsi = descInput.value;
        charCounter.textContent = `${descInput.value.length} / 1000 karakter`;
      });

      container.querySelector('#btnStep2Prev').addEventListener('click', () => {
        state.step = 1;
        this.renderFormWizard(container);
      });

      container.querySelector('#btnStep2Next').addEventListener('click', () => {
        state.judul = judulInput.value.trim() || `Pengaduan Insiden ${state.kategori_nama}`;
        state.waktu_kejadian = waktuInput.value.trim();
        state.lokasi = lokasiInput.value.trim();
        state.deskripsi = descInput.value.trim();

        if (!state.deskripsi) {
          alert('Mohon tuliskan deskripsi kronologi kejadian.');
          descInput.focus();
          return;
        }

        state.step = 3;
        this.renderFormWizard(container);
      });
    } else if (state.step === 3) {
      // Step 3: Mode & Bukti
      const modeRadios = container.querySelectorAll('input[name="modeAnonim"]');
      const identitasBox = container.querySelector('#identitasContainer');
      modeRadios.forEach(r => {
        r.addEventListener('change', (e) => {
          state.is_anonymous = e.target.value === '1';
          if (state.is_anonymous) {
            identitasBox.classList.add('hidden');
          } else {
            identitasBox.classList.remove('hidden');
          }
        });
      });

      const saksiInput = container.querySelector('#inputSaksi');
      const fileInput = container.querySelector('#fileBuktiInput');
      const uploadArea = container.querySelector('.border-dashed');

      uploadArea.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          state.bukti_file = e.target.files[0].name;
          container.querySelector('#fileUploadStatus').textContent = `✓ Berkas terlampir: ${state.bukti_file}`;
        }
      });

      container.querySelector('#btnStep3Prev').addEventListener('click', () => {
        state.step = 2;
        this.renderFormWizard(container);
      });

      container.querySelector('#btnStep3Next').addEventListener('click', () => {
        state.saksi = saksiInput.value.trim();
        if (!state.is_anonymous) {
          const namaInput = container.querySelector('#inputNamaPelapor');
          state.nama_pelapor = namaInput ? namaInput.value.trim() : 'Siswa Terdaftar';
        }
        state.step = 4;
        this.renderFormWizard(container);
      });
    } else if (state.step === 4) {
      // Step 4: Submit
      container.querySelector('#btnStep4Prev').addEventListener('click', () => {
        state.step = 3;
        this.renderFormWizard(container);
      });

      container.querySelector('#btnSubmitReport').addEventListener('click', () => {
        const newReport = store.createLaporan({
          judul: state.judul,
          deskripsi: state.deskripsi,
          kategori_id: state.kategori_id,
          is_anonymous: state.is_anonymous,
          nama_pelapor: state.nama_pelapor,
          lokasi: state.lokasi,
          bukti_file: state.bukti_file
        });

        // S-08: Tampilkan Halaman Konfirmasi Sukses
        this.renderConfirmation(container, newReport);
      });
    }
  },

  // ==========================================
  // S-08: Konfirmasi Pengiriman Sukses
  // ==========================================
  renderConfirmation(container, report) {
    container.innerHTML = `
      <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div class="max-w-lg w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-md text-center space-y-6 animate-fade-in">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <i data-lucide="check-circle-2" class="w-10 h-10"></i>
          </div>

          <div class="space-y-1">
            <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Pengiriman Berhasil</span>
            <h2 class="text-2xl font-extrabold text-slate-900">Laporan Berhasil Dikirim</h2>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Terima kasih telah berani bersuara. Laporan Anda telah masuk ke dalam sistem perlindungan SIGAP dan tim konselor sekolah segera melakukan verifikasi.
            </p>
          </div>

          <!-- Ticket Box Sesuai Wireframe -->
          <div class="bg-sky-50/70 border-2 border-dashed border-[#A7D8F0] p-5 rounded-2xl space-y-2">
            <span class="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">Kode Tiket Rahasia Anda:</span>
            <div class="text-2xl font-black font-mono text-slate-900 tracking-wider select-all" id="ticketCodeDisplay">
              ${report.ticket_code}
            </div>
            <p class="text-[11px] text-slate-500">
              Simpan kode tiket ini untuk memantau proses tindak lanjut, terutama jika Anda melapor secara anonim.
            </p>
            <button 
              id="btnCopyTicket" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-sky-200 text-sky-800 text-xs font-bold hover:bg-sky-50 shadow-sm transition"
            >
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> Salin Kode Tiket
            </button>
          </div>

          <div class="space-y-2.5 pt-2">
            <a 
              href="#/lacak?code=${report.ticket_code}&from=${store.getCurrentUser() ? 'dashboard' : 'login'}" 
              class="w-full py-3 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
            >
              <i data-lucide="search" class="w-4 h-4"></i> Lacak Status Sekarang
            </a>

            <a 
              href="#/dashboard" 
              class="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 block transition"
            >
              Kembali ke Beranda Siswa
            </a>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();

    const copyBtn = container.querySelector('#btnCopyTicket');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(report.ticket_code);
      copyBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i> Berhasil Disalin!`;
      lucide.createIcons();
      setTimeout(() => {
        copyBtn.innerHTML = `<i data-lucide="copy" class="w-3.5 h-3.5"></i> Salin Kode Tiket`;
        lucide.createIcons();
      }, 2000);
    });
  },

  // ==========================================
  // S-09 & S-10: Pelacakan Status & Detail Laporan
  // ==========================================
  renderTracking(container, prefilledCode = '', fromSource = '') {
    const defaultCode = prefilledCode || 'SGP-2024-0142';
    const report = store.getLaporanByTicket(defaultCode) || store.getAllLaporan()[0];

    const currentUser = store.getCurrentUser();
    // Tentukan tujuan tombol kembali:
    // Jika diakses dari menu login (from=login), kembali ke login (#/)
    // Jika diakses dari beranda siswa (from=dashboard atau user siswa sedang login), kembali ke beranda siswa (#/dashboard)
    const isFromDashboard = fromSource === 'dashboard' || (fromSource !== 'login' && currentUser && currentUser.role === 'siswa');
    const backUrl = isFromDashboard ? '#/dashboard' : '#/';
    const backLabel = isFromDashboard ? 'Kembali ke Beranda' : 'Kembali ke Halaman Masuk';

    container.innerHTML = `
      <div class="min-h-screen bg-slate-50 text-slate-800 pb-16">
        <!-- Header -->
        <header class="bg-white border-b border-slate-200 py-3 px-4 lg:px-12 flex items-center justify-between sticky top-0 z-30">
          <div class="flex items-center gap-3">
            <a href="${backUrl}" class="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition shadow-sm">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              <span>${backLabel}</span>
            </a>
            <div class="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <a href="${backUrl}" class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 shadow-sm">
                <i data-lucide="shield-check" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="font-bold text-base tracking-tight block leading-tight">SIGAP <span class="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold ml-1">PUBLIK</span></span>
                <span class="text-[11px] text-slate-500 hidden sm:block">Sistem Pengaduan Sekolah & Perlindungan Siswa</span>
              </div>
            </a>
          </div>

          <div class="flex items-center gap-3">
            ${isFromDashboard ? `
              <a href="#/dashboard" class="text-xs font-semibold text-sky-800 hover:text-sky-950 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 flex items-center gap-1.5 transition">
                <i data-lucide="home" class="w-3.5 h-3.5"></i> Beranda Siswa
              </a>
            ` : `
              <a href="#/" class="text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition">
                <i data-lucide="log-in" class="w-3.5 h-3.5"></i> Masuk Akun
              </a>
            `}
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <!-- Bar Navigasi Tombol Kembali -->
          <div class="flex items-center justify-between">
            <a href="${backUrl}" class="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition shadow-sm">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              <span>${backLabel}</span>
            </a>
            <span class="text-[11px] text-slate-400">
              ${isFromDashboard ? 'Portal Siswa Terverifikasi' : 'Mode Akses Pelacakan Cepat'}
            </span>
          </div>

          <!-- Hero Section Lacak -->
          <div class="text-center space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
              <i data-lucide="lock" class="w-3.5 h-3.5"></i> Pelacakan Aman & Anonim Tanpa Perlu Masuk
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Lacak Status Laporan</h2>
            <p class="text-xs text-slate-500 max-w-lg mx-auto">
              Masukkan kode tiket rahasia yang Anda dapatkan saat mengirimkan pengaduan untuk memantau perkembangan investigasi.
            </p>
          </div>

          <!-- Input Pencarian Tiket Sesuai Wireframe -->
          <div class="max-w-xl mx-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
            <div class="flex-grow flex items-center pl-3 gap-2">
              <i data-lucide="ticket" class="w-4 h-4 text-slate-400"></i>
              <input 
                type="text" 
                id="searchTicketInput" 
                value="${report ? report.ticket_code : ''}" 
                placeholder="SGP-2024-XXXX"
                class="w-full text-sm font-mono font-bold text-slate-800 focus:outline-none uppercase"
              />
            </div>
            <button 
              id="btnSearchTicket" 
              class="px-5 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs shadow-sm flex items-center gap-2 transition flex-shrink-0"
            >
              <i data-lucide="search" class="w-4 h-4"></i>
              <span>Cek Status</span>
            </button>
          </div>

          <div class="text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
            <span>✓ Format kode peka huruf kapital (SGP-XXXX-XXXX)</span>
            <span>•</span>
            <a href="${backUrl}" class="text-sky-700 hover:underline">Lupa kode tiket?</a>
          </div>

          <!-- Card Rincian Status Sesuai Wireframe LacakStatusLaporanUser_SIGAP.png -->
          ${report ? this.renderTrackingDetailHTML(report) : `
            <div class="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <i data-lucide="alert-circle" class="w-8 h-8 text-amber-500 mx-auto"></i>
              <h4 class="font-bold text-slate-800">Kode Tiket Tidak Ditemukan</h4>
              <p class="text-xs text-slate-500">Silakan periksa kembali kombinasi huruf dan angka pada kode tiket Anda.</p>
            </div>
          `}
        </main>
      </div>
    `;

    lucide.createIcons();

    const searchBtn = container.querySelector('#btnSearchTicket');
    const searchInput = container.querySelector('#searchTicketInput');
    const triggerSearch = () => {
      const code = searchInput.value.trim();
      if (code) {
        this.renderTracking(container, code, fromSource);
      }
    };

    searchBtn.addEventListener('click', triggerSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerSearch();
    });

    const copyBtn = container.querySelector('#copyTicketDetailBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(report.ticket_code);
        alert('Kode tiket disalin ke clipboard: ' + report.ticket_code);
      });
    }
  },

  renderTrackingDetailHTML(report) {
    // Stepper Status: Menunggu (1) -> Diverifikasi (2) -> Ditindaklanjuti (3) -> Selesai (4)
    let stepIndex = 1;
    if (report.status === 'diverifikasi') stepIndex = 2;
    else if (report.status === 'ditindaklanjuti') stepIndex = 3;
    else if (report.status === 'selesai') stepIndex = 4;

    return `
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8 space-y-6 animate-fade-in">
        <!-- Top Info Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">KODE TIKET TERVERIFIKASI</span>
              <span class="text-xs px-2.5 py-0.5 rounded-full font-medium ${report.status === 'selesai' ? 'badge-status-selesai' : 'badge-status-diverifikasi'}">
                ● ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <h3 class="text-2xl font-black font-mono text-slate-900 tracking-wider">${report.ticket_code}</h3>
              <button id="copyTicketDetailBtn" title="Salin Kode" class="text-slate-400 hover:text-slate-600 p-1">
                <i data-lucide="copy" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 text-xs">
            <div class="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Kategori</span>
              <span class="font-bold text-slate-800">${report.kategori_nama}</span>
            </div>
            <div class="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Dikirim Pada</span>
              <span class="font-bold text-slate-800">${report.tanggal}</span>
            </div>
            <div class="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              <span class="text-[10px] text-slate-400 uppercase font-bold block">Sifat Pelaporan</span>
              <span class="font-bold text-sky-700">${report.is_anonymous ? '🔒 Anonim' : '👤 Terbuka'}</span>
            </div>
          </div>
        </div>

        <!-- Stepper Penanganan 4 Tahap Sesuai Wireframe -->
        <div class="py-2">
          <div class="flex items-center justify-between text-center relative">
            <!-- Step 1: Diterima / Menunggu -->
            <div class="stepper-item ${stepIndex >= 1 ? (stepIndex > 1 ? 'completed' : 'active') : ''}">
              <div class="stepper-circle">
                ${stepIndex > 1 ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : '1'}
              </div>
              <span class="text-xs font-bold mt-2 text-slate-900">Diterima</span>
              <span class="text-[10px] text-slate-400">Tahap Awal</span>
            </div>

            <!-- Step 2: Penelaahan BK / Diverifikasi -->
            <div class="stepper-item ${stepIndex >= 2 ? (stepIndex > 2 ? 'completed' : 'active') : ''}">
              <div class="stepper-circle">
                ${stepIndex > 2 ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : '2'}
              </div>
              <span class="text-xs font-bold mt-2 text-slate-900">Penelaahan BK / Satgas</span>
              <span class="text-[10px] text-slate-400">Verifikasi Berkas</span>
            </div>

            <!-- Step 3: Ditindaklanjuti / Mediasi -->
            <div class="stepper-item ${stepIndex >= 3 ? (stepIndex > 3 ? 'completed' : 'active') : ''}">
              <div class="stepper-circle">
                ${stepIndex > 3 ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : '3'}
              </div>
              <span class="text-xs font-bold mt-2 text-slate-900">Tindak Lanjut & Mediasi</span>
              <span class="text-[10px] text-slate-400">Proses Penanganan</span>
            </div>

            <!-- Step 4: Selesai & Evaluasi -->
            <div class="stepper-item ${stepIndex === 4 ? 'completed' : ''}">
              <div class="stepper-circle">
                ${stepIndex === 4 ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : '4'}
              </div>
              <span class="text-xs font-bold mt-2 text-slate-900">Selesai & Evaluasi</span>
              <span class="text-[10px] text-slate-400">Tahap Akhir</span>
            </div>
          </div>
        </div>

        <!-- Box Catatan Petugas Konselor Sesuai Wireframe -->
        <div class="bg-sky-50/70 border border-sky-200 p-5 rounded-2xl flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-white text-sky-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <i data-lucide="message-square" class="w-5 h-5"></i>
          </div>
          <div class="flex-grow space-y-1">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-900">Catatan Petugas Konselor BK (Ibu Rahmawati, S.Pd)</h4>
              <span class="text-[10px] text-slate-500">${report.tanggal}</span>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed italic">
              "${report.catatan_konselor || 'Laporan telah terverifikasi. Kami sedang melakukan koordinasi internal dengan pihak sekolah terkait tanpa membocorkan identitas pelapor. Harap simpan tautan/tiket ini untuk update berikutnya.'}"
            </p>
          </div>
        </div>

        <!-- Deskripsi Ringkasan Masalah -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Ringkasan Kejadian yang Dilaporkan</h4>
          <p class="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
            ${report.deskripsi}
          </p>
        </div>
      </div>
    `;
  }
};

