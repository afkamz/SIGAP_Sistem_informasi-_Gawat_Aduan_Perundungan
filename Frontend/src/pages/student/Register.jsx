import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, ArrowRight, ArrowLeft, Info } from 'lucide-react';
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
    <div
      className="min-h-screen flex flex-col justify-between font-sans relative"
      style={{ background: '#FFFFFF', color: '#1C6F8E' }}
    >
      <StudentHeader />

      <main className="max-w-xl mx-auto w-full px-4 py-8 lg:py-12 relative z-20 flex-1">
        <div
          className="p-7 lg:p-8 rounded-3xl border space-y-6"
          style={{
            background: '#FFFFFF',
            borderColor: '#BFEFFF',
            boxShadow: '0 24px 70px rgba(191, 239, 255, 0.45)'
          }}
        >
          <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: '#BFEFFF' }}>
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs"
              style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
            >
              <UserPlus className="w-6 h-6 text-[#1C6F8E]" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight" style={{ color: '#1C6F8E' }}>
                Pendaftaran Akun Siswa
              </h2>
              <p className="text-xs" style={{ color: '#2E84A5' }}>
                Daftarkan akun resmi untuk memudahkan tracking dan riwayat laporan terpadu.
              </p>
            </div>
          </div>

          {isFromReport && (
            <div
              className="p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border"
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
              className="p-3.5 rounded-2xl text-xs font-semibold animate-fade-in border"
              style={{
                background: '#FFF5F5',
                borderColor: '#FEB2B2',
                color: '#C53030'
              }}
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              className="p-3.5 rounded-2xl text-xs font-semibold animate-fade-in border"
              style={{
                background: '#F0FFF4',
                borderColor: '#9AE6B4',
                color: '#22543D'
              }}
            >
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1.5 uppercase tracking-wider" style={{ color: '#1C6F8E' }}>
                NISN (Nomor Induk Siswa Nasional) *
              </label>
              <input
                type="text"
                name="nisn"
                required
                value={formData.nisn}
                onChange={handleChange}
                placeholder="Contoh: 1234567890 (10 Digit)"
                className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none border"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5 uppercase tracking-wider" style={{ color: '#1C6F8E' }}>
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                name="nama"
                required
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap siswa"
                className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none border"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1.5 uppercase tracking-wider" style={{ color: '#1C6F8E' }}>
                  Asal Sekolah *
                </label>
                <input
                  type="text"
                  name="sekolah"
                  required
                  value={formData.sekolah}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none border"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1.5 uppercase tracking-wider" style={{ color: '#1C6F8E' }}>
                  Kelas *
                </label>
                <input
                  type="text"
                  name="kelas"
                  required
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none border"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5 uppercase tracking-wider" style={{ color: '#1C6F8E' }}>
                Kata Sandi Akun *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none border"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5 uppercase tracking-wider" style={{ color: '#1C6F8E' }}>
                Konfirmasi Kata Sandi *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ketik ulang kata sandi"
                className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm focus:outline-none border"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
              />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="persetujuan"
                name="persetujuan"
                checked={formData.persetujuan}
                onChange={handleChange}
                className="mt-1 rounded border-[#BFEFFF] text-[#1C6F8E] focus:ring-[#BFEFFF]"
              />
              <label htmlFor="persetujuan" className="text-xs leading-relaxed cursor-pointer" style={{ color: '#2E84A5' }}>
                Saya menyatakan data yang saya masukkan adalah benar dan saya menyetujui kebijakan privasi data perlindungan siswa SIGAP.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 border hover:opacity-90 shadow-xs cursor-pointer transition active:scale-95"
              style={{
                background: '#BFEFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <span>{isLoading ? 'Mendaftarkan Akun...' : 'Daftarkan Akun Siswa'}</span>
              <ArrowRight className="w-4 h-4 text-[#1C6F8E]" />
            </button>
          </form>

          <div className="text-center text-xs pt-2 border-t flex items-center justify-center gap-2" style={{ borderColor: '#BFEFFF' }}>
            <Link
              to={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : '/login'}
              className="hover:underline flex items-center gap-1 font-bold"
              style={{ color: '#1C6F8E' }}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#1C6F8E]" /> Sudah punya akun? Masuk ke portal
            </Link>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
};

export default Register;
