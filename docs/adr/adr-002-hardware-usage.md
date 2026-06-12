# ADR 001 – Hardware Usage
Status: Accepted

## Context
The app is primarily text and data driven. Hardware should only be used when it meaningfully enhances the reading-tracking experience.

## Decision
Use camera access only for optional book cover photos. No GPS, fingerprint scanner, microphone, or speaker integration.

## Rationale
•	camera enhances the user experience
•	avoids unnecessary permissions
•	keeps the app simple and within course scope


## Consequences
•	must request camera permission
•	must provide fallback cover

