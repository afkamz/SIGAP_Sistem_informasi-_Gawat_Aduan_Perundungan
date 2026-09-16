# Import semua model di sini supaya Base.metadata mengenali seluruh tabel
# saat Base.metadata.create_all(bind=engine) dipanggil di main.py
from app.models.admin import Admin
from app.models.siswa import Siswa
from app.models.kategori import Kategori
from app.models.pengaduan import Pengaduan
from app.models.bukti_pendukung import BuktiPendukung
from app.models.audit_trail import AuditTrail
from app.models.external_benchmark import ExternalBenchmark
