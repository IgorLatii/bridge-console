# Frontier Distributed UI

A React + TypeScript frontend for the Frontier microservice ecosystem.

## Architecture

All API requests flow through the **frontier_consult** API gateway, which routes to downstream services:

```
Frontend  ──▶  frontier_consult (API Gateway)
                 ├──▶ border_info_admin  (Django FAQ data)
                 ├──▶ ai_for_chatbot     (AI Q&A service)
                 └──▶ release-orchestrator-idp (Release management)
```

## Services

| Service | Purpose | Endpoints Used |
|---|---|---|
| `frontier_consult` | API Gateway & Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| `border_info_admin` | FAQ content (Django) | `GET /api/faq` |
| `ai_for_chatbot` | AI assistant | `POST /api/ai/question` |
| `release-orchestrator-idp` | Release orchestration | `GET /api/releases` |

## Event-Driven Architecture

User actions trigger events published to a message broker (RabbitMQ/Kafka):

- `USER_QUESTION_SUBMITTED` — When a user asks the AI assistant
- `FAQ_VIEWED` — When a user expands an FAQ item
- `RELEASE_REQUESTED` — When a release action is triggered

## Pages

1. **Auth Page** (`/`) — Split-screen login & registration
2. **Dashboard** (`/dashboard`) — FAQ accordion + AI chat assistant

## Local Setup

```bash
npm install
echo "VITE_API_GATEWAY_URL=http://localhost:8000" > .env
npm run dev
```

## Backend Integration

All API calls use mock data by default. To connect to real backends:

1. Set `VITE_API_GATEWAY_URL` in `.env` to your frontier_consult gateway URL
2. Uncomment the actual API calls in `src/services/*.ts` files
3. Remove mock implementations

Each service file has TODO comments marking integration points.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Axios (HTTP client)
- React Router (routing)
