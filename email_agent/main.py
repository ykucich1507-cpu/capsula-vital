"""Punto de entrada: clasifica, etiqueta y (opcionalmente) redacta borradores
para los emails no leídos de la bandeja de entrada.

Nunca envía emails — como mucho crea borradores en Gmail para que los repases
y los mandes vos misma.
"""
from __future__ import annotations

import argparse
import logging

from . import gmail_client
from .ai import classify, draft_reply
from .config import CATEGORIES, DRAFT_GENERATED_LABEL, LABEL_PREFIX, NEVER_REPLY_CATEGORIES

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("email_agent")


def run(max_results: int, dry_run: bool) -> None:
    service = gmail_client.get_service()
    label_ids = {name: gmail_client.get_or_create_label(service, f"{LABEL_PREFIX}{name}") for name in CATEGORIES}
    draft_label_id = gmail_client.get_or_create_label(service, DRAFT_GENERATED_LABEL)

    messages = gmail_client.list_unread(service, max_results=max_results)
    log.info("Procesando %d emails no leídos", len(messages))

    for msg in messages:
        result = classify(msg.sender, msg.subject, msg.body)
        log.info("[%s] %.60s -> %s (needsReply=%s, suspicious=%s)", msg.id, msg.subject, result.category, result.needs_reply, result.is_suspicious)

        if dry_run:
            continue

        gmail_client.add_label(service, msg.id, label_ids[result.category])

        should_draft = result.needs_reply and not result.is_suspicious and result.category not in NEVER_REPLY_CATEGORIES
        if should_draft:
            draft = draft_reply(msg.sender, msg.subject, msg.body, result)
            gmail_client.create_draft_reply(service, msg.thread_id, msg.sender, draft.subject, draft.body)
            gmail_client.add_label(service, msg.id, draft_label_id)
            log.info("  -> borrador creado: %s", draft.subject)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--max-results", type=int, default=20, help="Máximo de emails no leídos a procesar por corrida")
    parser.add_argument("--dry-run", action="store_true", help="Solo clasifica y loguea, no etiqueta ni crea borradores")
    args = parser.parse_args()
    run(max_results=args.max_results, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
