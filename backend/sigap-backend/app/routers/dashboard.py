from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pengaduan import Pengaduan
from app.models.kategori import Kategori
from app.models.admin import Admin
from app.models.external_benchmark import ExternalBenchmark
from app.core.security import get_current_admin

router = APIRouter()


@router.get("/summary")
def ringkasan_dashboard(
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    """Ringkasan statistik umum laporan untuk overview Admin Dashboard."""
    total = db.query(func.count(Pengaduan.id)).scalar() or 0

    per_status = (
        db.query(Pengaduan.status, func.count(Pengaduan.id))
        .group_by(Pengaduan.status)
        .all()
    )

    per_kategori = (
        db.query(Kategori.nama, func.count(Pengaduan.id))
        .join(Pengaduan, Pengaduan.kategori_id == Kategori.id)
        .group_by(Kategori.nama)
        .all()
    )

    anonim_count = db.query(func.count(Pengaduan.id)).filter(Pengaduan.mode_anonim == True).scalar() or 0
    non_anonim_count = total - anonim_count

    return {
        "total_laporan": total,
        "mode_pelaporan": {
            "anonim": anonim_count,
            "non_anonim": non_anonim_count,
        },
        "per_status": {status.value: jumlah for status, jumlah in per_status},
        "per_kategori": {nama: jumlah for nama, jumlah in per_kategori},
    }


@router.get("/clusters")
def ringkasan_klaster(
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    """Statistik klaster kejadian berulang hasil modul HDBSCAN."""
    total_laporan = db.query(func.count(Pengaduan.id)).scalar() or 0
    noise_count = db.query(func.count(Pengaduan.id)).filter(Pengaduan.is_noise == True).scalar() or 0
    clustered_count = db.query(func.count(Pengaduan.id)).filter(Pengaduan.cluster_label.isnot(None)).scalar() or 0

    cluster_groups = (
        db.query(Pengaduan.cluster_label, func.count(Pengaduan.id))
        .filter(Pengaduan.cluster_label.isnot(None))
        .group_by(Pengaduan.cluster_label)
        .all()
    )

    return {
        "total_laporan": total_laporan,
        "kasus_terklaster": clustered_count,
        "kasus_tunggal_noise": noise_count,
        "daftar_klaster": [
            {"cluster_id": c_id, "jumlah_kejadian": count}
            for c_id, count in cluster_groups
        ],
    }


@router.get("/ai-metrics")
def performa_ai_metrics(
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    """Metrik performa modul AI rekomendasi dan tingkat persetujuan Admin."""
    validasi_counts = (
        db.query(Pengaduan.sumber_kategori, func.count(Pengaduan.id))
        .group_by(Pengaduan.sumber_kategori)
        .all()
    )

    avg_confidence = (
        db.query(func.avg(Pengaduan.ai_confidence_score))
        .filter(Pengaduan.ai_confidence_score.isnot(None))
        .scalar()
    )

    return {
        "rata_rata_confidence_score": round(float(avg_confidence), 2) if avg_confidence else 0.0,
        "status_validasi_kategori": {
            sumber.value: count for sumber, count in validasi_counts
        },
    }


@router.get("/external-comparison")
def perbandingan_data_eksternal(
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin),
):
    """Data referensi pembanding makro daerah dan nasional dari tabel external_benchmark."""
    benchmarks = (
        db.query(ExternalBenchmark)
        .order_by(ExternalBenchmark.tahun.desc(), ExternalBenchmark.sumber.asc())
        .all()
    )

    grouped_data = {}
    for b in benchmarks:
        if b.sumber not in grouped_data:
            grouped_data[b.sumber] = []
        grouped_data[b.sumber].append({
            "wilayah": b.wilayah,
            "indikator": b.indikator,
            "tahun": b.tahun,
            "nilai": b.nilai,
            "satuan": b.satuan,
            "keterangan": b.keterangan,
        })

    return {
        "sumber_tersedia": list(grouped_data.keys()),
        "data": grouped_data,
    }
