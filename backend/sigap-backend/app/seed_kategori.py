"""
Script one-time: isi 7 kategori resmi, akun admin percobaan, akun siswa percobaan,
dan data benchmark eksternal (Aceh, Kaltim, Nasional).
Jalankan manual: python -m app.seed_kategori
"""
from app.database import SessionLocal, Base, engine
from app.models.kategori import Kategori
from app.models.admin import Admin
from app.models.siswa import Siswa
from app.core.security import hash_password
from app.data.etl_external import run_etl
import app.models  # noqa: F401

KATEGORI_RESMI = [
    "Perundungan Verbal",
    "Perundungan Fisik",
    "Perundungan Siber",
    "Kekerasan Seksual",
    "Hukuman Fisik oleh Tenaga Pendidik",
    "Kekerasan Psikis/Pengucilan Sosial",
    "Penyalahgunaan Narkoba/Rokok/Minuman Keras",
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed kategori (idempotent)
        for nama in KATEGORI_RESMI:
            ada = db.query(Kategori).filter(Kategori.nama == nama).first()
            if not ada:
                db.add(Kategori(nama=nama))
        db.commit()
        print(f"[Seed] Kategori tersedia: {db.query(Kategori).count()} baris")

        # 2. Seed 1 akun admin percobaan (idempotent)
        admin_ada = db.query(Admin).filter(Admin.nip == "198001012026").first()
        if not admin_ada:
            db.add(Admin(
                nip="198001012026",
                nama="Admin Percobaan",
                jabatan="Guru BK",
                password_hash=hash_password("admin123"),
            ))
            db.commit()
            print("[Seed] Akun admin percobaan dibuat -> NIP: 198001012026 / password: admin123")
        else:
            print("[Seed] Akun admin percobaan sudah ada, dilewati.")

        # 3. Seed 1 akun siswa percobaan (idempotent)
        siswa_ada = db.query(Siswa).filter(Siswa.nisn == "1234567890").first()
        if not siswa_ada:
            db.add(Siswa(
                nisn="1234567890",
                nama="Siswa Percobaan",
                sekolah="SMK Negeri 1 Lamongan",
                password_hash=hash_password("siswa123"),
            ))
            db.commit()
            print("[Seed] Akun siswa percobaan dibuat -> NISN: 1234567890 / password: siswa123")
        else:
            print("[Seed] Akun siswa percobaan sudah ada, dilewati.")

    finally:
        db.close()

    # 4. Jalankan ETL data agregat eksternal pemerintah
    try:
        run_etl()
    except Exception as e:
        print(f"[Seed] Peringatan: ETL data eksternal dilewati: {e}")


if __name__ == "__main__":
    run()
