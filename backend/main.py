import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
from google import genai

# 1. .env file se saare tokens aur links load karna
load_dotenv()

# 2. Supabase aur Gemini Clients ko initialize karna
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
ai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# 3. 🔒 CORS MIDDLEWARE (Poora Open - Allow All Origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# 4. DATA SCHEMAS (Validation ke liye)
class SymptomInput(BaseModel):
    symptoms: str
    age: int
    gender: str

# 5. HEALTH CHECK ROUTES
@app.get("/")
def read_root():
    return {"message": "Welcome to Varg Medical Platform Backend!"}

@app.get("/status")
def health_check():
    return {"status": "healthy", "database": "connected_to_supabase_gateway"}

# 6. 🤖 FEATURE 1: AI Symptom Checker & Database Save Route
@app.post("/api/analyze-symptoms")
def analyze_symptoms(data: SymptomInput):
    try:
        prompt = f"""
        You are an expert AI Medical Assistant for 'Varg Medical Platform'. 
        Analyze the following user health details:
        Age: {data.age}
        Gender: {data.gender}
        Symptoms described: {data.symptoms}

        Provide a structured response in plain text with the following sections:
        1. PRELIMINARY ASSESSMENT: What could be the possible causes (mention 2-3 general possibilities).
        2. RECOMMENDED NEXT STEPS: What type of specialist doctor they should consult.
        3. HOME CARE & CAUTION: General non-prescription advice and what symptoms to watch out for.
        4. MANDATORY DISCLAIMER: State clearly that this is an AI analysis, not a final medical diagnosis.
        """

        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        ai_analysis = response.text

        db_data = {
            "age": data.age,
            "gender": data.gender,
            "symptoms": data.symptoms,
            "analysis": ai_analysis
        }
        supabase.table("symptom_logs").insert(db_data).execute()
        
        return {"analysis": ai_analysis}

    except Exception as e:
        print(f"🔥 AI/DATABASE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database/AI Error: {str(e)}")

# 7. 🩸 FEATURE 2: Blood Bank Locator API Route
@app.get("/api/blood-banks")
def get_blood_banks(blood_group: str = None):
    try:
        if blood_group:
            search_query = f"%{blood_group}%"
            response = supabase.table("blood_banks")\
                .select("*")\
                .ilike("blood_groups", search_query)\
                .execute()
        else:
            response = supabase.table("blood_banks").select("*").execute()
            
        return response.data

    except Exception as e:
        print(f"🔥 BLOOD BANK ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

# 8. 👨‍⚕️ FEATURE 3: Doctor List & Specialty Filter API Route
@app.get("/api/doctors")
def get_doctors(specialty: str = None):
    try:
        if specialty:
            response = supabase.table("doctors")\
                .select("*")\
                .ilike("specialty", f"%{specialty}%")\
                .execute()
        else:
            response = supabase.table("doctors").select("*").execute()
            
        return response.data

    except Exception as e:
        print(f"🔥 DOCTOR MODULE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")