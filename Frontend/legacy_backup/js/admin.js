/**
 * SIGAP - Modul Admin & Konselor BK
 * Implementasi Layar A-01 sampai A-07:
 * A-01 Login Petugas / Guru BK
 * A-02 Dashboard Statistik & Grafik ECharts
 * A-03 Daftar Laporan Masuk & Filter
 * A-04 & A-05 Detail Pengaduan, Rekomendasi AI & Override Kategori
 * A-06 Klaster Insiden Serupa (HDBSCAN)
 * A-07 State Machine Penanganan Laporan
 */

import { store, KATEGORI_DATA } from './store.js';

export const AdminModule = {
  activeFilter: 'semua', // semua, menunggu, low_ai, klaster, referensi
  categoryFilter: 'semua',
  statusFilter: 'semua',
  sourceFilter: 'semua',
  searchQuery: '',

  // ==========================================
  // A-01: Login Admin / Guru BK Sesuai Wireframe OnBoardingAdmin_SIGAP.png
  // ==========================================
  renderLogin(container) {
    container.innerHTML = `
      <div class="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
        <!-- Top Navbar -->
        <header class="py-4 px-6 lg:px-12 flex justify-between items-center bg-white border-b border-slate-200">
          <div class="flex items-center gap-2">
            <span class="font-bold text-lg text-slate-900 tracking-tight">SIGAP</span>
            <span class="text-xs text-slate-400">|</span>
            <span class="text-xs text-slate-500 font-medium">Portal Konselor & Dinas Pendidikan</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
            <span>Autentikasi Terenkripsi</span>
          </div>
        </header>

        <!-- Center Login Card -->
        <main class="max-w-md mx-auto w-full px-4 py-8">
          <div class="bg-white p-7 lg:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <!-- Icon Logo -->
            <div class="text-center space-y-2">
              <div class="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 mx-auto">
                <i data-lucide="shield" class="w-6 h-6"></i>
              </div>
              <span class="inline-block px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
                <i data-lucide="briefcase" class="w-3.5 h-3.5 inline mr-1"></i> Portal Tenaga Pendidik & Pengawas
              </span>
              <h2 class="text-2xl font-extrabold text-slate-900">Masuk sebagai Admin</h2>
              <p class="text-xs text-slate-500">
                Akses khusus Guru Bimbingan Konseling (BK), Satgas PPKSP, dan Staf Dinas Pendidikan.
              </p>
            </div>

            <!-- Form Login -->
            <form id="adminLoginForm" class="space-y-4">
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">NIP (Nomor Induk Pegawai) *</label>
                  <span class="text-[11px] text-slate-400">Format 18 Digit</span>
                </div>
                <div class="relative">
                  <i data-lucide="id-card" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                  <input 
                    type="text" 
                    id="adminNIP" 
                    required 
                    value="198001012026"
                    placeholder="Contoh: 19850315 201001 2 004"
                    class="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                  />
                </div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi *</label>
                </div>
                <div class="relative">
                  <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                  <input 
                    type="password" 
                    id="adminPassword" 
                    required 
                    value="admin123"
                    placeholder="Masukkan kata sandi akun resmi"
                    class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                  />
                  <button type="button" id="adminTogglePwd" class="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs">
                <label class="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" checked class="rounded border-slate-300 text-sky-600 focus:ring-[#A7D8F0]">
                  <span>Ingat perangkat ini</span>
                </label>
                <a href="#" class="text-sky-700 hover:underline">Lupa kata sandi?</a>
              </div>

              <button 
                type="submit" 
                class="w-full py-3 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
              >
                <span>Masuk ke Panel Admin</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </form>

            <!-- Area Akses Terbatas Notice Sesuai Wireframe -->
            <div class="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-3 text-xs text-slate-700">
              <i data-lucide="shield-alert" class="w-4 h-4 text-sky-800 flex-shrink-0 mt-0.5"></i>
              <div>
                <span class="font-bold text-slate-900 block mb-0.5">Area Akses Terbatas</span>
                <p class="text-[11px] text-slate-600 leading-relaxed">
                  Sistem ini hanya diperuntukkan bagi personel sekolah dan dinas pendidikan resmi yang berwenang. Segala bentuk akses tanpa hak akan dicatat dan ditindaklanjuti sesuai ketentuan hukum.
                </p>
              </div>
            </div>

            <div class="text-center text-xs text-slate-600 pt-1">
              Bukan staf atau guru? 
              <a href="#/" class="font-bold text-sky-700 hover:underline">Masuk ke Portal Siswa →</a>
            </div>
          </div>
        </main>

        <!-- Footer -->
        <footer class="py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
          Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi • Satgas PPKSP Satuan Pendidikan
        </footer>
      </div>
    `;

    lucide.createIcons();

    const pwdToggle = container.querySelector('#adminTogglePwd');
    const pwdInput = container.querySelector('#adminPassword');
    pwdToggle.addEventListener('click', () => {
      const isPwd = pwdInput.getAttribute('type') === 'password';
      pwdInput.setAttribute('type', isPwd ? 'text' : 'password');
    });

    const form = container.querySelector('#adminLoginForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      store.setCurrentUser({
        role: 'admin',
        nama: 'Ibu Rahmawati, S.Pd',
        role_label: 'Konselor Utama BK & Satgas PPKSP',
        nip: '198001012026'
      });
      window.location.hash = '#/admin/dashboard';
    });
  },

  // ==========================================
  // Layout Admin Shell (Sidebar + Top Bar)
  // ==========================================
  renderAdminLayout(contentHTML, activeNav = 'dashboard') {
    const user = store.getCurrentUser() || {
      nama: 'Ibu Rahmawati, S.Pd',
      role_label: 'Konselor Utama BK & Satgas PPKSP',
      nip: '198001012026'
    };

    return `
      <div class="min-h-screen bg-slate-50 text-slate-800 flex">
        <!-- Sidebar Kiri Sesuai Wireframe DashboardAdmin_SIGAP.png -->
        <aside class="admin-sidebar p-5 flex flex-col justify-between hidden md:flex">
          <div class="space-y-6">
            <!-- Brand -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900 shadow-sm">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
              </div>
              <div>
                <span class="font-extrabold text-base tracking-tight block leading-tight">SIGAP</span>
                <span class="text-[11px] text-slate-500">Panel Konselor & Dinas</span>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="space-y-1.5">
              <a href="#/admin/dashboard" class="admin-nav-link ${activeNav === 'dashboard' ? 'active' : ''}">
                <i data-lucide="layout-grid" class="w-4 h-4"></i>
                <span class="text-xs">Dashboard</span>
              </a>

              <a href="#/admin/laporan" class="admin-nav-link ${activeNav === 'laporan' ? 'active' : ''}">
                <i data-lucide="inbox" class="w-4 h-4"></i>
                <span class="text-xs">Daftar Laporan</span>
              </a>

              <a href="#/admin/laporan?filter=low_ai" class="admin-nav-link ${activeNav === 'validasi' ? 'active' : ''}">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
                <span class="text-xs">Validasi AI</span>
              </a>

              <a href="#/admin/audit" class="admin-nav-link ${activeNav === 'audit' ? 'active' : ''}">
                <i data-lucide="history" class="w-4 h-4"></i>
                <span class="text-xs">Audit Trail</span>
              </a>

              <a href="#/admin/pengaturan" class="admin-nav-link ${activeNav === 'pengaturan' ? 'active' : ''}">
                <i data-lucide="settings" class="w-4 h-4"></i>
                <span class="text-xs">Pengaturan</span>
              </a>
            </nav>
          </div>

          <!-- Bottom Security Badge -->
          <div class="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs space-y-1">
            <div class="flex items-center gap-1.5 text-slate-800 font-bold text-[11px]">
              <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
              <span>Koneksi Terenkripsi TLS 1.3</span>
            </div>
            <p class="text-[10px] text-slate-500 leading-tight">
              Satgas PPKSP Satuan Pendidikan SMAN 1 Teladan.
            </p>
          </div>
        </aside>

        <!-- Main Workspace -->
        <div class="flex-grow flex flex-col min-w-0">
          <!-- Top Bar Admin -->
          <header class="bg-white border-b border-slate-200 h-16 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-400 font-medium hidden sm:inline">Admin Panel</span>
              <span class="text-xs text-slate-300 hidden sm:inline">/</span>
              <h1 class="text-sm font-bold text-slate-900 capitalize">${activeNav} Analitik</h1>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-right hidden sm:block">
                <span class="text-xs font-bold text-slate-900 block leading-tight">${user.nama}</span>
                <span class="text-[10px] text-slate-500">${user.role_label || 'Konselor Utama BK'}</span>
              </div>

              <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                Admin Sekolah
              </span>

              <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                IR
              </div>

              <a href="#/admin/login" title="Keluar" class="text-slate-400 hover:text-red-600 text-xs font-semibold flex items-center gap-1 border-l border-slate-200 pl-3">
                <i data-lucide="log-out" class="w-4 h-4"></i>
                <span class="hidden sm:inline">Keluar</span>
              </a>
            </div>
          </header>

          <!-- Main Scrollable Content -->
          <main class="p-6 lg:p-8 flex-grow space-y-6">
            ${contentHTML}
          </main>
        </div>
      </div>
    `;
  },

  // ==========================================
  // A-02: Dashboard Statistik & Analitik ECharts
  // ==========================================
  renderDashboard(container) {
    const metrics = store.getMetrics();
    const activeReports = store.getAllLaporan().slice(0, 4);

    const html = `
      <!-- Header Dashboard -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Ikhtisar & Analitik Kasus Siswa</h2>
          <p class="text-xs text-slate-500 mt-1">
            Monitoring real-time penanganan insiden, perbandingan tren laporan sekolah terhadap data referensi nasional PPKSP.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-3 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <span class="text-slate-400 font-medium">Legenda:</span>
            <span class="inline-flex items-center gap-1 text-sky-700 font-bold">
              <span class="w-2 h-2 rounded-full bg-sky-500"></span> Data Aktif
            </span>
            <span class="inline-flex items-center gap-1 text-slate-500 font-medium">
              <span class="w-2 h-2 rounded-full bg-slate-300"></span> Data Referensi
            </span>
          </div>

          <select class="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none">
            <option>Tahun Ajaran 2026/2027 (Semester Ganjil)</option>
            <option>Tahun Ajaran 2025/2026 (Semester Genap)</option>
          </select>

          <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> Unduh Laporan
          </button>
        </div>
      </div>

      <!-- 4 Stat Cards Sesuai Wireframe DashboardAdmin_SIGAP.png -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Laporan -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <i data-lucide="file-text" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full tag-data-aktif">Data Aktif</span>
          </div>
          <div>
            <span class="text-xs text-slate-500 font-medium block">Total Laporan</span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="text-2xl font-black text-slate-900">${metrics.total}</span>
              <span class="text-xs font-bold text-emerald-600">+12%</span>
            </div>
            <span class="text-[11px] text-slate-400 block mt-0.5">Dari bulan lalu (internal satuan)</span>
          </div>
        </div>

        <!-- Menunggu Verifikasi -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <i data-lucide="inbox" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full tag-data-aktif">Data Aktif</span>
          </div>
          <div>
            <span class="text-xs text-slate-500 font-medium block">Menunggu Verifikasi</span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="text-2xl font-black text-amber-600">${metrics.menunggu}</span>
              <span class="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Prioritas Satgas</span>
            </div>
            <span class="text-[11px] text-red-500 font-medium block mt-0.5">⏱ Butuh respons &lt; 24 jam</span>
          </div>
        </div>

        <!-- Ditindaklanjuti -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <i data-lucide="refresh-cw" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full tag-data-aktif">Data Aktif</span>
          </div>
          <div>
            <span class="text-xs text-slate-500 font-medium block">Ditindaklanjuti</span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="text-2xl font-black text-blue-600">${metrics.proses}</span>
              <span class="text-xs text-slate-500">16.2% beban</span>
            </div>
            <span class="text-[11px] text-slate-400 block mt-0.5">Tahap mediasi & konseling BK</span>
          </div>
        </div>

        <!-- Selesai & Ditutup -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <i data-lucide="check-circle" class="w-5 h-5"></i>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full tag-data-aktif">Data Aktif</span>
          </div>
          <div>
            <span class="text-xs text-slate-500 font-medium block">Selesai & Ditutup</span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <span class="text-2xl font-black text-emerald-600">${metrics.selesai}</span>
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Efektif</span>
            </div>
            <span class="text-[11px] text-slate-400 block mt-0.5">Tingkat resolusi kasus 78.2%</span>
          </div>
        </div>
      </div>

      <!-- ECharts Visualizations (Tren Kasus & Distribusi Kategori) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Chart 1: Tren Kasus per Bulan Sesuai Wireframe -->
        <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-slate-900">Tren Kasus per Bulan</h3>
              <p class="text-xs text-slate-500">Perbandingan volume insiden internal sekolah dengan baseline rata-rata nasional (Kemendikbudristek).</p>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="flex items-center gap-1.5 font-bold text-sky-700">
                <span class="w-3 h-1 bg-[#0284C7] rounded"></span> Internal
              </span>
              <span class="flex items-center gap-1.5 font-medium text-slate-400">
                <span class="w-3 h-1 bg-slate-300 rounded border border-dashed"></span> Nasional
              </span>
            </div>
          </div>

          <!-- Container ECharts -->
          <div id="chartTrenBulanan" style="width: 100%; height: 260px;"></div>

          <!-- Notice Analisis Tren Sesuai Wireframe -->
          <div class="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-900">
            <i data-lucide="info" class="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5"></i>
            <span><strong>Catatan Analisis:</strong> Terjadi penurunan aduan sebesar 15% pada bulan April pasca-sosialisasi anti-perundungan di pekan MPLS, namun kembali meningkat di bulan Mei akibat laporan siber luar jam sekolah.</span>
          </div>
        </div>

        <!-- Chart 2: Distribusi per Kategori Sesuai Wireframe -->
        <div class="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-bold text-slate-900">Distribusi per Kategori</h3>
              <p class="text-xs text-slate-500">Klasifikasi 7 jenis kekerasan sekolah (Permendikbudristek 46/2023).</p>
            </div>
            <span class="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">7 Kategori</span>
          </div>

          <!-- List Distribusi Bar Interaktif -->
          <div class="space-y-3 pt-1">
            ${KATEGORI_DATA.map(kat => {
              const pctAktif = Math.min(100, Math.round((kat.count / 50) * 100));
              return `
                <div class="space-y-1">
                  <div class="flex justify-between text-xs">
                    <span class="font-bold text-slate-800">${kat.nama}</span>
                    <div class="flex items-center gap-2 font-mono">
                      <span class="font-bold text-sky-800">${kat.count} kasus</span>
                      <span class="text-slate-400 text-[11px]">(Ref: ${kat.benchmark})</span>
                    </div>
                  </div>
                  <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div class="h-full bg-[#A7D8F0]" style="width: ${pctAktif}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-[#A7D8F0] rounded"></span> Data Sekolah (Aktif)</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-slate-200 rounded"></span> Benchmark Nasional (PPKSP)</span>
          </div>
        </div>
      </div>

      <!-- Antrean Verifikasi & Pemantauan Kasus Terkini -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Antrean Verifikasi & Pemantauan Kasus Terkini</h3>
              <p class="text-xs text-slate-500">Daftar laporan masuk yang membutuhkan validasi administratif dan tindak lanjut segera.</p>
            </div>
          </div>
          <a href="#/admin/laporan" class="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1">
            Lihat Semua Arsip <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>

        <!-- Tabel Antrean Sesuai Wireframe -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th class="py-3 px-3">Tipe Data</th>
                <th class="py-3 px-3">Kode Tiket</th>
                <th class="py-3 px-3">Kategori Insiden</th>
                <th class="py-3 px-3">Tanggal Masuk</th>
                <th class="py-3 px-3">Urgensi</th>
                <th class="py-3 px-3">Status Verifikasi</th>
                <th class="py-3 px-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${activeReports.map(rep => {
                let badgeClass = 'badge-status-menunggu';
                let statusLabel = 'Menunggu Verifikasi';
                if (rep.status === 'diverifikasi') {
                  badgeClass = 'badge-status-diverifikasi';
                  statusLabel = 'Investigasi Satgas';
                } else if (rep.status === 'ditindaklanjuti') {
                  badgeClass = 'badge-status-ditindaklanjuti';
                  statusLabel = 'Mediasi Berjalan';
                } else if (rep.status === 'selesai') {
                  badgeClass = 'badge-status-selesai';
                  statusLabel = 'Selesai & Termonitor';
                }

                return `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="py-3 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${rep.is_active ? 'tag-data-aktif' : 'tag-data-referensi'}">
                        ${rep.is_active ? 'Data Aktif' : 'Data Referensi'}
                      </span>
                    </td>
                    <td class="py-3 px-3 font-mono font-bold text-sky-800">
                      ${rep.ticket_code}
                    </td>
                    <td class="py-3 px-3 font-medium text-slate-800">
                      ${rep.judul}
                    </td>
                    <td class="py-3 px-3 text-slate-500">
                      ${rep.tanggal}
                    </td>
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center gap-1 font-semibold ${rep.urgensi === 'Tinggi' ? 'text-red-600' : 'text-amber-600'}">
                        ● ${rep.urgensi}
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      <span class="px-2 py-0.5 rounded-full font-medium ${badgeClass}">
                        ${statusLabel}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-right">
                      <a 
                        href="#/admin/laporan-detail?id=${rep.id}" 
                        class="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold inline-flex items-center gap-1 transition"
                      >
                        <span>Periksa Kasus</span>
                        <i data-lucide="external-link" class="w-3 h-3"></i>
                      </a>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = this.renderAdminLayout(html, 'dashboard');
    lucide.createIcons();

    // Render Apache ECharts
    setTimeout(() => {
      this.initTrenChart();
    }, 100);
  },

  initTrenChart() {
    const chartDom = document.getElementById('chartTrenBulanan');
    if (!chartDom || typeof echarts === 'undefined') return;

    const myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0F172A',
        borderColor: '#0F172A',
        textStyle: { color: '#FFFFFF', fontSize: 12 }
      },
      grid: {
        top: 20,
        right: 15,
        bottom: 25,
        left: 35
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
        axisLine: { lineStyle: { color: '#E2E8F0' } },
        axisLabel: { color: '#64748B', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#F1F5F9' } },
        axisLabel: { color: '#64748B', fontSize: 11 }
      },
      series: [
        {
          name: 'Sekolah (Internal)',
          type: 'line',
          smooth: true,
          data: [14, 18, 19, 12, 28, 16, 22, 20, 17, 13, 15],
          lineStyle: { color: '#0284C7', width: 2.5 },
          itemStyle: { color: '#0284C7' },
          symbolSize: 6
        },
        {
          name: 'Baseline Nasional',
          type: 'line',
          smooth: true,
          lineStyle: { color: '#94A3B8', width: 2, type: 'dashed' },
          itemStyle: { color: '#94A3B8' },
          data: [20, 22, 23, 21, 24, 23, 25, 22, 20, 21, 22],
          symbolSize: 4
        }
      ]
    };
    myChart.setOption(option);
    window.addEventListener('resize', () => myChart.resize());
  },

  // ==========================================
  // A-03: Daftar Laporan Masuk & Filter Tab Sesuai Wireframe
  // ==========================================
  renderDaftarLaporan(container) {
    const all = store.getAllLaporan();
    const metrics = store.getMetrics();

    // Filter Logic
    let filtered = all.filter(item => {
      if (this.activeFilter === 'menunggu' && item.status !== 'menunggu') return false;
      if (this.activeFilter === 'low_ai' && (!item.ai || item.ai.confidence >= 80)) return false;
      if (this.activeFilter === 'klaster' && (!item.ai || !item.ai.cluster_label)) return false;
      if (this.activeFilter === 'referensi' && item.is_active) return false;

      if (this.categoryFilter !== 'semua' && item.kategori_id !== Number(this.categoryFilter)) return false;
      if (this.statusFilter !== 'semua' && item.status !== this.statusFilter) return false;
      if (this.sourceFilter === 'aktif' && !item.is_active) return false;
      if (this.sourceFilter === 'referensi' && item.is_active) return false;

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchTicket = item.ticket_code.toLowerCase().includes(q);
        const matchTitle = item.judul.toLowerCase().includes(q);
        const matchDesc = item.deskripsi.toLowerCase().includes(q);
        const matchReporter = (item.reporter_label || '').toLowerCase().includes(q);
        if (!matchTicket && !matchTitle && !matchDesc && !matchReporter) return false;
      }

      return true;
    });

    const html = `
      <!-- Title & Ekspor Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Daftar Laporan Masuk</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Kelola, verifikasi, dan pantau seluruh aduan insiden siswa dan data rujukan nasional PPKSP.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">Diperbarui 2 menit yang lalu</span>
          <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> Ekspor Data (CSV/Excel)
          </button>
        </div>
      </div>

      <!-- 5 Summary Tabs Sesuai Wireframe DaftarLaporanMasukAdmin_SIGAP.png -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button class="filter-tab p-3.5 rounded-2xl border text-left transition ${this.activeFilter === 'semua' ? 'border-sky-400 bg-sky-50/50 ring-2 ring-[#A7D8F0]/30' : 'bg-white border-slate-200'}" data-filter="semua">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-bold text-slate-700">Semua Aduan</span>
            <i data-lucide="archive" class="w-4 h-4"></i>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-black text-slate-900">${metrics.total}</span>
            <span class="text-[10px] text-slate-400">total kasus</span>
          </div>
        </button>

        <button class="filter-tab p-3.5 rounded-2xl border text-left transition ${this.activeFilter === 'menunggu' ? 'border-sky-400 bg-sky-50/50 ring-2 ring-[#A7D8F0]/30' : 'bg-white border-slate-200'}" data-filter="menunggu">
          <div class="flex items-center justify-between text-amber-600 mb-1">
            <span class="text-xs font-bold text-amber-700">● Menunggu Verifikasi</span>
            <i data-lucide="inbox" class="w-4 h-4"></i>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-black text-amber-600">${metrics.menunggu}</span>
            <span class="text-[10px] text-amber-700">butuh tindakan</span>
          </div>
        </button>

        <button class="filter-tab p-3.5 rounded-2xl border text-left transition ${this.activeFilter === 'low_ai' ? 'border-sky-400 bg-sky-50/50 ring-2 ring-[#A7D8F0]/30' : 'bg-white border-slate-200'}" data-filter="low_ai">
          <div class="flex items-center justify-between text-blue-600 mb-1">
            <span class="text-xs font-bold text-blue-800">Perlu Tinjauan AI</span>
            <i data-lucide="sparkles" class="w-4 h-4"></i>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-black text-blue-600">${metrics.lowAi}</span>
            <span class="text-[10px] text-slate-500">akurasi &lt; 80%</span>
          </div>
        </button>

        <button class="filter-tab p-3.5 rounded-2xl border text-left transition ${this.activeFilter === 'klaster' ? 'border-sky-400 bg-sky-50/50 ring-2 ring-[#A7D8F0]/30' : 'bg-white border-slate-200'}" data-filter="klaster">
          <div class="flex items-center justify-between text-indigo-600 mb-1">
            <span class="text-xs font-bold text-indigo-800">Terdeteksi Klaster</span>
            <i data-lucide="network" class="w-4 h-4"></i>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-black text-indigo-600">${metrics.clusters}</span>
            <span class="text-[10px] text-slate-500">pola berulang</span>
          </div>
        </button>

        <button class="filter-tab p-3.5 rounded-2xl border text-left transition ${this.activeFilter === 'referensi' ? 'border-sky-400 bg-sky-50/50 ring-2 ring-[#A7D8F0]/30' : 'bg-white border-slate-200'}" data-filter="referensi">
          <div class="flex items-center justify-between text-slate-600 mb-1">
            <span class="text-xs font-bold text-slate-700">Data Referensi</span>
            <i data-lucide="database" class="w-4 h-4"></i>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xl font-black text-slate-700">${metrics.referenceCount}</span>
            <span class="text-[10px] text-slate-400">benchmark</span>
          </div>
        </button>
      </div>

      <!-- Filter Controls Bar Sesuai Wireframe -->
      <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div class="flex-grow flex items-center pl-3 gap-2 w-full md:w-auto">
          <i data-lucide="search" class="w-4 h-4 text-slate-400"></i>
          <input 
            type="text" 
            id="searchInput" 
            value="${this.searchQuery}"
            placeholder="Cari kode tiket, nama siswa/terlapor, atau kata kunci..."
            class="w-full text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select id="catFilterSelect" class="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none">
            <option value="semua">Semua Kategori</option>
            ${KATEGORI_DATA.map(k => `<option value="${k.id}" ${this.categoryFilter == k.id ? 'selected' : ''}>${k.nama}</option>`).join('')}
          </select>

          <select id="statusFilterSelect" class="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none">
            <option value="semua">Semua Status</option>
            <option value="menunggu" ${this.statusFilter === 'menunggu' ? 'selected' : ''}>Menunggu</option>
            <option value="diverifikasi" ${this.statusFilter === 'diverifikasi' ? 'selected' : ''}>Diverifikasi</option>
            <option value="ditindaklanjuti" ${this.statusFilter === 'ditindaklanjuti' ? 'selected' : ''}>Ditindaklanjuti</option>
            <option value="selesai" ${this.statusFilter === 'selesai' ? 'selected' : ''}>Selesai</option>
          </select>

          <select id="sourceFilterSelect" class="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none">
            <option value="semua">Semua Sumber</option>
            <option value="aktif" ${this.sourceFilter === 'aktif' ? 'selected' : ''}>Data Aktif</option>
            <option value="referensi" ${this.sourceFilter === 'referensi' ? 'selected' : ''}>Data Referensi</option>
          </select>

          <button id="resetFilterBtn" title="Reset Filter" class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Tabel Laporan Masuk Sesuai Wireframe -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th class="py-3 px-4 w-8"><input type="checkbox" class="rounded text-sky-600"></th>
                <th class="py-3 px-3">Kode Tiket</th>
                <th class="py-3 px-3">Kategori Dilaporkan</th>
                <th class="py-3 px-3">Rekomendasi AI</th>
                <th class="py-3 px-3">Status Penanganan</th>
                <th class="py-3 px-3">Penanda Klaster</th>
                <th class="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="7" class="py-8 text-center text-slate-400">Tidak ada laporan yang sesuai dengan filter.</td>
                </tr>
              ` : filtered.map(rep => {
                // AI Badge Visual Language
                let aiBadgeHTML = '';
                if (rep.ai) {
                  if (rep.ai.confidence < 80) {
                    aiBadgeHTML = `
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <i data-lucide="alert-triangle" class="w-3 h-3 text-amber-600"></i> Ketidakcocokan Kategori ${rep.ai.confidence}%
                      </span>
                    `;
                  } else {
                    aiBadgeHTML = `
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                        <i data-lucide="sparkles" class="w-3 h-3 text-sky-600"></i> ${rep.ai.kategori_rekomendasi} ${rep.ai.confidence}%
                      </span>
                    `;
                  }
                }

                // Status Badge
                let statusBadgeClass = 'badge-status-menunggu';
                if (rep.status === 'diverifikasi') statusBadgeClass = 'badge-status-diverifikasi';
                else if (rep.status === 'ditindaklanjuti') statusBadgeClass = 'badge-status-ditindaklanjuti';
                else if (rep.status === 'selesai') statusBadgeClass = 'badge-status-selesai';

                return `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3.5 px-4"><input type="checkbox" class="rounded text-sky-600"></td>
                    <td class="py-3.5 px-3">
                      <div class="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                        <span>${rep.ticket_code}</span>
                        ${!rep.is_active ? '<span class="text-[9px] bg-slate-100 text-slate-600 font-sans px-1.5 py-0.2 rounded">REFERENSI</span>' : ''}
                      </div>
                      <span class="text-[11px] text-slate-400 block">${rep.reporter_label || 'Siswa'}</span>
                    </td>
                    <td class="py-3.5 px-3 font-semibold text-slate-800">
                      ${rep.kategori_nama}
                    </td>
                    <td class="py-3.5 px-3">
                      ${aiBadgeHTML}
                    </td>
                    <td class="py-3.5 px-3">
                      <span class="px-2.5 py-0.5 rounded-full font-medium ${statusBadgeClass}">
                        ● ${rep.status.charAt(0).toUpperCase() + rep.status.slice(1)}
                      </span>
                    </td>
                    <td class="py-3.5 px-3 text-slate-500">
                      ${rep.ai && rep.ai.cluster_label ? `
                        <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <i data-lucide="link-2" class="w-3 h-3"></i> ${rep.ai.cluster_name || rep.ai.cluster_label}
                        </span>
                      ` : '<span class="text-slate-300">-</span>'}
                    </td>
                    <td class="py-3.5 px-3 text-right">
                      <a 
                        href="#/admin/laporan-detail?id=${rep.id}" 
                        class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-[#A7D8F0] hover:border-[#A7D8F0] text-slate-800 font-bold inline-flex items-center gap-1 transition shadow-sm"
                      >
                        <span>Periksa</span>
                        <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                      </a>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar Sesuai Wireframe -->
        <div class="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan 1 - ${filtered.length} dari ${metrics.total} total laporan (${metrics.total - metrics.referenceCount} Data Aktif, ${metrics.referenceCount} Data Referensi)
          </div>
          <div class="flex items-center gap-1">
            <button class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 font-semibold disabled:opacity-50">Sebelumnya</button>
            <button class="px-3 py-1 rounded bg-[#A7D8F0] text-slate-900 font-bold">1</button>
            <button class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">3</button>
            <button class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 font-semibold">Selanjutnya</button>
          </div>
        </div>
      </div>

      <!-- Info Box Panduan AI Sesuai Wireframe -->
      <div class="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3.5 text-xs text-slate-700">
        <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center flex-shrink-0">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h4 class="font-bold text-slate-900">Panduan Validasi AI & Deteksi Klaster PPKSP</h4>
            <span class="text-[10px] bg-sky-200 text-sky-900 font-mono px-1.5 rounded">Model IndoBERT v2.4</span>
          </div>
          <p class="text-[11px] text-slate-600 leading-relaxed">
            Sistem AI menganalisis narasi laporan untuk mencocokkan pola insiden serupa secara otomatis guna mendeteksi tindakan perundungan berulang dalam lingkup kelas atau angkatan yang sama. Data bertanda <strong>Referensi</strong> merupakan arsip kasus nasional anonim yang dipakai sebagai parameter komparasi keputusan penanganan.
          </p>
          <div class="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-sky-500"></span> Ambang Akurasi Stabil: &ge; 85%</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Perlu Verifikasi Manual: &lt; 80%</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-indigo-500"></span> Deteksi Kesamaan Semantik: Bertaut Otomatis</span>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = this.renderAdminLayout(html, 'laporan');
    lucide.createIcons();

    // Event Listeners for Filters
    const tabs = container.querySelectorAll('.filter-tab');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        this.activeFilter = t.dataset.filter;
        this.renderDaftarLaporan(container);
      });
    });

    const searchInput = container.querySelector('#searchInput');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderDaftarLaporan(container);
    });

    container.querySelector('#catFilterSelect').addEventListener('change', (e) => {
      this.categoryFilter = e.target.value;
      this.renderDaftarLaporan(container);
    });

    container.querySelector('#statusFilterSelect').addEventListener('change', (e) => {
      this.statusFilter = e.target.value;
      this.renderDaftarLaporan(container);
    });

    container.querySelector('#sourceFilterSelect').addEventListener('change', (e) => {
      this.sourceFilter = e.target.value;
      this.renderDaftarLaporan(container);
    });

    container.querySelector('#resetFilterBtn').addEventListener('click', () => {
      this.activeFilter = 'semua';
      this.categoryFilter = 'semua';
      this.statusFilter = 'semua';
      this.sourceFilter = 'semua';
      this.searchQuery = '';
      this.renderDaftarLaporan(container);
    });
  },

  // ==========================================
  // A-04 s.d A-07: Detail Pengaduan, AI Analitik, Override & State Machine
  // Sesuai Wireframe StatusLaporanAdmin_SIGAP.png
  // ==========================================
  renderDetailPengaduan(container, reportId) {
    const report = store.getLaporanById(reportId) || store.getAllLaporan()[0];
    if (!report) return;

    // Status Step Mapping
    const steps = [
      { key: 'menunggu', label: 'Menunggu', subtitle: 'Laporan Diterima' },
      { key: 'diverifikasi', label: 'Diverifikasi', subtitle: 'Verifikasi Berkas' },
      { key: 'ditindaklanjuti', label: 'Ditindaklanjuti', subtitle: 'Mediasi & Konseling' },
      { key: 'selesai', label: 'Selesai', subtitle: 'Kasus Ditutup' }
    ];

    const currentIndex = steps.findIndex(s => s.key === report.status);
    const nextStep = steps[currentIndex + 1] || null;

    const html = `
      <!-- Breadcrumb & Top Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div class="flex items-center gap-2 text-xs">
          <a href="#/admin/laporan" class="text-slate-500 hover:text-slate-900">Daftar Laporan</a>
          <span class="text-slate-300">/</span>
          <span class="font-mono font-bold text-slate-800">#${report.ticket_code}</span>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="window.print()" class="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Berita Acara
          </button>
          <a href="#/admin/laporan" class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Kembali ke Daftar
          </a>
        </div>
      </div>

      <!-- Header Card Tiket Sesuai Wireframe -->
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold text-sm">#${report.ticket_code}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${report.is_active ? 'tag-data-aktif' : 'tag-data-referensi'}">
              ${report.is_active ? 'Data Aktif' : 'Data Referensi'}
            </span>
          </div>
          <h2 class="text-xl font-extrabold text-slate-900 mt-1">${report.judul}</h2>
          <p class="text-xs text-slate-500">
            Diajukan pada: ${report.tanggal} • Pelapor: <strong>${report.reporter_label}</strong>
          </p>
        </div>

        <div class="text-right">
          <span class="text-[11px] text-slate-400 block mb-1">Status Saat Ini:</span>
          <span class="px-3 py-1 rounded-full text-xs font-bold ${report.status === 'selesai' ? 'badge-status-selesai' : 'badge-status-diverifikasi'}">
            ● ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </span>
        </div>
      </div>

      <!-- State Machine Stepper Card Sesuai Wireframe StatusLaporanAdmin_SIGAP.png -->
      <div class="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <i data-lucide="refresh-cw" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Perbarui Status Progres Laporan</h3>
              <p class="text-xs text-slate-500">Alur penanganan wajib dilakukan secara berurutan sesuai SOP PPKSP Kemendikbudristek No. 46/2023.</p>
            </div>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
            <i data-lucide="lock" class="w-3.5 h-3.5"></i> Alur Berurutan Terkunci
          </span>
        </div>

        <!-- 4 Steps Stepper Controller -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
          ${steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isNext = idx === currentIndex + 1;
            const isLocked = idx > currentIndex + 1;

            let stepCardClass = 'admin-state-step locked';
            let statusText = 'Terkunci';
            if (isCompleted) {
              stepCardClass = 'admin-state-step completed';
              statusText = '✓ Selesai';
            } else if (isCurrent) {
              stepCardClass = 'admin-state-step current';
              statusText = 'Tahap Saat Ini';
            } else if (isNext) {
              stepCardClass = 'admin-state-step cursor-pointer hover:border-sky-400 bg-sky-50/50';
              statusText = '→ Tersedia (Klik)';
            }

            return `
              <div class="${stepCardClass} p-4 rounded-xl text-center space-y-1">
                <div class="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${isCompleted ? 'bg-emerald-600 text-white' : (isCurrent ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600')}">
                  ${isCompleted ? '✓' : idx + 1}
                </div>
                <div class="text-xs font-bold text-slate-900">${step.label}</div>
                <div class="text-[10px] font-semibold ${isCurrent ? 'text-sky-800' : 'text-slate-500'}">${statusText}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Penegakan Alur Sekuensial Notice Sesuai Wireframe -->
        <div class="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-900">
          <i data-lucide="info" class="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5"></i>
          <span>
            <strong>Penegakan Alur Sekuensial:</strong> Anda sedang memproses tahap <strong>${report.status}</strong>. Sesuai aturan PPKSP, laporan tidak dapat langsung ditutup ("Selesai") sebelum tahap "Ditindaklanjuti" tercatat dalam log intervensi sekolah.
          </span>
        </div>

        <!-- Form Ubah Status -->
        ${nextStep ? `
          <div class="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-xs font-bold text-slate-700">Catatan Tindak Lanjut (Wajib dicatat di Audit Trail)</label>
                <span class="text-[11px] text-slate-400">Tercatat di Audit Trail resmi</span>
              </div>
              <textarea 
                id="catatanStatusInput" 
                rows="3" 
                placeholder="Tuliskan catatan verifikasi, rekomendasi mediasi, atau jadwal pemanggilan pihak terkait..."
                class="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#A7D8F0]"
              ></textarea>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs text-slate-500">
                <i data-lucide="check" class="w-4 h-4 text-emerald-600"></i>
                <span>Notifikasi status otomatis diteruskan ke pelapor (via Kode Tiket).</span>
              </div>

              <div class="flex items-center gap-2">
                <button id="btnAdvanceStatus" class="px-5 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs shadow-sm flex items-center gap-2 transition">
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                  <span>Ubah ke ${nextStep.label}</span>
                </button>
              </div>
            </div>
          </div>
        ` : `
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-bold">
            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
            Kasus telah selesai dan ditutup secara resmi. Seluruh riwayat tersimpan aman dalam Audit Trail.
          </div>
        `}
      </div>

      <!-- Layout 2 Kolom: Detail Laporan (Kiri) vs Analisis AI & Klaster (Kanan) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Kolom Kiri: Kronologi & Bukti -->
        <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Rincian Narasi Pengaduan</h3>
          
          <div class="space-y-3 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px]">Kategori Terdaftar:</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="font-bold text-slate-900">${report.kategori_nama}</span>
                <button id="btnOpenOverrideModal" class="text-xs font-bold text-sky-700 hover:underline">
                  (Ubah / Override Kategori)
                </button>
              </div>
            </div>

            <div>
              <span class="text-slate-400 block text-[11px]">Deskripsi Lengkap:</span>
              <p class="mt-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">${report.deskripsi}</p>
            </div>

            ${report.bukti_file ? `
              <div>
                <span class="text-slate-400 block text-[11px]">Berkas Lampiran Bukti:</span>
                <div class="mt-1 p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50">
                  <div class="flex items-center gap-2 text-slate-800">
                    <i data-lucide="file-image" class="w-4 h-4 text-sky-600"></i>
                    <span class="font-bold">${report.bukti_file}</span>
                  </div>
                  <button class="text-xs text-sky-700 font-bold hover:underline">Unduh Lampiran Terenkripsi</button>
                </div>
              </div>
            ` : ''}

            <!-- Riwayat Log Kasus -->
            <div class="pt-3 border-t border-slate-100">
              <span class="text-slate-400 block text-[11px] mb-2">Riwayat Log Status:</span>
              <div class="space-y-2">
                ${report.history.map(h => `
                  <div class="flex items-start gap-2 text-xs">
                    <span class="w-2 h-2 rounded-full bg-sky-500 mt-1 flex-shrink-0"></span>
                    <div>
                      <span class="font-bold text-slate-900">${h.status.toUpperCase()}</span>
                      <span class="text-[10px] text-slate-400">• ${h.waktu} oleh ${h.pelaksana || 'Sistem'}</span>
                      <p class="text-slate-600 mt-0.5 italic">"${h.catatan}"</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Kolom Kanan: Panel Analisis AI & Deteksi Klaster Sesuai uiuxspesification.md S-04 -->
        <div class="lg:col-span-5 space-y-4">
          <!-- Card Inferensi AI -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <i data-lucide="sparkles" class="w-5 h-5 text-sky-600"></i>
                <h3 class="text-base font-bold text-slate-900">Analisis Model IndoBERT</h3>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">Model AI Terintegrasi</span>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <span class="text-slate-400 block text-[11px]">Rekomendasi Kategori:</span>
                <span class="text-sm font-black text-slate-900 block mt-0.5">${report.ai ? report.ai.kategori_rekomendasi : report.kategori_nama}</span>
              </div>

              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-400">Confidence Score:</span>
                  <span class="font-bold text-sky-800">${report.ai ? report.ai.confidence : 85}%</span>
                </div>
                <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-sky-500" style="width: ${report.ai ? report.ai.confidence : 85}%"></div>
                </div>
              </div>

              ${report.ai && report.ai.secondary_suggestion ? `
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span class="text-slate-400 text-[10px] block uppercase font-bold">Saran Alternatif Sekunder:</span>
                  <span class="font-bold text-slate-800">${report.ai.secondary_suggestion} (${report.ai.secondary_confidence}%)</span>
                </div>
              ` : ''}

              <!-- AI Actions: Approve vs Override Sesuai Wireframe -->
              <div class="pt-2 flex flex-col gap-2">
                <button 
                  id="btnApproveAI" 
                  class="w-full py-2.5 rounded-xl ${report.ai && report.ai.is_approved ? 'bg-emerald-100 text-emerald-800 cursor-default' : 'bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200'} font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <i data-lucide="${report.ai && report.ai.is_approved ? 'check' : 'thumbs-up'}" class="w-4 h-4"></i>
                  <span>${report.ai && report.ai.is_approved ? '✓ Rekomendasi AI Telah Disetujui' : 'Setujui Rekomendasi AI'}</span>
                </button>

                <button 
                  id="btnTriggerOverride" 
                  class="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                  <span>Override Kategori Manual</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Card Deteksi Klaster (HDBSCAN) Sesuai A-06 -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center gap-2">
              <i data-lucide="network" class="w-5 h-5 text-indigo-600"></i>
              <h3 class="text-base font-bold text-slate-900">Laporan Pola Kejadian Serupa</h3>
            </div>
            <p class="text-xs text-slate-500">
              Sistem mendeteksi kemiripan narasi, waktu, dan pelaku berdasarkan analisis klastering HDBSCAN.
            </p>

            ${report.ai && report.ai.cluster_label ? `
              <div class="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-indigo-900">${report.ai.cluster_name}</span>
                  <span class="text-[10px] font-mono bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded font-bold">${report.ai.cluster_label}</span>
                </div>
                <p class="text-[11px] text-indigo-800 leading-relaxed">
                  Terdapat 3 aduan lain dalam 14 hari terakhir dengan kemiripan narasi intimidasi di grup pertemanan kelas yang sama.
                </p>
                <div class="pt-1">
                  <a href="#/admin/laporan?filter=klaster" class="text-xs font-bold text-indigo-700 hover:underline">
                    Lihat Semua Laporan dalam Klaster Ini →
                  </a>
                </div>
              </div>
            ` : `
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 text-center">
                Belum terdeteksi klaster keterkaitan pola berulang untuk insiden ini (diperlakukan sebagai insiden independen).
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Modal Override Kategori (Hidden by Default) Sesuai A-05 -->
      <div id="overrideModal" class="hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 animate-fade-in">
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900">Override Kategori Pengaduan</h3>
            <button id="closeOverrideModalBtn" class="text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <p class="text-xs text-slate-500">
            Pilih kategori final yang paling akurat menurut hasil telaah konselor BK. Aksi ini akan dicatat dalam Audit Trail resmi.
          </p>

          <div class="space-y-3">
            <div>
              <label class="text-xs font-bold text-slate-700 block mb-1">Pilih Kategori Final *</label>
              <select id="selectNewCategory" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#A7D8F0]">
                ${KATEGORI_DATA.map(k => `
                  <option value="${k.id}" ${k.id === report.kategori_id ? 'selected' : ''}>
                    ${k.nama} ${report.ai && report.ai.kategori_rekomendasi === k.nama ? '— (Direkomendasikan AI)' : ''}
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 block mb-1">Alasan Penyesuaian Kategori *</label>
              <textarea 
                id="alasanOverrideInput" 
                rows="3" 
                placeholder="Contoh: Bukti tangkapan layar obrolan menunjukkan unsur pemerasan uang secara berulang..."
                class="w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#A7D8F0]"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button id="cancelOverrideBtn" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50">Batal</button>
            <button id="submitOverrideBtn" class="px-5 py-2 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs shadow-sm">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = this.renderAdminLayout(html, 'laporan');
    lucide.createIcons();

    // Event: Advance Status (State Machine)
    const advanceBtn = container.querySelector('#btnAdvanceStatus');
    if (advanceBtn && nextStep) {
      advanceBtn.addEventListener('click', () => {
        const catatan = container.querySelector('#catatanStatusInput').value.trim();
        const res = store.updateLaporanStatus(report.id, nextStep.key, catatan);
        if (res.success) {
          alert(`Status berhasil diperbarui menjadi '${nextStep.label}'.`);
          this.renderDetailPengaduan(container, report.id);
        } else {
          alert(res.message);
        }
      });
    }

    // Event: Approve AI
    const approveBtn = container.querySelector('#btnApproveAI');
    if (approveBtn) {
      approveBtn.addEventListener('click', () => {
        store.approveAiRecommendation(report.id);
        alert('Rekomendasi AI berhasil disetujui dan dicatat di Audit Trail.');
        this.renderDetailPengaduan(container, report.id);
      });
    }

    // Modal Override Logic
    const modal = container.querySelector('#overrideModal');
    const openBtn1 = container.querySelector('#btnOpenOverrideModal');
    const openBtn2 = container.querySelector('#btnTriggerOverride');
    const closeBtn = container.querySelector('#closeOverrideModalBtn');
    const cancelBtn = container.querySelector('#cancelOverrideBtn');
    const submitOverrideBtn = container.querySelector('#submitOverrideBtn');

    const openModal = () => modal.classList.remove('hidden');
    const closeModal = () => modal.classList.add('hidden');

    if (openBtn1) openBtn1.addEventListener('click', openModal);
    if (openBtn2) openBtn2.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (submitOverrideBtn) {
      submitOverrideBtn.addEventListener('click', () => {
        const newCatId = container.querySelector('#selectNewCategory').value;
        const alasan = container.querySelector('#alasanOverrideInput').value.trim();
        store.overrideCategory(report.id, newCatId, alasan);
        closeModal();
        alert('Override kategori berhasil disimpan.');
        this.renderDetailPengaduan(container, report.id);
      });
    }
  }
};

