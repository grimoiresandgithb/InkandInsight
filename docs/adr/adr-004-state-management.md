# ADR 001 – Navigation Strategy
Status: Accepted

## Context
Multiple screens require access to shared data such as books, quotes, and reading sessions.

## Decision
Use React Context + useReducer for global state

## Rationale
•	lightweight and built into React
•	no need for Redux
•	easy to integrate with navigation


## Consequences
•	must structure reducers cleanly
•	avoid deeply nested state

