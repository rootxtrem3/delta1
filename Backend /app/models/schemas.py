from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")
    sleep_records = relationship("SleepData", back_populates="user", cascade="all, delete-orphan")
    mood_logs = relationship("MoodLog", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    devices = relationship("WearableDevice", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("WeeklyReport", back_populates="user", cascade="all, delete-orphan")

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    activity_type = Column(String, nullable=False) # e.g., "running", "productivity_session"
    duration_minutes = Column(Integer, nullable=False)
    calories_burned = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="activities")

class SleepData(Base):
    __tablename__ = "sleep_data"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    deep_sleep_minutes = Column(Integer, default=0)
    rem_sleep_minutes = Column(Integer, default=0)
    sleep_score = Column(Integer, nullable=True)

    user = relationship("User", back_populates="sleep_records")

class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    mood_score = Column(Integer, nullable=False) # 1-10 Scale
    emotional_entry = Column(Text, nullable=True) # Encrypted string can reside here
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="mood_logs")

class Goal(Base):
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title = Column(String, nullable=False)
    target_value = Column(Float, nullable=False)
    current_value = Column(Float, default=0.0)
    is_ai_generated = Column(Boolean, default=False)
    forecasted_completion_date = Column(DateTime, nullable=True)
    status = Column(String, default="active") # active, completed, failed

    user = relationship("User", back_populates="goals")

class WearableDevice(Base):
    __tablename__ = "wearable_devices"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    device_uuid = Column(String, unique=True, index=True)
    device_type = Column(String, nullable=False) # e.g., "Fitbit", "AppleWatch", "BLE-Mock"
    is_connected = Column(Boolean, default=True)

    user = relationship("User", back_populates="devices")
    telemetry_streams = relationship("TelemetryStream", back_populates="device", cascade="all, delete-orphan")

class TelemetryStream(Base):
    __tablename__ = "telemetry_streams"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("wearable_devices.id", ondelete="CASCADE"), index=True)
    heart_rate = Column(Integer, nullable=True)
    step_count = Column(Integer, default=0)
    spo2 = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    device = relationship("WearableDevice", back_populates="telemetry_streams")

class AIInsight(Base):
    __tablename__ = "ai_insights"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    insight_type = Column(String, index=True) # "alert", "recommendation", "behavioral_shift"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class WeeklyReport(Base):
    __tablename__ = "weekly_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    wellness_score = Column(Integer, nullable=False)
    trend_analytics = Column(Text, nullable=False) # Structured JSON string representation

    user = relationship("User", back_populates="reports")