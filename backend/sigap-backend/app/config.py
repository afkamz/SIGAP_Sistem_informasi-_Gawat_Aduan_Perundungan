from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Konfigurasi aplikasi, dibaca otomatis dari file .env dengan fallback default siap pakai."""

    # Default ke SQLite lokal agar langsung siap digunakan tanpa wajib menyalakan MySQL
    database_url: str = "sqlite:///./sigap.db"
    jwt_secret_key: str = "sigap_super_secret_jwt_key_lamongan_2026_change_in_production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 120

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
