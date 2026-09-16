# Design System --- SIGAP

## 1. Design System Goal

Design System SIGAP dibuat untuk menjaga konsistensi visual antara
aplikasi siswa dan dashboard admin, dengan karakter: - Aman. - Bersih. -
Formal. - Mudah dipahami. - Tidak menimbulkan kesan menghakimi. -
Konsisten antara data AI dan keputusan manusia.

## 2. Brand/UI Foundation

### Primary Color

**Baby Blue:** `#A7D8F0`

Digunakan untuk: - Primary button. - Active link. - Active tab. - Focus
border. - Progress indicator aktif. - Elemen interaktif utama.

### Base

**White:** `#FFFFFF`

Digunakan sebagai background utama.

### Neutral

Digunakan untuk: - Teks utama. - Teks sekunder. - Border. - Data
referensi. - State disabled.

### Semantic Status

-   Menunggu → neutral gray.
-   Diverifikasi → baby blue.
-   Ditindaklanjuti → darker blue.
-   Selesai → green outline.
-   Perlu Peninjauan Manual → amber/orange sebagai warning.

## 3. Typography

Gunakan sans-serif yang bersih.

### Hierarchy

``` text
H1 — halaman utama
H2 — section
H3 — card/subsection
Body — informasi utama
Caption — helper text
```

Prinsip: - Judul singkat. - Label jelas. - Bahasa Indonesia formal. -
Hindari jargon teknis pada sisi siswa.

## 4. Spacing

Gunakan spacing system berbasis kelipatan 4/8px.

Contoh: - 4px --- icon gap kecil. - 8px --- label/input. - 16px ---
antar komponen. - 24px --- antar section. - 32px --- section utama.

## 5. Shape

-   Border radius: 8--12px.
-   Card: radius 10--12px.
-   Button: radius 8--12px.
-   Input: radius 8px.
-   Shadow: subtle.
-   Tidak menggunakan neumorphism.

## 6. Button

### Primary

Baby blue background, teks gelap.

Contoh: - Masuk. - Daftar. - Lanjut. - Kirim Laporan. - Setujui Kategori
Ini.

### Secondary

Outline dengan baby blue.

Contoh: - Kembali. - Pilih Kategori Lain.

### Text Button

Untuk: - Batal. - Kembali ke Beranda. - Buka Detail.

## 7. Input

Input wajib memiliki: - Label. - Placeholder jika diperlukan. - Focus
state. - Error state. - Helper text bila dibutuhkan.

Focus: - Border baby blue.

Error: - Border/status semantic warning/error dengan pesan yang jelas.

## 8. Card

Card digunakan untuk: - Riwayat laporan. - Summary statistic. - Analisis
AI. - Laporan terkait. - Informasi ticket.

Struktur:

``` text
Title
Supporting information
Main value/status
Optional action
```

## 9. Badge

### Data Source

-   **Data Aktif:** baby blue.
-   **Data Referensi:** neutral gray.

### Status

Gunakan status visual yang sama pada siswa dan admin.

### AI

Sebelum validasi: - Outline badge. - "Direkomendasikan AI".

Sesudah validasi: - Tampilkan sebagai kategori final. - Audit trail
mencatat sumber keputusan.

## 10. Progress & Timeline

Student status:

``` text
● Menunggu
│
● Diverifikasi
│
● Ditindaklanjuti
│
● Selesai
```

Admin state machine menggunakan pola yang sama tetapi hanya state
berikutnya yang dapat dipilih.

## 11. Navigation

### Student

Bottom navigation: 1. Beranda 2. Buat Laporan 3. Riwayat 4. Profil

### Admin

Sidebar: 1. Dashboard 2. Daftar Laporan 3. Validasi AI 4. Audit Trail 5.
Pengaturan

## 12. Charts

### Trend

"Tren Kasus per Bulan" - Data internal. - Data referensi. - Baby blue
untuk internal. - Gray dashed untuk reference.

### Distribution

"Distribusi per Kategori" - 7 kategori. - Flat chart. - Label harus
mudah dibaca.

## 13. AI Components

### Recommendation Card

``` text
Analisis AI

Rekomendasi Kategori
Perundungan Fisik
87%

[Setujui Kategori Ini]
[Pilih Kategori Lain]
```

### Low Confidence

``` text
Perlu Peninjauan Manual
Confidence di bawah threshold.
```

### Cluster Card

``` text
Deteksi Klaster

Terdeteksi 3 laporan lain
dengan pola serupa.

[Lihat Laporan Terkait]
```

## 14. Responsive Design

### Student Mobile

-   Mobile-first.
-   One-column.
-   Sticky/accessible primary action.
-   Bottom navigation.

### Admin Desktop

-   Sidebar.
-   Table.
-   Dashboard cards.
-   Two-column detail view.

Pada layar kecil admin, tabel dapat berubah menjadi card/list view.

## 15. Accessibility

-   Jangan menggunakan warna sebagai satu-satunya indikator.
-   Sertakan teks pada status.
-   Gunakan icon dengan label/tooltip.
-   Pastikan focus state terlihat.
-   Gunakan dark text di atas baby blue.
-   Hindari gradient.
-   Pastikan komponen dapat digunakan dengan keyboard pada desktop.

## 16. Content Guidelines

### Student

Nada: - Tenang. - Aman. - Tidak menghakimi. - Ringkas.

Contoh: \> "Ceritamu akan dibaca dengan hati-hati dan rahasia."

### Admin

Nada: - Formal. - Operasional. - Berbasis data.

Contoh: \> "Perlu Peninjauan Manual"

## 17. Component Inventory

  Component             Student   Admin
  ------------------- --------- -------
  Button                      ✓       ✓
  Input                       ✓       ✓
  Select                      ✓       ✓
  Badge                       ✓       ✓
  Card                        ✓       ✓
  Timeline                    ✓       ✓
  Stepper                     ✓       ✓
  Table                     ---       ✓
  Chart                     ---       ✓
  AI Recommendation         ---       ✓
  Cluster Panel             ---       ✓
  Audit Table               ---       ✓

## 18. Design Rules

1.  White background sebagai foundation.
2.  Baby blue sebagai accent utama.
3.  Tidak menggunakan gradient.
4.  AI suggestion harus berbeda secara visual dari keputusan final.
5.  Data referensi harus berbeda dari data aktif.
6.  Status konsisten pada seluruh layar.
7.  Siswa menggunakan flow mobile-first.
8.  Admin menggunakan dashboard desktop-first.
9.  Semua perubahan penting dicatat secara sistem.
