"""
Modul klasifikasi kategori rekomendasi AI menggunakan Cosine Similarity
terhadap 7 Centroid Kategori Resmi Permendikbudristek No. 46/2023.
"""
import json
import math
from pathlib import Path
from typing import Dict, List, Any

from app.ai.embedder import get_embedding, cosine_similarity

_CATEGORY_CENTROIDS: Dict[str, List[float]] = {}


def _get_seed_cases_path() -> Path:
    candidates = [
        Path(__file__).resolve().parent.parent.parent.parent / "dataset" / "seed_narasi_7_kategori.json",
        Path("/home/afkam/Downloads/tes/dataset/seed_narasi_7_kategori.json"),
    ]
    for p in candidates:
        if p.exists():
            return p
    return candidates[0]


def init_centroids() -> Dict[str, List[float]]:
    """
    Menghitung vektor centroid untuk setiap kategori dari seed narasi emas.
    Centroid dihitung dari mean vector seluruh contoh dalam kategori.
    """
    global _CATEGORY_CENTROIDS
    if _CATEGORY_CENTROIDS:
        return _CATEGORY_CENTROIDS

    path = _get_seed_cases_path()
    if not path.exists():
        print(f"[AI Classifier] File seed narasi tidak ditemukan: {path}")
        return {}

    with open(path, "r", encoding="utf-8") as f:
        categories = json.load(f)

    centroids = {}
    for cat in categories:
        nama = cat["kategori"]
        contoh_list = cat["contoh"]

        embeddings = [get_embedding(teks) for teks in contoh_list if teks.strip()]
        if not embeddings:
            continue

        dim = len(embeddings[0])
        centroid = [0.0] * dim

        for emb in embeddings:
            for i in range(dim):
                centroid[i] += emb[i]

        count = len(embeddings)
        centroid = [c / count for c in centroid]

        # Normalisasi L2
        norm = math.sqrt(sum(c * c for c in centroid))
        if norm > 0:
            centroid = [round(c / norm, 6) for c in centroid]

        centroids[nama] = centroid

    _CATEGORY_CENTROIDS = centroids
    return _CATEGORY_CENTROIDS


def classify_text(text: str) -> Dict[str, Any]:
    """
    Menerima deskripsi laporan, menghitung Cosine Similarity ke 7 centroid kategori,
    lalu mengembalikan kategori rekomendasi, skor confidence (0.00 - 1.00), dan detail ranking.
    """
    centroids = init_centroids()
    if not centroids:
        return {
            "kategori_rekomendasi": None,
            "confidence_score": 0.0,
            "all_scores": {},
            "embedding": [],
        }

    input_vector = get_embedding(text)

    raw_scores: Dict[str, float] = {}
    for nama_kategori, centroid_vec in centroids.items():
        sim = cosine_similarity(input_vector, centroid_vec)
        raw_scores[nama_kategori] = round(sim, 4)

    sorted_cats = sorted(raw_scores.items(), key=lambda item: item[1], reverse=True)
    best_cat, best_raw = sorted_cats[0]
    second_raw = sorted_cats[1][1] if len(sorted_cats) > 1 else 0.0

    # Jika teks tidak mengandung indikator apapun (semua kemiripan 0)
    if best_raw <= 0.01:
        return {
            "kategori_rekomendasi": best_cat,
            "confidence_score": 0.30,
            "all_scores": {k: 0.0 for k in raw_scores},
            "embedding": input_vector,
        }

    # Kalibrasi confidence score berbasis gap margin ke kategori kedua
    margin = max(0.0, best_raw - second_raw)
    calibrated_confidence = round(min(0.96, max(0.50, 0.50 + best_raw * 0.8 + margin * 0.4)), 2)

    return {
        "kategori_rekomendasi": best_cat,
        "confidence_score": calibrated_confidence,
        "all_scores": raw_scores,
        "embedding": input_vector,
    }

