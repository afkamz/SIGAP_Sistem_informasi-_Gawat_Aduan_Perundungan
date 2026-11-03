import React, { useState } from 'react';
import {
  Settings,
  Trash2,
  CheckCircle2,
  Shield,
  Bell,
  Mail,
  Phone,
  MessageSquare,
  Users,
  UserPlus,
  Key,
  ShieldAlert,
  AlertTriangle,
  Lock,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminSettings = () => {
  const { resetDefault } = useStore();
  const [savedMsg, setSavedMsg] = useState('');

  // State untuk Notifikasi & Saluran Darurat
  const [notifConfig, setNotifConfig] = useState({
    emailSatgas: 'satgas-ppksp@sman1teladan.sch.id',
    waHotline: '0812-3456-7890',
    telegramBotToken: '',
    alertHighRiskImmediate: true,
    alertDailyDigest: true,
    alertSmsEmergency: false,
    autoEscalateHours: '24'
  });

  // State untuk Manajemen Akun Petugas & Hak Akses
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      nama: 'Ibu Rahmawati, M.Pd',
      email: 'rahmawati@sman1teladan.sch.id',
      role: 'Ketua Satgas PPKSP',
      accessLevel: 'Super Admin',
      status: 'Aktif',
      canViewAnonymous: true,
      canAuditLogs: true
    },
    {
      id: 2,
      nama: 'Bapak Ahmad Fauzi, S.Pd',
      email: 'fauzi.bk@sman1teladan.sch.id',
      role: 'Konselor BK Inti',
      accessLevel: 'Operator Triase',
      status: 'Aktif',
      canViewAnonymous: false,
      canAuditLogs: true
    },
    {
      id: 3,
      nama: 'Ibu Siti Nurhaliza, S.Psi',
      email: 'siti.psikolog@sman1teladan.sch.id',
      role: 'Psikolog Mitra',
      accessLevel: 'Petugas Pendamping',
      status: 'Aktif',
      canViewAnonymous: false,
      canAuditLogs: false
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    nama: '',
    email: '',
    role: 'Guru BK',
    accessLevel: 'Operator Triase',
    canViewAnonymous: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg('Konfigurasi pengaturan sistem berhasil disimpan!');
    setTimeout(() => setSavedMsg(''), 3500);
  };

  const handleToggleStaffAnonymous = (id) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, canViewAnonymous: !s.canViewAnonymous } : s))
    );
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.nama || !newStaff.email) return;

    const staffEntry = {
      id: Date.now(),
      nama: newStaff.nama,
      email: newStaff.email,
      role: newStaff.role,
      accessLevel: newStaff.accessLevel,
      status: 'Aktif',
      canViewAnonymous: newStaff.canViewAnonymous,
      canAuditLogs: false
    };

    setStaffList((prev) => [...prev, staffEntry]);
    setShowAddModal(false);
    setNewStaff({
      nama: '',
      email: '',
      role: 'Guru BK',
      accessLevel: 'Operator Triase',
      canViewAnonymous: false
    });
    setSavedMsg(`Petugas ${staffEntry.nama} berhasil ditambahkan!`);
    setTimeout(() => setSavedMsg(''), 3500);
  };

  const handleDeleteStaff = (id, nama) => {
    if (confirm(`Hapus hak akses untuk ${nama}?`)) {
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      setSavedMsg(`Akses petugas ${nama} telah dinonaktifkan.`);
      setTimeout(() => setSavedMsg(''), 3500);
    }
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data aduan ke simulasi awal?')) {
      resetDefault();
      alert('Data berhasil direset ke kondisi awal.');
    }
  };

  return (
    <AdminLayout
      title="Pengaturan Sistem SIGAP"
      subtitle="Kelola parameter satuan pendidikan, saluran notifikasi darurat, dan hak akses petugas"
    >
      <div className="max-w-4xl space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Admin Panel</span>
            <span>&gt;</span>
            <span className="text-slate-800 font-bold">Pengaturan</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pengaturan Sistem</h1>
          <p className="text-xs text-slate-600">
            Kelola identitas satuan pendidikan, saluran notifikasi darurat cepat, dan manajemen hak akses petugas penanganan.
          </p>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-2xl glass-pill-green text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* ========================================================= */}
          {/* SEKSI 1: Informasi Satuan Pendidikan                      */}
          {/* ========================================================= */}
          <div className="glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-white/50 pb-3">
              <Shield className="w-4 h-4 text-[#3B7DE8]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Informasi Satuan Pendidikan
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Nama Satuan Pendidikan</label>
                <input
                  type="text"
                  defaultValue="SMAN 1 Teladan"
                  className="w-full p-3 rounded-2xl glass-input font-semibold text-slate-800 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">NPSN</label>
                <input
                  type="text"
                  defaultValue="20512345"
                  className="w-full p-3 rounded-2xl glass-input font-semibold text-slate-800 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SEKSI 2: Konfigurasi Notifikasi & Saluran Darurat         */}
          {/* ========================================================= */}
          <div className="glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-white/50 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Konfigurasi Notifikasi & Saluran Darurat
                </h3>
              </div>
              <span className="glass-pill-yellow text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                Alert Real-Time Aktif
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tentukan kontak darurat resmi Satgas PPKSP dan preferensi pengiriman notifikasi otomatis saat aduan risiko tinggi terdeteksi oleh sistem triase AI.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>Email Darurat Satgas PPKSP</span>
                </label>
                <input
                  type="email"
                  value={notifConfig.emailSatgas}
                  onChange={(e) => setNotifConfig({ ...notifConfig, emailSatgas: e.target.value })}
                  placeholder="satgas@sekolah.sch.id"
                  className="w-full p-3 rounded-2xl glass-input font-semibold text-slate-800 focus:outline-none transition"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Notifikasi rincian aduan baru akan dikirimkan ke alamat ini.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hotline WhatsApp Siaga (24 Jam)</span>
                </label>
                <input
                  type="text"
                  value={notifConfig.waHotline}
                  onChange={(e) => setNotifConfig({ ...notifConfig, waHotline: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full p-3 rounded-2xl glass-input font-semibold text-slate-800 focus:outline-none transition"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Ditampilkan pada tombol darurat siswa untuk panggilan darurat cepat.
                </span>
              </div>
            </div>

            {/* Opsi Toggle Peringatan Instan */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800">Kebijakan Sinyal & Notifikasi Otomatis:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="glass-card p-3.5 rounded-2xl flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifConfig.alertHighRiskImmediate}
                    onChange={(e) =>
                      setNotifConfig({ ...notifConfig, alertHighRiskImmediate: e.target.checked })
                    }
                    className="mt-0.5 rounded text-[#3B7DE8] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      Alert Instan Kasus Kritis / Urgen
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Kirimkan peringatan prioritas saat AI mendeteksi kekerasan fisik atau perundungan berat.
                    </span>
                  </div>
                </label>

                <label className="glass-card p-3.5 rounded-2xl flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifConfig.alertDailyDigest}
                    onChange={(e) =>
                      setNotifConfig({ ...notifConfig, alertDailyDigest: e.target.checked })
                    }
                    className="mt-0.5 rounded text-[#3B7DE8] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      Ringkasan Harian (Daily Digest)
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Kirim rekapitulasi status penanganan kasus ke email setiap pukul 16:00 WIB.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SEKSI 3: Manajemen Akun Petugas & Hak Akses               */}
          {/* ========================================================= */}
          <div className="glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/50 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#3B7DE8]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Manajemen Akun Petugas & Hak Akses
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="glass-button-primary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah Petugas</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Atur staf bimbingan konseling dan anggota Satgas PPKSP yang berwenang menindaklanjuti laporan. Akses terhadap identitas anonim dibatasi sesuai prinsip kerahasiaan Permendikbudristek No. 46 Tahun 2023.
            </p>

            {/* Tabel Petugas */}
            <div className="overflow-x-auto rounded-2xl border border-white/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/40 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-white/60">
                  <tr>
                    <th className="py-3 px-4">Nama Petugas</th>
                    <th className="py-3 px-4">Peran / Jabatan</th>
                    <th className="py-3 px-4">Tingkat Hak Akses</th>
                    <th className="py-3 px-4 text-center">Buka Anonim</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/50">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-white/30 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{staff.nama}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{staff.email}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{staff.role}</td>
                      <td className="py-3 px-4">
                        <span className="glass-pill-blue text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                          {staff.accessLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStaffAnonymous(staff.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${
                            staff.canViewAnonymous
                              ? 'bg-emerald-500/15 border-emerald-300 text-emerald-800'
                              : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                          }`}
                          title="Klik untuk ubah hak akses melihat identitas anonim"
                        >
                          {staff.canViewAnonymous ? 'Diizinkan' : 'Terkunci'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(staff.id, staff.nama)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white/60 transition"
                          title="Cabut Akses"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-2xl glass-card flex items-start gap-2.5 text-[11px] text-slate-600">
              <Lock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong>Prinsip Kebutuhan Tahu (Need-to-Know):</strong> Hanya petugas dengan izin 'Buka Anonim' yang dapat meminta pengungkapan identitas saksi/korban melalui prosedur otorisasi berlapis dan tercatat pada Jejak Audit.
              </span>
            </div>
          </div>

          {/* Tombol Simpan Perubahan Utama */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="glass-button-primary px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Seluruh Pengaturan</span>
            </button>
          </div>
        </form>

        {/* Modal Tambah Petugas Baru */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fade-in">
            <div className="glass-panel-elevated rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-white/80">
              <div className="flex items-center justify-between border-b border-white/50 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#3B7DE8]" />
                  <h3 className="font-bold text-sm text-slate-900">Tambah Petugas Penanganan</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={newStaff.nama}
                    onChange={(e) => setNewStaff({ ...newStaff, nama: e.target.value })}
                    placeholder="Contoh: Dra. Endang Lestari, Kons."
                    className="w-full p-2.5 rounded-xl glass-input text-slate-800 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Resmi Sekolah</label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="nama@sman1teladan.sch.id"
                    className="w-full p-2.5 rounded-xl glass-input text-slate-800 font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Peran Jabatan</label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-slate-800 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Guru BK">Guru BK</option>
                      <option value="Anggota Satgas PPKSP">Anggota Satgas</option>
                      <option value="Wali Kelas Terpilih">Wali Kelas</option>
                      <option value="Kepala Sekolah">Kepala Sekolah</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tingkat Otoritas</label>
                    <select
                      value={newStaff.accessLevel}
                      onChange={(e) => setNewStaff({ ...newStaff, accessLevel: e.target.value })}
                      className="w-full p-2.5 rounded-xl glass-input text-slate-800 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="Operator Triase">Operator Triase</option>
                      <option value="Petugas Pendamping">Petugas Pendamping</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                <label className="glass-card p-3 rounded-xl flex items-start gap-2.5 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={newStaff.canViewAnonymous}
                    onChange={(e) => setNewStaff({ ...newStaff, canViewAnonymous: e.target.checked })}
                    className="mt-0.5 rounded text-[#3B7DE8] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">
                      Beri Izin Buka Identitas Anonim
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      Hanya berikan kepada pimpinan Satgas PPKSP atau Kepala Sekolah.
                    </span>
                  </div>
                </label>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/50">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="glass-button-secondary px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="glass-button-primary px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    Simpan Petugas
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SEKSI 4: Reset Uji Coba                                   */}
        {/* ========================================================= */}
        <div className="glass-panel-elevated p-6 rounded-3xl border border-red-200/50 shadow-md space-y-3">
          <div className="flex items-center gap-2 border-b border-red-100 pb-3">
            <Trash2 className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider">
              Pemulihan Data &amp; Reset Uji Coba
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kembalikan seluruh aduan dan jejak audit ke data simulasi bawaan awal jika diperlukan untuk demonstrasi sidang atau pengujian ulang.
          </p>
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-2xl glass-pill-red font-bold text-xs flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" /> Reset ke Data Simulasi Bawaan
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
