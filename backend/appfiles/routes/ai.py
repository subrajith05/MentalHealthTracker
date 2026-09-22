from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, models, utils
from google import genai
from google.genai import types
import os

router = APIRouter(
    prefix="/ai",
    tags=["AI chatbot"]
)

client = genai.Client()

#Instructions for the LLM so that it sticks with the safety guiderails
instruction_prompt = """
ROLE & IDENTITY:
- You are a supportive, empathetic, and concise AI mental wellness assistant. 
- You are NOT a doctor, therapist, or licensed medical professional. 
- Never establish a clinical treatment contract or therapeutic relationship. If the user treats you like a real therapist, gently remind them you are an AI.

CRITICAL SAFETY PROTOCOL (CRISIS):
- If the user expresses active or passive thoughts of self-harm, suicide, or severe violence, immediately bypass your standard conversational style.
- Output exactly this phrase and nothing else: "I'm really concerned about what you're sharing. Please know you don't have to go through this alone. Reach out to a professional or a crisis line immediately: Call 112 or your local emergency services."

CLINICAL BOUNDARIES & PROHIBITIONS:
- DO NOT provide medical or psychological diagnoses.
- DO NOT suggest, evaluate, or give advice regarding specific psychiatric medications or alternative chemical treatments.
- DO NOT attempt heavy trauma processing or specialized therapeutic protocols (e.g., trying to conduct an active EMDR session).
- Permitted actions: Offer general psychoeducational insights, suggest basic mindfulness or deep breathing exercises, and provide behavioral coping strategies (e.g., journaling, progressive muscle relaxation).

TONE & CONVERSATIONAL STYLE:
- Speak like a helpful, grounded peer. Avoid cold, robotic lists ("Three factors are relevant. They are as follows:").
- Avoid toxic positivity. Do not tell a deeply hurting user to "just smile" or "look on the bright side." Validate their feeling first ("That sounds incredibly exhausting and heavy") before gently offering a small, low-effort wellness suggestion.
- Keep responses highly concise (under 3-4 sentences max per turn) to avoid overwhelming the user.
"""

CRISIS_RESPONSE = "I'm really concerned about what you're sharing. Please know you don't have to go through this alone. Reach out to a professional or a crisis line immediately: Call 112 or your local emergency services."

#Extra layer of security so that it can handle sensitive prompts effectively
safety_rules = [
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=types.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=types.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
    )
]

get_db = database.get_db

@router.post("/chat")
def chat(
    message: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(utils.get_current_user)
):
    user_input = message.get("message", "").strip()
    history = message.get("history", [])

    recent_checkins = (
        db.query(models.Moods)
        .filter(models.Moods.user_id == current_user.id)
        .order_by(models.Moods.timestamp.desc())
        .limit(7)
        .all()
    )

    mood_context = "\n".join([
        f"Mood : {c.mood}, Note : {c.note}"
        for c in recent_checkins
    ])

    contents_payload = []

    for msg in history:
        contents_payload.append(
            types.Content(
                role=msg["role"],
                parts=[
                    types.Part.from_text(
                        text=msg["content"]
                    )
                ]
            )
        )

    prompt = f"""
    <mood_history>
    {mood_context}
    </mood_history>

    <current_user_message>
    {user_input}
    </current_user_message>
    """


    contents_payload.append(
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt)
            ]
        )
    )

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=contents_payload,
            config=types.GenerateContentConfig(
                system_instruction=instruction_prompt,
                safety_settings=safety_rules,
                temperature=0.3
            )
        )

        if not response.candidates:
            return{
                'status': "crisis_triggered",
                'reply': CRISIS_RESPONSE
            }
        
        candidate = response.candidates[0]

        #If safety function is triggered due to sensitive prompt
        if candidate.finish_reason == types.FinishReason.SAFETY:
            return {
                'status': 'crisis_triggered',
                'reply': CRISIS_RESPONSE
            }
        
        #If the safety filters are somehow bypassed by manipulating prompts
        generated_text = response.text.strip()
        if generated_text == CRISIS_RESPONSE:
            return {
                'status': 'crisis_triggered',
                'reply': CRISIS_RESPONSE
            }
        
        #Standard response
        return {
            'status': 'success',
            'reply': response.text
        }
    
    except Exception as e:
        raise HTTPException(
            status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error has occured whille communicating with the AI service"
        )