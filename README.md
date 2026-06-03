# ShopSpur Live Chat Assignment

## Setup

Run the backend:

```bash
cd backend
npm install
cp .env.example .env
# Fill GEMINI_API_KEY in .env
npm run migrate
npm run seed
npm run dev
```

Then run the frontend in a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Environment Variables

`GEMINI_API_KEY` is the Google Gemini API key used by the backend LLM service.

`PORT` is the backend HTTP server port. It defaults to `3001`.

## Architecture

The backend is split into four layers. Routes handle HTTP concerns and validation only. Services contain the business logic for chat sessions and AI replies. Repositories own database reads and writes. `llmService` manages the Gemini model and is initialized once at startup.

## LLM Notes

Gemini 1.5 Flash is used. The model and system prompt are initialized once when the server starts by reading store knowledge from the database. Conversation history is capped at the last 10 messages. Max tokens is 1000.

## Trade-offs

SQLite was used for a zero-infrastructure local setup, but the schema is Postgres compatible with a one-line change in `knexfile.ts`. FAQ knowledge is stored in the database and loaded once at startup, so it can be updated without a code change. Authentication is omitted because it was not required.

## If I Had More Time

I would add streaming responses via SSE, Redis for session caching, an admin panel to edit store knowledge, and tool use for real order lookups.
