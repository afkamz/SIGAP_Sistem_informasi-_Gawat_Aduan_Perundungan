"""
Pembersihan dan normalisasi teks pengaduan bahasa Indonesia
"""
import re
import string

# Kamus normalisasi kata slang / singkatan umum dalam konteks kekerasan & sekolah
SLANG_MAP = {
    "yg": "yang",
    "dgn": "dengan",
    "tdk": "tidak",
    "nggak": "tidak",
    "gak": "tidak",
    "ga": "tidak",
    "kalo": "kalau",
    "kl": "kalau",
    "bgt": "banget",
    "bgt2": "banget",
    "udh": "sudah",
    "udah": "sudah",
    "blm": "belum",
    "krn": "karena",
    "tp": "tapi",
    "sm": "sama",
    "bkn": "bukan",
    "org": "orang",
    "bapak": "ayah",
    "bapake": "ayah",
    "grup": "kelompok",
    "wa": "whatsapp",
    "medsos": "media sosial",
    "di bully": "dibully",
    "dipalak": "diperas",
    "malak": "memeras",
    "mukulin": "memukul",
    "pukulin": "memukul",
    "nendang": "menendang",
    "dianiaya": "dianiaya",
    "dijauhi": "dikucilkan",
    "dijauhin": "dikucilkan",
}


def preprocess_text(text: str) -> str:
    """
    Membersihkan teks input dari spasi berlebih, URL, karakter khusus,
    dan melakukan case folding serta normalisasi kata singkatan.
    """
    if not text:
        return ""

    # 1. Lowercase
    text = text.lower().strip()

    # 2. Hapus URL / Link
    text = re.sub(r"https?://\S+|www\.\S+", "", text)

    # 3. Hapus mention dan hashtag
    text = re.sub(r"[@#]\w+", "", text)

    # 4. Hapus karakter berulang lebih dari 2 kali (contoh: "pukullaaaa" -> "pukul")
    text = re.sub(r"(.)\1{2,}", r"\1", text)

    # 5. Hapus tanda baca kecuali spasi
    text = text.translate(str.maketrans("", "", string.punctuation))

    # 6. Normalisasi token slang
    tokens = text.split()
    normalized_tokens = [SLANG_MAP.get(token, token) for token in tokens]

    cleaned_text = " ".join(normalized_tokens)
    return cleaned_text

