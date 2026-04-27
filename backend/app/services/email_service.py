import smtplib
from email.message import EmailMessage
import os

def send_application_email(to_email: str, subject: str, body: str, attachments: list[str]):
    """
    Sends an email application via SMTP.
    """
    # Use environment variables for SMTP configuration
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER", "your_email@gmail.com")
    smtp_pass = os.getenv("SMTP_PASS", "your_app_password")

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg.set_content(body)

    for file_path in attachments:
        try:
            with open(file_path, 'rb') as f:
                file_data = f.read()
                file_name = os.path.basename(file_path)
            msg.add_attachment(file_data, maintype='application', subtype='pdf', filename=file_name)
        except Exception as e:
            print(f"Error attaching file {file_path}: {e}")

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            print("Email sent successfully!")
            return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
