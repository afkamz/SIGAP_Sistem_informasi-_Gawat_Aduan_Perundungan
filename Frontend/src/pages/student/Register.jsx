import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Info,
  Headphones,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const res = await api.registerSiswa({
        nisn: formData.nisn.trim(),
        nama: formData.nama.trim(),
        sekolah: formData.sekolah.trim(),
        password: formData.password
      });

      let token = '';
      try {
        const loginRes = await api.loginSiswa(formData.nisn.trim(), formData.password);
        token = loginRes.access_token;
      } catch (_) {}

      setIsLoading(false);
      setSuccessMsg('Pendaftaran berhasil! Mengarahkan...');

      setTimeout(() => {
        loginUser({
          id: res?.id || Date.now(),
          nama: formData.nama.trim(),
          nisn: formData.nisn.trim(),
          sekolah: formData.sekolah.trim(),
          role: 'siswa'
        }, token, 'siswa');
        navigate(redirectTarget);
      }, 800);
    } catch (err) {
      setIsLoading(false);
      console.warn('Backend register error:', err.message);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setSuccessMsg('Pendaftaran berhasil (Mode Offline)! Mengarahkan...');
        setTimeout(() => {
          loginUser({
            id: Date.now(),
            nama: formData.nama.trim(),
            nisn: formData.nisn.trim(),
            sekolah: formData.sekolah.trim(),
            role: 'siswa'
          });
          navigate(redirectTarget);
        }, 800);
      } else {
        setErrorMsg(err.message || 'Pendaftaran gagal. Silakan periksa kembali data Anda.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans relative overflow-hidden">
      {/* ─── BACKGROUND DEKORATIF: KOMBINASI BULAT BABY BLUE & GARIS-GARIS PERSIS REFERENSI ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Lingkaran Besar Baby Blue di sisi kiri */}
        <div
          className="absolute -left-28 sm:-left-40 md:-left-52 top-[10%] sm:top-[14%] w-[340px] sm:w-[480px] md:w-[580px] h-[340px] sm:h-[480px] md:h-[580px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
            opacity: 0.82
          }}
        />

        {/* Lingkaran Aksen Halus di kanan bawah */}
        <div
          className="hidden md:block absolute -right-24 -bottom-24 w-[320px] h-[320px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #E6F8FF 0%, #BFEFFF 100%)',
            opacity: 0.45
          }}
        />

        {/* Garis-garis Diagonal Halus */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          style={{ opacity: 0.75 }}
        >
          {/* Garis 1: Memotong tepi luar lingkaran kiri */}
          <line
            x1="-100"
            y1="60"
            x2="880"
            y2="1040"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          {/* Garis 2: Melintas di area tengah */}
          <line
            x1="260"
            y1="-100"
            x2="1240"
            y2="880"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          {/* Garis 3: Melintas di area kanan */}
          <line
            x1="640"
            y1="-100"
            x2="1620"
            y2="880"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          {/* Garis 4: Di pojok kanan bawah */}
          <line
            x1="1020"
            y1="-100"
            x2="2000"
            y2="880"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* ─── NAVBAR TANPA GARIS PEMBATAS ─── */}
      <StudentHeader hideBorder={true} />

      {/* ─── MAIN CONTENT: TAMPILAN DAFTAR AKUN FLAT MINIMALIS ─── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-20">
        <div className="w-full max-w-[460px] space-y-5">
          {/* Tombol Kembali ke Halaman Utama */}
          <div className="w-full flex justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full transition border hover:opacity-90"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#1C6F8E]" />
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>

          {/* Judul: Daftar Akun */}
          <div className="text-left w-full pt-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
              Daftar Akun Siswa
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Daftarkan akun resmi untuk kemudahan tracking dan riwayat laporan terpadu.
            </p>
          </div>

          {isFromReport && (
            <div
              className="p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border text-left"
              style={{
                background: 'rgba(191, 239, 255, 0.35)',
                borderColor: '#BFEFFF',
                color: '#1C6F8E'
              }}
            >
              <Info className="w-4 h-4 text-[#1C6F8E] shrink-0 mt-0.5" />
              <span>
                <strong>Akses Buat Aduan:</strong> Silakan daftarkan akun Anda terlebih dahulu untuk melanjutkan proses pelaporan aduan di sistem SIGAP.
              </span>
            </div>
          )}

          {errorMsg && (
            <div
              className="p-3 rounded-xl text-xs font-semibold border flex items-center gap-2 text-left"
              style={{
                background: '#FFF5F5',
                borderColor: '#FEB2B2',
                color: '#C53030'
              }}
            >
              <span>ⓘ</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              className="p-3 rounded-xl text-xs font-semibold border flex items-center gap-2 text-left"
              style={{
                background: '#F0FFF4',
                borderColor: '#9AE6B4',
                color: '#22543D'
              }}
            >
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input: NISN */}
            <div className="text-left">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                NISN (Nomor Induk Siswa Nasional)
              </label>
              <input
                type="text"
                name="nisn"
                required
                value={formData.nisn}
                onChange={handleChange}
                placeholder="Contoh: 1234567890 (10 Digit)"
                className="w-full px-3.5 py-3 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition"
              />
            </div>

            {/* Input: Nama Lengkap */}
            <div className="text-left">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                name="nama"
                required
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap siswa"
                className="w-full px-3.5 py-3 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition"
              />
            </div>

            {/* Grid: Asal Sekolah & Kelas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  name="sekolah"
                  required
                  value={formData.sekolah}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Kelas
                </label>
                <input
                  type="text"
                  name="kelas"
                  required
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Input: Kata Sandi */}
            <div className="text-left">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-3.5 pr-10 py-3 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Input: Konfirmasi Kata Sandi */}
            <div className="text-left">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ketik ulang kata sandi"
                  className="w-full pl-3.5 pr-10 py-3 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox Persetujuan Kebijakan */}
            <div className="flex items-start gap-2 pt-1 text-left">
              <input
                type="checkbox"
                id="persetujuan"
                name="persetujuan"
                checked={formData.persetujuan}
                onChange={handleChange}
                className="mt-0.5 rounded border-slate-300 text-[#1C6F8E] focus:ring-[#BFEFFF]"
              />
              <label htmlFor="persetujuan" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                Saya menyatakan data yang saya masukkan adalah benar dan menyetujui kebijakan privasi perlindungan siswa SIGAP.
              </label>
            </div>

            {/* ─── TOMBOL AKSI ─── */}
            <div className="pt-2 space-y-2.5">
              {/* Tombol Utama: Daftar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 border hover:opacity-90 shadow-xs cursor-pointer transition active:scale-95"
                style={{
                  background: '#BFEFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                <span>{isLoading ? 'Mendaftarkan Akun...' : 'Daftarkan Akun Siswa'}</span>
                <ArrowRight className="w-4 h-4 text-[#1C6F8E]" />
              </button>

              {/* Tombol: Sudah punya akun? Masuk ke portal */}
              <Link
                to={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : '/login'}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm border flex items-center justify-center transition hover:bg-slate-50 cursor-pointer"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              >
                Sudah punya akun? Masuk ke portal
              </Link>
            </div>
          </form>

          {/* Link Bantuan */}
          <div className="pt-4 text-center">
            <Link
              to="/lacak"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 hover:underline transition"
            >
              <Headphones className="w-3.5 h-3.5 text-slate-400" />
              <span>Apakah Anda mengalami kesulitan saat mendaftar?</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
