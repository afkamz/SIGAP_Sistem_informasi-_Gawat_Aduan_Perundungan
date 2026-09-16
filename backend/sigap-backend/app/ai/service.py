"""
Orkestrator integrasi Modul AI Pipeline ke dalam siklus hidup laporan pengaduan SIGAP.
"""
from typing import Optional
from sqlalchemy.orm import Session

from app.models.pengaduan import Pengaduan
from app.models.kategori import Kategori
from app.ai.classifier import classify_text
from app.ai.clustering import evaluate_single_report_cluster


def analyze_report(pengaduan: Pengaduan, db: Session) -> Pengaduan:
    """
    Eksekusi alur AI lengkap untuk sebuah pengaduan:
    1. Ekstraksi embedding teks narasi
    2. Rekomendasi kategori Permendikbud via Cosine Similarity
    3. Kalkulasi confidence score (0.00 - 1.00)
    4. Evaluasi keterhubungan klaster kejadian (HDBSCAN) vs Noise/Outlier
    5. Penyimpanan hasil ke database
    """
    if not pengaduan.deskripsi:
        return pengaduan

    # 1 & 2 & 3. Klasifikasi & Cosine Similarity
    ai_result = classify_text(pengaduan.deskripsi)
    rekomendasi_nama = ai_result.get("kategori_rekomendasi")
    confidence = ai_result.get("confidence_score", 0.0)
    embedding = ai_result.get("embedding")

    if rekomendasi_nama:
        kategori_db = db.query(Kategori).filter(Kategori.nama == rekomendasi_nama).first()
        if kategori_db:
            pengaduan.ai_kategori_rekomendasi_id = kategori_db.id
            pengaduan.ai_confidence_score = confidence

    if embedding:
        pengaduan.embedding = embedding

        # 4. Klasterisasi Kejadian (HDBSCAN)
        # Ambil embedding laporan lain yang sudah tersimpan
        other_reports = (
            db.query(Pengaduan.embedding)
            .filter(
                Pengaduan.embedding.isnot(None),
                Pengaduan.id != pengaduan.id,
            )
            .all()
        )
        existing_embeddings = [r[0] for r in other_reports if r[0] and isinstance(r[0], list)]

        cluster_info = evaluate_single_report_cluster(embedding, existing_embeddings)
        pengaduan.cluster_label = cluster_info.get("cluster_label")
        pengaduan.is_noise = cluster_info.get("is_noise", True)

    db.add(pengaduan)
    db.commit()
    db.refresh(pengaduan)
    return pengaduan

