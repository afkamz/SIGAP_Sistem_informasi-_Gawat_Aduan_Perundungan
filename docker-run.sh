#!/usr/bin/env bash
# ============================================================
# docker-run.sh — Skrip untuk menjalankan SIGAP via Docker
# ============================================================
# Cara pakai:
#   ./docker-run.sh          → jalankan semua service
#   ./docker-run.sh stop     → matikan semua service
#   ./docker-run.sh restart  → restart semua service
#   ./docker-run.sh logs     → lihat log semua service
#   ./docker-run.sh status   → lihat status container
#   ./docker-run.sh clean    → matikan + hapus volume (RESET DB)
# ============================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# ── Deteksi path docker (Docker Desktop Mac) ─────────────────
DOCKER_BIN=""
for candidate in docker \
    /usr/local/bin/docker \
    /Applications/Docker.app/Contents/Resources/bin/docker \
    "$HOME/.docker/bin/docker"; do
  if command -v "$candidate" &>/dev/null 2>&1 || [ -x "$candidate" ]; then
    DOCKER_BIN="$candidate"
    break
  fi
done

if [ -z "$DOCKER_BIN" ]; then
  echo -e "${RED}❌  Docker tidak ditemukan. Pastikan Docker Desktop sudah terinstall dan berjalan.${NC}"
  exit 1
fi

COMPOSE="$DOCKER_BIN compose"

# ── Warna output ─────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

print_banner() {
  echo -e "${CYAN}"
  echo "╔══════════════════════════════════════════════════╗"
  echo "║   SIGAP — Sistem Informasi Gawat Aduan Perundungan  ║"
  echo "╚══════════════════════════════════════════════════╝"
  echo -e "${NC}"
}

print_urls() {
  echo -e "${GREEN}✅  Semua service berhasil dijalankan!${NC}"
  echo ""
  echo -e "  ${CYAN}🌐  Frontend     ${NC}→ http://localhost:3000"
  echo -e "  ${CYAN}⚡  Backend API  ${NC}→ http://localhost:8000"
  echo -e "  ${CYAN}📖  API Docs     ${NC}→ http://localhost:8000/docs"
  echo -e "  ${CYAN}🗄️   phpMyAdmin   ${NC}→ http://localhost:8080"
  echo ""
  echo -e "  Hentikan dengan: ${YELLOW}./docker-run.sh stop${NC}"
}

CMD="${1:-up}"

case "$CMD" in

  up|start|"")
    print_banner
    echo -e "${YELLOW}⏳  Membangun image dan menjalankan service...${NC}"
    $COMPOSE up --build -d
    echo ""
    # Tunggu backend sehat sebentar
    echo -e "${YELLOW}⏳  Menunggu backend siap (maks 60 detik)...${NC}"
    for i in $(seq 1 12); do
      if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}  Backend siap!${NC}"
        break
      fi
      sleep 5
      echo -ne "  Mencoba... ($((i*5))s)\r"
    done
    echo ""
    # Auto-seed data awal (idempotent, aman dijalankan berulang)
    echo -e "${YELLOW}🌱  Mengisi data awal (akun demo + kategori)...${NC}"
    $DOCKER_BIN exec sigap-backend python -m app.seed_kategori 2>&1 | sed 's/^/  /'
    echo ""
    print_urls
    ;;

  stop|down)
    echo -e "${YELLOW}🛑  Menghentikan semua service SIGAP...${NC}"
    $COMPOSE down
    echo -e "${GREEN}✅  Semua container dihentikan.${NC}"
    ;;

  restart)
    echo -e "${YELLOW}🔄  Merestart semua service...${NC}"
    $COMPOSE down
    $COMPOSE up --build -d
    echo ""
    print_urls
    ;;

  logs)
    SERVICE="${2:-}"
    echo -e "${CYAN}📋  Menampilkan log... (Ctrl+C untuk keluar)${NC}"
    $COMPOSE logs -f $SERVICE
    ;;

  status|ps)
    echo -e "${CYAN}📊  Status container SIGAP:${NC}"
    $COMPOSE ps
    ;;

  seed)
    echo -e "${YELLOW}🌱  Menjalankan seed data (kategori, akun demo)...${NC}"
    $DOCKER_BIN exec sigap-backend python -m app.seed_kategori
    echo -e "${GREEN}✅  Selesai!${NC}"
    ;;

  clean)
    echo -e "${RED}⚠️  PERINGATAN: Ini akan menghapus semua container DAN data database (volume)!${NC}"
    read -p "   Ketik 'ya' untuk melanjutkan: " confirm
    if [[ "$confirm" == "ya" ]]; then
      $COMPOSE down -v --remove-orphans
      echo -e "${GREEN}✅  Semua container dan volume dihapus. Database di-reset.${NC}"
    else
      echo "Dibatalkan."
    fi
    ;;

  *)
    echo "Perintah tidak dikenal: $1"
    echo ""
    echo "Penggunaan: ./docker-run.sh [up|stop|restart|logs|status|seed|clean]"
    exit 1
    ;;
esac
