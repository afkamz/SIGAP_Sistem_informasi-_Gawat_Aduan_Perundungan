import enum


class StatusLaporan(str, enum.Enum):
    """Alur status laporan (state machine) — hanya boleh maju satu tahap, tidak bisa dilompati."""
    MENUNGGU = "menunggu"
    DIVERIFIKASI = "diverifikasi"
    DITINDAKLANJUTI = "ditindaklanjuti"
    SELESAI = "selesai"


# Urutan resmi state machine, dipakai untuk validasi transisi status
URUTAN_STATUS = [
    StatusLaporan.MENUNGGU,
    StatusLaporan.DIVERIFIKASI,
    StatusLaporan.DITINDAKLANJUTI,
    StatusLaporan.SELESAI,
]


class SumberKategori(str, enum.Enum):
    """Menandai asal kategori final laporan, untuk keperluan audit."""
    BELUM_DIVALIDASI = "belum_divalidasi"
    AI_DISETUJUI = "ai_disetujui"
    MANUAL_OVERRIDE = "manual_override"
