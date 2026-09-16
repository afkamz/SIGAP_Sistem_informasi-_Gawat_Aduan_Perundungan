/**
 * SIGAP - Modul Jejak Audit (Audit Trail & Activity Log)
 * Implementasi Layar A-08 Sesuai Wireframe JejakAuditAdmin_SIGAP.png
 */

import { store } from './store.js';
import { AdminModule } from './admin.js';

export const AuditModule = {
  activeTab: 'semua', // semua, status, ai, override, ekspor
  searchQuery: '',

  renderAuditTrail(container) {
    const allLogs = store.getAllAudit();

    // Filter
    const filtered = allLogs.filter(item => {
      if (this.activeTab === 'status' && item.tipe_aksi !== 'status') return false;
      if (this.activeTab === 'ai' && (item.tipe_aksi !== 'ai_approve' && item.tipe_aksi !== 'ai_cluster')) return false;
      if (this.activeTab === 'override' && item.tipe_aksi !== 'override') return false;
      if (this.activeTab === 'ekspor' && item.tipe_aksi !== 'download') return false;

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const mActor = item.pelaksana_nama.toLowerCase().includes(q);
        const mDesc = item.deskripsi.toLowerCase().includes(q);
        const mDetail = item.detail_perubahan.toLowerCase().includes(q);
        const mTicket = item.ticket_code.toLowerCase().includes(q);
        if (!mActor && !mDesc && !mDetail && !mTicket) return false;
      }

      return true;
    });

    const html = `
      <!-- Header Jejak Audit Sesuai Wireframe -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Jejak Audit & Log Aktivitas</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Rekam jejak kepatuhan dan integritas penanganan laporan kekerasan satuan pendidikan sesuai SOP PPKSP Permendikbudristek No. 46/2023.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-xs text-slate-400 flex items-center gap-1.5">
            <i data-lucide="clock" class="w-3.5 h-3.5"></i>
            <span>Terakhir diperbarui: Hari ini, 09:30 WIB</span>
          </div>
          <button id="refreshAuditBtn" class="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition">
            <i data-lucide="rotate-cw" class="w-3.5 h-3.5"></i> Segarkan Data
          </button>
          <button onclick="window.print()" class="px-4 py-1.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> Ekspor Log (CSV)
          </button>
        </div>
      </div>

      <!-- 5 Stat Cards Sesuai Wireframe JejakAuditAdmin_SIGAP.png -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Aktivitas</span>
            <i data-lucide="file-text" class="w-4 h-4 text-sky-600"></i>
          </div>
          <div class="text-2xl font-black text-slate-900">1.284</div>
          <span class="text-[10px] text-slate-400 block">Semua entri tercatat</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Perubahan Status</span>
            <i data-lucide="refresh-cw" class="w-4 h-4 text-blue-600"></i>
          </div>
          <div class="text-2xl font-black text-blue-600">342</div>
          <span class="text-[10px] text-slate-400 block">Pergeseran alur tiket</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Validasi AI</span>
            <i data-lucide="sparkles" class="w-4 h-4 text-sky-600"></i>
          </div>
          <div class="text-2xl font-black text-sky-700">218</div>
          <span class="text-[10px] text-slate-400 block">Persetujuan klasifikasi</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Override Manual</span>
            <i data-lucide="edit-3" class="w-4 h-4 text-amber-600"></i>
          </div>
          <div class="text-2xl font-black text-amber-600">24</div>
          <span class="text-[10px] text-slate-400 block">Penyesuaian diskresi BK</span>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div class="flex items-center justify-between text-slate-400">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">Integritas Hash</span>
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
          </div>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-bold text-xs border border-emerald-200">
              🔒 SHA-256 Valid
            </span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono block">Chain: 4bf2...c90a</span>
        </div>
      </div>

      <!-- Filter Controls & Quick Tabs Sesuai Wireframe -->
      <div class="space-y-3">
        <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div class="flex-grow flex items-center pl-3 gap-2 w-full md:w-auto">
            <i data-lucide="search" class="w-4 h-4 text-slate-400"></i>
            <input 
              type="text" 
              id="auditSearchInput" 
              value="${this.searchQuery}"
              placeholder="Cari nomor tiket, nama admin/konselor, atau detail aksi..."
              class="w-full text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select class="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none">
              <option>Semua Aksi</option>
              <option>Perubahan Status</option>
              <option>Validasi AI</option>
              <option>Override Manual</option>
              <option>Unduh Bukti</option>
            </select>

            <select class="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none">
              <option>Semua Pengguna</option>
              <option>Ibu Rahmawati, S.Pd</option>
              <option>Bpk. Ahmad Fauzi, M.Psi</option>
              <option>AI System Service</option>
              <option>Dinas Pendidikan</option>
            </select>

            <div class="flex items-center gap-1.5 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700">
              <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>Hari Ini</span>
            </div>
          </div>
        </div>

        <!-- Quick Filter Pill Tabs Sesuai Wireframe -->
        <div class="flex flex-wrap items-center gap-2">
          <button class="audit-tab px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeTab === 'semua' ? 'bg-[#A7D8F0] text-slate-900 shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}" data-tab="semua">
            Semua Log
          </button>
          <button class="audit-tab px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeTab === 'status' ? 'bg-[#A7D8F0] text-slate-900 shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}" data-tab="status">
            Perubahan Status Tiket
          </button>
          <button class="audit-tab px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeTab === 'ai' ? 'bg-[#A7D8F0] text-slate-900 shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}" data-tab="ai">
            Interaksi AI
          </button>
          <button class="audit-tab px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeTab === 'override' ? 'bg-[#A7D8F0] text-slate-900 shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}" data-tab="override">
            Override Manual
          </button>
          <button class="audit-tab px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeTab === 'ekspor' ? 'bg-[#A7D8F0] text-slate-900 shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}" data-tab="ekspor">
            Ekspor Dokumen
          </button>
        </div>
      </div>

      <!-- Tabel Jejak Audit Sesuai Wireframe JejakAuditAdmin_SIGAP.png -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th class="py-3 px-4 w-44">Waktu</th>
                <th class="py-3 px-3 w-56">Pelaksana</th>
                <th class="py-3 px-3">Aktivitas & Deskripsi Perubahan</th>
                <th class="py-3 px-3 w-40">Kode Tiket</th>
                <th class="py-3 px-4 text-right w-24">Rincian</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${filtered.map(entry => {
                // Icon Pelaksana / Aksi
                let actionIcon = '<i data-lucide="check-circle" class="w-4 h-4 text-sky-600"></i>';
                if (entry.tipe_aksi === 'override') {
                  actionIcon = '<i data-lucide="edit-3" class="w-4 h-4 text-amber-600"></i>';
                } else if (entry.tipe_aksi === 'ai_approve') {
                  actionIcon = '<i data-lucide="sparkles" class="w-4 h-4 text-sky-600"></i>';
                } else if (entry.tipe_aksi === 'ai_cluster') {
                  actionIcon = '<i data-lucide="network" class="w-4 h-4 text-indigo-600"></i>';
                } else if (entry.tipe_aksi === 'download') {
                  actionIcon = '<i data-lucide="download" class="w-4 h-4 text-slate-600"></i>';
                }

                return `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-3.5 px-4">
                      <span class="font-bold text-slate-900 block">${entry.waktu}</span>
                      <span class="text-[10px] text-slate-400">${entry.tanggal_raw}</span>
                    </td>

                    <td class="py-3.5 px-3">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0 overflow-hidden">
                          ${entry.pelaksana_avatar ? `<img src="${entry.pelaksana_avatar}" class="w-full h-full object-cover">` : entry.pelaksana_nama.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span class="font-bold text-slate-900 block leading-tight">${entry.pelaksana_nama}</span>
                          <span class="text-[10px] text-slate-400">${entry.pelaksana_role}</span>
                        </div>
                      </div>
                    </td>

                    <td class="py-3.5 px-3">
                      <div class="flex items-start gap-2">
                        <div class="mt-0.5">${actionIcon}</div>
                        <div>
                          <span class="font-bold text-slate-900 block">${entry.deskripsi}</span>
                          <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">${entry.detail_perubahan}</p>
                        </div>
                      </div>
                    </td>

                    <td class="py-3.5 px-3">
                      <span class="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        #${entry.ticket_code}
                      </span>
                    </td>

                    <td class="py-3.5 px-4 text-right">
                      <a href="#/admin/laporan" class="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1">
                        Lihat <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                      </a>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div class="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan 1 - ${filtered.length} dari 1.284 log
          </div>
          <div class="flex items-center gap-1">
            <button class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">Sebelumnya</button>
            <button class="px-3 py-1 rounded bg-[#A7D8F0] text-slate-900 font-bold">1</button>
            <button class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">2</button>
            <button class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">3</button>
            <span class="px-1 text-slate-300">...</span>
            <button class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">129</button>
            <button class="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50">Selanjutnya</button>
          </div>
        </div>
      </div>

      <!-- Legal Compliance Guarantee Banner Sesuai Wireframe JejakAuditAdmin_SIGAP.png -->
      <div class="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-white text-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
            <i data-lucide="shield" class="w-5 h-5"></i>
          </div>
          <div>
            <h4 class="font-bold text-slate-900">Jaminan Kepatuhan & Integritas Data</h4>
            <p class="text-[11px] text-slate-500 mt-0.5">
              Log Jejak Audit ini bersifat <em>immutable</em> (hanya dapat dibaca/append-only) dan tersimpan aman demi kepatuhan hukum perlindungan saksi dan korban anak.
            </p>
          </div>
        </div>

        <div class="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 flex-shrink-0">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600"></i>
          <span>Standar Kriptografi ISO 27001 / Permendikbudristek 46/2023</span>
        </div>
      </div>
    `;

    container.innerHTML = AdminModule.renderAdminLayout(html, 'audit');
    lucide.createIcons();

    // Event listeners
    const tabs = container.querySelectorAll('.audit-tab');
    tabs.forEach(t => {
      t.addEventListener('click', () => {
        this.activeTab = t.dataset.tab;
        this.renderAuditTrail(container);
      });
    });

    const searchInput = container.querySelector('#auditSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderAuditTrail(container);
      });
    }

    const refreshBtn = container.querySelector('#refreshAuditBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        alert('Data jejak audit berhasil disinkronkan.');
        this.renderAuditTrail(container);
      });
    }
  }
};

