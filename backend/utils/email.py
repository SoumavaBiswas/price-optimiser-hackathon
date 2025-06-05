"""
This module provides utility functions for sending emails.
Functions:
    send_verification_email(to_email: str, token: str):
Environment Variables:
    SENDER_EMAIL: The email address used to send emails.
    SENDER_EMAIL_PASSWORD: The password for the sender email.
    SERVER: The server URL to be included in the email body.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_EMAIL_PASSWORD = os.getenv("SENDER_EMAIL_PASSWORD")
SERVER = os.getenv("SERVER") #eg. http://localhost:3000


def send_verification_email(to_email: str, token: str):
    """
    Sends a verification email to the specified email address.
    Args:
        to_email (str): The recipient's email address.
        token (str): The verification token to be included in the email.
    Returns:
        None
    """
    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg["Subject"] = "Email Verification"
    
    body = f"Click the link to verify your email: {SERVER}/verify-email?token={token}"
    msg.attach(MIMEText(body, "plain"))
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(SENDER_EMAIL, SENDER_EMAIL_PASSWORD)  # Use app password here
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
