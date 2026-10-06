import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, ArrowRight, ShieldCheck, ArrowLeft, Info } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';
import { StudentFooter } from '../../components/layout/StudentFooter';
import { api } from '../../services/api';

export const Register = () => {
  const [formData, setFormData] = useState({
    nisn: '',
    nama: '',
    sekolah: 'SMAN 1 Teladan',
    kelas: 'X-MIPA-1',
    password: '',
    confirmPassword: '',
    persetujuan: false
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const isFromReport = redirectTarget.includes('buat-laporan');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    if (!formData.persetujuan) {
      setErrorMsg('Anda harus menyetujui ketentuan privasi dan integritas data.');
      return;
    }

    setIsLoading(true);

    try {
      // Try calling FastAPI backend
      await api.registerSiswa({
        nisn: formData.nisn,
        nama: formData.nama,
        sekolah: formData.sekolah,
        password: formData.password
      });
    } catch (err) {
      console.warn('Backend warning:', err.message);
    }

    setIsLoading(false);
    setSuccessMsg('Pendaftaran berhasil! Mengarahkan...');

    setTimeout(() => {
      loginUser({
        id: Date.now(),
        nama: formData.nama,
        nisn: formData.nisn,
        sekolah: formData.sekolah,
        role: 'siswa'
      });
      navigate(redirectTarget);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
      <StudentHeader />

      <main className="max-w-xl mx-auto w-full px-4 py-8 lg:py-12">
        <div className="bg-white p-7 lg:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A7D8F0] flex items-center justify-center text-slate-900">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pendaftaran Akun Siswa</h2>
              <p className="text-xs text-slate-500">Daftarkan akun resmi untuk memudahkan tracking dan riwayat laporan terpadu.</p>
            </div>
          </div>

          {isFromReport && (
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Akses Buat Aduan:</strong> Silakan daftarkan akun Anda terlebih dahulu untuk melanjutkan proses pelaporan aduan di sistem SIGAP.
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">NISN (Nomor Induk Siswa Nasional) *</label>
              <input
                type="text"
                name="nisn"
                required
                value={formData.nisn}
                onChange={handleChange}
                placeholder="Contoh: 3125521007 (10 Digit)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap Siswa *</label>
              <input
                type="text"
                name="nama"
                required
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap siswa"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Asal Sekolah *</label>
                <input
                  type="text"
                  name="sekolah"
                  required
                  value={formData.sekolah}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kelas *</label>
                <input
                  type="text"
                  name="kelas"
                  required
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kata Sandi Akun *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Konfirmasi Kata Sandi *</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ketik ulang kata sandi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="persetujuan"
                name="persetujuan"
                checked={formData.persetujuan}
                onChange={handleChange}
                className="mt-1 rounded border-slate-300 text-sky-600 focus:ring-[#A7D8F0]"
              />
              <label htmlFor="persetujuan" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                Saya menyatakan data yang saya masukkan adalah benar dan saya menyetujui kebijakan privasi data siswa SIGAP.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#A7D8F0] hover:bg-[#90C8E4] text-slate-900 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{isLoading ? 'Mendaftarkan...' : 'Daftarkan Akun'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
            <Link
              to={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : '/login'}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke halaman login
            </Link>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};
