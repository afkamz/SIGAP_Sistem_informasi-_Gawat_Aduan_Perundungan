import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
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
    setSuccessMsg('Pendaftaran berhasil! Mengarahkan ke dashboard...');

    setTimeout(() => {
      loginUser({
        id: Date.now(),
        nama: formData.nama,
        nisn: formData.nisn,
        sekolah: formData.sekolah,
        role: 'siswa'
      });
      navigate('/dashboard');
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
                placeholder="Masukkan nama lengkap sesuai data sekolah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  placeholder="Contoh: X-MIPA-1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#A7D8F0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kata Sandi *</label>
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
                <label className="text-xs font-bold text-slate-700 block mb-1">Ulangi Kata Sandi *</label>
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
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                name="persetujuan"
                id="persetujuan"
                checked={formData.persetujuan}
                onChange={handleChange}
                className="rounded border-slate-300 text-sky-600 focus:ring-[#A7D8F0] mt-0.5"
              />
              <label htmlFor="persetujuan" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                Saya menyatakan data yang saya masukkan adalah benar dan bersedia mematuhi tata tertib perlindungan kerahasiaan layanan SIGAP.
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
            <Link to="/" className="text-slate-600 hover:text-slate-900 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke halaman login
            </Link>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

