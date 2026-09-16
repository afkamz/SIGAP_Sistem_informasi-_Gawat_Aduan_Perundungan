import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  FileText,
  Lock,
  ArrowLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';

export const TrackReport = () => {
  const [searchParams] = useSearchParams();
  const queryCode = searchParams.get('code') || '';
  const fromParam = searchParams.get('from') || '';

  const [ticketInput, setTicketInput] = useState(queryCode);
  const [activeReport, setActiveReport] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const { reports } = useStore();

  useEffect(() => {
    if (queryCode) {
      setTicketInput(queryCode);
      handleSearch(queryCode);
    }
  }, [queryCode, reports]);

  const handleSearch = (codeToSearch) => {
    const clean = (codeToSearch || ticketInput).trim().toUpperCase();
    setSearchAttempted(true);

    if (!clean) {
      setActiveReport(null);
      return;
    }

    const found = reports.find((r) => r.ticket_code.toUpperCase() === clean);
    setActiveReport(found || null);
  };

  const stepsList = [
    { id: 'menunggu', label: '1. Laporan Diterima', desc: 'Aduan masuk dalam sistem dan menunggu telaah awal konselor.' },
    { id: 'diverifikasi', label: '2. Diverifikasi', desc: 'Bukti fisik/digital dan keterangan saksi telah divalidasi oleh Satgas.' },
    { id: 'ditindaklanjuti', label: '3. Ditindaklanjuti', desc: 'Pemanggilan para pihak, mediasi tertutup, atau pendampingan psikologis.' },
    { id: 'selesai', label: '4. Selesai Ditangani', desc: 'Kasus tuntas dengan kesepakatan tertulis dan pemulihan kondisi siswa.' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'menunggu': return 0;
      case 'diverifikasi': return 1;
      case 'ditindaklanjuti': return 2;
      case 'selesai': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = activeReport ? getStepIndex(activeReport.status) : 0;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
      <StudentHeader />

      <main className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Header Title & Back button */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Pelacakan Progres Laporan Pengaduan
            </h2>
            <p className="text-xs text-slate-500">
              Periksa perkembangan penanganan investigasi dan tindak lanjut Satgas secara transparan dan aman.
            </p>
          </div>
          <Link
            to="/"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali
          </Link>
        </div>

        {/* Input Pencarian Tiket */}
        <div className="bg-white p-5 lg:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <label className="text-xs font-bold text-slate-700 block">Masukkan Kode Tiket Laporan Anda:</label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="Contoh: SGP-2024-0142 atau SGP-2026-101"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs uppercase focus:outline-none focus:border-[#A7D8F0]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Search className="w-4 h-4" /> Cari Tiket
            </button>
          </form>

          {/* Quick presets for test */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
            <span>Contoh tiket demo:</span>
            {['SGP-2024-0142', 'SGP-2024-0141', 'SGP-2024-0139', 'SGP-2024-0138'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setTicketInput(code);
                  handleSearch(code);
                }}
                className="font-mono px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Hasil Pencarian / Detail Progres */}
        {activeReport ? (
          <div className="space-y-6 animate-fade-in">
            {/* Card Ringkasan Tiket */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-sky-900 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                      {activeReport.ticket_code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">• {activeReport.tanggal}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{activeReport.judul}</h3>
                </div>

                <div className="self-start sm:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-200">
                    <ShieldCheck className="w-4 h-4 text-sky-700" />
                    Kategori: {activeReport.kategori_nama}
                  </span>
                </div>
              </div>

              {/* 4-Step Stepper Timeline Horizontal / Vertical */}
              <div className="py-4">
                <span className="text-xs font-bold text-slate-700 block mb-4">Status Alur Penanganan:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {stepsList.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div
                        key={step.id}
                        className={`p-4 rounded-2xl border transition space-y-2 ${
                          isCurrent
                            ? 'border-sky-400 bg-sky-50/80 ring-2 ring-[#A7D8F0]/40'
                            : isDone
                            ? 'border-emerald-300 bg-emerald-50/50'
                            : 'border-slate-200 bg-slate-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                              isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-sky-600 text-white uppercase tracking-wider">
                              Aktif
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-xs text-slate-900">{step.label}</h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Catatan Konselor / Hasil Verifikasi */}
              {activeReport.catatan_konselor && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-bold text-xs text-amber-900">Catatan Resmi Tim Konselor BK / Satgas:</h5>
                    <p className="text-xs text-amber-800 leading-relaxed">{activeReport.catatan_konselor}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Riwayat Log Jejak Penanganan */}
            {activeReport.history && activeReport.history.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Log Kronologi Aktivitas Kasus
                </h4>
                <div className="divide-y divide-slate-100">
                  {activeReport.history.map((h, i) => (
                    <div key={i} className="py-3 flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{h.pelaksana}</span>
                          <span className="text-[11px] text-slate-400">{h.waktu}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{h.catatan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : searchAttempted ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Kode Tiket Tidak Ditemukan</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Pastikan Anda memasukkan kode tiket dengan format yang benar (misal: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">SGP-2024-0142</code>). Jika baru saja mengirim aduan, periksa kembali kode tiket yang diberikan pada layar konfirmasi.
            </p>
          </div>
        ) : null}
      </main>

      <StudentFooter />
    </div>
  );
};

