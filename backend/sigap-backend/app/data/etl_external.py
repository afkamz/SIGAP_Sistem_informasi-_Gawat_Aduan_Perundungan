"""
Modul ETL (Extract, Transform, Load) untuk membersihkan dan mengimpor
dataset statistik agregat eksternal pemerintah ke dalam tabel external_benchmark.
Dapat dijalankan secara mandiri: python -m app.data.etl_external
"""
import csv
import os
from pathlib import Path
from sqlalchemy.orm import Session

from app.database import SessionLocal, Base, engine
from app.models.external_benchmark import ExternalBenchmark
import app.models  # noqa: F401


def get_dataset_dir() -> Path:
    # Cari letak folder dataset di root project
    base_dir = Path(__file__).resolve().parent.parent.parent.parent
    dataset_dir = base_dir / "dataset"
    if not dataset_dir.exists():
        # Fallback path absolut jika dipanggil dari subdirektori
        dataset_dir = Path("/home/afkam/Downloads/tes/dataset")
    return dataset_dir


def load_aceh_data(db: Session, dataset_dir: Path) -> int:
    filepath = dataset_dir / "kasus-kekerasan-terhadap-anak-di-aceh-menurut-kabupaten-kota.csv"
    if not filepath.exists():
        print(f"[ETL] File tidak ditemukan: {filepath}")
        return 0

    count = 0
    with open(filepath, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            try:
                wilayah = (row.get("kemendagri_nama_kabupaten_kota") or "").strip()
                tahun_raw = (row.get("tahun ") or row.get("tahun") or "").strip()
                nilai_raw = (row.get("Kekerasan_ Anak") or "").strip()
                satuan = (row.get("satuan") or "Kasus").strip()

                if not wilayah or not tahun_raw or not nilai_raw:
                    continue

                tahun = int(tahun_raw)
                nilai = float(nilai_raw)

                # Cek duplikasi sebelum insert
                ada = db.query(ExternalBenchmark).filter(
                    ExternalBenchmark.sumber == "Dinas PPPA Aceh",
                    ExternalBenchmark.wilayah == wilayah,
                    ExternalBenchmark.tahun == tahun,
                    ExternalBenchmark.indikator == "Kekerasan Terhadap Anak",
                ).first()

                if not ada:
                    db.add(ExternalBenchmark(
                        sumber="Dinas PPPA Aceh",
                        wilayah=wilayah,
                        indikator="Kekerasan Terhadap Anak",
                        tahun=tahun,
                        nilai=nilai,
                        satuan=satuan,
                        keterangan=f"Kode Wilayah: {row.get('kemendagri_kode_kabupaten_kota', '')}",
                    ))
                    count += 1
            except Exception as err:
                continue

    db.commit()
    print(f"[ETL] Berhasil memproses data Aceh: {count} baris baru.")
    return count


def load_nasional_laporan_data(db: Session, dataset_dir: Path) -> int:
    filepath = dataset_dir / "jumlah-laporan-pengaduan-kasus-kekerasan-terhadap-anak.csv"
    if not filepath.exists():
        return 0

    count = 0
    with open(filepath, "r", encoding="utf-8-sig") as f:
        lines = [line.strip() for line in f if line.strip()]

    # Baris 0 adalah dummy/kosong, baris 1 header, baris 2+ data
    for line in lines[1:]:
        parts = line.split(",")
        if len(parts) >= 2:
            tahun_str = parts[0].strip()
            nilai_str = parts[1].strip()
            if tahun_str.isdigit():
                tahun = int(tahun_str)
                nilai = float(nilai_str)

                ada = db.query(ExternalBenchmark).filter(
                    ExternalBenchmark.sumber == "KemenPPPA",
                    ExternalBenchmark.wilayah == "Nasional",
                    ExternalBenchmark.tahun == tahun,
                    ExternalBenchmark.indikator == "Jumlah Laporan Pengaduan Kasus Kekerasan Anak",
                ).first()

                if not ada:
                    db.add(ExternalBenchmark(
                        sumber="KemenPPPA",
                        wilayah="Nasional",
                        indikator="Jumlah Laporan Pengaduan Kasus Kekerasan Anak",
                        tahun=tahun,
                        nilai=nilai,
                        satuan="Kasus",
                        keterangan="Data agregat tahunan nasional",
                    ))
                    count += 1

    db.commit()
    print(f"[ETL] Berhasil memproses laporan nasional: {count} baris baru.")
    return count


def load_ppks_data(db: Session, dataset_dir: Path) -> int:
    filepath = dataset_dir / "ppks-anak-yang-menjadi-korban-tindak-kekersan.csv"
    if not filepath.exists():
        return 0

    count = 0
    with open(filepath, "r", encoding="utf-8-sig") as f:
        lines = [line.strip() for line in f if line.strip()]

    for line in lines[1:]:
        parts = line.split(",")
        if len(parts) >= 2:
            tahun_str = parts[0].strip()
            nilai_str = parts[1].strip()
            if tahun_str.isdigit():
                tahun = int(tahun_str)
                nilai = float(nilai_str)

                ada = db.query(ExternalBenchmark).filter(
                    ExternalBenchmark.sumber == "PPKS Kemensos",
                    ExternalBenchmark.wilayah == "Nasional",
                    ExternalBenchmark.tahun == tahun,
                    ExternalBenchmark.indikator == "PPKS Anak Korban Tindak Kekerasan",
                ).first()

                if not ada:
                    db.add(ExternalBenchmark(
                        sumber="PPKS Kemensos",
                        wilayah="Nasional",
                        indikator="PPKS Anak Korban Tindak Kekerasan",
                        tahun=tahun,
                        nilai=nilai,
                        satuan="Jiwa",
                        keterangan="Data PPKS Kementerian Sosial",
                    ))
                    count += 1

    db.commit()
    print(f"[ETL] Berhasil memproses data PPKS: {count} baris baru.")
    return count


def load_kaltim_data(db: Session, dataset_dir: Path) -> int:
    filepath = dataset_dir / "data-prioritas-nasional-2023-dkp3a-prov.-kaltim-tahun-2021-2023.csv"
    if not filepath.exists():
        return 0

    count = 0
    with open(filepath, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            indikator = (row.get("Daftar Data") or "").strip()
            satuan = (row.get("Satuan") or "Skor").strip() or "Skor"

            for th in ["2021", "2022", "2023"]:
                val_raw = (row.get(th) or "").strip().replace(",", ".")
                if not val_raw:
                    continue
                try:
                    val = float(val_raw)
                    tahun = int(th)

                    ada = db.query(ExternalBenchmark).filter(
                        ExternalBenchmark.sumber == "DKP3A Prov Kaltim",
                        ExternalBenchmark.wilayah == "Provinsi Kalimantan Timur",
                        ExternalBenchmark.tahun == tahun,
                        ExternalBenchmark.indikator == indikator,
                    ).first()

                    if not ada:
                        db.add(ExternalBenchmark(
                            sumber="DKP3A Prov Kaltim",
                            wilayah="Provinsi Kalimantan Timur",
                            indikator=indikator,
                            tahun=tahun,
                            nilai=val,
                            satuan=satuan,
                            keterangan="Prioritas Nasional DKP3A Kaltim",
                        ))
                        count += 1
                except ValueError:
                    # Lewati entri deskriptif teks seperti daftar peringkat KLA
                    continue

    db.commit()
    print(f"[ETL] Berhasil memproses data DKP3A Kaltim: {count} baris baru.")
    return count


def run_etl():
    """Fungsi eksekusi utama seluruh alur ETL external data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    dataset_dir = get_dataset_dir()
    print(f"[ETL] Memulai proses ETL data eksternal dari: {dataset_dir}")
    try:
        total = 0
        total += load_aceh_data(db, dataset_dir)
        total += load_nasional_laporan_data(db, dataset_dir)
        total += load_ppks_data(db, dataset_dir)
        total += load_kaltim_data(db, dataset_dir)
        print(f"[ETL] Selesai! Total baris benchmark diimpor: {total}")
    finally:
        db.close()


if __name__ == "__main__":
    run_etl()

