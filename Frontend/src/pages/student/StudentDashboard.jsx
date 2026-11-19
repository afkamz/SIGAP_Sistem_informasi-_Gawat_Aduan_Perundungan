import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Shield,
  Eye,
  EyeOff,
  Clock,
  PlusCircle,
  Inbox,
  MoreHorizontal,
  RotateCw,
  CheckCircle2,
  ChevronDown,
  SlidersHorizontal,
  Monitor,
  Users,
  Building2,
  ShieldAlert,
  FileText,
  Lock,
  UserCheck,
  Info,
  GraduationCap,
  ArrowRight,
  PhoneCall,
  Phone,
  Search,
  Settings,
  Edit3,
  Check,
  X,
  AlertCircle,
  Calendar,
  MapPin,
  HeartHandshake,
  HelpCircle,
  ShieldCheck,
  Bell,
  CheckCheck,
  MessageSquare,
  Activity,
  ListChecks,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StudentHeader } from '../../components/layout/StudentHeader';

export const StudentDashboard = () => {
  const {
    currentUser,
    reports,
    fetchRiwayatSiswa,
    isBackendConnected,
    token,
    updateStudentProfile,
    confirmAppointmentAttendance,
    studentNotifications = [],
    unreadNotificationsCount = 0,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false);

  // State Pusat Notifikasi & Pelacak Alur
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all');
  const [selectedReportDetail, setSelectedReportDetail] = useState(null);

  // State Pengaturan Akun (NISN, Nama, Sekolah, Kata Sandi)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingNisn, setSettingNisn] = useState('');
  const [settingNama, setSettingNama] = useState('');
  const [settingSekolah, setSettingSekolah] = useState('');
  const [settingOldPassword, setSettingOldPassword] = useState('');
  const [settingNewPassword, setSettingNewPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // State Jadwal Konseling Tatap Muka (Appointment Tracker)
  const [showAppointmentGuide, setShowAppointmentGuide] = useState(false);
  const [confirmingAppt, setConfirmingAppt] = useState(false);

  // Sinkronkan form modal dengan data akun currentUser
  useEffect(() => {
    if (currentUser) {
      setSettingNisn(currentUser.nisn || '');
      setSettingNama(currentUser.nama || '');
      setSettingSekolah(currentUser.sekolah || '');
    }
  }, [currentUser, isSettingsOpen]);

  // Buka modal jika parameter URL ?tab=pengaturan terdeteksi
  useEffect(() => {
    if (searchParams.get('tab') === 'pengaturan') {
      setIsSettingsOpen(true);
    }
    if (searchParams.get('tab') === 'notifikasi') {
      setIsNotifModalOpen(true);
    }
  }, [searchParams]);

  // Buka detail laporan tertentu jika parameter URL ?notif=... terdeteksi
  useEffect(() => {
    const notifTarget = searchParams.get('notif');
    if (notifTarget && myReports.length > 0) {
      const targetRep = myReports.find(
        (r) => String(r.id) === String(notifTarget) || r.ticket_code === notifTarget
      );
      if (targetRep) {
        setSelectedReportDetail(targetRep);
      }
    }
  }, [searchParams, myReports]);

  // Background Video Ref & Autoplay Enforcer
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const [isHeroInView, setIsHeroInView] = useState(false);

  // Sticky Scroll-Driven Animation Section Ref & Direct Element Refs
  const stickyContainerRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  const labelsRef = useRef([]);
  const valuesRef = useRef([]);
  const badgesRef = useRef([]);
  const progressCardRef = useRef(null);
  const progressPendingRef = useRef(null);
  const progressInProgressRef = useRef(null);
  const progressCompletedRef = useRef(null);

  // Pinned Horizontal Editorial Section: Riwayat Laporan Saya
  const reportsStickyRef = useRef(null);
  const editorialTitleRef = useRef(null);
  const reportsTrackRef = useRef(null);
  const reportCardsRef = useRef([]);

  const easeCurve = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // Cubic Bezier solver for cubic-bezier(0.16, 1, 0.3, 1)
  const solveCubicBezier = (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 5; i++) {
      const currentX = 3 * (1 - t) * (1 - t) * t * 0.16 + 3 * (1 - t) * t * t * 0.3 + t * t * t;
      const currentSlope = 3 * (1 - t) * (1 - t) * 0.16 + 6 * (1 - t) * t * (0.3 - 0.16) + 3 * t * t * (1 - 0.3);
      if (Math.abs(currentSlope) < 1e-5) break;
      t -= (currentX - p) / currentSlope;
      t = Math.max(0, Math.min(1, t));
    }
    return 3 * (1 - t) * (1 - t) * t * 1.0 + 3 * (1 - t) * t * t * 1.0 + t * t * t;
  };

  const getSubProgress = (p, start, end) => {
    if (p <= start) return 0;
    if (p >= end) return 1;
    return (p - start) / (end - start);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play()?.catch(() => {});
        });
      }
    }
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(heroEl);

    // Initial check jika hero section sudah berada dalam viewport saat pertama kali render
    const rect = heroEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsHeroInView(true);
    }

    return () => observer.disconnect();
  }, []);

  const studentName = currentUser?.nama || 'Dimas Prasetya';
  const displayName = studentName.toLowerCase().includes('ananda')
    ? studentName
    : `Ananda ${studentName}`;

  // Filter laporan milik siswa
  const myReports = useMemo(() => {
    return reports.filter((r) => {
      if (!r.is_active && r.urgensi === 'Selesai' && r.ticket_code?.startsWith('REF-')) return false;

      if (currentUser?.id && r.siswa_id && Number(r.siswa_id) === Number(currentUser.id)) return true;
      if (currentUser?.nama && r.reporter_name && r.reporter_name.toLowerCase() === currentUser.nama.toLowerCase()) return true;

      if (!currentUser?.id) {
        if (['TKT-2024-0891', 'TKT-2024-0742', 'TKT-2024-0511'].includes(r.ticket_code)) return true;
        if (r.reporter_name && r.reporter_name.toLowerCase().includes('dimas prasetya')) return true;
      }

      if (r.id > 1000000000000 && (!r.reporter_name || r.reporter_name === currentUser?.nama)) return true;

      return false;
    });
  }, [reports, currentUser]);

  // Daftar jadwal sesi konseling tatap muka dari laporan milik siswa
  const activeAppointments = useMemo(() => {
    return myReports
      .filter((r) => r.counseling_appointment && r.counseling_appointment.status !== 'dibatalkan')
      .map((r) => ({
        ...r.counseling_appointment,
        reportId: r.id,
        ticketCode: r.ticket_code,
        caseTitle: r.judul || r.kategori_nama,
      }));
  }, [myReports]);

  const latestAppointment = activeAppointments[0] || null;

  // Laporan prioritas yang sedang aktif untuk kartu Live Follow-up Stepper
  const activeFollowUpReport = useMemo(() => {
    if (myReports.length === 0) return null;
    return (
      myReports.find((r) => r.status === 'ditindaklanjuti') ||
      myReports.find((r) => r.status === 'diverifikasi') ||
      myReports.find((r) => r.status === 'menunggu') ||
      myReports[0]
    );
  }, [myReports]);

  // Filter notifikasi di dalam modal pusat notifikasi
  const filteredNotifications = useMemo(() => {
    if (notifFilter === 'unread') {
      return studentNotifications.filter((n) => !n.isRead);
    }
    if (notifFilter === 'counseling') {
      return studentNotifications.filter((n) => n.status === 'counseling' || n.actionType === 'appointment');
    }
    if (notifFilter === 'in_progress') {
      return studentNotifications.filter((n) => n.stage === 'ditindaklanjuti' || n.stage === 'diverifikasi');
    }
    if (notifFilter === 'completed') {
      return studentNotifications.filter((n) => n.status === 'selesai');
    }
    return studentNotifications;
  }, [studentNotifications, notifFilter]);

  const totalCount = myReports.length;
  const pendingCount = myReports.filter((r) => r.status === 'menunggu').length;
  const inProgressCount = myReports.filter(
    (r) => r.status === 'diverifikasi' || r.status === 'ditindaklanjuti'
  ).length;
  const completedCount = myReports.filter((r) => r.status === 'selesai').length;

  const pendingPercent = totalCount > 0 ? (pendingCount / totalCount) * 100 : 0;
  const inProgressPercent = totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0;
  const completedPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Data 4 Kartu Statistik Ringkasan
  const statsItems = useMemo(() => [
    {
      id: 'total',
      label: 'Total Aduan Saya',
      value: totalCount,
      suffix: 'kasus tercatat',
      icon: <Inbox className="w-5 h-5 text-[#1C6F8E]" />
    },
    {
      id: 'pending',
      label: 'Menunggu Tanggapan',
      value: pendingCount,
      suffix: 'Penelaahan',
      icon: <Clock className="w-5 h-5 text-[#1C6F8E]" />
    },
    {
      id: 'in_progress',
      label: 'Sedang Ditindak',
      value: inProgressCount,
      suffix: 'Konseling',
      icon: <RotateCw className="w-5 h-5 text-[#1C6F8E]" />
    },
    {
      id: 'completed',
      label: 'Selesai Ditangani',
      value: completedCount,
      suffix: 'Terselesaikan',
      icon: <CheckCircle2 className="w-5 h-5 text-[#1C6F8E]" />
    }
  ], [totalCount, pendingCount, inProgressCount, completedCount]);

  // Handler Sticky Scroll-Driven Animation
  useEffect(() => {
    const container = stickyContainerRef.current;
    if (!container) return;

    let rafId = null;

    const updateCard = (index, p, cStart, cEnd, vStart, vEnd, bStart, bEnd, targetValue) => {
      // 1. Container & Nama Kategori + Icon
      const pCard = solveCubicBezier(getSubProgress(p, cStart, cEnd));
      const cardEl = cardsRef.current[index];
      const labelEl = labelsRef.current[index];
      if (cardEl) {
        cardEl.style.opacity = pCard;
        cardEl.style.transform = `translateY(${(1 - pCard) * 24}px)`;
      }
      if (labelEl) {
        labelEl.style.opacity = pCard;
      }

      // 2. Angka Count-Up
      const pValRaw = getSubProgress(p, vStart, vEnd);
      const pVal = solveCubicBezier(pValRaw);
      const valEl = valuesRef.current[index];
      if (valEl) {
        valEl.style.opacity = pVal;
        valEl.style.transform = `scale(${0.85 + 0.15 * pVal})`;
        const currentCount = Math.round(targetValue * pVal);
        valEl.textContent = currentCount;
      }

      // 3. Keterangan Badge
      const pBadge = solveCubicBezier(getSubProgress(p, bStart, bEnd));
      const badgeEl = badgesRef.current[index];
      if (badgeEl) {
        badgeEl.style.opacity = pBadge;
        badgeEl.style.transform = `translateY(${(1 - pBadge) * 10}px)`;
      }
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const topOffset = 64; // Tinggi header sticky (64px)
      const totalScrollable = rect.height - window.innerHeight;

      let p = 0;
      if (totalScrollable > 0) {
        p = Math.max(0, Math.min(1, (topOffset - rect.top) / totalScrollable));
      }

      // 1. Judul Section: [0.00, 0.08]
      const pTitle = solveCubicBezier(getSubProgress(p, 0.00, 0.08));
      if (titleRef.current) {
        titleRef.current.style.opacity = pTitle;
        titleRef.current.style.transform = `translateY(${(1 - pTitle) * 24}px)`;
      }

      // 2. Deskripsi Section: [0.05, 0.12]
      const pDesc = solveCubicBezier(getSubProgress(p, 0.05, 0.12));
      if (descRef.current) {
        descRef.current.style.opacity = pDesc;
        descRef.current.style.transform = `translateY(${(1 - pDesc) * 12}px)`;
      }

      // 3. Card 1: Total Aduan Saya (target = totalCount)
      updateCard(0, p, 0.12, 0.19, 0.17, 0.25, 0.23, 0.28, totalCount);

      // 4. Card 2: Menunggu Tanggapan (target = pendingCount)
      updateCard(1, p, 0.29, 0.36, 0.34, 0.42, 0.40, 0.45, pendingCount);

      // 5. Card 3: Sedang Ditindak (target = inProgressCount)
      updateCard(2, p, 0.46, 0.53, 0.51, 0.59, 0.57, 0.62, inProgressCount);

      // 6. Card 4: Selesai Ditangani (target = completedCount)
      updateCard(3, p, 0.63, 0.70, 0.68, 0.76, 0.74, 0.79, completedCount);

      // 7. Elemen Visual Progres (muncul setelah seluruh 4 card selesai): [0.81, 0.94]
      const pProgress = solveCubicBezier(getSubProgress(p, 0.81, 0.94));
      if (progressCardRef.current) {
        progressCardRef.current.style.opacity = pProgress;
        progressCardRef.current.style.transform = `translateY(${(1 - pProgress) * 20}px)`;
      }
      if (progressPendingRef.current) {
        progressPendingRef.current.style.width = `${pendingPercent * pProgress}%`;
      }
      if (progressInProgressRef.current) {
        progressInProgressRef.current.style.width = `${inProgressPercent * pProgress}%`;
      }
      if (progressCompletedRef.current) {
        progressCompletedRef.current.style.width = `${completedPercent * pProgress}%`;
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Inisialisasi posisi frame saat pertama kali render
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [totalCount, pendingCount, inProgressCount, completedCount, pendingPercent, inProgressPercent, completedPercent]);

  const handleRefreshRiwayat = async () => {
    if (!currentUser?.id) return;
    setIsLoadingRiwayat(true);
    try {
      await fetchRiwayatSiswa(currentUser.id, token);
    } finally {
      setIsLoadingRiwayat(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (!settingNisn.trim()) {
      setSettingsError('NISN tidak boleh kosong.');
      return;
    }
    if (settingNisn.trim().length < 4) {
      setSettingsError('NISN minimal 4 karakter/angka.');
      return;
    }
    if (!settingNama.trim()) {
      setSettingsError('Nama siswa tidak boleh kosong.');
      return;
    }

    if (showPasswordFields && settingNewPassword) {
      if (settingNewPassword.length < 4) {
        setSettingsError('Kata sandi baru minimal 4 karakter.');
        return;
      }
    }

    setIsSavingSettings(true);
    try {
      await updateStudentProfile({
        nisn: settingNisn.trim(),
        nama: settingNama.trim(),
        sekolah: settingSekolah.trim(),
        old_password: settingOldPassword || undefined,
        new_password: showPasswordFields && settingNewPassword ? settingNewPassword : undefined,
      });

      setSettingsSuccess('Perubahan profil dan NISN Anda berhasil disimpan!');
      setSettingOldPassword('');
      setSettingNewPassword('');
      setShowPasswordFields(false);

      if (searchParams.get('tab') === 'pengaturan') {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('tab');
        setSearchParams(newParams, { replace: true });
      }

      setTimeout(() => {
        setSettingsSuccess('');
        setIsSettingsOpen(false);
      }, 1200);
    } catch (err) {
      setSettingsError(err.message || 'Gagal menyimpan pengaturan akun. Silakan coba lagi.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      handleRefreshRiwayat();
    }
  }, [currentUser?.id, token]);

  const displayedReports = useMemo(() => {
    let result = [...myReports];

    if (statusFilter !== 'all') {
      if (statusFilter === 'ditindaklanjuti') {
        result = result.filter(
          (r) => r.status === 'ditindaklanjuti' || r.status === 'diverifikasi'
        );
      } else {
        result = result.filter((r) => r.status === statusFilter);
      }
    }

    result.sort((a, b) => {
      const dateA = new Date(a.tanggal || 0).getTime() || a.id;
      const dateB = new Date(b.tanggal || 0).getTime() || b.id;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [myReports, statusFilter, sortOrder]);

  // Handler Sticky Scroll-Driven Horizontal Reveal: Riwayat Laporan Saya
  useEffect(() => {
    const container = reportsStickyRef.current;
    if (!container) return;

    let rafId = null;

    const handleReportsScroll = () => {
      const rect = container.getBoundingClientRect();
      const topOffset = 64; // Header sticky offset
      const totalScrollable = rect.height - window.innerHeight;

      let p = 0;
      if (totalScrollable > 0) {
        p = Math.max(0, Math.min(1, (topOffset - rect.top) / totalScrollable));
      }

      // 1. Oversized Editorial Typography:
      // At p = 0: opacity 1.0, scale 1.0
      // Fades to soft watermark background (opacity 0.12, scale 0.94)
      const pTitle = getSubProgress(p, 0.00, 0.28);
      const titleOpacity = 1.0 - (0.88 * solveCubicBezier(pTitle));
      const titleScale = 1.0 - (0.06 * solveCubicBezier(pTitle));
      if (editorialTitleRef.current) {
        editorialTitleRef.current.style.opacity = titleOpacity;
        editorialTitleRef.current.style.transform = `scale(${titleScale}) translate3d(0, 0, 0)`;
      }

      // 2. Horizontal Cards Track Translation:
      const track = reportsTrackRef.current;
      if (track) {
        const vw = window.innerWidth;
        const trackWidth = track.scrollWidth;
        const padding = vw < 640 ? 24 : 48;

        // End position:
        let endX = padding;
        if (trackWidth + padding * 2 <= vw) {
          endX = Math.round((vw - trackWidth) / 2);
        } else {
          endX = vw - trackWidth - padding;
        }

        const startX = vw + 60; // Initial state: entirely hidden offscreen right

        const pTrackNorm = getSubProgress(p, 0.05, 0.95);
        const pTrack = solveCubicBezier(pTrackNorm);

        const currentX = startX + (endX - startX) * pTrack;
        const trackOpacity = solveCubicBezier(getSubProgress(p, 0.03, 0.15));

        track.style.opacity = trackOpacity;
        track.style.transform = `translate3d(${currentX}px, 0, 0)`;

        // 3. Staggered Card Animation
        const cards = reportCardsRef.current;
        const numCards = cards.length;
        if (numCards > 0) {
          cards.forEach((cardEl, idx) => {
            if (!cardEl) return;
            const cardStart = (idx / (numCards + 1)) * 0.35;
            const cardEnd = Math.min(1, cardStart + 0.45);
            const pCard = solveCubicBezier(getSubProgress(pTrackNorm, cardStart, cardEnd));
            cardEl.style.opacity = 0.35 + 0.65 * pCard;
            cardEl.style.transform = `scale(${0.92 + 0.08 * pCard}) translate3d(0, 0, 0)`;
          });
        }
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleReportsScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial frame
    handleReportsScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [displayedReports.length]);

  const renderCategoryIcon = (kategoriNama = '') => {
    const lower = kategoriNama.toLowerCase();
    if (lower.includes('siber') || lower.includes('cyber') || lower.includes('online')) {
      return (
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
        >
          <Monitor className="w-3.5 h-3.5 text-[#1C6F8E]" />
        </span>
      );
    }
    if (lower.includes('sosial') || lower.includes('pengucilan') || lower.includes('kelompok')) {
      return (
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
        >
          <Users className="w-3.5 h-3.5 text-[#1C6F8E]" />
        </span>
      );
    }
    if (lower.includes('sekolah') || lower.includes('kantin') || lower.includes('lingkungan')) {
      return (
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
          style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
        >
          <Building2 className="w-3.5 h-3.5 text-[#1C6F8E]" />
        </span>
      );
    }
    return (
      <span
        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border"
        style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-[#1C6F8E]" />
      </span>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative"
      style={{ background: '#FFFFFF', color: '#1C6F8E' }}
    >
      {/* ─── BACKGROUND DEKORATIF: KOMBINASI BULAT BABY BLUE & GARIS-GARIS DIAGONAL ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Lingkaran 1: Area Statistik (Kanan Atas di bawah Hero) */}
        <div
          className="absolute -right-28 sm:-right-40 md:-right-52 top-[22%] sm:top-[25%] w-[380px] sm:w-[520px] md:w-[620px] h-[380px] sm:h-[520px] md:h-[620px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
            opacity: 0.82
          }}
        />

        {/* Lingkaran 2: Area Riwayat Laporan (Kiri Tengah) */}
        <div
          className="absolute -left-28 sm:-left-40 md:-left-52 top-[52%] sm:top-[56%] w-[340px] sm:w-[480px] md:w-[560px] h-[340px] sm:h-[480px] md:h-[560px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #D2F4FF 0%, #BFEFFF 100%)',
            opacity: 0.78
          }}
        />

        {/* Lingkaran 3: Area Bawah / Aksen (Kanan Bawah) */}
        <div
          className="hidden md:block absolute -right-24 bottom-[4%] w-[320px] h-[320px] rounded-full"
          style={{
            background: 'linear-gradient(135deg, #E6F8FF 0%, #BFEFFF 100%)',
            opacity: 0.5
          }}
        />

        {/* Garis-garis Diagonal Halus Berarah Elegan */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 2800"
          style={{ opacity: 0.75 }}
        >
          <line x1="-120" y1="880" x2="1620" y2="280" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="-160" y1="1520" x2="1580" y2="920" stroke="#E2E8F0" strokeWidth="1.2" />
          <line x1="-120" y1="2160" x2="1620" y2="1560" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="200" y1="2800" x2="1800" y2="2200" stroke="#E2E8F0" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Header Siswa */}
      <StudentHeader isDashboard={true} hideBorder={true} />

      {/* ─── Hero Section Siswa Full-Screen dengan Background Video & Degradasi Halus ─── */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-between items-center overflow-hidden z-0 text-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
      >
        {/* Background Video (Memenuhi Seluruh Viewport Hero Layar Penuh) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none brightness-105"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0
          }}
          aria-hidden="true"
        >
          <source src="/assets/background/dashboard-welcome.mp4" type="video/mp4" />
        </video>

        {/* Clean Solid Translucent Shield Overlay (Melindungi Keterbacaan Teks Hero) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.38)',
            zIndex: 1
          }}
          aria-hidden="true"
        />

        {/* Bottom Seamless Gradient Fade (Degradasi Halus Menyatu ke Web Bawahnya, Menghilangkan Garis Polosan) */}
        <div
          className="absolute inset-x-0 bottom-0 h-36 sm:h-48 lg:h-64 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.40) 35%, rgba(255, 255, 255, 0.85) 75%, #FFFFFF 100%)',
            zIndex: 2
          }}
          aria-hidden="true"
        />

        {/* Spacer Atas untuk Menyeimbangkan Komposisi Tengah */}
        <div className="w-full h-4 sm:h-8 relative z-10" />

        {/* Hero Content Area: Konten Utama Berada Tepat di Tengah Halaman */}
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center space-y-6 sm:space-y-8 my-auto">
          
          {/* Main Welcome Headline (Cinematic Text Reveal - Full Screen Center) */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.14]"
            style={{
              textShadow: '0 3px 14px rgba(20, 43, 74, 0.50)'
            }}
          >
            <span
              className="inline-block"
              style={{
                color: '#FFFFFF',
                opacity: isHeroInView ? 1 : 0,
                transform: isHeroInView ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 700ms ${easeCurve} 150ms, transform 700ms ${easeCurve} 150ms`
              }}
            >
              Selamat Datang,&nbsp;
            </span>
            <br className="hidden sm:inline" />
            <span
              className="inline-block"
              style={{
                color: '#FFFFFF',
                opacity: isHeroInView ? 1 : 0,
                transform: isHeroInView ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 700ms ${easeCurve} 260ms, transform 700ms ${easeCurve} 260ms`
              }}
            >
              {displayName}
            </span>
          </h1>

          {/* Supporting Text Sambutan Singkat */}
          <p
            className="text-sm sm:text-lg leading-relaxed max-w-2xl font-semibold"
            style={{
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(20, 43, 74, 0.55)',
              opacity: isHeroInView ? 1 : 0,
              transform: isHeroInView ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 500ms ${easeCurve} 420ms, transform 500ms ${easeCurve} 420ms`
            }}
          >
            Ruang perlindungan siswa SIGAP. Setiap suara Anda didengar, dilindungi, dan ditindaklanjuti secara profesional.
          </p>

          {/* Badge Interaktif NISN & Profil Siswa (Klik untuk mengubah NISN jika ada salah ketik/typo) */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border shadow-md backdrop-blur-md transition hover:scale-[1.02] cursor-pointer active:scale-98"
            onClick={() => setIsSettingsOpen(true)}
            title="Klik untuk mengubah NISN atau data diri siswa jika terdapat salah ketik (typo)"
            style={{
              background: 'rgba(255, 255, 255, 0.94)',
              borderColor: '#BFEFFF',
              opacity: isHeroInView ? 1 : 0,
              transform: isHeroInView ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 500ms ${easeCurve} 500ms, transform 500ms ${easeCurve} 500ms`
            }}
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs"
              style={{ background: '#BFEFFF', color: '#1C6F8E' }}
            >
              <GraduationCap className="w-4 h-4 text-[#1C6F8E]" />
            </div>
            <div className="text-left leading-tight">
              <span className="text-[10px] font-semibold text-slate-500 block">NISN TERDAFTAR</span>
              <span className="text-xs font-bold text-[#1C6F8E] font-mono tracking-wide">
                {currentUser?.nisn || '0061234567'}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="text-left leading-tight hidden xs:block">
              <span className="text-[10px] font-semibold text-slate-500 block">SEKOLAH</span>
              <span className="text-xs font-bold text-slate-700 truncate max-w-[150px] block">
                {currentUser?.sekolah || 'SMAN 1 Teladan'}
              </span>
            </div>
            <div
              className="ml-1 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border"
              style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
            >
              <Edit3 className="w-3 h-3 text-[#1C6F8E]" />
              <span>Koreksi NISN</span>
            </div>
          </div>

          {/* Group Tombol Aksi - Fokus Utama "Buat Aduan Baru" */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto pt-2"
            style={{
              opacity: isHeroInView ? 1 : 0,
              transform: isHeroInView ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 500ms ${easeCurve} 600ms, transform 500ms ${easeCurve} 600ms`
            }}
          >
            {/* Tombol Utama: Buat Aduan Baru (Fokus Utama) */}
            <Link
              to="/buat-laporan"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition transform hover:scale-105 active:scale-95 border shadow-lg cursor-pointer"
              style={{
                background: '#BFEFFF',
                color: '#142B4A',
                borderColor: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(20, 43, 74, 0.25)'
              }}
            >
              <PlusCircle className="w-5 h-5 text-[#142B4A]" />
              <span>Buat Aduan Baru</span>
            </Link>

            {/* Tombol Sekunder: Pengaturan Akun */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition hover:opacity-95 border shadow-md active:scale-95 cursor-pointer"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
              title="Pengaturan akun siswa (Ubah NISN, Nama, atau Sekolah jika typo)"
            >
              <Settings className="w-4 h-4 text-[#1C6F8E]" />
              <span>Pengaturan Akun</span>
            </button>

            {/* Tombol Sekunder: Lacak Tiket */}
            <Link
              to="/lacak?from=dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:opacity-95 border shadow-md"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <Search className="w-4 h-4 text-[#1C6F8E]" />
              <span>Lacak Tiket</span>
            </Link>

            {/* Tombol Sekunder: Sinkronkan Data */}
            <button
              type="button"
              onClick={handleRefreshRiwayat}
              disabled={isLoadingRiwayat}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer border hover:opacity-95 shadow-md"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
              title="Sinkronkan aduan dari database"
            >
              <RotateCw className={`w-4 h-4 text-[#1C6F8E] ${isLoadingRiwayat ? 'animate-spin' : ''}`} />
              <span>Sinkronkan Data</span>
            </button>

            {/* Tombol Sekunder: Notifikasi Tindak Lanjut */}
            <button
              type="button"
              onClick={() => setIsNotifModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition hover:opacity-95 border shadow-md active:scale-95 cursor-pointer relative"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
              title="Lihat seluruh notifikasi dan riwayat tindak lanjut penanganan aduan Anda"
            >
              <Bell className="w-4 h-4 text-[#1C6F8E]" />
              <span>Notifikasi Tindak Lanjut</span>
              {unreadNotificationsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                  {unreadNotificationsCount} Baru
                </span>
              )}
            </button>
          </div>

          {/* ─── KARTU PELACAK ALUR TINDAK LANJUT ADUAN TERKINI (LIVE CASE TRACKER) ─── */}
          {activeFollowUpReport && (
            <div
              className="w-full max-w-2xl mt-1 mb-2 p-5 sm:p-6 rounded-3xl border shadow-xl backdrop-blur-xl relative overflow-hidden transition-all duration-300 text-left"
              style={{
                background: 'rgba(255, 255, 255, 0.96)',
                borderColor: '#BFEFFF',
                boxShadow: '0 12px 36px -6px rgba(28, 111, 142, 0.16)',
                opacity: isHeroInView ? 1 : 0,
                transform: isHeroInView ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 600ms ${easeCurve} 650ms, transform 600ms ${easeCurve} 650ms`
              }}
            >
              {/* Header Kartu Progres */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#BFEFFF]/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs" style={{ background: '#BFEFFF', borderColor: '#BFEFFF' }}>
                    <Activity className="w-4 h-4 text-[#1C6F8E]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-wider uppercase text-[#2E84A5] block">
                      PROGRES TINDAK LANJUT ADUAN TERKINI
                    </span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-[#142B4A]">
                      #{activeFollowUpReport.ticket_code} • {activeFollowUpReport.kategori_nama}
                    </h3>
                  </div>
                </div>

                {/* Badge Status Tahapan */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-extrabold border shadow-2xs flex items-center gap-1.5"
                    style={{
                      background:
                        activeFollowUpReport.status === 'selesai'
                          ? '#D1FAE5'
                          : activeFollowUpReport.status === 'ditindaklanjuti'
                          ? '#E0F2FE'
                          : activeFollowUpReport.status === 'diverifikasi'
                          ? '#FEF3C7'
                          : '#F1F5F9',
                      color:
                        activeFollowUpReport.status === 'selesai'
                          ? '#065F46'
                          : activeFollowUpReport.status === 'ditindaklanjuti'
                          ? '#0369A1'
                          : activeFollowUpReport.status === 'diverifikasi'
                          ? '#92400E'
                          : '#475569',
                      borderColor:
                        activeFollowUpReport.status === 'selesai'
                          ? '#A7F3D0'
                          : activeFollowUpReport.status === 'ditindaklanjuti'
                          ? '#BAE6FD'
                          : activeFollowUpReport.status === 'diverifikasi'
                          ? '#FDE68A'
                          : '#CBD5E1'
                    }}
                  >
                    <span className="w-2 h-2 rounded-full animate-ping" style={{ background: 'currentColor' }} />
                    <span>
                      {activeFollowUpReport.status === 'menunggu'
                        ? '1. Laporan Masuk'
                        : activeFollowUpReport.status === 'diverifikasi'
                        ? '2. Terverifikasi Satgas'
                        : activeFollowUpReport.status === 'ditindaklanjuti'
                        ? '3. Sedang Ditindaklanjuti'
                        : '4. Selesai Ditangani'}
                    </span>
                  </span>
                </div>
              </div>

              {/* ─── STEPPER 4 TAHAP TINDAK LANJUT ─── */}
              <div className="py-2">
                <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center relative">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs border transition shadow-xs z-10"
                      style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#1C6F8E' }}
                    >
                      <Check className="w-3.5 h-3.5 text-[#1C6F8E]" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight">1. Diterima</span>
                    <span className="text-[9px] text-slate-400 hidden sm:block">Aduan Masuk</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs border transition shadow-xs z-10"
                      style={{
                        background: ['diverifikasi', 'ditindaklanjuti', 'selesai'].includes(activeFollowUpReport.status)
                          ? '#BFEFFF'
                          : '#F8FAFC',
                        color: ['diverifikasi', 'ditindaklanjuti', 'selesai'].includes(activeFollowUpReport.status)
                          ? '#1C6F8E'
                          : '#94A3B8',
                        borderColor: ['diverifikasi', 'ditindaklanjuti', 'selesai'].includes(activeFollowUpReport.status)
                          ? '#1C6F8E'
                          : '#E2E8F0'
                      }}
                    >
                      {['diverifikasi', 'ditindaklanjuti', 'selesai'].includes(activeFollowUpReport.status) ? (
                        <Check className="w-3.5 h-3.5 text-[#1C6F8E]" />
                      ) : (
                        '2'
                      )}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight">2. Verifikasi</span>
                    <span className="text-[9px] text-slate-400 hidden sm:block">Bukti Satgas</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs border transition shadow-xs z-10"
                      style={{
                        background: ['ditindaklanjuti', 'selesai'].includes(activeFollowUpReport.status)
                          ? '#BFEFFF'
                          : activeFollowUpReport.status === 'diverifikasi'
                          ? '#E0F2FE'
                          : '#F8FAFC',
                        color: ['ditindaklanjuti', 'selesai'].includes(activeFollowUpReport.status)
                          ? '#1C6F8E'
                          : '#94A3B8',
                        borderColor: ['ditindaklanjuti', 'selesai'].includes(activeFollowUpReport.status)
                          ? '#1C6F8E'
                          : '#E2E8F0'
                      }}
                    >
                      {['ditindaklanjuti', 'selesai'].includes(activeFollowUpReport.status) ? (
                        <Check className="w-3.5 h-3.5 text-[#1C6F8E]" />
                      ) : (
                        '3'
                      )}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight">3. Penanganan</span>
                    <span className="text-[9px] text-slate-400 hidden sm:block">Konseling / Mediasi</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs border transition shadow-xs z-10"
                      style={{
                        background: activeFollowUpReport.status === 'selesai' ? '#D1FAE5' : '#F8FAFC',
                        color: activeFollowUpReport.status === 'selesai' ? '#065F46' : '#94A3B8',
                        borderColor: activeFollowUpReport.status === 'selesai' ? '#059669' : '#E2E8F0'
                      }}
                    >
                      {activeFollowUpReport.status === 'selesai' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        '4'
                      )}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1 leading-tight">4. Resolusi</span>
                    <span className="text-[9px] text-slate-400 hidden sm:block">Kasus Tuntas</span>
                  </div>
                </div>
              </div>

              {/* Catatan Terakhir dari Konselor BK */}
              <div
                className="mt-3 p-3 rounded-2xl text-xs border flex items-start gap-2.5 leading-relaxed"
                style={{
                  background: 'rgba(191, 239, 255, 0.25)',
                  borderColor: '#BFEFFF',
                  color: '#1C6F8E'
                }}
              >
                <MessageSquare className="w-4 h-4 text-[#1C6F8E] shrink-0 mt-0.5" />
                <div className="space-y-0.5 w-full">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="font-bold">Perkembangan Terkini dari Konselor BK:</span>
                    <span className="text-slate-400 text-[10px]">
                      {activeFollowUpReport.history?.[activeFollowUpReport.history.length - 1]?.waktu || activeFollowUpReport.tanggal}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px]">
                    {activeFollowUpReport.history?.[activeFollowUpReport.history.length - 1]?.catatan ||
                      activeFollowUpReport.catatan_konselor ||
                      'Laporan Anda saat ini sedang dalam penanganan intensif oleh Guru BK dan Satgas PPKSP.'}
                  </p>
                </div>
              </div>

              {/* Tombol Aksi di Bawah Card */}
              <div className="mt-3 pt-3 border-t border-[#BFEFFF]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReportDetail(activeFollowUpReport)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline cursor-pointer"
                  style={{ color: '#1C6F8E' }}
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>Lihat Kronologi Lengkap Kasus Ini →</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsNotifModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold border transition hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <Bell className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Pusat Notifikasi ({studentNotifications.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── KARTU JADWAL KONSELING TATAP MUKA (APPOINTMENT TRACKER) ─── */}
          {latestAppointment && (
            <div
              className="w-full max-w-2xl mt-1 mb-2 p-5 sm:p-6 rounded-3xl border shadow-xl backdrop-blur-xl relative overflow-hidden transition-all duration-300 text-left"
              style={{
                background: 'rgba(255, 255, 255, 0.96)',
                borderColor: '#BFEFFF',
                boxShadow: '0 12px 36px -6px rgba(28, 111, 142, 0.18)',
                opacity: isHeroInView ? 1 : 0,
                transform: isHeroInView ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 500ms ${easeCurve} 650ms, transform 500ms ${easeCurve} 650ms`
              }}
            >
              {/* Soft decorative ambient shape */}
              <div
                className="absolute -right-16 -top-16 w-44 h-44 rounded-full pointer-events-none select-none"
                style={{
                  background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
                  opacity: 0.65
                }}
              />

              {/* Card Header: Icon, Badge, and Title */}
              <div
                className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b"
                style={{ borderColor: 'rgba(191, 239, 255, 0.7)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs shrink-0"
                    style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                  >
                    <Calendar className="w-5 h-5 text-[#1C6F8E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#1C6F8E]">
                        Jadwal Konseling Tatap Muka
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Sesi pendampingan privat resmi dari Tim Guru BK &amp; Satgas PPKSP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-extrabold border shadow-2xs flex items-center gap-1.5"
                    style={{
                      background: latestAppointment.is_confirmed ? '#D1FAE5' : '#D6F5FF',
                      color: latestAppointment.is_confirmed ? '#065F46' : '#1C6F8E',
                      borderColor: latestAppointment.is_confirmed ? '#A7F3D0' : '#BFEFFF'
                    }}
                  >
                    {latestAppointment.is_confirmed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kehadiran Terkonfirmasi</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-[#1C6F8E]" />
                        <span>Dijadwalkan Konselor</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Card Body: Detail Waktu, Ruangan, Konselor, dan Kasus Terkait */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-3.5 text-xs">
                {/* Waktu & Tanggal */}
                <div className="p-3 rounded-2xl border" style={{ background: '#F0FAFD', borderColor: '#BFEFFF' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#1C6F8E]" />
                    <span className="text-[10px] font-bold uppercase text-slate-500">WAKTU PERTEMUAN:</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                    {latestAppointment.scheduled_date || 'Jumat, 20 November 2026'}
                  </div>
                  <div className="text-[11px] font-semibold text-[#1C6F8E] mt-0.5">
                    Pukul {latestAppointment.scheduled_time || '10:00 - 11:00 WIB'}
                  </div>
                </div>

                {/* Lokasi Ruangan Aman */}
                <div className="p-3 rounded-2xl border" style={{ background: '#F0FAFD', borderColor: '#BFEFFF' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#1C6F8E]" />
                    <span className="text-[10px] font-bold uppercase text-slate-500">LOKASI RUANG PRIVAT:</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                    {latestAppointment.location || 'Ruang Bimbingan Konseling (BK) Privat - Lantai 2'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {latestAppointment.room_detail || 'Ruang aman tertutup, tanpa paparan teman lain.'}
                  </div>
                </div>

                {/* Konselor Pendamping */}
                <div className="p-3 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#BFEFFF' }}>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">GURU BK PENDAMPING:</span>
                  <div className="font-bold text-slate-800 text-xs">
                    {latestAppointment.counselor || 'Ibu Rahmawati, S.Pd (Konselor Satgas PPKSP)'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Kasus: <span className="font-semibold text-[#1C6F8E]">#{latestAppointment.ticketCode}</span> • {latestAppointment.caseTitle || 'Perundungan Siber'}
                  </div>
                </div>

                {/* Jaminan Keamanan */}
                <div className="p-3 rounded-2xl border flex flex-col justify-between" style={{ background: '#FFFFFF', borderColor: '#BFEFFF' }}>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">JAMINAN PERLINDUNGAN:</span>
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Rahasia &amp; Bebas Konfrontasi</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">Dilindungi SOP Satgas PPKSP</span>
                </div>
              </div>

              {/* Catatan Konselor untuk Siswa */}
              {latestAppointment.notes && (
                <div
                  className="p-3 rounded-2xl text-[11px] leading-relaxed border mb-3"
                  style={{
                    background: 'rgba(191, 239, 255, 0.25)',
                    borderColor: '#BFEFFF',
                    color: '#1C6F8E'
                  }}
                >
                  <span className="font-bold block mb-0.5">Pesan dari Konselor:</span>
                  {latestAppointment.notes}
                </div>
              )}

              {/* Action Buttons Footer */}
              <div
                className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 pt-2 border-t"
                style={{ borderColor: 'rgba(191, 239, 255, 0.6)' }}
              >
                <button
                  type="button"
                  onClick={() => setShowAppointmentGuide(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border transition hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                  style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Panduan Masuk Ruang BK</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {!latestAppointment.is_confirmed ? (
                    <button
                      type="button"
                      disabled={confirmingAppt}
                      onClick={async () => {
                        setConfirmingAppt(true);
                        confirmAppointmentAttendance(latestAppointment.reportId, currentUser?.nama || 'Siswa');
                        setTimeout(() => setConfirmingAppt(false), 500);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold border transition active:scale-95 shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 w-full sm:w-auto justify-center"
                      style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                    >
                      <Check className="w-3.5 h-3.5 text-[#1C6F8E]" />
                      <span>{confirmingAppt ? 'Mengonfirmasi...' : 'Konfirmasi: Saya Siap Hadir'}</span>
                    </button>
                  ) : (
                    <span
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border"
                      style={{ background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' }}
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kehadiran Anda Telah Dicatat BK</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <span
            className="text-[11px] sm:text-xs font-semibold px-3.5 py-1 rounded-full border shadow-xs"
            style={{
              background: 'rgba(255, 255, 255, 0.90)',
              color: '#1C6F8E',
              borderColor: '#BFEFFF',
              opacity: isHeroInView ? 1 : 0,
              transition: `opacity 500ms ${easeCurve} 750ms`
            }}
          >
            Layanan resmi bebas biaya &amp; terlindungi hukum • Respons Tim BK &lt; 24 Jam
          </span>
        </div>

        {/* Petunjuk Gulir ke Bawah (Interaktif Klik untuk Scroll Turun) */}
        <button
          type="button"
          onClick={() => {
            const el = stickyContainerRef.current;
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 64;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }}
          className="relative z-10 pb-3 flex flex-col items-center gap-1 cursor-pointer group hover:scale-105 transition-all duration-300 select-none"
          style={{
            opacity: isHeroInView ? 0.95 : 0,
            transition: `opacity 600ms ${easeCurve} 900ms`
          }}
          aria-label="Gulir ke bawah untuk melihat riwayat aduan"
        >
          <span
            className="text-[11px] font-bold tracking-wider uppercase transition-transform group-hover:translate-y-0.5"
            style={{ color: '#1C6F8E' }}
          >
            Gulir ke bawah untuk melihat riwayat aduan
          </span>
          <ChevronDown className="w-4 h-4 text-[#1C6F8E] animate-bounce" />
        </button>
      </section>

      {/* ─── Sticky Scroll Section: Status Penanganan Aduan Anda ─── */}
      <section
        id="student-stats-section"
        ref={stickyContainerRef}
        className="relative w-full z-10"
        style={{ height: '240vh' }}
      >
        <div className="sticky top-16 w-full min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col justify-start pt-4 sm:pt-8 md:pt-10 pb-6 sm:pb-12">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-7">
            
            {/* Header Ringkasan Statistik */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#BFEFFF]">
              <div className="space-y-1.5">
                <h2
                  ref={titleRef}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight"
                  style={{
                    color: '#1C6F8E',
                    opacity: 0,
                    transform: 'translateY(24px)',
                    willChange: 'opacity, transform'
                  }}
                >
                  Status Penanganan Aduan Anda
                </h2>
                <p
                  className="text-xs sm:text-sm font-semibold"
                  style={{ color: '#2E84A5' }}
                >
                  Pantau perkembangan seluruh aduan yang telah Anda sampaikan melalui SIGAP.
                </p>
              </div>

              <div
                ref={descRef}
                className="flex items-center gap-2 text-xs font-semibold text-[#2E84A5] self-start md:self-end pb-1"
                style={{
                  opacity: 0,
                  transform: 'translateY(12px)',
                  willChange: 'opacity, transform'
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#1C6F8E] shrink-0" />
                <span>Statistik lengkap. Anda dapat menggulir ke bawah.</span>
              </div>
            </div>

            {/* Grid 4 Kartu Statistik (2 Kolom di Mobile, 4 Kolom di Desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {statsItems.map((item, idx) => (
                <div
                  key={item.id}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border flex flex-col justify-between relative overflow-hidden transition-shadow duration-300 hover:shadow-md min-h-[140px] sm:min-h-[175px]"
                  style={{
                    background: '#FFFFFF',
                    borderColor: '#BFEFFF',
                    boxShadow: '0 4px 18px rgba(191, 239, 255, 0.40)',
                    opacity: 0,
                    transform: 'translateY(24px)',
                    willChange: 'opacity, transform'
                  }}
                >
                  {/* Bagian Atas Card: Icon & Nama Kategori Sejajar */}
                  <div
                    ref={(el) => (labelsRef.current[idx] = el)}
                    className="flex items-center gap-2.5 sm:gap-3.5"
                    style={{ opacity: 0, willChange: 'opacity' }}
                  >
                    <div
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{
                        background: '#BFEFFF',
                        borderColor: '#BFEFFF',
                        color: '#1C6F8E'
                      }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-xs sm:text-base font-extrabold tracking-tight leading-tight" style={{ color: '#1C6F8E' }}>
                      {item.label}
                    </span>
                  </div>

                  {/* Bagian Bawah Card: Angka & Keterangan Status */}
                  <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-3">
                    <span
                      ref={(el) => (valuesRef.current[idx] = el)}
                      className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none tabular-nums"
                      style={{ color: '#1C6F8E', opacity: 0, transform: 'scale(0.85)', willChange: 'opacity, transform' }}
                    >
                      0
                    </span>
                    <span
                      ref={(el) => (badgesRef.current[idx] = el)}
                      className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border shrink-0 w-fit"
                      style={{
                        background: '#FFFFFF',
                        color: '#1C6F8E',
                        borderColor: '#BFEFFF',
                        opacity: 0,
                        transform: 'translateY(10px)',
                        willChange: 'opacity, transform'
                      }}
                    >
                      {item.suffix}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Elemen Visual Pendukung: Garis Progres Distribusi Status Aduan */}
            <div
              ref={progressCardRef}
              className="p-5 sm:p-6 rounded-3xl border shadow-xs"
              style={{
                background: '#FFFFFF',
                borderColor: '#BFEFFF',
                boxShadow: '0 4px 18px rgba(191, 239, 255, 0.35)',
                opacity: 0,
                transform: 'translateY(20px)',
                willChange: 'opacity, transform'
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1C6F8E]" />
                  <span className="text-xs sm:text-sm font-extrabold tracking-tight" style={{ color: '#1C6F8E' }}>
                    Ringkasan perkembangan aduan Anda
                  </span>
                </div>
                <span className="text-xs font-bold" style={{ color: '#2E84A5' }}>
                  {totalCount > 0 ? `${totalCount} Kasus Tercatat` : '0 Kasus Tercatat'}
                </span>
              </div>

              {/* Garis Progres Horizontal Solid */}
              <div
                className="w-full h-3.5 rounded-full overflow-hidden flex border"
                style={{
                  background: '#F0FAFD',
                  borderColor: '#BFEFFF'
                }}
              >
                {totalCount > 0 ? (
                  <>
                    <div
                      ref={progressPendingRef}
                      className="h-full transition-all duration-300"
                      style={{
                        width: '0%',
                        background: '#7AD4F8',
                        borderRight: (inProgressCount > 0 || completedCount > 0) ? '1.5px solid #FFFFFF' : 'none'
                      }}
                      title={`Menunggu Tanggapan: ${pendingCount} (${Math.round(pendingPercent)}%)`}
                    />
                    <div
                      ref={progressInProgressRef}
                      className="h-full transition-all duration-300"
                      style={{
                        width: '0%',
                        background: '#2E84A5',
                        borderRight: completedCount > 0 ? '1.5px solid #FFFFFF' : 'none'
                      }}
                      title={`Sedang Ditindak: ${inProgressCount} (${Math.round(inProgressPercent)}%)`}
                    />
                    <div
                      ref={progressCompletedRef}
                      className="h-full transition-all duration-300"
                      style={{
                        width: '0%',
                        background: '#1C6F8E'
                      }}
                      title={`Selesai Ditangani: ${completedCount} (${Math.round(completedPercent)}%)`}
                    />
                  </>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-[11px] font-bold"
                    style={{ color: '#2E84A5', background: '#F0FAFD' }}
                  >
                    Belum ada riwayat aduan yang tercatat
                  </div>
                )}
              </div>

              {/* Legend 4 Kategori Status */}
              <div className="mt-4 pt-3 border-t border-[#BFEFFF]/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full border shrink-0" style={{ borderColor: '#1C6F8E', background: '#FFFFFF' }} />
                  <span className="font-semibold text-[#2E84A5] truncate">Total Aduan:</span>
                  <span className="font-extrabold text-[#1C6F8E]">{totalCount}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#7AD4F8' }} />
                  <span className="font-semibold text-[#2E84A5] truncate">Menunggu:</span>
                  <span className="font-extrabold text-[#1C6F8E]">
                    {pendingCount}
                    {totalCount > 0 && <span className="font-normal text-[11px] ml-1">({Math.round(pendingPercent)}%)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#2E84A5' }} />
                  <span className="font-semibold text-[#2E84A5] truncate">Ditindak:</span>
                  <span className="font-extrabold text-[#1C6F8E]">
                    {inProgressCount}
                    {totalCount > 0 && <span className="font-normal text-[11px] ml-1">({Math.round(inProgressPercent)}%)</span>}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#1C6F8E' }} />
                  <span className="font-semibold text-[#2E84A5] truncate">Selesai:</span>
                  <span className="font-extrabold text-[#1C6F8E]">
                    {completedCount}
                    {totalCount > 0 && <span className="font-normal text-[11px] ml-1">({Math.round(completedPercent)}%)</span>}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Pinned Horizontal Editorial Section: Riwayat Laporan Saya ─── */}
      <section
        id="student-reports-section"
        ref={reportsStickyRef}
        className="relative w-full z-20"
        style={{ height: '260vh' }}
      >
        <div
          className="sticky top-16 w-full h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] flex flex-col justify-center overflow-hidden relative"
          style={{ background: 'transparent' }}
        >
          {/* Top Bar Floating Controls: Header Badge, Filter, and Sort */}
          <div className="absolute top-4 sm:top-6 inset-x-0 z-30 px-4 sm:px-8 max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1C6F8E] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1C6F8E]">
                Riwayat Laporan Saya
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Dropdown Filter Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-xl px-3.5 py-1.5 sm:py-2 pr-8 text-xs font-semibold focus:outline-none cursor-pointer border shadow-xs"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  <option value="all">Semua Status</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="ditindaklanjuti">Sedang Ditindak</option>
                  <option value="selesai">Selesai</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#1C6F8E]" />
              </div>

              {/* Tombol Urutkan */}
              <button
                type="button"
                onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
                className="rounded-xl px-3.5 py-1.5 sm:py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition border hover:opacity-90 shadow-xs"
                style={{
                  background: '#FFFFFF',
                  color: '#1C6F8E',
                  borderColor: '#BFEFFF'
                }}
                title="Klik untuk mengubah urutan"
              >
                <span>{sortOrder === 'newest' ? 'Terbaru' : 'Terlama'}</span>
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1C6F8E]" />
              </button>
            </div>
          </div>

          {/* 1. INITIAL STATE — OVERSIZED EDITORIAL TYPOGRAPHY */}
          <div
            ref={editorialTitleRef}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none px-4 sm:px-6 text-center z-0 will-change-transform"
            style={{ opacity: 1, willChange: 'opacity, transform' }}
          >
            <div className="space-y-1 sm:space-y-2 max-w-5xl">
              <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.25em] uppercase text-[#2E84A5] block">
                Arsip &amp; Dokumentasi Perlindungan Siswa
              </span>
              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.88] text-[#1C6F8E]">
                <span className="block">
                  RI<span className="font-serif italic font-normal text-[#2E84A5]">W</span>AYAT
                </span>
                <span className="block mt-1 sm:mt-2">
                  LAPO<span className="font-serif italic font-normal text-[#2E84A5]">R</span>AN <span className="text-[#142B4A]">SAYA</span>
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-[#2E84A5] max-w-xl mx-auto pt-2 sm:pt-4 flex items-center justify-center gap-2">
                <span>Gulir ke bawah untuk menelusuri kartu laporan</span>
                <ArrowRight className="w-4 h-4 text-[#1C6F8E] animate-pulse" />
              </p>
            </div>
          </div>

          {/* 2. HORIZONTAL CARD REVEAL TRACK (Glide in from offscreen right) */}
          <div className="relative z-10 w-full overflow-visible pointer-events-auto py-4">
            {displayedReports.length === 0 ? (
              <div
                ref={reportsTrackRef}
                className="max-w-md mx-auto rounded-3xl border p-8 sm:p-10 text-center space-y-3 bg-white shadow-lg will-change-transform"
                style={{
                  borderColor: '#BFEFFF',
                  transform: 'translate3d(100vw, 0, 0)',
                  opacity: 0
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border"
                  style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                >
                  <FileText className="w-6 h-6 text-[#1C6F8E]" />
                </div>
                <h4 className="text-base font-bold" style={{ color: '#1C6F8E' }}>
                  Tidak Ada Laporan Ditemukan
                </h4>
                <p className="text-xs text-[#2E84A5]">
                  {statusFilter !== 'all'
                    ? 'Tidak ada laporan dengan status yang dipilih.'
                    : 'Anda belum memiliki riwayat laporan pengaduan.'}
                </p>
                {statusFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className="text-xs font-bold hover:underline cursor-pointer"
                    style={{ color: '#1C6F8E' }}
                  >
                    Tampilkan Semua Status
                  </button>
                )}
              </div>
            ) : (
              <div
                ref={reportsTrackRef}
                className="flex items-center gap-5 sm:gap-6 flex-nowrap will-change-transform w-fit select-none"
                style={{
                  transform: 'translate3d(100vw, 0, 0)',
                  opacity: 0
                }}
              >
                {displayedReports.map((item, idx) => {
                  const isWaiting = item.status === 'menunggu';
                  const isProcessing = item.status === 'ditindaklanjuti' || item.status === 'diverifikasi';
                  const isCompleted = item.status === 'selesai';

                  const formattedTicket = item.ticket_code.startsWith('#')
                    ? item.ticket_code
                    : `#${item.ticket_code}`;

                  return (
                    <div
                      key={item.id}
                      ref={(el) => (reportCardsRef.current[idx] = el)}
                      className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 h-[440px] sm:h-[470px] rounded-3xl border p-5 sm:p-6 flex flex-col justify-between relative shadow-[0_8px_30px_rgba(191,239,255,0.45)] hover:shadow-xl transition-shadow duration-300 will-change-transform bg-white text-left"
                      style={{
                        borderColor: '#BFEFFF'
                      }}
                    >
                      <div>
                        {/* Baris Kode Tiket & Status Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="font-mono text-xs font-bold px-3 py-1 rounded-xl border"
                            style={{
                              background: '#FFFFFF',
                              color: '#1C6F8E',
                              borderColor: '#BFEFFF'
                            }}
                          >
                            {formattedTicket}
                          </span>

                          {isWaiting && (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border"
                              style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E] animate-pulse" />
                              <span>Menunggu</span>
                            </span>
                          )}

                          {isProcessing && (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border"
                              style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#1C6F8E' }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E] animate-pulse" />
                              <span>Ditindaklanjuti</span>
                            </span>
                          )}

                          {isCompleted && (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold border"
                              style={{ background: '#FFFFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1C6F8E]" />
                              <span>Selesai</span>
                            </span>
                          )}
                        </div>

                        {/* Kategori Baris */}
                        <div className="flex items-center gap-2 mt-3.5">
                          {renderCategoryIcon(item.kategori_nama)}
                          <span className="text-xs font-bold truncate" style={{ color: '#1C6F8E' }}>
                            {item.kategori_nama}
                          </span>
                        </div>

                        {/* Judul Insiden */}
                        <h4
                          className="font-bold text-sm leading-snug my-2.5 line-clamp-2"
                          style={{ color: '#1C6F8E' }}
                        >
                          {item.judul || item.deskripsi}
                        </h4>

                        {/* Meta Info */}
                        <div className="space-y-1 text-xs mb-3" style={{ color: '#2E84A5' }}>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: '#2E84A5' }} />
                            <span>{item.tanggal}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {item.is_anonymous ? (
                              <>
                                <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: '#2E84A5' }} />
                                <span>Mode: Anonim (Identitas Dirahasiakan)</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5 shrink-0" style={{ color: '#2E84A5' }} />
                                <span>Mode: Identitas Terbuka</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Callout Box Status */}
                        {isWaiting && (
                          <div
                            className="p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs border"
                            style={{
                              background: 'rgba(191, 239, 255, 0.3)',
                              borderColor: '#BFEFFF',
                              color: '#1C6F8E'
                            }}
                          >
                            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
                            <span className="leading-relaxed">
                              {item.catatan_konselor || 'Sedang dalam antrean telaah oleh Koordinator Konseling Kesiswaan.'}
                            </span>
                          </div>
                        )}

                        {isProcessing && (
                          <div
                            className="p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs border"
                            style={{
                              background: '#FFFFFF',
                              borderColor: '#BFEFFF',
                              color: '#1C6F8E'
                            }}
                          >
                            <GraduationCap className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
                            <div className="leading-relaxed">
                              <span className="font-bold">Konselor Pendamping: </span>
                              <span>{item.konselor_nama || 'Dra. Hj. Ratna Sari (Guru BK)'}</span>
                            </div>
                          </div>
                        )}

                        {isCompleted && (
                          <div
                            className="p-3 rounded-2xl mt-3 flex items-start gap-2.5 text-xs border"
                            style={{
                              background: '#FFFFFF',
                              borderColor: '#BFEFFF',
                              color: '#1C6F8E'
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#1C6F8E]" />
                            <div className="leading-relaxed">
                              <span className="font-bold">Resolusi: </span>
                              <span>{item.solusi || item.catatan_konselor || 'Penanganan dan mediasi kasus telah tuntas diselesaikan.'}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Footer */}
                      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t" style={{ borderColor: '#BFEFFF' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedReportDetail(item)}
                          className="text-xs font-bold flex items-center gap-1.5 transition hover:underline cursor-pointer"
                          style={{ color: '#1C6F8E' }}
                        >
                          <Activity className="w-3.5 h-3.5 text-[#1C6F8E]" />
                          <span>Alur Tindak Lanjut</span>
                        </button>
                        <Link
                          to={`/lacak?code=${item.ticket_code.replace('#', '')}&from=dashboard`}
                          className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Lacak</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 relative z-20">

        {/* Banner Bantuan Darurat Segera */}
        <div
          className="rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border"
          style={{
            background: '#FFFFFF',
            borderColor: '#BFEFFF',
            boxShadow: '0 4px 20px -2px rgba(191, 239, 255, 0.45)'
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
            >
              <PhoneCall className="w-6 h-6 text-[#1C6F8E]" />
            </div>
            <div>
              <h4 className="font-black text-sm md:text-base" style={{ color: '#1C6F8E' }}>
                Butuh Bantuan Darurat Segera?
              </h4>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#2E84A5' }}>
                Hubungi Satuan Tugas PPA &amp; Layanan Konseling Darurat Sekolah jika keselamatan Anda atau teman dalam situasi kritis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
            <a
              href="tel:02177889900"
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition whitespace-nowrap border hover:opacity-90"
              style={{
                background: '#FFFFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <Phone className="w-4 h-4 text-[#1C6F8E]" />
              <span>(021) 7788-9900</span>
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs whitespace-nowrap border hover:opacity-90"
              style={{
                background: '#BFEFFF',
                color: '#1C6F8E',
                borderColor: '#BFEFFF'
              }}
            >
              <svg className="w-4 h-4 fill-[#1C6F8E] shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>WhatsApp Satgas PPKSP</span>
            </a>
          </div>
        </div>
      </main>

      {/* ─── MODAL PENGATURAN AKUN SISWA (TEMA PERSIS HALAMAN LOGIN) ─── */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => {
            setIsSettingsOpen(false);
            if (searchParams.get('tab') === 'pengaturan') {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('tab');
              setSearchParams(newParams, { replace: true });
            }
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden shadow-2xl border my-8"
            style={{ borderColor: '#BFEFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lingkaran Dekoratif Baby Blue persis halaman Login */}
            <div
              className="absolute -right-24 -top-24 w-64 h-64 rounded-full pointer-events-none select-none z-0"
              style={{
                background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
                opacity: 0.82
              }}
            />
            <div
              className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full pointer-events-none select-none z-0"
              style={{
                background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
                opacity: 0.5
              }}
            />

            {/* Header Modal */}
            <div
              className="relative z-10 flex items-start justify-between gap-3 border-b pb-4 mb-4"
              style={{ borderColor: 'rgba(191, 239, 255, 0.6)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs"
                  style={{
                    background: '#BFEFFF',
                    borderColor: '#BFEFFF',
                    color: '#1C6F8E'
                  }}
                >
                  <UserCheck className="w-5 h-5 text-[#1C6F8E]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
                    Pengaturan Akun Siswa
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Koreksi data profil atau perbaiki salah ketik (typo) NISN Anda
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(false);
                  if (searchParams.get('tab') === 'pengaturan') {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('tab');
                    setSearchParams(newParams, { replace: true });
                  }
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Callout Info Tip persis gaya Login */}
            <div
              className="relative z-10 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border text-left mb-4"
              style={{
                background: 'rgba(191, 239, 255, 0.35)',
                borderColor: '#BFEFFF',
                color: '#1C6F8E'
              }}
            >
              <Info className="w-4 h-4 text-[#1C6F8E] shrink-0 mt-0.5" />
              <span>
                <strong>Koreksi NISN &amp; Profil:</strong> Jika terdapat salah ketik (typo) pada nomor NISN saat registrasi, Anda dapat langsung mengoreksinya di bawah ini agar selalu sinkron dengan data sekolah.
              </span>
            </div>

            {/* Form Pengaturan Akun */}
            <form onSubmit={handleSaveSettings} className="relative z-10 space-y-4 text-left">
              {/* Field 1: NISN */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  NISN (Nomor Induk Siswa Nasional) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={settingNisn}
                    onChange={(e) => setSettingNisn(e.target.value)}
                    placeholder="Masukkan NISN (cth: 0061234567)"
                    className="w-full px-3.5 py-2.5 rounded-md text-sm font-mono font-medium border border-slate-300 focus:border-slate-500 focus:outline-none transition bg-white"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-md border"
                    style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
                  >
                    Kunci Login
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Nomor ini digunakan untuk masuk ke portal siswa. Ubah nomor di atas jika sebelumnya typo.
                </p>
              </div>

              {/* Field 2: Nama Lengkap Siswa */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Nama Lengkap Siswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settingNama}
                  onChange={(e) => setSettingNama(e.target.value)}
                  placeholder="Nama lengkap siswa"
                  className="w-full px-3.5 py-2.5 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition bg-white"
                />
              </div>

              {/* Field 3: Asal Sekolah */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Asal Satuan Pendidikan / Sekolah
                </label>
                <input
                  type="text"
                  value={settingSekolah}
                  onChange={(e) => setSettingSekolah(e.target.value)}
                  placeholder="cth: SMAN 1 Teladan"
                  className="w-full px-3.5 py-2.5 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition bg-white"
                />
              </div>

              {/* Accordion / Toggle: Ganti Kata Sandi */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="text-xs font-bold flex items-center gap-1.5 transition hover:underline cursor-pointer"
                  style={{ color: '#1C6F8E' }}
                >
                  <Lock className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>{showPasswordFields ? '− Batalkan ganti kata sandi' : '+ Ingin ganti kata sandi?'}</span>
                </button>

                {showPasswordFields && (
                  <div className="mt-3 p-3.5 rounded-2xl border space-y-3 bg-slate-50/70" style={{ borderColor: '#BFEFFF' }}>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={settingNewPassword}
                          onChange={(e) => setSettingNewPassword(e.target.value)}
                          placeholder="Minimal 4 karakter"
                          className="w-full pl-3.5 pr-10 py-2 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Kata Sandi Saat Ini (Konfirmasi Keamanan)
                      </label>
                      <input
                        type="password"
                        value={settingOldPassword}
                        onChange={(e) => setSettingOldPassword(e.target.value)}
                        placeholder="Kata sandi lama"
                        className="w-full px-3.5 py-2 rounded-md text-sm border border-slate-300 focus:border-slate-500 focus:outline-none transition bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback Error / Sukses */}
              {settingsError && (
                <div className="p-3 rounded-xl text-xs bg-red-50 border border-red-200 text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              {settingsSuccess && (
                <div className="p-3 rounded-xl text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              {/* Action Buttons Footer */}
              <div
                className="flex items-center justify-end gap-2.5 pt-3 border-t"
                style={{ borderColor: 'rgba(191, 239, 255, 0.6)' }}
              >
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2.5 rounded-md font-bold text-xs border hover:opacity-90 transition cursor-pointer"
                  style={{
                    background: '#FFFFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-5 py-2.5 rounded-md font-bold text-xs sm:text-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-xs border hover:opacity-90 flex items-center gap-2"
                  style={{
                    background: '#BFEFFF',
                    color: '#1C6F8E',
                    borderColor: '#BFEFFF'
                  }}
                >
                  {isSavingSettings ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-[#1C6F8E]" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#1C6F8E]" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL PANDUAN MASUK RUANG BK ─── */}
      {showAppointmentGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-7 relative overflow-hidden text-left"
            style={{
              background: '#FFFFFF',
              borderColor: '#BFEFFF',
              boxShadow: '0 20px 48px -12px rgba(28, 111, 142, 0.22)'
            }}
          >
            {/* Ambient accent background */}
            <div
              className="absolute -right-12 -top-12 w-36 h-36 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, #BFEFFF 0%, #D6F5FF 100%)',
                opacity: 0.6
              }}
            />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b relative" style={{ borderColor: '#BFEFFF' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs shrink-0"
                  style={{ background: '#BFEFFF', borderColor: '#BFEFFF', color: '#1C6F8E' }}
                >
                  <HeartHandshake className="w-5 h-5 text-[#1C6F8E]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800">
                    Panduan Sesi Konseling Tatap Muka
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Ruang aman privat tanpa cemas, dijamin 100% rahasia &amp; nyaman
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAppointmentGuide(false)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Point-Point Penentram Hati */}
            <div className="py-4 space-y-3.5 text-xs text-slate-600 relative">
              <div className="flex items-start gap-3 p-3 rounded-2xl border" style={{ background: '#F0FAFD', borderColor: '#BFEFFF' }}>
                <div className="w-6 h-6 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs" style={{ background: '#BFEFFF', color: '#1C6F8E' }}>
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-0.5">100% Rahasia &amp; Tertutup</h4>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    Segala hal yang Anda ceritakan di dalam ruangan dijamin kerahasiaannya oleh kode etik Guru BK dan SOP Satgas PPKSP. Tidak akan dibocorkan ke teman sekelas atau pihak lain.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl border" style={{ background: '#F0FAFD', borderColor: '#BFEFFF' }}>
                <div className="w-6 h-6 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs" style={{ background: '#BFEFFF', color: '#1C6F8E' }}>
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-0.5">Bebas Konfrontasi Langsung</h4>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    Sesi ini khusus untuk mendengar cerita Anda dan mendampingi pemulihan kondisi emosional Anda. Pihak terlapor <strong>TIDAK AKAN</strong> dihadirkan atau dipertemukan di sesi ini tanpa persetujuan Anda.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl border" style={{ background: '#F0FAFD', borderColor: '#BFEFFF' }}>
                <div className="w-6 h-6 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs" style={{ background: '#BFEFFF', color: '#1C6F8E' }}>
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-0.5">Boleh Mengajak Pendamping</h4>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    Jika Anda merasa cemas atau gugup untuk hadir sendiri, Anda diperbolehkan mengajak satu orang yang Anda percayai (sahabat, wali kelas, atau orang tua).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl border" style={{ background: '#F0FAFD', borderColor: '#BFEFFF' }}>
                <div className="w-6 h-6 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs" style={{ background: '#BFEFFF', color: '#1C6F8E' }}>
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-0.5">Tidak Ada Hukuman Bagi Pelapor</h4>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    Melaporkan kekerasan atau perundungan adalah tindakan terpuji dan dilindungi undang-undang. Anda adalah prioritas perlindungan pihak sekolah.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t flex justify-end" style={{ borderColor: 'rgba(191, 239, 255, 0.6)' }}>
              <button
                type="button"
                onClick={() => setShowAppointmentGuide(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs transition active:scale-[0.98] border shadow-xs cursor-pointer hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}
              >
                <Check className="w-4 h-4 text-[#1C6F8E]" />
                <span>Saya Mengerti &amp; Merasa Lebih Tenang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: PUSAT NOTIFIKASI & PERKEMBANGAN TINDAK LANJUT ─── */}
      {isNotifModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => {
            setIsNotifModalOpen(false);
            if (searchParams.get('tab') === 'notifikasi') {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('tab');
              setSearchParams(newParams, { replace: true });
            }
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 relative overflow-hidden shadow-2xl border my-8 text-left max-h-[90vh] flex flex-col"
            style={{ borderColor: '#BFEFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Notifikasi */}
            <div className="flex items-start justify-between pb-4 border-b border-[#BFEFFF]/60 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs"
                  style={{ background: '#BFEFFF', borderColor: '#BFEFFF' }}
                >
                  <Bell className="w-5 h-5 text-[#1C6F8E]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-[#142B4A]">
                      Pusat Notifikasi Tindak Lanjut
                    </h3>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                        {unreadNotificationsCount} Baru
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Informasi transparan sejauh mana laporan Anda telah ditindaklanjuti oleh Guru BK &amp; Satgas.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadNotificationsCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-xs font-bold text-[#1C6F8E] hover:underline flex items-center gap-1 cursor-pointer bg-sky-50 px-2.5 py-1.5 rounded-xl border border-[#BFEFFF]"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-[#1C6F8E]" />
                    <span className="hidden sm:inline">Tandai Semua Dibaca</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsNotifModalOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 py-3 border-b border-slate-100 overflow-x-auto shrink-0">
              {[
                { id: 'all', label: 'Semua', count: studentNotifications.length },
                { id: 'unread', label: 'Belum Dibaca', count: unreadNotificationsCount },
                { id: 'in_progress', label: 'Sedang Ditindak', count: studentNotifications.filter((n) => n.stage === 'ditindaklanjuti' || n.stage === 'diverifikasi').length },
                { id: 'counseling', label: 'Jadwal Konseling', count: studentNotifications.filter((n) => n.status === 'counseling').length },
                { id: 'completed', label: 'Selesai', count: studentNotifications.filter((n) => n.status === 'selesai').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setNotifFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    notifFilter === tab.id
                      ? 'bg-[#BFEFFF] text-[#142B4A] border border-[#BFEFFF]'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${notifFilter === tab.id ? 'bg-white/80 text-[#142B4A]' : 'bg-slate-200 text-slate-700'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* List Notifikasi */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 py-2 space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">Tidak ada notifikasi pada kategori ini</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    Setiap perkembangan terbaru dari Guru BK mengenai aduan Anda akan langsung muncul di sini.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      if (notif.reportData) {
                        setSelectedReportDetail(notif.reportData);
                      } else {
                        const rep = myReports.find((r) => r.id === notif.reportId || r.ticket_code === notif.ticketCode);
                        if (rep) setSelectedReportDetail(rep);
                      }
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl transition cursor-pointer flex items-start gap-3.5 border ${
                      !notif.isRead ? 'bg-sky-50/70 border-[#BFEFFF] shadow-2xs' : 'bg-white hover:bg-slate-50/80 border-slate-100'
                    }`}
                  >
                    {/* Icon Status */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5"
                      style={{ background: '#BFEFFF', borderColor: '#BFEFFF' }}
                    >
                      {notif.status === 'selesai' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : notif.status === 'counseling' ? (
                        <HeartHandshake className="w-4 h-4 text-[#1C6F8E]" />
                      ) : notif.status === 'diverifikasi' ? (
                        <ShieldCheck className="w-4 h-4 text-blue-700" />
                      ) : notif.status === 'ditindaklanjuti' ? (
                        <RotateCw className="w-4 h-4 text-cyan-700" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#1C6F8E]" />
                      )}
                    </div>

                    {/* Konten Notifikasi */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#142B4A]">
                            {notif.title}
                          </span>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {notif.waktu}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-[#1C6F8E] mb-1">
                        Tiket: #{notif.ticketCode} • {notif.category}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-100">
                        {notif.message}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-500 font-medium">
                          Pelaksana: <strong className="text-slate-700">{notif.pelaksana}</strong>
                        </span>

                        <span className="font-bold text-[#1C6F8E] flex items-center gap-1 hover:underline">
                          <span>Buka Kronologi Penanganan</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Modal Notifikasi */}
            <div className="pt-3 border-t border-[#BFEFFF]/60 flex justify-between items-center text-xs shrink-0">
              <span className="text-slate-400 text-[11px]">
                Notifikasi diperbarui realtime sesuai audit penanganan BK
              </span>
              <button
                type="button"
                onClick={() => setIsNotifModalOpen(false)}
                className="px-4 py-2 rounded-xl font-bold border transition hover:bg-slate-50 cursor-pointer"
                style={{ borderColor: '#D1D5DB', color: '#111827' }}
              >
                Tutup Notifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: KRONOLOGI ALUR PENANGANAN KASUS SPESIFIK ─── */}
      {selectedReportDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in overflow-y-auto"
          onClick={() => setSelectedReportDetail(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 relative overflow-hidden shadow-2xl border my-8 text-left max-h-[90vh] flex flex-col"
            style={{ borderColor: '#BFEFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Detail Laporan */}
            <div className="flex items-start justify-between pb-3.5 border-b border-[#BFEFFF]/60 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border" style={{ background: '#BFEFFF', color: '#1C6F8E', borderColor: '#BFEFFF' }}>
                    ALUR TINDAK LANJUT RESMI
                  </span>
                  <span className="font-bold text-xs text-[#2E84A5]">
                    #{selectedReportDetail.ticket_code}
                  </span>
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#142B4A]">
                  {selectedReportDetail.kategori_nama}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedReportDetail.judul || selectedReportDetail.deskripsi}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReportDetail(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Timeline */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4">
              {/* Stepper 4 Tahap */}
              <div className="p-4 rounded-2xl border bg-slate-50/70" style={{ borderColor: '#E2E8F0' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Tahap Penanganan Saat Ini:
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs bg-[#BFEFFF] text-[#1C6F8E] border border-[#1C6F8E]">
                      <Check className="w-3.5 h-3.5 text-[#1C6F8E]" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 mt-1">1. Diterima</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                        ['diverifikasi', 'ditindaklanjuti', 'selesai'].includes(selectedReportDetail.status)
                          ? 'bg-[#BFEFFF] text-[#1C6F8E] border-[#1C6F8E]'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {['diverifikasi', 'ditindaklanjuti', 'selesai'].includes(selectedReportDetail.status) ? (
                        <Check className="w-3.5 h-3.5 text-[#1C6F8E]" />
                      ) : (
                        '2'
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 mt-1">2. Verifikasi</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                        ['ditindaklanjuti', 'selesai'].includes(selectedReportDetail.status)
                          ? 'bg-[#BFEFFF] text-[#1C6F8E] border-[#1C6F8E]'
                          : selectedReportDetail.status === 'diverifikasi'
                          ? 'bg-sky-100 text-sky-800 border-sky-300'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {['ditindaklanjuti', 'selesai'].includes(selectedReportDetail.status) ? (
                        <Check className="w-3.5 h-3.5 text-[#1C6F8E]" />
                      ) : (
                        '3'
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 mt-1">3. Penanganan</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                        selectedReportDetail.status === 'selesai'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {selectedReportDetail.status === 'selesai' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        '4'
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 mt-1">4. Tuntas</span>
                  </div>
                </div>
              </div>

              {/* Jadwal Konseling Jika Ada */}
              {selectedReportDetail.counseling_appointment && selectedReportDetail.counseling_appointment.status !== 'dibatalkan' && (
                <div className="p-4 rounded-2xl border bg-sky-50/70" style={{ borderColor: '#BFEFFF' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1C6F8E]" />
                      <span className="font-bold text-xs text-[#142B4A]">Sesi Konseling Tatap Muka Terjadwal</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-[#1C6F8E] border border-[#BFEFFF]">
                      {selectedReportDetail.counseling_appointment.is_confirmed ? 'Siap Hadir' : 'Menunggu Konfirmasi'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Waktu:</span>
                      <strong>{selectedReportDetail.counseling_appointment.scheduled_date} ({selectedReportDetail.counseling_appointment.scheduled_time})</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Ruangan:</span>
                      <strong>{selectedReportDetail.counseling_appointment.location}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Kronologi History Lengkap */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#1C6F8E]" />
                  <span>Riwayat Jejak Rekam Penanganan (Audit Trail)</span>
                </h4>

                <div className="space-y-2.5">
                  {selectedReportDetail.history && selectedReportDetail.history.length > 0 ? (
                    selectedReportDetail.history.map((hist, hIdx) => (
                      <div
                        key={hIdx}
                        className="p-3 rounded-2xl border text-xs bg-white space-y-1"
                        style={{ borderColor: '#E2E8F0' }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#142B4A] capitalize">
                            Tahap: {hist.status}
                          </span>
                          <span className="text-[10px] text-slate-400">{hist.waktu}</span>
                        </div>
                        <p className="text-slate-600 text-[11.5px] leading-relaxed">
                          {hist.catatan}
                        </p>
                        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                          Pelaksana: <strong className="text-slate-600">{hist.pelaksana}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-2xl border text-xs text-slate-500 bg-slate-50">
                      Laporan baru masuk dalam sistem. Menunggu telaah awal dari tim konselor sekolah.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Modal Detail */}
            <div className="pt-3 border-t border-[#BFEFFF]/60 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedReportDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border transition hover:bg-slate-50 cursor-pointer"
                style={{ borderColor: '#D1D5DB', color: '#111827' }}
              >
                Tutup Kronologi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
