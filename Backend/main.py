from fastapi import FastAPI
from app.core.database import Base, engine
from app.routers import telemetry, auth

# Initialize structural migration schemas inline for prototype staging 
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Wellness Platform Telemetry Core API",
    version="1.0.0",
    description="Scalable mobile edge computation routing system engine."
)

# Active Route Formations
app.include_router(auth.router)
app.include_router(telemetry.router)

@app.get("/")
def health_check():
    return {"status": "operational", "engine": "SQLite WAL Mode Enabled"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)