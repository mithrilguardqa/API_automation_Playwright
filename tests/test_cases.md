# Test Cases

## API Scope

Base API tests to verify the application's backend is intact and working properly.

**Criteria tested:**

- Status code (success / failure)
- Session (with / without)
- JSON Schema validation
- CRUD operations (Create, Read, Update, Delete)
- Lookup by existing / non-existing entity
- Input validation (missing required fields)
- Referential integrity (cross-entity references)

---

### Legend

- **[P]** Positive — the operation MUST work successfully
- **[N]** Negative — the operation MUST fail in a desired manner so the app and users are protected from malfunctions

---

## Authentication Suite (6 tests)

| # | Type | Test Case |
|---|------|-----------|
| 1 | [P] | Check user can login successfully with valid credentials |
| 2 | [N] | Check user cannot login with invalid credentials |
| 3 | [N] | Check user cannot login with empty credentials |
| 4 | [P] | Check logout works properly |
| 5 | [N] | Check logout fails if not logged in |
| 6 | [N] | Check user cannot access protected endpoint after logout |

## Users Suite (8 tests)

| # | Type | Test Case |
|---|------|-----------|
| 1 | [P] | Check user can get all users list |
| 2 | [P] | Check user can get user details by id |
| 3 | [N] | Check user receives proper error when getting user by invalid id |
| 4 | [P] | Check user can create new user |
| 5 | [N] | Check user cannot create user with missing required fields |
| 6 | [P] | Check user can update an existing user |
| 7 | [N] | Check user cannot update a non-existent user |
| 8 | [P] | Check user can delete a user |

## Cars Suite (9 tests)

| # | Type | Test Case |
|---|------|-----------|
| 1 | [P] | Check user can get all cars |
| 2 | [P] | Check user can get car by id |
| 3 | [N] | Check user receives proper error when getting car by invalid id |
| 4 | [P] | Check user can get cars by name |
| 5 | [P] | Check user can get cars by model |
| 6 | [P] | Check user can create a new car |
| 7 | [N] | Check user cannot create car with missing required fields |
| 8 | [P] | Check user can update an existing car |
| 9 | [P] | Check user can delete a car |

## Tracks Suite (6 tests)

| # | Type | Test Case |
|---|------|-----------|
| 1 | [P] | Check user can get all tracks |
| 2 | [P] | Check user can get track by id |
| 3 | [N] | Check user receives proper error when getting track by invalid id |
| 4 | [P] | Check user can create a new track |
| 5 | [N] | Check user cannot create track with missing required fields |
| 6 | [P] | Check user can update an existing track |

## Records Suite (7 tests)

| # | Type | Test Case |
|---|------|-----------|
| 1 | [P] | Check user can get all records |
| 2 | [P] | Check user can get record by id |
| 3 | [N] | Check user receives proper error when getting record by invalid id |
| 4 | [P] | Check user can create a new record |
| 5 | [N] | Check user cannot create record with missing required fields |
| 6 | [N] | Check user cannot create record with non-existent userId |
| 7 | [P] | Check user can update an existing record |

## End-to-End Flow (1 test)

| # | Type | Test Case |
|---|------|-----------|
| 1 | [P] | Full flow: create user -> create car -> create track -> create record -> verify record |

---

**Total: 37 tests** (22 positive, 15 negative)
