# Collaborative AI Notes App

A premium, state-of-the-art **Real-Time Collaborative Notes Management Application** enhanced with **AI-Powered Insights**. Built using Next.js 16 (App Router), React 19, Tailwind CSS 4, Drizzle ORM, Neon PostgreSQL, Socket.io, and OpenAI.

This application allows multiple users to collaborate on notes simultaneously with live cursor tracking, active editor indicators, role-based permissions, and robust AI text summarization, title generation, and action item extraction.

---

## Deployed URL

[https://notesai.jeetdas.site](https://notesai.jeetdas.site)

## Key Features

### Secure Authentication & Session Management
* **Argon2 Hashing**: Cryptographically secure password hashing.
* **JWT Authorization**: Custom JSON Web Token stateless sessions.
* **Unified Profile Navigation**: Accessible profile dropdown for user email details and fast logout across pages.

### Real-Time Collaborative Workspace
* **Socket.io Integration**: Low-latency, full-duplex WebSocket server wrapper for high-frequency text synchronization.
* **Collaborator Presence**: Visual headers displaying other active users working on the same note.
* **Live Cursor Tracking**: Real-time cursor positions displayed using individual user-assigned colors.
* **Access Control & Roles**: Assign `Editor` or `Viewer` permissions to collaborators. Viewers are restricted from making changes, and their roles are dynamically represented.

### OpenAI-Powered Insights
* **AI Summary Panel**: Dynamic, single-click summaries generated from note content.
* **Action Items Extraction**: Extract actionable to-do lists from the text automatically.
* **AI-Suggested Titles**: Generates premium title recommendations based on text semantics.
* **Generation History**: AI prompts and responses are tracked and cached.

### Notes Organization & Search
* **Note Archiving**: Archive/unarchive notes with a single click.
* **Tag Management**: Dynamically create, assign, and manage multi-tag categorization.
* **Global Search**: Search through owned and shared notes on the dashboard dynamically.
* **Dynamic Sidebar**: Access notes, categories, archives, and tags in a responsive view.

---

## Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework & Engine** | Next.js 16.2.6 (App Router) / React 19.2.4 | UI rendering, client-side routing, compilation, and API hosting. |
| **Styling & Motion** | Tailwind CSS 4, Framer Motion, next-themes | Elegant typography (Inter/Geist), glassmorphism, responsive sidebar, light/dark mode, and micro-animations. |
| **Database** | Neon Serverless PostgreSQL | Managed cloud relational database with low latency. |
| **ORM** | Drizzle ORM (drizzle-orm / drizzle-kit) | Type-safe SQL querying, schema declaration, and migrations. |
| **Realtime Sync** | Socket.IO (socket.io / socket.io-client) | WebSocket server context tracking, room creation, and user cursors. |
| **State & Data Cache** | Zustand & TanStack React Query 5 | Global client state and cached API fetch requests. |
| **AI Processing** | OpenAI Node SDK | AI insights (Summarization, Title suggestion, Action items). |
| **Components** | Radix UI, Shadcn, Lucide React, Hugeicons | Accessible overlay primitives, rich premium icons, dialogs, and notifications. |
| **Security & Forms** | Argon2, jsonwebtoken, React Hook Form, Zod | Password hashing, token authorization, forms validation. |

---

## System Architecture

The application is structured around a **monolithic Next.js codebase** hosted on a custom Node.js HTTP server. This server boots Next.js alongside a Socket.IO WebSocket server, allowing regular REST API endpoints and low-latency real-time collaboration channels to coexist on the same port.

### Client-Server Communication Flow

```mermaid
graph TD
    Client[Web Client: React 19 + Next.js] <-->|HTTP REST / JSON APIs| NextAPI[Next.js API Routes]
    Client <-->|WebSockets: Socket.io| SocketServer[Socket.io Custom Server]
    NextAPI <-->|Drizzle ORM| DB[(Neon PostgreSQL DB)]
    NextAPI <-->|OpenAI Node SDK| OpenAI[OpenAI API]
    SocketServer <-->|In-Memory Rooms| SyncState[Live Cursor Presence & Document Sync]
```

### Database Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ NOTES : "owns"
    USERS ||--o{ NOTES_COLLABORATOR : "participates"
    NOTES ||--o{ NOTES_COLLABORATOR : "has"
    NOTES ||--o{ NOTE_TAGS : "categorized by"
    TAGS ||--o{ NOTE_TAGS : "linked to"
    USERS ||--o{ AI_GENERATIONS : "requests"
    NOTES ||--o{ AI_GENERATIONS : "generates for"

    USERS {
        uuid id PK
        varchar name
        varchar email UK
        varchar password
        timestamp created_at
    }

    NOTES {
        uuid id PK
        uuid user_id FK
        varchar title
        text content
        boolean is_archived
        boolean is_public
        uuid share_id
        text ai_summary
        varchar ai_suggested_title
        text action_items
        timestamp created_at
        timestamp updated_at
    }

    TAGS {
        uuid id PK
        varchar name UK
    }

    NOTE_TAGS {
        uuid note_id PK, FK
        uuid tag_id PK, FK
    }

    NOTES_COLLABORATOR {
        uuid note_id PK, FK
        uuid user_id PK, FK
        role role "editor | viewer"
        timestamp created_at
        timestamp updated_at
    }

    AI_GENERATIONS {
        uuid id PK
        uuid user_id FK
        uuid note_id FK
        varchar type
        text prompt
        text response
        timestamp created_at
    }
```

---

## Environment Variables Configuration

To run the application, create a `.env` file in the root directory. You can copy the template from `.env.example`:

| Environment Variable | Description | Example / Required Format |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL Serverless Connection URI. | `postgresql://neondb_owner:...@ep-pooler.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | Super secret token/hash key for JWT signing. | `any_high_entropy_alphanumeric_string` |
| `OPENAI_API_KEY` | Your personal API key from OpenAI developer platform. | `sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `NODE_ENV` | Environment identifier. | `development` or `production` |

---

## API Reference

All requests and responses use the `application/json` format. Protected endpoints require the user session token to be present in the cookies.

### Authentication

#### Sign Up
* **URL**: `/api/auth/signup`
* **Method**: `POST`
* **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

#### Sign In
* **URL**: `/api/auth/signin`
* **Method**: `POST`
* **Body**:
  ```json
  {
    "email": "jeet@email.com",
    "password": "securepassword"
  }
  ```
* **Response**:
  ```json
  {
      "message": "User signed in successfully",
      "user": {
          "id": "ecb272b0-cbca-4398-968a-d46c6b1b59d4",
          "email": "jeet@email.com",
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlY2IyNzJiMC1jYmNhLTQzOTgtOTY4YS1kNDZjNmIxYjU5ZDQiLCJpYXQiOjE3NzkwMzc0NjYsImV4cCI6MTc3OTY0MjI2Nn0.G96dxhEo3PQ-pYIrN8jhWEa7JR2vOdtdjQIZ-sIUf0g"
      }
  }
  ```

#### Get Current User
* **URL**: `/api/auth/me`
* **Method**: `GET`

#### Sign Out
* **URL**: `/api/auth/logout`
* **Method**: `POST`

---

### Notes

#### List Notes
* **URL**: `/api/notes`
* **Method**: `GET`

#### Create Note
* **URL**: `/api/notes`
* **Method**: `POST`
* **Body**:
  ```json
  {
    "title": "Project kickoff notes",
    "content": "Outline milestones, owners, and next steps.",
    "tags": ["Roadmap", "Q2 Planning", "Product"]
  }
  ```
* **Response**:
  ```json
  {
      "message": "Note created successfully",
      "data": {
          "id": "3b30b745-1750-46b7-8587-246d55636b21",
          "userId": "ecb272b0-cbca-4398-968a-d46c6b1b59d4",
          "title": "Project kickoff notes",
          "content": "Outline milestones, owners, and next steps.",
          "isArchived": false,
          "isPublic": false,
          "shareId": "2b89355c-4c01-4e41-8fe2-25474d9a1d3f",
          "aiSummary": null,
          "aiSuggestedTitle": null,
          "actionItems": null,
          "createdAt": "2026-05-17T17:05:20.655Z",
          "updatedAt": "2026-05-17T17:05:20.655Z"
      }
  }
  ```

#### Get Note by ID
* **URL**: `/api/notes/[id]`
* **Method**: `GET`

#### Update Note by ID
* **URL**: `/api/notes/[id]`
* **Method**: `PATCH`

#### Delete Note by ID
* **URL**: `/api/notes/[id]`
* **Method**: `DELETE`

#### List Shared Notes
* **URL**: `/api/notes/shared`
* **Method**: `GET`

---

### Note Collaborators

#### List Collaborators
* **URL**: `/api/notes/[id]/collaborators`
* **Method**: `GET`

#### Add Collaborator
* **URL**: `/api/notes/[id]/collaborators`
* **Method**: `POST`

#### Remove Collaborator
* **URL**: `/api/notes/[id]/collaborators/[userId]`
* **Method**: `DELETE`

---

### Link Sharing

#### Configure Link Sharing
* **URL**: `/api/notes/[id]/share`
* **Method**: `POST`

#### Get Public Note by Share ID
* **URL**: `/api/share/[shareId]`
* **Method**: `GET`

---

### AI Insights

#### Generate AI Insights
* **URL**: `/api/ai/generate`
* **Method**: `POST`

#### Get AI Usage Count
* **URL**: `/api/ai/count`
* **Method**: `GET`

---

## How to Start the Project

### 1. Prerequisites
Ensure you have **Node.js** (version 20 or higher) and a package manager (**Bun**, **NPM**, or **PNPM**) installed.

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/JeetDas5/notes-app
cd notes-app

# Install project packages
npm install
# or
bun install
# or
pnpm install
```

### 3. Setup Your Database Environment
Drizzle Kit is used to sync schemas. Boot up a database on Neon, fill in your `DATABASE_URL` in `.env`, and apply the database schemas:

```bash
# Synchronize your PostgreSQL schema directly
npx drizzle-kit push
# or using Bun:
bunx drizzle-kit push
```

Alternatively, you can run Drizzle's migration commands to keep track of schema version control:
```bash
# Generate schema migrations
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4. Running the Development Server

> [!IMPORTANT]
> Since the project uses a custom Socket.IO layer, **you must execute the custom dev script** rather than the default `next dev` to enable WebSocket features.

```bash
# Start Next.js AND the Socket.io WebSocket server on port 3000
npm run dev:socket
# or
bun dev:socket
```

Open [http://localhost:3000](http://localhost:3000) on your browser to view the page.

### 5. Build and Deploy (Production)
```bash
# Build the Next.js production bundles
npm run build

# Start the application in production mode with socket.io support
npm run start:socket
```

---

## Running Tests

The application includes a comprehensive test suite built with Vitest, covering crucial areas such as validation schemas, JWT utilities, password hashing, and AI prompt generation.

To run the unit tests, use the following commands:

```bash
# Run all tests once
npm run test --run
# or using Bun:
bun run test --run

# Run tests in interactive watch mode
npm run test
# or using Bun:
bun run test
```

---

## Screenshots

Here are the primary application views showing the dashboard in dark and light modes, as well as the collaborative notes editor and AI insights panel.

![Dashboard Dark Mode](public/dashboard_dark.png)

![Dashboard Light Mode](public/dashboard_light.png)

![Collaborative Workspace](public/notes_page.png)

Built by Jeet Das 
