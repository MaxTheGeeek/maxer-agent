import os
from jinja2 import Environment, FileSystemLoader

# Set up Jinja2 environment
template_dir = os.path.join(os.path.dirname(__file__), '..', 'templates')
# Ensure templates directory exists
os.makedirs(template_dir, exist_ok=True)

env = Environment(loader=FileSystemLoader(template_dir))

def generate_cover_letter(template_name: str, context: dict) -> str:
    """
    Generates a cover letter from a Jinja2 template.
    """
    try:
        template = env.get_template(template_name)
        return template.render(context)
    except Exception as e:
        print(f"Error rendering template: {e}")
        return ""
