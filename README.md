# ShopSpur Live Chat Assignment

## Overview

ShopSpur is a small AI live chat app for a fictional ecommerce store. A user can open the chat UI, ask support questions, and receive answers from a Gemini-powered support agent using seeded store policy knowledge.

## Local Setup

Run the backend:

```bash
cd backend
npm install
cp .env.example .env
```

Fill `backend/.env`:

```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Set up the database and start the backend:

```bash
npm run migrate
npm run seed
npm run dev
```

Then run the frontend in a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

## Database Setup

The backend uses SQLite through Knex.

Run migrations:

```bash
cd backend
npm run migrate
```

Seed store knowledge:

```bash
npm run seed
```

The seed creates realistic ShopSpur support knowledge such as shipping, returns, refunds, exchanges, payment methods, promo codes, damaged item handling, and support escalation rules.

## Environment Variables

Backend `.env`:

`GEMINI_API_KEY` is the Google Gemini API key used by the backend LLM service.

`PORT` is the backend HTTP server port. It defaults to `3001`.

`FRONTEND_URL` is the frontend origin allowed by CORS. It defaults to `http://localhost:5173`.

Frontend `.env`:

`VITE_APP_BACKEND_URL` is the backend API URL. It defaults to `http://localhost:3001`.

## Architecture

The frontend is a React/Vite chat panel with a scrollable message list, user/agent message styling, sender icons, input validation, character counter, loading state, and history reload from local storage.

The backend is split into layers:

- Routes define chat endpoints.
- Controllers parse requests, validate input, and format responses.
- Services contain chat session logic and AI reply generation.
- Repositories own database reads and writes.
- `llmService` wraps the Gemini API and keeps LLM-specific logic isolated.

Main endpoints:

- `POST /chat/message` accepts `{ message: string, sessionId?: string }`
- `GET /chat/history/:sessionId` returns previous messages for a conversation

Conversations and messages are persisted in SQLite. The frontend stores the active `sessionId` in local storage and reloads history after refresh.

## Design Decisions

SQLite keeps the project easy to run locally without external infrastructure.

Store knowledge is stored in the database and loaded into the system prompt at startup, so policies can be updated through seed data without changing prompt code.

The LLM call is isolated behind `generateReply(history, userMessage)` so another provider could be swapped in without changing controllers or repositories.

Input is validated with Zod on the backend. The frontend mirrors the 200 character message limit for better UX, but the backend remains the source of enforcement.

Errors returned to users are intentionally non-technical so the chat feels like a customer support product, not a developer tool.

## LLM Notes

Provider: Google Gemini via `@google/genai`.

Model: Gemini 2.5 Flash.

The system prompt tells the model to act as ShopSpur's customer support agent, answer with practical policy details, stay concise and professional, and avoid inventing live order, tracking, refund, discount, or account information.

Realistic ShopSpur policy knowledge is read from the database when the backend starts and included in the system prompt. Conversation history is capped at the last 10 messages. Max output tokens is 1000.

If you update the seed knowledge, rerun `npm run seed` and restart the backend.

## Trade-offs

SQLite was used for a zero-infrastructure local setup. PostgreSQL would be a better production choice for concurrent traffic and managed deployments.

Knowledge is loaded once at startup, which keeps requests fast and simple. The trade-off is that knowledge updates require reseeding and restarting the backend.

Authentication is omitted because it was not required. The app uses a client-side session ID for history restoration, which is enough for this exercise but not for private production customer data.

## If I Had More Time

I would add streaming responses via SSE, Redis for session caching, an admin panel to edit store knowledge, tool use for real order lookups, automated tests for services/controllers, and a deployed demo environment.
