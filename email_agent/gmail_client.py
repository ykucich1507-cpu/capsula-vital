"""Wrapper delgado sobre la Gmail API: auth, listar no leídos, labels y borradores."""
from __future__ import annotations

import base64
import os
from dataclasses import dataclass
from email.mime.text import MIMEText
from typing import Optional

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from .config import GMAIL_SCOPES

TOKEN_PATH = os.environ.get("GMAIL_TOKEN_PATH", "token.json")
CLIENT_SECRET_PATH = os.environ.get("GMAIL_CLIENT_SECRET_PATH", "client_secret.json")


@dataclass
class EmailMessage:
    id: str
    thread_id: str
    sender: str
    subject: str
    body: str


def get_service():
    creds: Optional[Credentials] = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, GMAIL_SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_PATH, GMAIL_SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, "w") as f:
            f.write(creds.to_json())
    return build("gmail", "v1", credentials=creds)


def list_unread(service, max_results: int = 20) -> list[EmailMessage]:
    resp = (
        service.users()
        .messages()
        .list(userId="me", labelIds=["UNREAD", "INBOX"], maxResults=max_results)
        .execute()
    )
    messages = []
    for item in resp.get("messages", []):
        full = service.users().messages().get(userId="me", id=item["id"], format="full").execute()
        messages.append(_parse_message(full))
    return messages


def _parse_message(full: dict) -> EmailMessage:
    headers = {h["name"].lower(): h["value"] for h in full["payload"].get("headers", [])}
    body = _extract_body(full["payload"])
    return EmailMessage(
        id=full["id"],
        thread_id=full["threadId"],
        sender=headers.get("from", ""),
        subject=headers.get("subject", ""),
        body=body,
    )


def _extract_body(payload: dict) -> str:
    if payload.get("mimeType") == "text/plain" and payload.get("body", {}).get("data"):
        return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="replace")
    for part in payload.get("parts", []) or []:
        text = _extract_body(part)
        if text:
            return text
    return ""


def get_or_create_label(service, name: str, _cache: dict = {}) -> str:
    if name in _cache:
        return _cache[name]
    resp = service.users().labels().list(userId="me").execute()
    for label in resp.get("labels", []):
        if label["name"] == name:
            _cache[name] = label["id"]
            return label["id"]
    created = (
        service.users()
        .labels()
        .create(userId="me", body={"name": name, "labelListVisibility": "labelShow", "messageListVisibility": "show"})
        .execute()
    )
    _cache[name] = created["id"]
    return created["id"]


def add_label(service, message_id: str, label_id: str) -> None:
    service.users().messages().modify(
        userId="me", id=message_id, body={"addLabelIds": [label_id]}
    ).execute()


def create_draft_reply(service, thread_id: str, to: str, subject: str, body: str) -> dict:
    message = MIMEText(body)
    message["to"] = to
    message["subject"] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return (
        service.users()
        .drafts()
        .create(userId="me", body={"message": {"raw": raw, "threadId": thread_id}})
        .execute()
    )
