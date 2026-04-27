import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY and API_KEY != "your_api_key_here":
    genai.configure(api_key=API_KEY)
else:
    print("WARNING: Gemini API Key not set. AI features will not work.")

def classify_job_description(job_desc_text: str) -> dict:
    """
    Reads a job description and outputs a JSON containing lang, stack, fit_score, and reason.
    Returns: { "lang": "DE", "stack": ".Net", "fit_score": 92, "reason": "..." }
    """
    if not API_KEY or API_KEY == "your_api_key_here":
        # Fallback or mock if no key
        return { "lang": "EN", "stack": "JS", "fit_score": 85, "reason": "API Key missing, mock score." }
    
    prompt = f"""
    Analyze the following Job Description and extract the key information.
    Determine the primary language required (DE or EN).
    Determine the primary tech stack (.Net or JS/React).
    Give a fit score out of 100 based on a generic full-stack developer profile, and a brief reason.
    Return strictly a JSON object with keys: lang, stack, fit_score, reason.
    
    Job Description:
    {job_desc_text}
    """
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        import json
        # Clean up possible markdown code blocks in the response
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return { "lang": "EN", "stack": "JS", "fit_score": 0, "reason": f"Error: {str(e)}" }
