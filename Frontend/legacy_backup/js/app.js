/**
 * SIGAP - Main Router & Orchestrator
 * Single Page Application router berbasis Hash (#/)
 */

import { store } from './store.js';
import { StudentModule } from './student.js';
import { AdminModule } from './admin.js';
import { AuditModule } from './audit.js';

class SigapApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const hashString = window.location.hash || '#/';
    const [routePart, queryPart] = hashString.split('?');
    const params = new URLSearchParams(queryPart || '');

    // Reset scroll position
    window.scrollTo({ top: 0, behavior: 'instant' });

    switch (routePart) {
      // Portal Siswa
      case '#/':
      case '#/landing':
      case '#/login':
        StudentModule.renderLanding(this.appContainer);
        break;

      case '#/register':
        StudentModule.renderRegister(this.appContainer);
        break;

      case '#/dashboard':
      case '#/riwayat':
        StudentModule.renderDashboard(this.appContainer);
        break;

      case '#/buat-laporan':
        StudentModule.resetWizard();
        StudentModule.renderFormWizard(this.appContainer);
        break;

      case '#/lacak':
        const code = params.get('code') || '';
        const from = params.get('from') || '';
        StudentModule.renderTracking(this.appContainer, code, from);
        break;

      // Portal Admin / Konselor BK
      case '#/admin/login':
        AdminModule.renderLogin(this.appContainer);
        break;

      case '#/admin/dashboard':
        AdminModule.renderDashboard(this.appContainer);
        break;

      case '#/admin/laporan':
        if (params.get('filter')) {
          AdminModule.activeFilter = params.get('filter');
        }
        AdminModule.renderDaftarLaporan(this.appContainer);
        break;

      case '#/admin/laporan-detail':
        const reportId = params.get('id') || 1;
        AdminModule.renderDetailPengaduan(this.appContainer, reportId);
        break;

      case '#/admin/audit':
        AuditModule.renderAuditTrail(this.appContainer);
        break;

      case '#/admin/pengaturan':
        this.renderAdminSettings();
        break;

      default:
        StudentModule.renderLanding(this.appContainer);
        break;
    }
  }

  renderAdminSettings() {
    const html = `
      <div class="max-w-2xl space-y-6">
        <div>
          <h2 class="text-2xl font-black text-slate-900">Pengaturan Sistem SIGAP</h2>
          <p class="text-xs text-slate-500 mt-0.5">Kelola parameter satuan pendidikan, ambang model AI, dan sinkronisasi basis data.</p>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Informasi Satuan Pendidikan</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Nama Sekolah</label>
              <input type="text" value="SMAN 1 Teladan" class="w-full p-2 rounded-lg border border-slate-200">
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">NPSN</label>
              <input type="text" value="20512345" class="w-full p-2 rounded-lg border border-slate-200">
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Model AI & Pipeline NLP</h3>
          <div class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-slate-700 block mb-1">Arsitektur NLP</label>
              <span class="font-mono text-xs bg-slate-100 px-2 py-1 rounded">IndoBERT-Base-Indonesian (512-dim embedding)</span>
            </div>
            <div>
              <label class="font-bold text-slate-700 block mb-1">Ambang Batas Kepercayaan (Confidence Threshold)</label>
              <input type="range" min="50" max="95" value="80" class="w-full">
              <div class="flex justify-between text-[11px] text-slate-400">
                <span>50% (Longgar)</span>
                <span class="font-bold text-slate-800">80% (Standar Disarankan)</span>
                <span>95% (Sangat Ketat)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 class="text-sm font-bold text-red-600 border-b border-slate-100 pb-2">Pemulihan Data & Reset Uji Coba</h3>
          <p class="text-xs text-slate-500">Kembalikan seluruh aduan dan jejak audit ke data simulasi bawaan awal jika diperlukan untuk demonstrasi ulang.</p>
          <button id="btnResetData" class="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center gap-1.5 transition">
            <i data-lucide="trash-2" class="w-4 h-4"></i> Reset ke Data Simulasi Bawaan
          </button>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = AdminModule.renderAdminLayout(html, 'pengaturan');
    lucide.createIcons();

    const resetBtn = this.appContainer.querySelector('#btnResetData');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mereset seluruh data ke simulasi awal?')) {
          store.resetDefault();
          alert('Data berhasil direset.');
          window.location.hash = '#/admin/dashboard';
        }
      });
    }
  }
}

// Inisialisasi App
new SigapApp();

