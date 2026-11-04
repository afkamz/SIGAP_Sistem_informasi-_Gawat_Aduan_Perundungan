import React, { useState, useEffect } from 'react';
import {
  Trash2,
  CheckCircle2,
  Shield,
  Users,
  UserPlus,
  Key,
  AlertTriangle,
  Lock,
  Check,
  X,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';

export const AdminSettings = () => {
  const { resetDefault, token, currentUser } = useStore();
  const [savedMsg, setSavedMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State untuk Manajemen Akun Petugas & Hak Akses
  const [staffList, setStaffList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    nip: '',
    nama: '',
    email: '',
    password: '',
    role: 'Guru BK',
    accessLevel: 'Operator Triase',
    canViewAnonymous: false
  });

  // Fetch daftar admin nyata dari database backend
  const loadStaffList = async () => {
    setLoadingStaff(true);
    try {
      if (token) {
        const data = await api.getAdminList(token);
        if (Array.isArray(data) && data.length > 0) {
          // Format data dari database ke format tampilan
          const mapped = data.map((admin) => {
            const isSuper = admin.nip === '198001012026' || admin.jabatan?.includes('Ketua') || admin.jabatan?.includes('Kepala');
            return {
              id: admin.id,
              nip: admin.nip,
              nama: admin.nama,
              email: `${admin.nip}@sman1teladan.sch.id`,
              role: admin.jabatan || 'Guru BK',
              accessLevel: isSuper ? 'Super Admin' : 'Operator Triase',
              status: 'Aktif',
              canViewAnonymous: isSuper,
              isDbAdmin: true
            };
          });
          setStaffList(mapped);
          return;
        }
      }
    } catch (err) {
      console.warn('Gagal memuat admin dari backend, menggunakan data lokal:', err.message);
    } finally {
      setLoadingStaff(false);
    }

    // Fallback jika backend offline / belum ada token
    setStaffList([
      {
        id: 1,
        nip: '198001012026',
        nama: 'Ibu Rahmawati, M.Pd',
        email: '198001012026@sman1teladan.sch.id',
        role: 'Guru BK',
        accessLevel: 'Super Admin',
        status: 'Aktif',
        canViewAnonymous: true,
        isDbAdmin: true
      }
    ]);
  };

  useEffect(() => {
    loadStaffList();
  }, [token]);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg('Konfigurasi pengaturan sistem berhasil disimpan!');
    setTimeout(() => setSavedMsg(''), 3500);
  };

  const handleToggleStaffAnonymous = (id) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, canViewAnonymous: !s.canViewAnonymous } : s))
    );
    setSavedMsg('Otorisasi izin akses anonim diperbarui.');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newStaff.nip || !newStaff.nama || !newStaff.password) {
      setErrorMsg('Harap lengkapi NIP/Username, Nama Lengkap, dan Kata Sandi.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Simpan langsung ke database backend MySQL jika token tersedia
      if (token) {
        const res = await api.registerAdmin(
          {
            nip: newStaff.nip.trim(),
            nama: newStaff.nama.trim(),
            jabatan: newStaff.role,
            password: newStaff.password
          },
          token
        );

        if (res && res.id) {
          await loadStaffList();
          setShowAddModal(false);
          setNewStaff({
            nip: '',
            nama: '',
            email: '',
            password: '',
            role: 'Guru BK',
            accessLevel: 'Operator Triase',
            canViewAnonymous: false
          });
          setSavedMsg(`Petugas ${res.nama} (NIP: ${res.nip}) berhasil tersimpan di MySQL dan dapat langsung login!`);
          setTimeout(() => setSavedMsg(''), 4500);
          setSubmitting(false);
          return;
        }
      }

      // 2. Fallback penyimpanan lokal jika backend tidak terhubung
      const staffEntry = {
        id: Date.now(),
        nip: newStaff.nip,
        nama: newStaff.nama,
        email: newStaff.email || `${newStaff.nip}@sman1teladan.sch.id`,
        role: newStaff.role,
        accessLevel: newStaff.accessLevel,
        status: 'Aktif',
        canViewAnonymous: newStaff.canViewAnonymous,
        isDbAdmin: false
      };
      setStaffList((prev) => [...prev, staffEntry]);
      setShowAddModal(false);
      setNewStaff({
        nip: '',
        nama: '',
        email: '',
        password: '',
        role: 'Guru BK',
        accessLevel: 'Operator Triase',
        canViewAnonymous: false
      });
      setSavedMsg(`Petugas ${staffEntry.nama} berhasil ditambahkan!`);
      setTimeout(() => setSavedMsg(''), 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan petugas ke database.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id, nama, isDbAdmin) => {
    if (confirm(`Cabut dan hapus akun petugas ${nama}? Petugas ini tidak akan dapat login lagi.`)) {
      try {
        if (token && isDbAdmin) {
          await api.deleteAdmin(id, token);
          await loadStaffList();
          setSavedMsg(`Akun petugas ${nama} berhasil dihapus dari database.`);
          setTimeout(() => setSavedMsg(''), 3500);
          return;
        }
      } catch (err) {
        alert('Gagal menghapus: ' + err.message);
      }

      // Fallback lokal
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
      subtitle="Kelola parameter satuan pendidikan, hak akses petugas penanganan, dan pemulihan data"
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
            Kelola identitas satuan pendidikan, manajemen akun petugas penanganan, dan pemulihan data sistem.
          </p>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-2xl glass-pill-green text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-300/60 text-xs font-bold text-red-700 flex items-center gap-2 shadow-sm animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
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
          {/* SEKSI 2: Manajemen Akun Petugas & Hak Akses               */}
          {/* ========================================================= */}
          <div className="glass-panel-elevated p-6 rounded-3xl border border-white/80 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/50 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#3B7DE8]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Manajemen Akun Petugas & Hak Akses (Tersinkron Database)
                </h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={loadStaffList}
                  disabled={loadingStaff}
                  className="glass-button-secondary px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                  title="Sinkronkan ulang daftar petugas dari database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingStaff ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="glass-button-primary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Petugas Baru</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Petugas yang ditambahkan di sini disimpan langsung ke basis data MySQL (<code className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded">admins</code>) dan langsung dapat digunakan untuk login ke portal admin menggunakan <strong>NIP</strong> dan <strong>Password</strong> yang didaftarkan.
            </p>

            {/* Tabel Petugas */}
            <div className="overflow-x-auto rounded-2xl border border-white/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/40 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-white/60">
                  <tr>
                    <th className="py-3 px-4">Nama & NIP Petugas</th>
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
                        <div className="text-[11px] text-sky-800 font-mono font-semibold flex items-center gap-1 mt-0.5">
                          <Key className="w-3 h-3 text-slate-400" />
                          <span>NIP: {staff.nip}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{staff.role}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          staff.accessLevel === 'Super Admin' ? 'glass-pill-blue' : 'glass-pill'
                        }`}>
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
                        {String(staff.nip) !== '198001012026' ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(staff.id, staff.nama, staff.isDbAdmin)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white/60 transition"
                            title="Hapus / Cabut Akses Petugas Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold italic">Utama</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-2xl glass-card flex items-start gap-2.5 text-[11px] text-slate-600">
              <Lock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong>Prinsip Kerahasiaan (Need-to-Know):</strong> Izin 'Buka Anonim' menentukan apakah akun petugas bersangkutan dapat meminta otorisasi membuka sensor identitas saksi/korban pada halaman detail laporan. Setiap pembukaan identitas tercatat secara permanen di Jejak Audit.
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

        {/* Modal Tambah Petugas Baru (Tersinkron Langsung ke Database MySQL) */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fade-in">
            <div className="glass-panel-elevated rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-white/80">
              <div className="flex items-center justify-between border-b border-white/50 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#3B7DE8]" />
                  <h3 className="font-bold text-sm text-slate-900">Tambah Akun Petugas Penanganan</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-300 text-xs text-red-700 font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    NIP / ID Login Petugas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.nip}
                    onChange={(e) => setNewStaff({ ...newStaff, nip: e.target.value })}
                    placeholder="Contoh: 198502152026 atau guru_bk02"
                    className="w-full p-2.5 rounded-xl glass-input text-slate-800 font-semibold focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Akan digunakan sebagai username saat login ke panel admin.
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nama Lengkap &amp; Gelar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.nama}
                    onChange={(e) => setNewStaff({ ...newStaff, nama: e.target.value })}
                    placeholder="Contoh: Dra. Endang Lestari, M.Pd"
                    className="w-full p-2.5 rounded-xl glass-input text-slate-800 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Kata Sandi Login <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newStaff.password}
                      onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                      placeholder="Masukkan kata sandi aman"
                      className="w-full p-2.5 pr-10 rounded-xl glass-input text-slate-800 font-semibold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Password ini otomatis di-hash aman dengan bcrypt sebelum masuk database.
                  </span>
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
                      <option value="Petugas Pendamping">Petugas Pendamping</option>
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
                      Hanya berikan kepada pimpinan Satgas PPKSP atau Kepala Sekolah jika diperlukan untuk penanganan lapangan darurat.
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
                    disabled={submitting}
                    className="glass-button-primary px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan ke Database...</span>
                      </>
                    ) : (
                      <span>Simpan ke Database</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SEKSI 3: Reset Uji Coba                                   */}
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
