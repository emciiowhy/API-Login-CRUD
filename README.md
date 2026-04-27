# Express Backend API

A RESTful backend API built with **Express.js**, **MongoDB**, and **JWT authentication**.
Includes Signup, Email Verification, Login, and full CRUD for Tasks.

---

## Tech Stack

- **Express.js** – Web framework
- **MongoDB + Mongoose** – Database & ODM
- **bcryptjs** – Password hashing
- **jsonwebtoken** – Access & Refresh token generation
- **nodemailer** – Email verification
- **express-validator** – Schema validation
- **cookie-parser** – Secure httpOnly cookie handling

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd express-api
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Fill in your `.env`:

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES` | Access token expiry (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES` | Refresh token expiry (e.g. `7d`) |
| `EMAIL_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `EMAIL_PORT` | SMTP port (e.g. `587`) |
| `EMAIL_USER` | Your email address |
| `EMAIL_PASS` | Your email app password |
| `CLIENT_URL` | Frontend URL for CORS & email links |

### 3. Run

```bash
# Development
npm run dev

# Production
npm start
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | No |
| GET | `/api/auth/verify-email?token=` | Verify email address | No |
| POST | `/api/auth/login` | Login and get tokens | No |
| POST | `/api/auth/refresh` | Refresh access token | No (cookie) |
| POST | `/api/auth/logout` | Logout and clear token | No |

### Tasks (CRUD)

All task routes require `Authorization: Bearer <accessToken>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks (with pagination & status filter) |
| GET | `/api/tasks/:id` | Get a single task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## Request & Response Examples

### POST /api/auth/signup

**Body:**
```json
{
  "name": "Juan dela Cruz",
  "email": "juan@example.com",
  "password": "secure123"
}
```

**Response (201):**
```json
{
  "message": "Account created. Please check your email to verify your account.",
  "userId": "665abc123..."
}
```

---

### GET /api/auth/verify-email?token=abc123...

**Response (200):**
```json
{
  "message": "Email verified successfully. You can now log in."
}
```

---

### POST /api/auth/login

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "secure123"
}
```

**Response (200):**
```json
{
  "message": "Login successful.",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "665abc123...",
    "name": "Juan dela Cruz",
    "email": "juan@example.com"
  }
}
```
> Refresh token is sent as an `httpOnly` cookie automatically.

---

### POST /api/tasks

**Headers:** `Authorization: Bearer <accessToken>`

**Body:**
```json
{
  "title": "Finish the backend API",
  "description": "Build all the routes and test them",
  "status": "in-progress",
  "dueDate": "2025-05-01"
}
```

**Response (201):**
```json
{
  "message": "Task created.",
  "task": {
    "_id": "665xyz...",
    "user": "665abc123...",
    "title": "Finish the backend API",
    "status": "in-progress",
    "dueDate": "2025-05-01T00:00:00.000Z",
    "createdAt": "..."
  }
}
```

---

### GET /api/tasks?status=pending&page=1&limit=5

**Response (200):**
```json
{
  "tasks": [...],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 5,
    "totalPages": 3
  }
}
```

---

## Project Structure

```
src/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Signup, verify, login, refresh, logout
│   └── taskController.js   # Task CRUD logic
├── middleware/
│   └── auth.js             # JWT protect middleware
├── models/
│   ├── User.js             # User schema
│   └── Task.js             # Task schema (linked to User)
├── routes/
│   ├── authRoutes.js       # Auth routes + validation
│   └── taskRoutes.js       # Task routes + validation
├── utils/
│   ├── email.js            # Nodemailer helper
│   └── jwt.js              # Token generation/verification
└── index.js                # App entry point
```

---

## Security Notes

- Passwords are hashed with **bcryptjs** (12 salt rounds)
- Refresh tokens are stored in the DB and sent via **httpOnly cookie**
- Access tokens are short-lived (15 min by default)
- All task queries are scoped to `req.user._id` — users can only access their own data
- Email verification expires after **1 hour**

---

## Group Members

- (Add your names here)
