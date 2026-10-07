#!/bin/bash
# sigap-dev.sh — Script development SIGAP
# Jalankan: ./sigap-dev.sh
# Kemudian edit kode bebas:
#   - Backend (.py): auto reload via uvicorn --reload ✅
#   - Frontend (.jsx/.tsx): ketik 'b' lalu Enter untuk build, lalu refresh browser

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_DIR/Frontend"

echo "🛡️  SIGAP Dev Helper"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Backend  → http://localhost:8000/docs  (auto-reload ✅)"
echo "🌐 Frontend → http://localhost:3000       (build dulu lalu refresh)"
echo "🗄️  PhpMyAdmin → http://localhost:8080"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Ketik perintah:"
echo "  b  → Build frontend & langsung live di :3000"
echo "  w  → Watch mode: auto build setiap ada perubahan file"
echo "  q  → Keluar"
echo ""

while true; do
  read -rp "sigap> " cmd
  case "$cmd" in
    b)
      echo "⚙️  Building frontend..."
      cd "$FRONTEND_DIR" && npm run build
      echo "✅ Done! Refresh browser di http://localhost:3000"
      ;;
    w)
      echo "👀 Watch mode aktif — build otomatis setiap ada perubahan .jsx/.tsx/.css"
      echo "   Tekan Ctrl+C untuk berhenti."
      cd "$FRONTEND_DIR" && npx vite build --watch
      ;;
    q|exit|quit)
      echo "👋 Keluar."
      break
      ;;
    *)
      echo "Perintah tidak dikenal. Ketik b, w, atau q."
      ;;
  esac
done

