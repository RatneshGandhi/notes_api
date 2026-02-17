# 📝 Notes API

A RESTful API for managing notes with user authentication, tagging system, pagination, and search — built with Express.js, PostgreSQL, and Drizzle ORM.

## ✨ Features

- **User Authentication** — Signup & login with JWT tokens and salted password hashing
- **Notes CRUD** — Create, read, update, and delete notes
- **Tagging System** — Add, remove, and list tags on notes
- **Pagination** — Paginated notes listing with configurable page size
- **Search** — Search notes by title or content (case-insensitive)
- **Input Validation** — Request validation using Zod schemas

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Express.js](https://expressjs.com/) | Web framework |
| [PostgreSQL](https://www.postgresql.org/) | Database |
| [Drizzle ORM](https://orm.drizzle.team/) | Database ORM & migrations |
| [JWT](https://jwt.io/) | Authentication tokens |
| [Zod](https://zod.dev/) | Schema validation |
| [Docker](https://www.docker.com/) | Database containerization |

## 📁 Project Structure

```
Notes API/
├── db/
│   └── index.js              # Database connection
├── middleware/
│   └── auth.middleware.js     # JWT auth & route protection
├── models/
│   ├── index.js               # Model exports
│   ├── user.models.js         # Users table schema
│   ├── notes.models.js        # Notes table schema
│   └── tag.models.js          # Tags & NoteTags table schemas
├── routes/
│   ├── user.routes.js         # Signup & login routes
│   ├── notes.routes.js        # Notes CRUD routes
│   └── tags.routes.js         # Tag management routes
├── services/
│   ├── user.services.js       # User database operations
│   ├── note.sevices.js        # Note database operations
│   └── tag.services.js        # Tag database operations
├── utils/
│   ├── hash.js                # Password hashing (HMAC-SHA256)
│   └── token.js               # JWT creation & verification
├── validation/
│   ├── user.validation.js     # Signup & login schemas
│   ├── note.validation.js     # Note create & update schemas
│   ├── tag.validation.js      # Tag schemas
│   └── token.validation.js    # Token payload schema
├── docker-compose.yml         # PostgreSQL container setup
├── drizzle.config.js          # Drizzle ORM configuration
├── index.js                   # App entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for PostgreSQL)

### 1. Clone the repository

```bash
git clone https://github.com/RatneshGandhi/notes_api.git
cd notes_api
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://admin:yourpassword@localhost:5432/notes_db
JWT_SECRET=your_jwt_secret_key
PORT=8000
```

### 4. Start the database

```bash
docker compose up -d
```

### 5. Run database migrations

```bash
npx drizzle-kit push
```

### 6. Start the server

```bash
pnpm run dev
```

The server will start on `http://localhost:8000`.

## 📖 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/user/signup` | Register a new user | ❌ |
| `POST` | `/user/login` | Login & get JWT token | ❌ |

#### Signup

```json
POST /user/signup
{
    "firstname": "Ratnesh",
    "lastname": "Gandhi",
    "email": "ratnesh@example.com",
    "password": "password123"
}
```

#### Login

```json
POST /user/login
{
    "email": "ratnesh@example.com",
    "password": "password123"
}
```

> Returns a JWT token. Use it in the `Authorization` header: `Bearer <token>`

---

### 📒 Notes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/notes` | Create a new note | ✅ |
| `GET` | `/notes` | Get all notes (paginated) | ✅ |
| `GET` | `/notes/:id` | Get a note by ID | ✅ |
| `PATCH` | `/notes/:id` | Update a note | ✅ |
| `DELETE` | `/notes/:id` | Delete a note | ✅ |

#### Get Notes (with pagination & search)

```
GET /notes?page=1&limit=5&q=search_term
```

Response:
```json
{
    "notes": [
        {
            "id": "uuid",
            "title": "My Note",
            "content": "Note content...",
            "createdAt": "2026-02-17T00:00:00.000Z",
            "updatedAt": null
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 5,
        "total": 12,
        "totalPages": 3
    }
}
```

---

### 🏷️ Tags

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/notes/:id/tags` | Add tags to a note | ✅ |
| `GET` | `/notes/:id/tags` | Get tags for a note | ✅ |
| `DELETE` | `/notes/:id/tags/:tagId` | Remove a tag from a note | ✅ |
| `GET` | `/tags` | Get all tags for the user | ✅ |

#### Add Tags

```json
POST /notes/:id/tags
{
    "tags": ["javascript", "backend", "api"]
}
```

---

## 🔒 Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 📄 License

ISC
