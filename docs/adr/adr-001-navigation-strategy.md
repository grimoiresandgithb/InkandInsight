# ADR 001 – Navigation Strategy
Status: Accepted

## Context
Ink & Insight requires multiple screens, including Home, Book List, Book Details, Reading Session Logging, Quotes, and Analytics. Navigation must be intuitive, scalable, and easy to maintain in React Native.

## Decision
Use React Navigation with a hybrid structure:
•	Bottom tab Navigator for primary sections
•	stack navigator nested inside tabs for deeper screens


## Rationale
•	industry standard library for React Native
•	Supports nested navigation and smooth transitions
•	well documented and stable
•	fits project scope and timeline

## Consequences
•	industry standard library for React Native
•	Supports nested navigation and smooth transitions
•	well documented and stable
•	fits project scope and timeline

