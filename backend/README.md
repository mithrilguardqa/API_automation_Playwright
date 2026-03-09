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

## Visual API testing (like Postman)

Two ways to explore the API with a UI:

### 1. Swagger UI (in the browser, no install)

With the server running, open:

**http://localhost:3000/docs**

You get an interactive doc: expand an endpoint → **Try it out** → edit the body (if needed) → **Execute**.  
**Tip:** Run **Auth → Login** first so the session cookie is set; then other endpoints will work.

### 2. Postman or Thunder Client (import collection)

- **Postman:** [postman.com](https://www.postman.com/downloads/) → Import → choose `backend/postman/Racing-API.postman_collection.json`.
- **Thunder Client** (VS Code/Cursor): Install the “Thunder Client” extension → New Request → Import → choose the same file.

Collection variable `baseUrl` is set to `http://localhost:3000`. Send **Auth → Login** first; then use any other request (cookies are sent automatically).

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

## CRUD: Add, edit, delete data

Use these after logging in (so you have `cookies.txt`). Replace `cookies.txt` with `-b cookies.txt` in every request.

### Users

| Action | Method | Endpoint | Body (JSON) |
|--------|--------|----------|-------------|
| List all | `GET` | `/users` | — |
| Get one | `GET` | `/users/:id` | — |
| Create | `POST` | `/users` | `username`, `password`, `email` |
| Update | `PUT` | `/users/:id` | any of: `username`, `password`, `email` |
| Delete | `DELETE` | `/users/:id` | — |

**Create user**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"username":"newuser","password":"secret","email":"new@racing.local"}'
```

**Update user** (e.g. change email)
```bash
curl -X PUT http://localhost:3000/users/usr001 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"email":"admin-new@racing.local"}'
```

**Delete user**
```bash
curl -X DELETE http://localhost:3000/users/usr003 -b cookies.txt
```

---

### Cars

| Action | Method | Endpoint | Body (JSON) |
|--------|--------|----------|-------------|
| List all | `GET` | `/cars` | — |
| Get one | `GET` | `/cars/:id` | — |
| Create | `POST` | `/cars` | `userId`, `name`, `model`, `year` |
| Update | `PUT` | `/cars/:id` | any of: `userId`, `name`, `model`, `year` |
| Delete | `DELETE` | `/cars/:id` | — |

**Create car** (`userId` must be an existing user id, e.g. `usr001`)
```bash
curl -X POST http://localhost:3000/cars \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"userId":"usr001","name":"Rocket","model":"X1","year":2025}'
```

**Update car**
```bash
curl -X PUT http://localhost:3000/cars/crs001 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Thunder II","year":2025}'
```

**Delete car**
```bash
curl -X DELETE http://localhost:3000/cars/crs005 -b cookies.txt
```

---

### Tracks

| Action | Method | Endpoint | Body (JSON) |
|--------|--------|----------|-------------|
| List all | `GET` | `/tracks` | — |
| Get one | `GET` | `/tracks/:id` | — |
| Create | `POST` | `/tracks` | `name`, `country`, `lengthKm` |
| Update | `PUT` | `/tracks/:id` | any of: `name`, `country`, `lengthKm` |
| Delete | `DELETE` | `/tracks/:id` | — |

**Create track**
```bash
curl -X POST http://localhost:3000/tracks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Brands Hatch","country":"UK","lengthKm":3.908}'
```

**Update track**
```bash
curl -X PUT http://localhost:3000/tracks/trk001 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"lengthKm":5.9}'
```

**Delete track**
```bash
curl -X DELETE http://localhost:3000/tracks/trk005 -b cookies.txt
```

---

### Records (lap times)

| Action | Method | Endpoint | Body (JSON) |
|--------|--------|----------|-------------|
| List all | `GET` | `/records` | — |
| Get one | `GET` | `/records/:id` | — |
| Create | `POST` | `/records` | `userId`, `carId`, `trackId`, `lapTime`, `date` |
| Update | `PUT` | `/records/:id` | any of: `userId`, `carId`, `trackId`, `lapTime`, `date` |
| Delete | `DELETE` | `/records/:id` | — |

`userId`, `carId`, and `trackId` must exist. `date` format: `"YYYY-MM-DD"`.

**Create record**
```bash
curl -X POST http://localhost:3000/records \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"userId":"usr001","carId":"crs001","trackId":"trk001","lapTime":90.5,"date":"2026-03-08"}'
```

**Update record** (e.g. fix lap time)
```bash
curl -X PUT http://localhost:3000/records/rcd001 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"lapTime":91.0,"date":"2026-03-09"}'
```

**Delete record**
```bash
curl -X DELETE http://localhost:3000/records/rcd010 -b cookies.txt
```

---

### Quick list commands

```bash
curl -b cookies.txt http://localhost:3000/users
curl -b cookies.txt http://localhost:3000/cars
curl -b cookies.txt http://localhost:3000/tracks
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

IDs in seed data are fixed (e.g. usr001, crs001, trk001, rcd001) so reset is deterministic and tests can rely on stable IDs.

---

## Using with Playwright

1. Start this backend (e.g. `npm start` in `backend`).
2. In tests, call `POST /login` with `username`/`password`, then use `context.storageState()` or save cookies so subsequent requests send the `session` cookie.
3. Use `POST /reset` when you need a clean, deterministic state (e.g. in `beforeEach` or global setup).
