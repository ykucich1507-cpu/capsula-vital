"""Clasificación y redacción de borradores usando la API de Claude."""
from __future__ import annotations

import json
import os
from dataclasses import dataclass

import anthropic

from .config import (
    CATEGORIES,
    CLASSIFIER_SYSTEM_PROMPT,
    DEFAULT_CATEGORY,
    DRAFTER_SYSTEM_PROMPT,
    categories_block,
)

MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-5")

_client = anthropic.Anthropic()


@dataclass
class Classification:
    category: str
    needs_reply: bool
    is_suspicious: bool
    urgency: str
    reasoning: str


@dataclass
class Draft:
    subject: str
    body: str


def _extract_json(text: str) -> dict:
    start, end = text.find("{"), text.rfind("}")
    return json.loads(text[start : end + 1])


def classify(sender: str, subject: str, body: str) -> Classification:
    system = CLASSIFIER_SYSTEM_PROMPT.format(categories=categories_block())
    message = _client.messages.create(
        model=MODEL,
        max_tokens=512,
        temperature=0.1,
        system=system,
        messages=[
            {
                "role": "user",
                "content": f"Remitente: {sender}\nAsunto: {subject}\n\n{body}",
            }
        ],
    )
    data = _extract_json(message.content[0].text)
    category = data.get("category") if data.get("category") in CATEGORIES else DEFAULT_CATEGORY
    return Classification(
        category=category,
        needs_reply=bool(data.get("needsReply")),
        is_suspicious=bool(data.get("isSuspicious")),
        urgency=data.get("urgency", "media"),
        reasoning=data.get("reasoning", ""),
    )


def draft_reply(sender: str, subject: str, body: str, classification: Classification) -> Draft:
    message = _client.messages.create(
        model=MODEL,
        max_tokens=1024,
        temperature=0.4,
        system=DRAFTER_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Remitente: {sender}\nAsunto original: {subject}\n"
                    f"Categoría: {classification.category}\nMotivo: {classification.reasoning}\n\n"
                    f"Email original:\n{body}"
                ),
            }
        ],
    )
    data = _extract_json(message.content[0].text)
    return Draft(subject=data.get("subject", f"Re: {subject}"), body=data.get("body", ""))
