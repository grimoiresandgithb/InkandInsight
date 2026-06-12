# ADR 001 – Navigation Strategy
Status: Accepted

## Context
Ink & Insight stores books, reading sessions, quotes, and mood logs. Data must persist locally and work offline.

## Decision
Use local, unencrypted storage via SQLite (Expo SQLite) for structured data and AsyncStorage for lightweight settings.

## Rationale
•	fully offline app
•	SQLite supports relational data
•	no sensitive person data so encryption not required
•	avoids backend completely


## Consequences
Consequences:
•	must design a clean schema
•	no cloud sync

