# Racing API – Stable target for Playwright API testing

A small **Node.js + Express** backend that represents a racing platform: users, cars, tracks, and lap records. It is designed as a **predictable, test-friendly API** for automated API testing with Playwright (session-based auth, stable responses, reset endpoint).

- **Stack:** Node.js, Express, TypeScript, UUID, in-memory store (no database)
- **Port:** 3000
- **Auth:** Session-based; HTTP-only cookie `session`; use Playwright `storageState` to persist login

---

## Quick start

```bash
cd backend
npm install
npm run build
npm start
```

For development with auto-reload:

```bash
npm run dev
```

Server runs at **http://localhost:3000**.

---

## Authentication

**Login**

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' \
  -c cookies.txt -v
```

- **200 OK** – Sets `Set-Cookie: session=...; HttpOnly; Path=/`
- **401** – Invalid credentials

**Example credentials**

| Username | Password |
|----------|----------|
| admin    | password |

**Logout**

```bash
curl -X POST http://localhost:3000/logout \
  -b cookies.txt -v
```

**Protected routes** (Users, Cars, Tracks, Records) require the `session` cookie. If missing or invalid: **401 Unauthorized**.

---

## Reset (test-friendly)

Resets all in-memory data to the default seed state (3 users, 5 cars, 5 tracks, 10 records). No auth required.

```bash
curl -X POST http://localhost:3000/reset
```

---

## Resources and endpoints

| Resource | Endpoints |
|----------|-----------|
| Users    | `GET/POST /users`, `GET/PUT/DELETE /users/:id` |
| Cars     | `GET/POST /cars`, `GET/PUT/DELETE /cars/:id` |
| Tracks   | `GET/POST /tracks`, `GET/PUT/DELETE /tracks/:id` |
| Records  | `GET/POST /records`, `GET/PUT/DELETE /records/:id` |

All of these require a valid session cookie (send `-b cookies.txt` with curl after login).

---

## Example requests (after login)

**List users**

```bash
curl -b cookies.txt http://localhost:3000/users
```

**Get one user**

```bash
curl -b cookies.txt http://localhost:3000/users/a0000001-0000-4000-8000-000000000001
```

**Create a car**

```bash
curl -X POST http://localhost:3000/cars \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"userId":"a0000001-0000-4000-8000-000000000001","name":"Rocket","model":"X1","year":2025}'
```

**Create a record**

```bash
curl -X POST http://localhost:3000/records \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"userId":"a0000001-0000-4000-8000-000000000001","carId":"b0000001-0000-4000-8000-000000000001","trackId":"c0000001-0000-4000-8000-000000000001","lapTime":90.5,"date":"2026-03-08"}'
```

**List tracks**

```bash
curl -b cookies.txt http://localhost:3000/tracks
```

**List records**

```bash
curl -b cookies.txt http://localhost:3000/records
```

---

## Data model

- **User** – id, username, password, email (password not returned in API responses)
- **Car** – id, userId, name, model, year
- **Track** – id, name, country, lengthKm
- **Record** – id, userId, carId, trackId, lapTime, date (e.g. `"2026-03-08"`)

Relationships: a user owns cars; a record links one user, one car, and one track.

---

## Status codes and validation

- **200** OK  
- **201** Created (POST)  
- **400** Bad Request (validation: required fields, types, invalid references)  
- **401** Unauthorized (missing or invalid session)  
- **404** Not Found  
- **500** Internal Server Error  

Validation errors return a JSON body with `error`, `message`, and optional `details` (field-level errors).

---

## Seed data (after reset or startup)

- **3 users** (e.g. admin, alice, bob)
- **5 cars** (linked to users)
- **5 tracks**
- **10 records** (user + car + track + lapTime + date)

IDs in seed data are fixed UUIDs so reset is deterministic and tests can rely on stable IDs.

---

## Using with Playwright

1. Start this backend (e.g. `npm start` in `backend`).
2. In tests, call `POST /login` with `username`/`password`, then use `context.storageState()` or save cookies so subsequent requests send the `session` cookie.
3. Use `POST /reset` when you need a clean, deterministic state (e.g. in `beforeEach` or global setup).
