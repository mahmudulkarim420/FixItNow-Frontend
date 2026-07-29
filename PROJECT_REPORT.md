# Authentication Implementation Notes (FixItNow)

## Overview

এই প্রজেক্টে আমি **JWT Dual Token Authentication System** implement করেছি।

### Technology
- Frontend: Next.js 16 (App Router)
- Backend: Express.js
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Password Hashing: bcryptjs

---

# Authentication Strategy

আমি Stateless JWT Authentication ব্যবহার করেছি।

দুই ধরনের Token ব্যবহার করেছি:

- Access Token (Short-lived)
- Refresh Token (Long-lived)

Token LocalStorage-এ রাখিনি।

এর পরিবর্তে **HTTP-only Cookie** ব্যবহার করেছি যাতে JavaScript Token access করতে না পারে এবং XSS Attack থেকে নিরাপদ থাকে।

Cookie এর জন্য:
- httpOnly
- sameSite: "strict"
- secure (Production)

---

# Registration Flow

User Register করলে নিচের Step গুলো follow হয়।

1. User Form Fill করে।
2. Frontend এ React Hook Form + Zod দিয়ে Validation হয়।
3. POST `/api/auth/register` Request যায়।
4. Backend আবার Zod দিয়ে Validate করে।
5. Database এ একই Email আছে কিনা Check করে।
6. Password bcrypt দিয়ে Hash করা হয়।
7. PostgreSQL এ User Create হয়।
8. যদি Role = TECHNICIAN হয় তাহলে Automatically Technician Profile Create হয়।
9. Registration Success হলে User Automatically Login হয়ে যায়।
10. User নিজের Dashboard এ Redirect হয়।

---

# Login Flow

1. User Email এবং Password দেয়।
2. Backend Email দিয়ে User খুঁজে বের করে।
3. User Banned কিনা Check করে।
4. bcrypt.compare() দিয়ে Password Verify করে।
5. Access Token Generate করে।
6. Refresh Token Generate করে।
7. দুইটা Token HTTP-only Cookie তে Set করে।
8. User Information Return করে।
9. Dashboard এ Redirect করে।

---

# Session Management

Browser প্রতিটা Request এর সাথে Automatically Cookie পাঠায়।

Frontend এ সব Request এ

credentials: "include"

ব্যবহার করেছি।

এর ফলে User কে Token Manually Handle করতে হয় না।

---

# Refresh Token Flow

যখন Access Token Expire হয়ে যায়—

1. API Request 401 Return করে।
2. Frontend এটা Detect করে।
3. Automatically `/api/auth/refresh` Call করে।
4. Refresh Token Verify হয়।
5. নতুন Access Token Generate হয়।
6. আগের Request Automatically Retry হয়।

User বুঝতেই পারে না Token Expire হয়েছিল।

---

# Route Protection

আমি Authentication তিন Layer এ Protect করেছি।

## 1. Next.js Proxy

- Login ছাড়া Dashboard এ যেতে দেয় না।
- Login করা User কে আবার Login/Register Page এ যেতে দেয় না।

---

## 2. Server Component Guard

requireUser()

- User Login করা আছে কিনা Check করে।

requireRole()

- User এর Role ঠিক আছে কিনা Check করে।

---

## 3. Backend Middleware

Protected API Call হলে Middleware

- Cookie থেকে Token নেয়
- JWT Verify করে
- Database এ User আছে কিনা Check করে
- User Banned কিনা Check করে
- Role Match করে কিনা Check করে

সব ঠিক থাকলে Controller Execute হয়।

---

# Password Security

Password কখনো Plain Text এ Store করিনি।

Register করার সময়

bcrypt.hash()

ব্যবহার করেছি।

Login করার সময়

bcrypt.compare()

দিয়ে Verify করেছি।

---

# Validation

Validation দুই জায়গায় করেছি।

## Frontend

- Better User Experience
- Instant Error Message

## Backend

- Security
- Invalid Request Reject করার জন্য

---

# Why HTTP-only Cookie?

LocalStorage JavaScript দিয়ে Access করা যায়।

XSS Attack হলে Token চুরি হতে পারে।

HTTP-only Cookie JavaScript Access করতে পারে না।

তাই এটা অনেক বেশি Secure।

---

# Why Access Token + Refresh Token?

Access Token ছোট সময়ের জন্য থাকে।

Refresh Token দিয়ে নতুন Access Token Generate করা যায়।

এর ফলে User কে বারবার Login করতে হয় না।

---

# Role Based Authentication

JWT এর মধ্যে

- id
- email
- role

রাখা হয়েছে।

Backend Middleware Role Verify করে।

Frontend ও requireRole() দিয়ে Role Check করে।

---

# Security Features

- JWT Authentication
- Dual Token System
- HTTP-only Cookie
- SameSite Strict
- bcrypt Password Hashing
- Zod Validation
- Protected Routes
- Role Based Authorization
- Refresh Token Rotation
- User Ban Checking

---


# Important Things To Remember

- JWT Dual Token ব্যবহার করেছি।
- HTTP-only Cookie ব্যবহার করেছি।
- bcrypt দিয়ে Password Hash করেছি।
- Frontend + Backend দুই জায়গায় Validation করেছি।
- Registration এর পর Auto Login করেছি।
- Refresh Token দিয়ে Silent Login Maintain করেছি।
- Next.js Proxy দিয়ে Route Protect করেছি।
- Backend Middleware দিয়ে JWT Verify করেছি।
- Role Based Authorization করেছি।
- Prisma + PostgreSQL দিয়ে User Manage করেছি।