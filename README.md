# Lab 2 – Interactive Workshop Registration

A React + Vite form practising state, events, controlled inputs, validation and immutable array updates.

## Setup
1. Install Node.js (v18+) and VS Code.
2. `npm install`
3. `npm run dev` and open the URL shown (usually http://localhost:5173).

## Features
- Every input controlled via `value` + `onChange` (text, email, tel, date, number, url, select).
- Validation with specific error messages beside each field; focus jumps to the first invalid field.
- Registrations added with spread (`[...items, new]`) and removed with `filter()`.
- Success message after registering; form resets.
- Accessible: labels, `aria-invalid`, `aria-describedby`, live regions, visible focus.
- Responsive grid layout.
- **Extension:** filter registrations by workshop.

## Validation rules
Name ≥ 2 chars · valid email · phone 7–15 chars · date not in past · age 16–100 whole number · portfolio optional but must be http(s) URL · workshop required.

## Screenshots
Add two screenshots here (e.g. `screenshots/errors.png`, `screenshots/registered.png`).
