"""
Modul ekstraksi vektor embedding untuk sistem SIGAP.
Mendukung:
1. IndoBERT Pretrained Transformer (jika library torch & transformers tersedia)
2. Indonesian Linguistic Stemmed TF-IDF Vectorizer (high-precision fallback berbasis korpus 7 kategori)
"""
import json
import math
import re
from pathlib import Path
from typing import List, Dict, Tuple
from collections import Counter

from app.ai.preprocessor import preprocess_text

HAS_TRANSFORMERS = False
try:
    import torch
    from transformers import AutoTokenizer, AutoModel
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

_tokenizer = None
_model = None
_MODEL_NAME = "indobenchmark/indobert-base-p1"

# Struktur kamus korpus untuk vectorizer linguistik
_VOCAB: Dict[str, int] = {}
_IDF: Dict[str, float] = {}
_IS_INITIALIZED = False


def _stem_indonesian(w: str) -> str:
    """Stemmer kata bahasa Indonesia ringan untuk mencocokkan kata dasar kekerasan."""
    w = w.lower().strip()
    if len(w) <= 3:
        return w

    for prefix in ["meng", "meny", "men", "mem", "me", "di", "ber", "ter", "se", "ke"]:
        if w.startswith(prefix) and len(w) - len(prefix) >= 3:
            w = w[len(prefix):]
            break

    for suffix in ["nya", "kan", "lah", "kah", "i", "an"]:
        if w.endswith(suffix) and len(w) - len(suffix) >= 3:
            w = w[:-len(suffix)]
            break

    return w


def _init_linguistic_model():
    """Membangun kosakata dan bobot IDF dari seed narasi 7 kategori."""
    global _VOCAB, _IDF, _IS_INITIALIZED
    if _IS_INITIALIZED:
        return

    # Lokasi dataset seed
    candidates = [
        Path(__file__).resolve().parent.parent.parent.parent / "dataset" / "seed_narasi_7_kategori.json",
        Path("/home/afkam/Downloads/tes/dataset/seed_narasi_7_kategori.json"),
    ]

    seed_path = None
    for p in candidates:
        if p.exists():
            seed_path = p
            break

    if not seed_path:
        _IS_INITIALIZED = True
        return

    with open(seed_path, "r", encoding="utf-8") as f:
        categories = json.load(f)

    df = Counter()
    total_docs = sum(len(c["contoh"]) for c in categories)

    for cat in categories:
        for ex in cat["contoh"]:
            cleaned = preprocess_text(ex)
            tokens = set(_stem_indonesian(t) for t in re.findall(r"\w+", cleaned) if len(t) > 2)
            for t in tokens:
                df[t] += 1
                if t not in _VOCAB:
                    _VOCAB[t] = len(_VOCAB)

    for t, count in df.items():
        _IDF[t] = math.log((total_docs + 1) / (count + 1)) + 1.0

    _IS_INITIALIZED = True


def _linguistic_embedding(text: str) -> List[float]:
    """Ekstraksi vektor embedding dari token teks dengan pembobotan IDF terkalibrasi."""
    _init_linguistic_model()
    dim = len(_VOCAB)
    if dim == 0:
        return [0.0] * 64

    vec = [0.0] * dim
    cleaned = preprocess_text(text)
    tokens = [_stem_indonesian(t) for t in re.findall(r"\w+", cleaned)]

    for t in tokens:
        if t in _VOCAB:
            vec[_VOCAB[t]] += _IDF.get(t, 1.0)

    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        return [round(x / norm, 6) for x in vec]
    return vec


def _init_indobert():
    """Inisialisasi IndoBERT jika library tersedia."""
    global _tokenizer, _model
    if HAS_TRANSFORMERS and _tokenizer is None:
        try:
            _tokenizer = AutoTokenizer.from_pretrained(_MODEL_NAME)
            _model = AutoModel.from_pretrained(_MODEL_NAME)
            _model.eval()
        except Exception:
            _tokenizer = None
            _model = None


def get_embedding(text: str) -> List[float]:
    """
    Ekstraksi representasi vektor embedding dari teks narasi pengaduan.
    """
    _init_indobert()

    if HAS_TRANSFORMERS and _model is not None and _tokenizer is not None:
        try:
            inputs = _tokenizer(text, return_tensors="pt", truncation=True, max_length=256, padding=True)
            with torch.no_grad():
                outputs = _model(**inputs)
                embeddings = outputs.last_hidden_state.mean(dim=1).squeeze().tolist()
                norm = math.sqrt(sum(v * v for v in embeddings))
                return [round(v / norm, 6) for v in embeddings] if norm > 0 else embeddings
        except Exception:
            pass

    return _linguistic_embedding(text)


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """
    Menghitung kemiripan kosinus (Cosine Similarity) antara dua vektor:
    cos(theta) = (A . B) / (||A|| * ||B||)
    """
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0

    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))

    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0

    sim = dot / (norm_a * norm_b)
    return max(-1.0, min(1.0, sim))

