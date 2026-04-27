import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extracts text from a given PDF file."""
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def determine_resume_fit(job_description: str) -> dict:
    """
    Placeholder logic for the 'Picker'.
    Takes a Job Description and determines Language and Stack.
    """
    # TODO: Connect to Gemini for extraction or use Regex
    lang = "DE" if "deutsch" in job_description.lower() else "EN"
    stack = ".Net" if ".net" in job_description.lower() else "JS"
    
    return {
        "lang": lang,
        "stack": stack,
        "resume_path": f"./resumes/resume_{lang}_{stack}.pdf"
    }
