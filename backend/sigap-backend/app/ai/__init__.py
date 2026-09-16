"""
Modul AI Pipeline SIGAP
- Preprocessing teks narasi laporan (preprocessor.py)
- Ekstraksi Vector Embedding (embedder.py)
- Klasifikasi Kategori via Cosine Similarity (classifier.py)
- Klasterisasi Kejadian Berulang via HDBSCAN (clustering.py)
- Service Integrasi Database (service.py)
"""


def analyze_report(*args, **kwargs):
    """Lazy import agar sub-modul AI murni dapat dipakai tanpa ketergantungan SQLAlchemy."""
    from app.ai.service import analyze_report as _analyze
    return _analyze(*args, **kwargs)


__all__ = ["analyze_report"]

