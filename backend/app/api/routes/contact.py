import logging

from fastapi import APIRouter

from app.schemas.contact import ContactRequest, ContactResponse

logger = logging.getLogger("app.contact")

router = APIRouter(tags=["contact"])


@router.post("/contact", response_model=ContactResponse)
async def submit_contact(payload: ContactRequest) -> ContactResponse:
    """Accept a contact form submission.

    This is a Phase 2 stub: it validates the payload and the honeypot field,
    then logs the message instead of sending an email. Phase 3 adds actual
    email delivery (SMTP/Resend) and rate limiting.
    """
    if payload.company:
        # Honeypot tripped - silently pretend success so bots don't learn
        # anything, but don't actually process the message.
        logger.info("Dropped a contact submission that tripped the honeypot field.")
        return ContactResponse(success=True, detail="Thanks for reaching out!")

    logger.info(
        "New contact submission (email delivery not yet configured): "
        "name=%r email=%r message_length=%d",
        payload.name,
        payload.email,
        len(payload.message),
    )

    return ContactResponse(
        success=True,
        detail="Thanks for reaching out! (Note: email delivery is not yet configured.)",
    )
