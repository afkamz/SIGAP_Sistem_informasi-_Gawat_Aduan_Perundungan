from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# Jika database menggunakan SQLite, tambahkan check_same_thread: False untuk kompatibilitas multi-thread FastAPI
connect_args = {}
is_sqlite = settings.database_url.startswith("sqlite")
if is_sqlite:
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_pre_ping=not is_sqlite,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency FastAPI: buka session DB per-request, tutup otomatis setelah selesai."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
