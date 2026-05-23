import httpx
import os
from typing import Dict, Any
from app.core.config import settings # Config file containing API tokens

class GeminiOrchestrator:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.api_key}"

    async def generate_structured_wellness_insight(self, metrics_summary: Dict[str, Any]) -> str:
        """
        Sends aggregated health metrics downstream to Gemini with precise context wrappers.
        """
        if not self.api_key:
            return "Fallback insight: Maintain your consistent tracking intervals."

        prompt = (
            f"Analyze the following health telemetry parameters and return a definitive, actionable, "
            f"single-sentence behavioral micro-goal: {json.dumps(metrics_summary)}"
        )

        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.2, # Lower variance for clinical/behavioral correctness
                "maxOutputTokens": 150
            }
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.endpoint, json=payload, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    return data['candidates'][0]['content']['parts'][0]['text']
            except Exception:
                pass
            
            return "Prioritize dynamic zone training patterns tomorrow."