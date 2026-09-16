import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LAPORAN, INITIAL_AUDIT } from '../data/mockData';
import { KATEGORI_DATA } from '../data/categories';
import { api } from '../services/api';

const StoreContext = createContext(null);

const STORAGE_KEY = 'SIGAP_APP_STATE_REACT_V1';
const TOKEN_KEY = 'SIGAP_AUTH_TOKEN';
const ROLE_KEY = 'SIGAP_AUTH_ROLE';

export const StoreProvider = ({ children }) => {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.reports || INITIAL_LAPORAN;
      }
    } catch (_) {}
    return INITIAL_LAPORAN;
  });

  const [auditList, setAuditList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.auditList || INITIAL_AUDIT;
      }
    } catch (_) {}
    return INITIAL_AUDIT;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentUser || null;
      }
    } catch (_) {}
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || '');

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ reports, auditList, currentUser })
    );
  }, [reports, auditList, currentUser]);

  const loginUser = (user, jwtToken = '', userRole = 'siswa') => {
    setCurrentUser(user);
    if (jwtToken) {
      setToken(jwtToken);
      setRole(userRole);
      localStorage.setItem(TOKEN_KEY, jwtToken);
      localStorage.setItem(ROLE_KEY, userRole);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken('');
    setRole('');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  };

  const addAuditEntry = (entry) => {
    const newEntry = {
      id: Date.now(),
      waktu: 'Hari ini, ' + new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' WIB',
      tanggal_raw: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date()),
      pelaksana_nama: entry.pelaksana_nama || 'Petugas Sistem',
      pelaksana_role: entry.pelaksana_role || 'Staff',
      pelaksana_avatar: entry.pelaksana_avatar || null,
      tipe_aksi: entry.tipe_aksi || 'system',
      deskripsi: entry.deskripsi || 'Aktivitas sistem',
      detail_perubahan: entry.detail_perubahan || '-',
      ticket_code: entry.ticket_code || '-',
      hash_verified: true
    };
    setAuditList((prev) => [newEntry, ...prev]);
  };

  const createReport = async (formData) => {
    const randomSeq = String(Math.floor(100 + Math.random() * 900));
    const ticketCode = `SGP-2026-${randomSeq}`;
    const category = KATEGORI_DATA.find((k) => k.id === Number(formData.kategori_id)) || KATEGORI_DATA[0];

    // Try sending to backend if reachable
    try {
      await api.buatPengaduan({
        kategori_id: category.id,
        deskripsi: formData.deskripsi,
        mode_anonim: !!formData.is_anonymous,
        siswa_id: formData.is_anonymous ? null : (currentUser?.id || 1)
      });
    } catch (e) {
      console.warn('Backend API tidak merespons, menggunakan mode local store:', e.message);
    }

    const aiConfidence = (85 + Math.random() * 12).toFixed(1);

    const newReport = {
      id: Date.now(),
      ticket_code: ticketCode,
      judul: formData.judul || `Pengaduan Insiden ${category.nama}`,
      deskripsi: formData.deskripsi || '',
      kategori_id: category.id,
      kategori_nama: category.nama,
      status: 'menunggu',
      urgensi: formData.urgensi || 'Sedang',
      is_active: true,
      is_anonymous: !!formData.is_anonymous,
      reporter_name: formData.is_anonymous ? null : (formData.nama_pelapor || currentUser?.nama || 'Siswa Terdaftar'),
      reporter_label: formData.is_anonymous
        ? 'Anonim (Siswa)'
        : `${formData.nama_pelapor || currentUser?.nama || 'Siswa Terdaftar'} • Pelapor Terverifikasi`,
      reporter_school: formData.asal_sekolah || currentUser?.sekolah || 'SMAN 1 Teladan',
      lokasi: formData.lokasi || 'Area Sekolah',
      tanggal: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) + ' WIB',
      ai: {
        kategori_rekomendasi: category.nama,
        confidence: parseFloat(aiConfidence),
        secondary_suggestion: 'Perundungan Verbal',
        secondary_confidence: 68.4,
        is_approved: false,
        is_overridden: false,
        cluster_label: null,
        cluster_name: null,
        is_noise: true
      },
      bukti_file: formData.bukti_file || null,
      catatan_konselor: 'Laporan baru diterima. Menunggu verifikasi tim konselor BK.',
      history: [
        {
          waktu: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) + ' WIB',
          status: 'menunggu',
          pelaksana: formData.is_anonymous ? 'Pelapor Anonim' : (formData.nama_pelapor || 'Siswa'),
          catatan: 'Pengaduan berhasil diajukan melalui portal SIGAP.'
        }
      ]
    };

    setReports((prev) => [newReport, ...prev]);

    addAuditEntry({
      pelaksana_nama: formData.is_anonymous ? 'Pelapor Anonim' : (formData.nama_pelapor || 'Siswa'),
      pelaksana_role: 'Pelapor',
      tipe_aksi: 'create',
      deskripsi: `Laporan baru diajukan: ${category.nama}`,
      detail_perubahan: `Kategori terpilih: ${category.nama} • Status: Menunggu Telaah`,
      ticket_code: ticketCode
    });

    return newReport;
  };

  const updateReportStatus = async (id, nextStatus, catatan, adminName = 'Ibu Rahmawati, S.Pd') => {
    const report = reports.find((r) => r.id === Number(id));
    if (!report) return { success: false, message: 'Laporan tidak ditemukan' };

    const validTransitions = {
      menunggu: 'diverifikasi',
      diverifikasi: 'ditindaklanjuti',
      ditindaklanjuti: 'selesai',
      selesai: null
    };

    if (validTransitions[report.status] !== nextStatus) {
      return {
        success: false,
        message: `Transisi tidak valid! Dari '${report.status}' hanya dapat beralih ke '${validTransitions[report.status]}'.`
      };
    }

    // Try backend if token exists
    if (token) {
      try {
        await api.ubahStatus(id, nextStatus, catatan, token);
      } catch (e) {
        console.warn('API sync warning:', e.message);
      }
    }

    const prevStatus = report.status;
    const timestamp = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()) + ' WIB';

    const updated = {
      ...report,
      status: nextStatus,
      catatan_konselor: catatan || report.catatan_konselor,
      history: [
        ...report.history,
        {
          waktu: timestamp,
          status: nextStatus,
          pelaksana: adminName,
          catatan: catatan || `Status dialihkan ke ${nextStatus}.`
        }
      ]
    };

    setReports((prev) => prev.map((r) => (r.id === Number(id) ? updated : r)));

    addAuditEntry({
      pelaksana_nama: adminName,
      pelaksana_role: 'Konselor BK Utama',
      pelaksana_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      tipe_aksi: 'status',
      deskripsi: `Mengubah status ke ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`,
      detail_perubahan: `Dari: ${prevStatus} → Menjadi: ${nextStatus}. Catatan: "${catatan || 'Tanpa catatan'}"`,
      ticket_code: report.ticket_code
    });

    return { success: true, report: updated };
  };

  const approveAiCategory = async (id, adminName = 'Bpk. Ahmad Fauzi, M.Psi') => {
    const report = reports.find((r) => r.id === Number(id));
    if (!report) return false;

    if (token) {
      try {
        await api.validasiKategori(id, report.kategori_id, 'ai_disetujui', token);
      } catch (e) {
        console.warn('API sync warning:', e.message);
      }
    }

    const updated = {
      ...report,
      ai: {
        ...report.ai,
        is_approved: true,
        is_overridden: false
      }
    };

    setReports((prev) => prev.map((r) => (r.id === Number(id) ? updated : r)));

    addAuditEntry({
      pelaksana_nama: adminName,
      pelaksana_role: 'Satgas PPKSP',
      pelaksana_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      tipe_aksi: 'ai_approve',
      deskripsi: `Menyetujui rekomendasi AI: ${report.ai?.kategori_rekomendasi || report.kategori_nama}`,
      detail_perubahan: `Tingkat keyakinan IndoBERT: ${report.ai?.confidence || 90}% disetujui sebagai kategori final.`,
      ticket_code: report.ticket_code
    });

    return true;
  };

  const overrideCategory = async (id, newCategoryId, catatan, adminName = 'Ibu Rahmawati, S.Pd') => {
    const report = reports.find((r) => r.id === Number(id));
    if (!report) return false;

    const newCategory = KATEGORI_DATA.find((k) => k.id === Number(newCategoryId));
    if (!newCategory) return false;

    if (token) {
      try {
        await api.validasiKategori(id, newCategory.id, 'manual_override', token);
      } catch (e) {
        console.warn('API sync warning:', e.message);
      }
    }

    const oldCatName = report.kategori_nama;
    const updated = {
      ...report,
      kategori_id: newCategory.id,
      kategori_nama: newCategory.nama,
      ai: {
        ...report.ai,
        is_overridden: true,
        is_approved: false
      }
    };

    setReports((prev) => prev.map((r) => (r.id === Number(id) ? updated : r)));

    addAuditEntry({
      pelaksana_nama: adminName,
      pelaksana_role: 'Konselor BK Utama',
      pelaksana_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      tipe_aksi: 'override',
      deskripsi: 'Override kategori manual oleh Konselor',
      detail_perubahan: `Dari: ${oldCatName} → Menjadi: ${newCategory.nama}. Alasan: ${catatan || 'Koreksi verifikasi bukti fisik'}`,
      ticket_code: report.ticket_code
    });

    return true;
  };

  const getMetrics = () => {
    const activeReports = reports.filter((l) => l.is_active);
    const total = activeReports.length;
    const menunggu = activeReports.filter((l) => l.status === 'menunggu').length;
    const proses = activeReports.filter((l) => l.status === 'diverifikasi' || l.status === 'ditindaklanjuti').length;
    const selesai = activeReports.filter((l) => l.status === 'selesai').length;
    const lowAi = activeReports.filter((l) => l.ai && l.ai.confidence < 80).length;
    const clusters = 5;
    const referenceCount = reports.filter((l) => !l.is_active).length;

    return {
      total: total + 132,
      menunggu: menunggu,
      proses: proses + 21,
      selesai: selesai + 107,
      lowAi: lowAi + 10,
      clusters: clusters,
      referenceCount: referenceCount + 33
    };
  };

  const resetDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setReports(INITIAL_LAPORAN);
    setAuditList(INITIAL_AUDIT);
    setCurrentUser(null);
  };

  return (
    <StoreContext.Provider
      value={{
        reports,
        auditList,
        currentUser,
        token,
        role,
        loginUser,
        logout,
        createReport,
        updateReportStatus,
        approveAiCategory,
        overrideCategory,
        addAuditEntry,
        getMetrics,
        resetDefault,
        categories: KATEGORI_DATA
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

