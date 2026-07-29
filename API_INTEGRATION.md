# FixItNow — API Integration Guide

> **Audience:** Frontend Team
> **Backend:** FixItNow-Backend (Node.js + Express + Prisma + PostgreSQL + Stripe)
> **Generated from:** `src/app.ts`, `src/modules/**`, `src/middlewares/**`, `prisma/schema/**`

This document describes every available REST API endpoint, grouped by category, with HTTP method, access role, request payload, and expected response structures.

---

## Table of Contents

1. [Conventions](#conventions)
2. [Authentication & Cookies](#authentication--cookies)
3. [Standard Response Envelope](#standard-response-envelope)
4. [Error Response Structure](#error-response-structure)
5. [Pagination](#pagination)
6. [Health Check](#health-check)
7. [Authentication APIs](#authentication-apis)
8. [Services APIs](#services-apis)
9. [Technicians (Public Listing) APIs](#technicians-public-listing-apis)
10. [Technician (Self-Service) APIs](#technician-self-service-apis)
11. [Bookings APIs](#bookings-apis)
12. [Payments APIs](#payments-apis)
13. [Reviews APIs](#reviews-apis)
14. [Admin — Users & Bookings & Payments APIs](#admin--users--bookings--payments-apis)
15. [Admin — Categories APIs](#admin--categories-apis)
16. [Enums Reference](#enums-reference)
17. [Booking Status Flow](#booking-status-flow)
18. [Quick Endpoint Index](#quick-endpoint-index)

---

## Conventions

| Item | Value |
|------|-------|
| **Base URL (dev)** | `http://localhost:5000/api` |
| **Content-Type** | `application/json` (except Stripe webhook) |
| **Auth mechanism** | HTTP-only cookies (`accessToken`, `refreshToken`) |
| **Credentials** | Send `credentials: "include"` on every request from the frontend |
| **IDs** | UUID v4 strings |
| **Dates** | ISO 8601 / `YYYY-MM-DD` for `scheduledDate` |

> Replace `http://localhost:5000/api` with your production/staging base URL as needed. All routes below are relative to this base URL.

---

## Authentication & Cookies

- On **login**, the backend sets two HTTP-only cookies:
  - `accessToken` (short-lived, default `1d`)
  - `refreshToken` (long-lived, default `7d`)
- Cookies are `httpOnly`, `sameSite: "strict"`, and `secure` in production.
- The frontend **does not** read these cookies directly. It simply sends them automatically via `credentials: "include"`.
- When the `accessToken` expires, call [`POST /auth/refresh`](#post-authrefresh) to silently rotate tokens.
- On **logout**, both cookies are cleared by the server.

### Roles

| Role | Description |
|------|-------------|
| `CUSTOMER` | End customer who books services and pays |
| `TECHNICIAN` | Service provider who creates services and manages bookings |
| `ADMIN` | Platform administrator |

---

## Standard Response Envelope

All success responses use this shape (see [`sendResponse.ts`](src/utils/sendResponse.ts:12)):

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human-readable message",
  "meta": { "page": 1, "limit": 10, "total": 0, "totalPage": 0 },
  "data": {}
}
```

- `meta` is only present for **paginated** list endpoints.
- `data` is `null` for actions that return no body (e.g., delete, logout).

---

## Error Response Structure

All errors are handled by the global error handler (see [`globalErrorHandler.ts`](src/middlewares/globalErrorHandler.ts:46)):

```json
{
  "success": false,
  "message": "Error summary",
  "errorSources": [
    { "path": "field", "message": "Detailed message" }
  ],
  "stack": "Only present in development"
}
```

### Common Error Status Codes

| Code | Meaning |
|------|---------|
| `400` | Validation error (Zod) or bad request |
| `401` | Not authenticated / token missing or invalid |
| `403` | Forbidden — role not allowed or not the resource owner |
| `404` | Resource not found |
| `409` | Conflict (e.g., duplicate email, duplicate review) |
| `500` | Internal server error |

---

## Pagination

List endpoints accept these **query params** (see [`validations/index.ts`](src/validations/index.ts:7)):

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `page` | string (number) | `1` | `>= 1` |
| `limit` | string (number) | `10` | `1–100` |
| `sortBy` | string | `createdAt` | Field name to sort by |
| `sortOrder` | `asc` \| `desc` | `desc` | |
| `searchTerm` | string | — | Generic search (where supported) |

**`meta` object returned:**

```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPage": 3
}
```

---

## Health Check

### `GET /health`

**Access:** Public

**Description:** Returns server + database connectivity status.

**Response (200):**

```json
{
  "status": "ok",
  "message": "Database is connected"
}
```

---

## Authentication APIs

Base path: `/api/auth` — see [`auth.route.ts`](src/modules/auth/auth.route.ts:81)

### `POST /auth/register`

**Access:** Public

**Description:** Registers a new user. If `role` is `TECHNICIAN`, an empty `TechnicianProfile` is auto-created.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "CUSTOMER"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `name` | string | ✅ | min 1 char |
| `email` | string | ✅ | valid email |
| `password` | string | ✅ | min 6 chars |
| `role` | `CUSTOMER` \| `TECHNICIAN` | ✅ | enum |

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully!",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z",
    "technicianProfile": null
  }
}
```

**Error Responses:**

- `400` — Validation error (missing/invalid fields)
- `409` — Email already exists

```json
{
  "success": false,
  "message": "User already exists with this email!",
  "errorSources": [{ "path": "", "message": "User already exists with this email!" }]
}
```

---

### `POST /auth/login`

**Access:** Public

**Description:** Authenticates a user and sets `accessToken` + `refreshToken` as HTTP-only cookies.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `email` | string | ✅ | valid email |
| `password` | string | ✅ | non-empty |

**Success Response (200):** — sets `accessToken` and `refreshToken` cookies

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully!",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` — Validation error
- `401` — Invalid password
- `403` — User is banned
- `404` — User not found

```json
{
  "success": false,
  "message": "Invalid password!",
  "errorSources": [{ "path": "", "message": "Invalid password!" }]
}
```

---

### `GET /auth/me`

**Access:** `CUSTOMER`, `TECHNICIAN`, `ADMIN` (authenticated)

**Description:** Returns the currently authenticated user's profile.

**Request:** No body. Cookies sent automatically.

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User profile retrieved successfully!",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `401` — Unauthorized / token missing or invalid
- `404` — User not found

---

### `POST /auth/logout`

**Access:** `CUSTOMER`, `TECHNICIAN`, `ADMIN` (authenticated)

**Description:** Clears the `accessToken` and `refreshToken` HTTP-only cookies.

**Request:** No body.

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged out successfully!",
  "data": null
}
```

---

### `POST /auth/refresh`

**Access:** Public (requires valid `refreshToken` cookie)

**Description:** Issues a new access token and rotates the refresh token using the `refreshToken` cookie.

**Request:** No body. Requires `refreshToken` cookie.

**Success Response (200):** — sets new `accessToken` and `refreshToken` cookies

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Access token refreshed successfully!",
  "data": { "refreshed": true }
}
```

**Error Responses:**

- `401` — Refresh token missing, invalid, or expired
- `403` — User is banned
- `404` — User not found

---

### `PATCH /auth/me`

**Access:** Authenticated (`CUSTOMER`, `TECHNICIAN`, `ADMIN`)

**Description:** Updates the current user's profile information (name, email, password, bio, skills, experience, hourly rate, location).

**Request Body:**

```json
{
  "name": "Johnathan Doe",
  "email": "john.updated@example.com",
  "bio": "Experienced technician with 5+ years experience.",
  "skills": ["HVAC", "Plumbing"],
  "experience": 5,
  "hourlyRate": 65,
  "location": "New York, NY"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully!",
  "data": {
    "id": "uuid",
    "name": "Johnathan Doe",
    "email": "john.updated@example.com",
    "role": "CUSTOMER",
    "status": "ACTIVE",
    "createdAt": "2026-07-08T19:44:45.893Z",
    "updatedAt": "2026-07-28T17:13:55.161Z",
    "technicianProfile": null
  }
}
```

**Error Responses:**

- `400` — Validation error
- `401` — Unauthorized (token missing or invalid)
- `409` — Email is already taken by another account

---

### `DELETE /auth/me`

**Access:** Authenticated (`CUSTOMER`, `TECHNICIAN`, `ADMIN`)

**Description:** Deletes the authenticated user's account permanently and clears auth session cookies.

**Request Body:** None.

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User account deleted successfully!",
  "data": null
}
```

**Error Responses:**

- `401` — Unauthorized
- `404` — User not found

---

## Services APIs

Base path: `/api/services` — see [`service.route.ts`](src/modules/service/service.route.ts:29)

### `GET /services`

**Access:** Public

**Description:** Returns a paginated list of services with category and technician info.

**Query Params (in addition to [pagination](#pagination)):**

| Param | Type | Notes |
|-------|------|-------|
| `search` | string | Searches `title` and `description` (case-insensitive) |
| `categoryId` | string (UUID) | Filter by category |
| `minPrice` | string (number) | Minimum price |
| `maxPrice` | string (number) | Maximum price |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Services retrieved successfully!",
  "meta": { "page": 1, "limit": 10, "total": 25, "totalPage": 3 },
  "data": [
    {
      "id": "uuid",
      "title": "Pipe Repair",
      "description": "Fix leaking pipes",
      "price": 49.99,
      "categoryId": "uuid",
      "technicianProfileId": "uuid",
      "createdAt": "2026-07-28T10:00:00.000Z",
      "updatedAt": "2026-07-28T10:00:00.000Z",
      "category": { "id": "uuid", "name": "Plumbing", "description": "..." },
      "technicianProfile": {
        "id": "uuid",
        "user": { "name": "Jane Smith", "email": "jane@example.com" }
      }
    }
  ]
}
```

---

### `GET /services/categories`

**Access:** Public

**Description:** Returns all service categories with the count of services in each.

**Query Params:** `sortBy` (`name` \| `createdAt`)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved successfully!",
  "data": [
    {
      "id": "uuid",
      "name": "Plumbing",
      "description": "Plumbing repair and installation services",
      "createdAt": "2026-07-28T10:00:00.000Z",
      "updatedAt": "2026-07-28T10:00:00.000Z",
      "_count": { "services": 12 }
    }
  ]
}
```

---

### `GET /services/{id}`

**Access:** Public

**Path Params:**

| Param | Type | Required |
|-------|------|----------|
| `id` | UUID | ✅ |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service retrieved successfully!",
  "data": {
    "id": "uuid",
    "title": "Pipe Repair",
    "description": "Fix leaking pipes",
    "price": 49.99,
    "categoryId": "uuid",
    "technicianProfileId": "uuid",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z",
    "category": { "id": "uuid", "name": "Plumbing", "description": "..." },
    "technicianProfile": {
      "id": "uuid",
      "user": { "name": "Jane Smith", "email": "jane@example.com" }
    }
  }
}
```

**Error Responses:**

- `400` — Invalid UUID format
- `404` — Service not found

---

### `POST /services`

**Access:** `TECHNICIAN`

**Description:** Creates a new service for the authenticated technician's profile.

**Request Body:**

```json
{
  "title": "Pipe Repair",
  "description": "Fix leaking pipes quickly and professionally",
  "price": 49.99,
  "categoryId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `title` | string | ✅ | min 3 chars |
| `description` | string | ✅ | non-empty |
| `price` | number | ✅ | `>= 0` |
| `categoryId` | UUID | ✅ | valid UUID |

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Service created successfully!",
  "data": {
    "id": "uuid",
    "title": "Pipe Repair",
    "description": "Fix leaking pipes quickly and professionally",
    "price": 49.99,
    "categoryId": "uuid",
    "technicianProfileId": "uuid",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z",
    "category": { "id": "uuid", "name": "Plumbing", "description": "..." },
    "technicianProfile": {
      "id": "uuid",
      "user": { "name": "Jane Smith", "email": "jane@example.com" }
    }
  }
}
```

**Error Responses:**

- `400` — Validation error
- `401` — Not authenticated
- `403` — Not a technician
- `404` — Technician profile or category not found

---

### `PATCH /services/{id}`

**Access:** `TECHNICIAN` (must own the service)

**Path Params:** `id` (UUID)

**Request Body (all fields optional):**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 59.99,
  "categoryId": "uuid"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `title` | string | ❌ | min 3 chars |
| `description` | string | ❌ | non-empty |
| `price` | number | ❌ | `>= 0` |
| `categoryId` | UUID | ❌ | valid UUID |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service updated successfully!",
  "data": { "id": "uuid", "title": "Updated Title", "...": "..." }
}
```

**Error Responses:**

- `400` — Validation error / invalid UUID
- `403` — Not authorized to update this service
- `404` — Service or category not found

---

### `DELETE /services/{id}`

**Access:** `TECHNICIAN` (must own the service)

**Path Params:** `id` (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service deleted successfully!",
  "data": null
}
```

**Error Responses:**

- `400` — Invalid UUID
- `403` — Not authorized to delete this service
- `404` — Service not found

---

## Technicians (Public Listing) APIs

Base path: `/api/services/technicians` — see [`technician.route.ts`](src/modules/technician/technician.route.ts:199)

### `GET /services/technicians`

**Access:** Public

**Description:** Returns a paginated list of active technician profiles.

**Query Params (in addition to [pagination](#pagination)):**

| Param | Type | Notes |
|-------|------|-------|
| `location` | string | Case-insensitive contains match |
| `minRating` | string (number) | `averageRating >= value` |
| `minHourlyRate` | string (number) | `hourlyRate >= value` |
| `maxHourlyRate` | string (number) | `hourlyRate <= value` |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Technicians retrieved successfully!",
  "meta": { "page": 1, "limit": 10, "total": 5, "totalPage": 1 },
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "bio": "Certified plumber with 10 years experience",
      "skills": ["plumbing", "heating"],
      "experience": 10,
      "hourlyRate": 35.0,
      "location": "New York",
      "totalReviews": 42,
      "averageRating": 4.8,
      "availability": {},
      "isVerified": true,
      "createdAt": "2026-07-28T10:00:00.000Z",
      "updatedAt": "2026-07-28T10:00:00.000Z",
      "user": { "name": "Jane Smith", "email": "jane@example.com", "status": "ACTIVE" }
    }
  ]
}
```

---

### `GET /services/technicians/{id}`

**Access:** Public

**Path Params:** `id` (UUID — the `TechnicianProfile.id`)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Technician retrieved successfully!",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "bio": "Certified plumber with 10 years experience",
    "skills": ["plumbing", "heating"],
    "experience": 10,
    "hourlyRate": 35.0,
    "location": "New York",
    "totalReviews": 42,
    "averageRating": 4.8,
    "availability": {},
    "isVerified": true,
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z",
    "user": { "name": "Jane Smith", "email": "jane@example.com" },
    "services": [],
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent work!",
        "customer": { "name": "John Doe" }
      }
    ]
  }
}
```

**Error Responses:**

- `400` — Invalid UUID
- `404` — Technician not found

---

## Technician (Self-Service) APIs

Base path: `/api/technician` — see [`technician.route.ts`](src/modules/technician/technician.route.ts:31)

### `GET /technician/bookings`

**Access:** `TECHNICIAN`

**Description:** Returns all bookings assigned to the authenticated technician.

**Query Params:** [pagination](#pagination)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Technician bookings retrieved successfully!",
  "data": [
    {
      "id": "uuid",
      "customerId": "uuid",
      "serviceId": "uuid",
      "technicianProfileId": "uuid",
      "servicePrice": 49.99,
      "contactNumber": "+1234567890",
      "scheduledDate": "2026-08-01",
      "timeSlot": "10:00-12:00",
      "status": "REQUESTED",
      "cancellationReason": null,
      "createdAt": "2026-07-28T10:00:00.000Z",
      "updatedAt": "2026-07-28T10:00:00.000Z",
      "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
      "customer": { "name": "John Doe", "email": "john@example.com" }
    }
  ]
}
```

**Error Responses:**

- `401` — Not authenticated
- `403` — Not a technician
- `404` — Technician profile not found

---

### `PATCH /technician/bookings/{id}`

**Access:** `TECHNICIAN` (must own the booking)

**Description:** Updates the status of a booking assigned to the technician.

**Path Params:** `id` (UUID)

**Request Body:**

```json
{
  "status": "ACCEPTED"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `status` | enum | ✅ | `ACCEPTED` \| `DECLINED` \| `IN_PROGRESS` \| `COMPLETED` |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking status updated successfully!",
  "data": {
    "id": "uuid",
    "status": "ACCEPTED",
    "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
    "customer": { "name": "John Doe", "email": "john@example.com" }
  }
}
```

**Error Responses:**

- `400` — Invalid status / invalid UUID
- `403` — Not authorized to update this booking
- `404` — Booking or technician profile not found

---

### `PUT /technician/profile`

**Access:** `TECHNICIAN`

**Description:** Updates the authenticated technician's profile. All fields optional.

**Request Body:**

```json
{
  "bio": "Certified plumber with 10 years experience",
  "skills": ["plumbing", "heating", "boilers"],
  "experience": 10,
  "hourlyRate": 35.0,
  "location": "New York"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `bio` | string | ❌ | non-empty |
| `skills` | string[] | ❌ | at least 1 item |
| `experience` | integer | ❌ | `>= 0` |
| `hourlyRate` | number | ❌ | `>= 0` |
| `location` | string | ❌ | non-empty |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully!",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "bio": "Certified plumber with 10 years experience",
    "skills": ["plumbing", "heating", "boilers"],
    "experience": 10,
    "hourlyRate": 35.0,
    "location": "New York",
    "totalReviews": 42,
    "averageRating": 4.8,
    "availability": {},
    "isVerified": true,
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` — Validation error
- `401` — Not authenticated
- `403` — Not a technician

---

### `PUT /technician/availability`

**Access:** `TECHNICIAN`

**Description:** Updates the technician's weekly availability. The `availability` object maps day names to arrays of time slots.

**Request Body:**

```json
{
  "availability": {
    "monday": ["09:00-12:00", "14:00-18:00"],
    "tuesday": ["09:00-12:00", "14:00-18:00"],
    "wednesday": ["09:00-12:00"],
    "thursday": ["14:00-18:00"],
    "friday": ["09:00-12:00", "14:00-18:00"],
    "saturday": ["10:00-15:00"],
    "sunday": []
  }
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `availability` | object (day → string[]) | ✅ | non-empty slot strings |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Availability updated successfully!",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "availability": {
      "monday": ["09:00-12:00", "14:00-18:00"],
      "tuesday": ["09:00-12:00", "14:00-18:00"]
    },
    "...": "..."
  }
}
```

**Error Responses:**

- `400` — Validation error
- `401` — Unauthorized / token missing or invalid
- `404` — Technician profile not found

---

## Bookings APIs

Base path: `/api/bookings` — see [`booking.route.ts`](src/modules/booking/booking.route.ts:51)

### `POST /bookings`

**Access:** `CUSTOMER`

**Description:** Creates a new booking for a service. Initial status is `REQUESTED`.

**Request Body:**

```json
{
  "serviceId": "550e8400-e29b-41d4-a716-446655440000",
  "scheduledDate": "2026-08-01",
  "timeSlot": "10:00-12:00",
  "contactNumber": "+1234567890"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `serviceId` | UUID | ✅ | valid UUID |
| `scheduledDate` | string | ✅ | `YYYY-MM-DD` |
| `timeSlot` | string | ✅ | non-empty |
| `contactNumber` | string | ✅ | non-empty |

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Booking created successfully!",
  "data": {
    "id": "uuid",
    "customerId": "uuid",
    "serviceId": "uuid",
    "technicianProfileId": "uuid",
    "servicePrice": 49.99,
    "contactNumber": "+1234567890",
    "scheduledDate": "2026-08-01",
    "timeSlot": "10:00-12:00",
    "status": "REQUESTED",
    "cancellationReason": null,
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z",
    "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
    "customer": { "name": "John Doe", "email": "john@example.com" },
    "technicianProfile": { "id": "uuid", "user": { "name": "Jane Smith" } }
  }
}
```

**Error Responses:**

- `400` — Validation error
- `401` — Not authenticated
- `403` — Not a customer
- `404` — Service not found

---

### `GET /bookings`

**Access:** `CUSTOMER`, `TECHNICIAN`, `ADMIN`

**Description:** Returns bookings scoped to the caller's role:
- `CUSTOMER` → only their own bookings
- `TECHNICIAN` → bookings assigned to their profile
- `ADMIN` → all bookings

**Query Params:** [pagination](#pagination)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bookings retrieved successfully!",
  "meta": { "page": 1, "limit": 10, "total": 5, "totalPage": 1 },
  "data": [
    {
      "id": "uuid",
      "status": "REQUESTED",
      "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
      "customer": { "name": "John Doe", "email": "john@example.com" },
      "technicianProfile": { "id": "uuid", "user": { "name": "Jane Smith" } }
    }
  ]
}
```

---

### `GET /bookings/{id}`

**Access:** `CUSTOMER`, `TECHNICIAN`, `ADMIN` (must be owner or admin)

**Path Params:** `id` (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking retrieved successfully!",
  "data": {
    "id": "uuid",
    "customerId": "uuid",
    "serviceId": "uuid",
    "technicianProfileId": "uuid",
    "servicePrice": 49.99,
    "contactNumber": "+1234567890",
    "scheduledDate": "2026-08-01",
    "timeSlot": "10:00-12:00",
    "status": "REQUESTED",
    "cancellationReason": null,
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z",
    "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
    "customer": { "name": "John Doe", "email": "john@example.com" },
    "technicianProfile": { "id": "uuid", "user": { "name": "Jane Smith" } }
  }
}
```

**Error Responses:**

- `400` — Invalid UUID
- `403` — Not authorized to view this booking
- `404` — Booking not found

---

### `PATCH /bookings/{id}/cancel`

**Access:** `CUSTOMER` (must own the booking)

**Description:** Cancels a booking owned by the authenticated customer. Behavior depends on booking/payment state:

| Booking State | Payment State | Result |
|---------------|---------------|--------|
| `ACCEPTED` | `PENDING` | Cancelled, no refund, payment stays `PENDING` |
| `PAID` | `COMPLETED` | Cancelled + Stripe refund issued, payment becomes `REFUNDED` |
| `IN_PROGRESS` | — | ❌ Cannot cancel (400) |
| `COMPLETED` | — | ❌ Cannot cancel (400) |
| `CANCELLED` | — | ❌ Already cancelled (400) |

**Path Params:** `id` (UUID)

**Request Body:**

```json
{
  "reason": "Booked by mistake"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `reason` | string | ✅ | non-empty |

**Success Response (200) — no refund:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking cancelled successfully!",
  "data": {
    "id": "uuid",
    "status": "CANCELLED",
    "cancellationReason": "Booked by mistake",
    "payment": { "status": "PENDING" }
  }
}
```

**Success Response (200) — with refund:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking cancelled successfully!",
  "data": {
    "id": "uuid",
    "status": "CANCELLED",
    "cancellationReason": "No longer needed",
    "payment": { "status": "REFUNDED" }
  }
}
```

**Error Responses:**

- `400` — Booking cannot be cancelled (already cancelled / in progress / completed)
- `403` — Not authorized to cancel this booking
- `404` — Booking not found

```json
{
  "success": false,
  "message": "Booking cannot be cancelled after the service has started.",
  "errorSources": [
    { "path": "", "message": "Booking cannot be cancelled after the service has started." }
  ]
}
```

---

## Payments APIs

Base path: `/api/payments` — see [`payment.route.ts`](src/modules/payment/payment.route.ts:74)

### `POST /payments/checkout`

**Access:** `CUSTOMER`

**Description:** Creates a Stripe Hosted Checkout Session for a booking and returns the Checkout URL the frontend should redirect the customer to. The booking must be in `ACCEPTED` status and not already paid. On successful payment, the Stripe webhook marks the booking as `PAID`.

**Request Body:**

```json
{
  "bookingId": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `bookingId` | UUID | ✅ | valid UUID |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Stripe Checkout session created successfully!",
  "data": {
    "url": "https://checkout.stripe.com/c/pay/cs_test_abc123",
    "sessionId": "cs_test_abc123"
  }
}
```

**Frontend flow:** Redirect the user to `data.url`. Stripe will redirect back to:
- Success: `{FRONTEND_URL}/payment/success?bookingId={bookingId}`
- Cancel: `{FRONTEND_URL}/payment/cancel?bookingId={bookingId}`

**Error Responses:**

- `400` — Booking not accepted or already paid
- `403` — Not authorized to pay for this booking
- `404` — Booking not found

---

### `GET /payments`

**Access:** `CUSTOMER`, `ADMIN`

**Description:** Returns payment history.
- `CUSTOMER` → only their own payments
- `ADMIN` → all payments

**Query Params:** [pagination](#pagination)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment history retrieved successfully!",
  "data": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "amount": 49.99,
      "transactionId": "pi_xxx",
      "provider": "STRIPE",
      "status": "COMPLETED",
      "stripeCheckoutSessionId": "cs_test_xxx",
      "paidAt": "2026-07-28T10:05:00.000Z",
      "createdAt": "2026-07-28T10:00:00.000Z",
      "updatedAt": "2026-07-28T10:05:00.000Z",
      "booking": {
        "id": "uuid",
        "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
        "customer": { "name": "John Doe", "email": "john@example.com" }
      }
    }
  ]
}
```

---

### `GET /payments/{id}`

**Access:** `CUSTOMER`, `ADMIN` (customer must own the payment)

**Path Params:** `id` (UUID — the `Payment.id`)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment details retrieved successfully!",
  "data": {
    "id": "uuid",
    "bookingId": "uuid",
    "amount": 49.99,
    "transactionId": "pi_xxx",
    "provider": "STRIPE",
    "status": "COMPLETED",
    "stripeCheckoutSessionId": "cs_test_xxx",
    "paidAt": "2026-07-28T10:05:00.000Z",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:05:00.000Z",
    "booking": {
      "id": "uuid",
      "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
      "customer": { "name": "John Doe", "email": "john@example.com" }
    }
  }
}
```

**Error Responses:**

- `400` — Invalid UUID
- `403` — Not authorized to view this payment
- `404` — Payment not found

---

### `POST /payments/webhook` (Stripe → Backend)

**Access:** Public (verified via Stripe signature header)

**Description:** Receives Stripe webhook events. This endpoint is **not** called by the frontend — it is called by Stripe. Documented here for completeness.

**Headers:** `stripe-signature: <Stripe signature>`
**Body:** Raw Stripe event payload (`application/json`, parsed as raw buffer)

**Handled events:**

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Marks booking `PAID`, payment `COMPLETED` |
| `checkout.session.async_payment_succeeded` | Marks booking `PAID`, payment `COMPLETED` |
| `checkout.session.async_payment_failed` | Marks payment `FAILED` |
| `charge.refunded` | Marks payment `REFUNDED`, booking `CANCELLED` |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Webhook received successfully!",
  "data": null
}
```

**Error Responses:**

- `400` — Missing/invalid Stripe signature or verification failed

---

## Reviews APIs

Base path: `/api/reviews` — see [`review.route.ts`](src/modules/review/review.route.ts:44)

### `POST /reviews`

**Access:** `CUSTOMER`

**Description:** Creates a review for a completed booking. The booking must belong to the customer and have status `COMPLETED`. Only one review per booking is allowed. The technician's `averageRating` and `totalReviews` are recalculated automatically.

**Request Body:**

```json
{
  "bookingId": "550e8400-e29b-41d4-a716-446655440000",
  "rating": 5,
  "comment": "Excellent work, very professional!"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `bookingId` | UUID | ✅ | valid UUID |
| `rating` | integer | ✅ | `1–5` |
| `comment` | string | ❌ | non-empty if provided |

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully!",
  "data": {
    "id": "uuid",
    "bookingId": "uuid",
    "customerId": "uuid",
    "technicianProfileId": "uuid",
    "rating": 5,
    "comment": "Excellent work, very professional!",
    "createdAt": "2026-07-28T10:10:00.000Z",
    "customer": { "name": "John Doe", "email": "john@example.com" },
    "technicianProfile": { "id": "uuid" }
  }
}
```

**Error Responses:**

- `400` — Validation error / booking not `COMPLETED`
- `403` — Not authorized to review this booking
- `404` — Booking not found
- `409` — Review already exists for this booking

```json
{
  "success": false,
  "message": "Review already exists for this booking!",
  "errorSources": [{ "path": "", "message": "Review already exists for this booking!" }]
}
```

---

## Admin — Users & Bookings & Payments APIs

Base path: `/api/admin` — see [`admin.route.ts`](src/modules/admin/admin.route.ts:31)

> All endpoints in this section require the `ADMIN` role.

### `GET /admin/users`

**Access:** `ADMIN`

**Description:** Returns a paginated list of all users (passwords omitted), including their technician profile if present.

**Query Params:** [pagination](#pagination)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully!",
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPage": 5 },
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER",
      "status": "ACTIVE",
      "createdAt": "2026-07-28T10:00:00.000Z",
      "updatedAt": "2026-07-28T10:00:00.000Z",
      "technicianProfile": null
    }
  ]
}
```

---

### `PATCH /admin/users/{id}`

**Access:** `ADMIN`

**Description:** Toggles a user's status between `ACTIVE` and `BANNED`.

**Path Params:** `id` (UUID)

**Request Body:**

```json
{
  "status": "BANNED"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `status` | enum | ✅ | `ACTIVE` \| `BANNED` |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User status updated successfully!",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER",
    "status": "BANNED",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:05:00.000Z"
  }
}
```

**Error Responses:**

- `400` — Invalid status / invalid UUID
- `404` — User not found

---

### `GET /admin/bookings`

**Access:** `ADMIN`

**Description:** Returns a paginated list of all bookings.

**Query Params:** [pagination](#pagination)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bookings retrieved successfully!",
  "meta": { "page": 1, "limit": 10, "total": 30, "totalPage": 3 },
  "data": [
    {
      "id": "uuid",
      "status": "REQUESTED",
      "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
      "customer": { "name": "John Doe", "email": "john@example.com" },
      "technicianProfile": { "id": "uuid", "user": { "name": "Jane Smith" } }
    }
  ]
}
```

---

### `GET /admin/bookings/{id}`

**Access:** `ADMIN`

**Path Params:** `id` (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking retrieved successfully!",
  "data": {
    "id": "uuid",
    "customerId": "uuid",
    "serviceId": "uuid",
    "technicianProfileId": "uuid",
    "servicePrice": 49.99,
    "contactNumber": "+1234567890",
    "scheduledDate": "2026-08-01",
    "timeSlot": "10:00-12:00",
    "status": "REQUESTED",
    "cancellationReason": null,
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z",
    "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
    "customer": { "name": "John Doe", "email": "john@example.com" },
    "technicianProfile": { "id": "uuid", "user": { "name": "Jane Smith" } },
    "payment": null,
    "review": null
  }
}
```

**Error Responses:**

- `400` — Invalid UUID
- `404` — Booking not found

---

### `GET /admin/payments`

**Access:** `ADMIN`

**Description:** Returns all payments (most recent first).

**Query Params:** [pagination](#pagination)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payments retrieved successfully!",
  "data": [
    {
      "id": "uuid",
      "bookingId": "uuid",
      "amount": 49.99,
      "transactionId": "pi_xxx",
      "provider": "STRIPE",
      "status": "COMPLETED",
      "stripeCheckoutSessionId": "cs_test_xxx",
      "paidAt": "2026-07-28T10:05:00.000Z",
      "createdAt": "2026-07-28T10:00:00.000Z",
      "updatedAt": "2026-07-28T10:05:00.000Z",
      "booking": {
        "id": "uuid",
        "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
        "customer": { "name": "John Doe", "email": "john@example.com" }
      }
    }
  ]
}
```

---

### `GET /admin/payments/{id}`

**Access:** `ADMIN`

**Path Params:** `id` (UUID — the `Payment.id`)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment retrieved successfully!",
  "data": {
    "id": "uuid",
    "bookingId": "uuid",
    "amount": 49.99,
    "transactionId": "pi_xxx",
    "provider": "STRIPE",
    "status": "COMPLETED",
    "stripeCheckoutSessionId": "cs_test_xxx",
    "paidAt": "2026-07-28T10:05:00.000Z",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:05:00.000Z",
    "booking": {
      "id": "uuid",
      "service": { "id": "uuid", "title": "Pipe Repair", "...": "..." },
      "customer": { "name": "John Doe", "email": "john@example.com" }
    }
  }
}
```

**Error Responses:**

- `400` — Invalid UUID
- `404` — Payment not found

---

## Admin — Categories APIs

Base path: `/api/admin/categories` — see [`category.route.ts`](src/modules/category/category.route.ts:31)

> All endpoints in this section require the `ADMIN` role.

### `GET /admin/categories`

**Access:** `ADMIN`

**Description:** Returns all categories with the count of services in each (most recent first).

**Query Params:** [pagination](#pagination)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved successfully!",
  "data": [
    {
      "id": "uuid",
      "name": "Plumbing",
      "description": "Plumbing repair and installation services",
      "createdAt": "2026-07-28T10:00:00.000Z",
      "updatedAt": "2026-07-28T10:00:00.000Z",
      "_count": { "services": 12 }
    }
  ]
}
```

---

### `POST /admin/categories`

**Access:** `ADMIN`

**Request Body:**

```json
{
  "name": "Plumbing",
  "description": "Plumbing repair and installation services"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `name` | string | ✅ | non-empty, unique |
| `description` | string | ❌ | non-empty if provided |

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully!",
  "data": {
    "id": "uuid",
    "name": "Plumbing",
    "description": "Plumbing repair and installation services",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` — Validation error
- `409` — Category with this name already exists

---

### `PATCH /admin/categories/{id}`

**Access:** `ADMIN`

**Path Params:** `id` (UUID)

**Request Body (all fields optional):**

```json
{
  "name": "Plumbing & Heating",
  "description": "Updated description"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `name` | string | ❌ | non-empty, unique |
| `description` | string | ❌ | non-empty |

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category updated successfully!",
  "data": {
    "id": "uuid",
    "name": "Plumbing & Heating",
    "description": "Updated description",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:05:00.000Z",
    "_count": { "services": 12 }
  }
}
```

**Error Responses:**

- `400` — Validation error / invalid UUID
- `404` — Category not found
- `409` — Category with this name already exists

---

### `DELETE /admin/categories/{id}`

**Access:** `ADMIN`

**Description:** Deletes a category. A category **cannot** be deleted if it still has services assigned to it.

**Path Params:** `id` (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category deleted successfully!",
  "data": null
}
```

**Error Responses:**

- `400` — Invalid UUID / cannot delete a category that has services assigned
- `404` — Category not found

```json
{
  "success": false,
  "message": "Cannot delete a category that has services assigned to it!",
  "errorSources": [
    { "path": "", "message": "Cannot delete a category that has services assigned to it!" }
  ]
}
```

---

## Enums Reference

Defined in [`prisma/schema/enums.prisma`](prisma/schema/enums.prisma:1):

### `Role`
- `CUSTOMER`
- `TECHNICIAN`
- `ADMIN`

### `Status` (User)
- `ACTIVE`
- `BANNED`

### `BookingStatus`
- `REQUESTED` — initial state after booking creation
- `ACCEPTED` — technician accepted
- `DECLINED` — technician declined
- `PAID` — payment completed via Stripe
- `IN_PROGRESS` — technician started the job
- `COMPLETED` — job finished
- `CANCELLED` — cancelled by customer

### `PaymentStatus`
- `PENDING` — checkout session created, awaiting payment
- `COMPLETED` — payment succeeded
- `FAILED` — payment failed
- `REFUNDED` — refund issued

---

## Booking Status Flow

Valid transitions (see [`bookingStatus.ts`](src/modules/booking/bookingStatus.ts:4)):

```
REQUESTED  ──┬──> ACCEPTED   ──┬──> PAID        ──> IN_PROGRESS ──> COMPLETED
             │                  │
             ├──> DECLINED      └──> CANCELLED
             │
             └──> CANCELLED

PAID        ──> CANCELLED  (triggers Stripe refund)

COMPLETED, DECLINED, CANCELLED  ──> (terminal, no further transitions)
```

| From | Allowed To |
|------|-----------|
| `REQUESTED` | `ACCEPTED`, `DECLINED`, `CANCELLED` |
| `ACCEPTED` | `PAID`, `CANCELLED` |
| `PAID` | `IN_PROGRESS`, `CANCELLED` |
| `IN_PROGRESS` | `COMPLETED` |
| `COMPLETED` | — (terminal) |
| `DECLINED` | — (terminal) |
| `CANCELLED` | — (terminal) |

---

## Quick Endpoint Index

| # | Method | Endpoint | Access |
|---|--------|----------|--------|
| 1 | `GET` | `/health` | Public |
| 2 | `POST` | `/auth/register` | Public |
| 3 | `POST` | `/auth/login` | Public |
| 4 | `GET` | `/auth/me` | Customer, Technician, Admin |
| 5 | `POST` | `/auth/logout` | Customer, Technician, Admin |
| 6 | `POST` | `/auth/refresh` | Public (refresh cookie) |
| 7 | `GET` | `/services` | Public |
| 8 | `GET` | `/services/categories` | Public |
| 9 | `GET` | `/services/{id}` | Public |
| 10 | `POST` | `/services` | Technician |
| 11 | `PATCH` | `/services/{id}` | Technician |
| 12 | `DELETE` | `/services/{id}` | Technician |
| 13 | `GET` | `/services/technicians` | Public |
| 14 | `GET` | `/services/technicians/{id}` | Public |
| 15 | `GET` | `/technician/bookings` | Technician |
| 16 | `PATCH` | `/technician/bookings/{id}` | Technician |
| 17 | `PUT` | `/technician/profile` | Technician |
| 18 | `PUT` | `/technician/availability` | Technician |
| 19 | `POST` | `/bookings` | Customer |
| 20 | `GET` | `/bookings` | Customer, Technician, Admin |
| 21 | `GET` | `/bookings/{id}` | Customer, Technician, Admin |
| 22 | `PATCH` | `/bookings/{id}/cancel` | Customer |
| 23 | `POST` | `/payments/checkout` | Customer |
| 24 | `GET` | `/payments` | Customer, Admin |
| 25 | `GET` | `/payments/{id}` | Customer, Admin |
| 26 | `POST` | `/payments/webhook` | Public (Stripe) |
| 27 | `POST` | `/reviews` | Customer |
| 28 | `GET` | `/admin/users` | Admin |
| 29 | `PATCH` | `/admin/users/{id}` | Admin |
| 30 | `GET` | `/admin/bookings` | Admin |
| 31 | `GET` | `/admin/bookings/{id}` | Admin |
| 32 | `GET` | `/admin/payments` | Admin |
| 33 | `GET` | `/admin/payments/{id}` | Admin |
| 34 | `GET` | `/admin/categories` | Admin |
| 35 | `POST` | `/admin/categories` | Admin |
| 36 | `PATCH` | `/admin/categories/{id}` | Admin |
| 37 | `DELETE` | `/admin/categories/{id}` | Admin |

---

### Frontend Integration Notes

1. **Always send `credentials: "include"`** with every request so the auth cookies are attached.
2. **Token rotation:** When a `401` is received, call `POST /auth/refresh` once before retrying the original request. If refresh also fails, redirect to login.
3. **Stripe Checkout:** After `POST /payments/checkout`, redirect the browser to `data.url`. Do not fetch it via XHR-only — it must be a full-page navigation.
4. **Role-based UI:** Use `GET /auth/me` on app load to determine the user's role and render the appropriate navigation/routes.
5. **Booking lifecycle:** Poll or refetch the booking after payment redirect (`/payment/success`) since the webhook updates the booking to `PAID` asynchronously.
6. **Reviews:** Only allow the review form when the booking status is `COMPLETED` and no review exists yet.
