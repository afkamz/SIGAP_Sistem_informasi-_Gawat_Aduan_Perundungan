"""
Modul klasterisasi kejadian berulang / anomali laporan berbasis HDBSCAN
(dengan adaptif Density/Distance Graph clustering fallback).
"""
import math
from typing import List, Dict, Any, Optional

from app.ai.embedder import cosine_similarity

HAS_HDBSCAN = False
try:
    import hdbscan
    HAS_HDBSCAN = True
except ImportError:
    HAS_HDBSCAN = False


def _hdbscan_clustering(embeddings: List[List[float]]) -> List[int]:
    """Klasterisasi menggunakan library HDBSCAN jika tersedia."""
    clusterer = hdbscan.HDBSCAN(min_cluster_size=2, min_samples=1, metric="euclidean")
    labels = clusterer.fit_predict(embeddings)
    return [int(l) for l in labels]


def _density_clustering_fallback(embeddings: List[List[float]], threshold: float = 0.50) -> List[int]:
    """
    Algoritma klasterisasi berbasis kepadatan densitas graf & threshold Cosine Similarity.
    Dua laporan dianggap dalam klaster yang sama jika kemiripannya >= threshold.
    Laporan terisolasi tanpa tetangga dekat diberi label -1 (Noise / Outlier).
    """
    n = len(embeddings)
    if n == 0:
        return []
    if n == 1:
        return [-1]  # Satu laporan tunggal selalu dianggap noise (belum ada pola berulang)

    # Bangun graf ketetanggaan (Adjacency list)
    adj = {i: [] for i in range(n)}
    for i in range(n):
        for j in range(i + 1, n):
            sim = cosine_similarity(embeddings[i], embeddings[j])
            if sim >= threshold:
                adj[i].append(j)
                adj[j].append(i)

    # Identifikasi komponen terhubung (Connected Components)
    labels = [-1] * n
    visited = [False] * n
    current_cluster_id = 0

    for i in range(n):
        if not visited[i] and len(adj[i]) > 0:
            # Temukan semua anggota kelompok via BFS
            cluster_members = []
            queue = [i]
            visited[i] = True

            while queue:
                curr = queue.pop(0)
                cluster_members.append(curr)
                for neighbor in adj[curr]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        queue.append(neighbor)

            # Hanya bentuk klaster jika ada minimal 2 laporan berdekatan
            if len(cluster_members) >= 2:
                for member in cluster_members:
                    labels[member] = current_cluster_id
                current_cluster_id += 1

    return labels


def cluster_reports(existing_embeddings: List[List[float]], new_embedding: List[List[float]] | None = None) -> List[Dict[str, Any]]:
    """
    Menerima daftar vektor embedding laporan, menghasilkan penandaan klaster.
    Setiap elemen mengembalikan:
    - cluster_label: ID klaster (0, 1, 2, ...) atau None
    - is_noise: True jika outlier / kejadian berdiri sendiri, False jika bagian dari pola berulang
    """
    all_embeddings = list(existing_embeddings)
    if new_embedding:
        all_embeddings.extend(new_embedding)

    if not all_embeddings:
        return []

    if HAS_HDBSCAN:
        try:
            raw_labels = _hdbscan_clustering(all_embeddings)
        except Exception:
            raw_labels = _density_clustering_fallback(all_embeddings)
    else:
        raw_labels = _density_clustering_fallback(all_embeddings)

    results = []
    for lbl in raw_labels:
        if lbl == -1:
            results.append({"cluster_label": None, "is_noise": True})
        else:
            results.append({"cluster_label": lbl, "is_noise": False})

    return results


def evaluate_single_report_cluster(new_embedding: List[float], existing_embeddings: List[List[float]]) -> Dict[str, Any]:
    """
    Mengevaluasi posisi sebuah laporan baru terhadap kumpulan embedding laporan terdahulu.
    """
    if not existing_embeddings:
        return {"cluster_label": None, "is_noise": True}

    all_embs = existing_embeddings + [new_embedding]
    clustered = cluster_reports(all_embs)
    return clustered[-1]
