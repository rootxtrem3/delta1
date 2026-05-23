from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schemas import TelemetryStream, WearableDevice
import json
import logging

router = APIRouter(prefix="/v1/telemetry", tags=["Telemetry & IoT Pipeline"])

@router.websocket("/ws/{device_uuid}")
async def telemetry_stream_endpoint(websocket: WebSocket, device_uuid: str, db: Session = Depends(get_db)):
    await websocket.accept()
    
    # Verify hardware binding configuration
    device = db.query(WearableDevice).filter(WearableDevice.device_uuid == device_uuid).first()
    if not device:
        await websocket.send_text(json.dumps({"error": "Device unauthorized or unregistered"}))
        await websocket.close()
        return

    try:
        while True:
            # Receive real-time mock data payload from Flutter/BLE bridge
            raw_data = await websocket.receive_text()
            payload = json.loads(raw_data)
            
            # Normalize tracking fields
            telemetry_entry = TelemetryStream(
                device_id=device.id,
                heart_rate=payload.get("heart_rate"),
                step_count=payload.get("step_count", 0),
                spo2=payload.get("spo2"),
            )
            
            db.add(telemetry_entry)
            db.commit()
            
            # Immediate confirmation back to the frontend channel
            await websocket.send_json({"status": "processed", "device_uuid": device_uuid})
            
    except WebSocketDisconnect:
        logging.warning(f"Device stream disconnected: {device_uuid}")