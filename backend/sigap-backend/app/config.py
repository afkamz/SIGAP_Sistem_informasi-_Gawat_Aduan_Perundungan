from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Konfigurasi aplikasi, dibaca otomatis dari file .env dengan fallback default siap pakai."""

    # Default ke SQLite lokal agar langsung siap digunakan tanpa wajib menyalakan MySQL
    database_url: str = "sqlite:///./sigap.db"
    jwt_secret_key: str = "sigap_super_secret_jwt_key_lamongan_2026_change_in_production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 120

    # CORS — comma-separated list origin yang diizinkan.
    # Development: localhost Vite & Uvicorn. Production: ganti ke domain frontend resmi.
    # Jika kosong atau "*", backend akan membuka wildcard (hanya untuk dev darurat).
    allowed_origins: str = "http://localhost:5173,http://localhost:8000,http://127.0.0.1:5173,http://127.0.0.1:8000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    def get_allowed_origins(self) -> list[str]:
        """Parse ALLOWED_ORIGINS dari string CSV menjadi list. Mendukung wildcard '*'."""
        if not self.allowed_origins or self.allowed_origins.strip() == "*":
            return ["*"]
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()
