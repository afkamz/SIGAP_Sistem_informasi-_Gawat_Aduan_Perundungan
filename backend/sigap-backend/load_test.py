"""
Load test script untuk SIGAP API Performance Evaluation.
Menguji 3 endpoint kritis: auth login, buat pengaduan, inferensi NLP (klasifikasi).
"""
import httpx
import time
import statistics
import json
import asyncio

BASE_URL = "http://localhost:8000"
CONCURRENCY = 50  # simulasi 50 permintaan konkuren
ROUNDS = 3        # diulang 3 kali untuk stabilitas

# --- Data pengujian ---
LOGIN_PAYLOAD = {
    "username": "admin@sigap.sch.id",
    "password": "admin123"
}

PENGADUAN_PAYLOAD = {
    "judul": "Laporan Pengujian Performa",
    "deskripsi": "Saya sering diejek dan dihina oleh teman sekelas saya hampir setiap hari di sekolah.",
    "kategori_id": 1,
    "is_anonymous": True
}

# ------------------------------------------------------------------ #
async def fetch_once(client: httpx.AsyncClient, method: str, url: str,
                     json_data=None, token=None) -> dict:
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    t0 = time.perf_counter()
    try:
        if method == "POST":
            resp = await client.post(url, json=json_data, headers=headers, timeout=30)
        else:
            resp = await client.get(url, headers=headers, timeout=30)
        elapsed_ms = (time.perf_counter() - t0) * 1000
        return {"ok": resp.status_code < 400, "ms": elapsed_ms, "status": resp.status_code}
    except Exception as e:
        elapsed_ms = (time.perf_counter() - t0) * 1000
        return {"ok": False, "ms": elapsed_ms, "status": 0, "err": str(e)}


async def run_concurrent(label: str, method: str, url: str,
                         json_data=None, token=None, n: int = CONCURRENCY):
    async with httpx.AsyncClient() as client:
        tasks = [fetch_once(client, method, url, json_data, token) for _ in range(n)]
        results = await asyncio.gather(*tasks)

    times = [r["ms"] for r in results]
    successes = sum(1 for r in results if r["ok"])
    p50  = statistics.median(times)
    p95  = sorted(times)[int(len(times) * 0.95)]
    avg  = statistics.mean(times)
    success_rate = successes / n * 100

    print(f"\n[{label}]  n={n}")
    print(f"  avg={avg:.1f}ms  median={p50:.1f}ms  p95={p95:.1f}ms")
    print(f"  success={successes}/{n}  ({success_rate:.1f}%)")
    return {"label": label, "avg": avg, "median": p50, "p95": p95,
            "success_rate": success_rate, "n": n, "results": results}


async def main():
    print("=" * 60)
    print("SIGAP API Load Test — Performance Evaluation")
    print(f"Target: {BASE_URL}  |  Concurrency: {CONCURRENCY}")
    print("=" * 60)

    all_results = {}

    # 1. Health check
    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(f"{BASE_URL}/docs", timeout=5)
            print(f"\n[Health] Status: {r.status_code}")
        except Exception as e:
            print(f"\n[Health] GAGAL: {e}")
            return

    # 2. AUTH: Login siswa (endpoint non-NLP)
    login_url = f"{BASE_URL}/auth/siswa/login"
    login_payload = {"username": "testuser", "password": "testpass"}
    # gunakan admin login yang pasti ada
    admin_login_url = f"{BASE_URL}/api/auth/admin/login"

    # Dapatkan token dulu (1 request)
    token = None
    async with httpx.AsyncClient() as client:
        try:
            r = await client.post(admin_login_url,
                                  data={"username": "198001012026", "password": "admin123"},
                                  timeout=10)
            if r.status_code == 200:
                token = r.json().get("access_token")
                print(f"\n[Auth] Token berhasil didapat: {token[:20]}...")
            else:
                print(f"\n[Auth] Login gagal: {r.status_code} {r.text[:100]}")
        except Exception as e:
            print(f"\n[Auth] Exception: {e}")

    # 3. Load test: GET /auth/me (autentikasi JWT, tanpa NLP)
    if token:
        res = await run_concurrent("GET /api/auth/me (JWT Auth)", "GET",
                                   f"{BASE_URL}/api/auth/me", token=token)
        all_results["auth_me"] = res

    # 4. Load test: GET /api/pengaduan/kategori (endpoint ringan non-NLP)
    res = await run_concurrent("GET /api/pengaduan/kategori (List Kategori)", "GET",
                               f"{BASE_URL}/api/pengaduan/kategori")
    all_results["kategori"] = res

    # 5. Load test: POST /api/pengaduan (buat laporan — MENGANDUNG inferensi NLP)
    res = await run_concurrent("POST /api/pengaduan (Buat Laporan + Inferensi NLP)", "POST",
                               f"{BASE_URL}/api/pengaduan", json_data=PENGADUAN_PAYLOAD)
    all_results["pengaduan_nlp"] = res

    # 6. Load test: GET /api/pengaduan (list semua laporan — butuh auth admin)
    if token:
        res = await run_concurrent("GET /api/pengaduan (Daftar Laporan Admin)", "GET",
                                   f"{BASE_URL}/api/pengaduan", token=token)
        all_results["daftar_pengaduan"] = res

    # === RINGKASAN AKHIR ===
    print("\n" + "=" * 60)
    print("RINGKASAN HASIL LOAD TEST")
    print("=" * 60)
    for key, v in all_results.items():
        print(f"  {v['label'][:50]:50s}  avg={v['avg']:.1f}ms  p95={v['p95']:.1f}ms  OK={v['success_rate']:.1f}%")

    # Hitung aggregate
    overall_ok = sum(
        sum(1 for r in v["results"] if r["ok"])
        for v in all_results.values()
    )
    overall_total = sum(v["n"] for v in all_results.values())
    overall_rate = overall_ok / overall_total * 100

    all_avgs = [v["avg"] for v in all_results.values()]
    overall_avg = statistics.mean(all_avgs)

    nlp_avg = all_results.get("pengaduan_nlp", {}).get("avg", 0)
    auth_avg = all_results.get("auth_me", {}).get("avg", 0)

    print(f"\n  Total requests : {overall_total}")
    print(f"  Overall avg RT : {overall_avg:.1f} ms")
    print(f"  NLP endpoint   : {nlp_avg:.1f} ms")
    print(f"  Auth endpoint  : {auth_avg:.1f} ms")
    print(f"  Success rate   : {overall_rate:.2f}%")
    print("=" * 60)

    return all_results


if __name__ == "__main__":
    asyncio.run(main())
