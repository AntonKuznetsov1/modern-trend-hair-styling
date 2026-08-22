import smtplib
from email.mime.text import MIMEText

def send_system_email(subject: str, body: str):
    sender = "shop@moderntrend.com"
    recipient = "antonkuznetsov003@gmail.com"
    
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    # Uncomment and add real SMTP credentials for production
    print(f"DEBUG: Email intercepted and routed to {recipient}. Subject: {subject}")
    # with smtplib.SMTP("smtp.example.com", 587) as server:
    #     server.starttls()
    #     server.login(sender, "smtp_password")
    #     server.send_message(msg)