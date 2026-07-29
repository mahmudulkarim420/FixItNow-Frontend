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


# Services Module Implementation Notes (FixItNow)

# APIs Used

## 1. GET /api/services

এই API দিয়ে সব Service Fetch করেছি।

Features:

- Search
- Category Filter
- Pagination
- Sorting

Backend Parameters:

- search
- categoryId
- page
- limit
- sortBy
- sortOrder

---

## 2. GET /api/services/categories

এই API দিয়ে সব Service Category Fetch করেছি।

এখানে প্রতিটি Category-এর সাথে

_count.services

আসে, যার মাধ্যমে প্রতিটি Category-তে কতগুলো Service আছে সেটা দেখাতে পেরেছি।

---

## 3. GET /api/services/:id

এই API দিয়ে Single Service Details Fetch করেছি।

এখানে পাওয়া যায়—

- Service Information
- Category
- Technician Information
- Price
- Description

---

# API Layer

API Call গুলো এক জায়গায় রাখার জন্য

lib/services-api.ts

ফাইল তৈরি করেছি।

এখানে তিনটি Main Function আছে—

- fetchServices()
- fetchServiceById()
- fetchServiceCategories()

এর ফলে Project Maintain করা সহজ হয়েছে।

---

# Data Mapping

Backend থেকে আসা Data সরাসরি UI-তে ব্যবহার করিনি।

আমি

mapApiServiceToUI()

Function ব্যবহার করেছি।

এর কাজ হলো—

Backend Response কে UI-এর জন্য Suitable Format-এ Convert করা।

এতে Backend Change হলেও UI কম পরিবর্তন করতে হয়।

---

# Services Catalog

Services Page-এ আমি Dynamicভাবে—

- Services
- Categories
- Search Result
- Filtered Result

Show করেছি।

সব Data Database থেকে এসেছে।

---

# Pagination

Backend Pagination ব্যবহার করেছি।

Backend থেকে

- total
- page
- totalPage

আসে।

এই Data ব্যবহার করে Pagination তৈরি করেছি।

---

# Search

User যখন Search করে,

Backend-এ Search Query পাঠানো হয়।

তারপর Matching Service গুলো Return হয়।

---

# Category Filter

Category Select করলে

categoryId

Backend-এ পাঠানো হয়।

তারপর ওই Category-এর Service গুলো Show হয়।

---

# Loading State

Data Load হওয়ার সময়

Glassmorphism Skeleton Loader

দেখিয়েছি।

এতে User Experience অনেক ভালো হয়েছে।

---

# Error Handling

API Fail করলে

Error Banner

Show করেছি।

সাথে

Retry Button

দিয়েছি যাতে User আবার Request করতে পারে।

---

# Empty State

Search Result না থাকলে

Friendly Empty State

দেখিয়েছি।

সাথে

Reset Filters

Button দিয়েছি।

---

# Service Details Page

Dynamic Route ব্যবহার করেছি।

URL:

/services/:id

Database-এর UUID ব্যবহার করে Service Fetch করেছি।

---

# Dynamic Metadata

generateMetadata()

ব্যবহার করেছি।

এর ফলে প্রতিটি Service-এর Title এবং Description Dynamicভাবে Generate হয়।

SEO Improve হয়।

---

# Related Services

বর্তমান Service-এর Category অনুযায়ী Similar Service দেখিয়েছি।

এতে User সহজে Related Service দেখতে পারে।

---

# Booking Modal

Service Details Page-এ

Interactive Booking Modal

Implement করেছি।

Booking Request-এর পরে User Instant Feedback পায়।

---

# Image Optimization

সব Image

Next.js Image Component

দিয়ে Render করেছি।

এর ফলে

- Faster Loading
- Better Performance
- Responsive Images

পাওয়া যায়।

---


# Type Safety

সব API Response-এর জন্য TypeScript Interface ব্যবহার করেছি।

যেমন—

- ApiService
- ApiServiceCategory
- ApiTechnicianSummary
- GetServicesResponse
- GetServicesParams

এর ফলে Runtime Error কমে যায় এবং Development সহজ হয়।

---


# Important Things To Remember

- Backend API Integration করেছি।
- Services Dynamic করেছি।
- Categories Dynamic করেছি।
- Search Implement করেছি।
- Category Filter করেছি।
- Backend Pagination ব্যবহার করেছি।
- Data Mapping Function তৈরি করেছি।
- Loading Skeleton ব্যবহার করেছি।
- Error Handling করেছি।
- Empty State তৈরি করেছি।
- Dynamic Service Details করেছি।
- Dynamic SEO Metadata করেছি।
- Related Services দেখিয়েছি।
- Booking Modal যুক্ত করেছি।
- Next.js Image Optimization ব্যবহার করেছি।
- পুরো Module TypeScript দিয়ে Strictly Typed করেছি।



# Booking & Payment Module Implementation Notes (FixItNow)


# APIs Used

## 1. POST /api/bookings

নতুন Booking তৈরি করার জন্য এই API ব্যবহার করেছি।

Request Body:

- scheduledDate
- timeSlot
- contactNumber
- serviceId

এই API শুধুমাত্র Login করা CUSTOMER ব্যবহার করতে পারে।

---

## 2. POST /api/payments/checkout

Booking তৈরি হওয়ার পরে Stripe Checkout Session তৈরি করার জন্য এই API ব্যবহার করেছি।

Backend Stripe Hosted Checkout URL Return করে।

Frontend সেই URL-এ Redirect করে User-কে Stripe Payment Page-এ নিয়ে যায়।

---

## 3. GET /api/bookings/:id

Single Booking Details Fetch করার জন্য এই API ব্যবহার করেছি।

এখানে পাওয়া যায়—

- Booking Status
- Price
- Scheduled Date
- Assigned Technician
- Payment Status

---

# API Layer

সব Booking এবং Payment API এক জায়গায় রাখার জন্য

lib/bookings-payments-api.ts

ফাইল তৈরি করেছি।

Main Functions:

- createBooking()
- createCheckoutSession()
- getBookingById()

এর ফলে Code Maintain করা সহজ হয়েছে।

---

# Booking Flow

Customer Service Details Page থেকে Booking শুরু করে।

Modal Open হয়।

Customer দেয়—

- Visit Date
- Time Slot
- Contact Number

Form Submit করলে

POST /api/bookings

Call হয়।

Backend Booking Create করে।

---

# Authentication Check

Booking করার আগে Customer Login করা আছে কিনা Check করা হয়।

যদি Backend

401 Unauthorized

Return করে,

তাহলে User-কে Login Page-এ Redirect করা হয়।

---

# Payment Flow

Booking Successfully Create হওয়ার পরে

"Proceed to Online Payment"

Button Show করা হয়।

Button Click করলে

POST /api/payments/checkout

Call হয়।

Backend Stripe Checkout Session তৈরি করে।

Stripe Hosted Checkout URL Return করে।

তারপর User Stripe Payment Page-এ Redirect হয়।

---

# Stripe Success Page

Stripe Payment সফল হলে

/payment/success

Page Open হয়।

এই Page

GET /api/bookings/:id

Call করে।

তারপর User-কে দেখায়—

- Booking Confirmed
- Visit Date
- Payment Status
- Total Paid

এছাড়া Dashboard যাওয়ার Link দেওয়া হয়েছে।

---

# Stripe Cancel Page

যদি User Payment Cancel করে,

তাহলে

/payment/cancel

Page Open হয়।

এখানে

Retry Payment

Button দেওয়া হয়েছে যাতে User আবার Stripe Payment করতে পারে।

---

# Booking Modal

Booking করার জন্য

2-Step Interactive Modal

তৈরি করেছি।

## Step 1

Customer Information

- Visit Date
- Time Slot
- Contact Number

## Step 2

Booking Success Message

↓

Proceed to Stripe Payment

---

# Error Handling

যদি—

- User Login না থাকে
- Booking Fail হয়
- Payment Session তৈরি না হয়

তাহলে Proper Error Message দেখানো হয়েছে।

---

# Type Safety

সব API Response এবং Request-এর জন্য TypeScript ব্যবহার করেছি।

এর ফলে Development অনেক Safe হয়েছে।

---


# Security

- শুধুমাত্র Login করা Customer Booking করতে পারে।
- Booking তৈরি হওয়ার পরে Payment শুরু হয়।
- Payment Stripe Hosted Checkout-এর মাধ্যমে করা হয়।
- Backend Payment Session Generate করে।
- Client শুধুমাত্র Redirect করে।
- Payment Result Backend Booking Data দিয়ে Verify করা হয়।

---

# Important Things To Remember

- Booking API Integration করেছি।
- Stripe Checkout Integration করেছি।
- Booking Modal তৈরি করেছি।
- Authentication Check করেছি।
- 401 Unauthorized Handle করেছি।
- Stripe Success Page তৈরি করেছি।
- Stripe Cancel Page তৈরি করেছি।
- Retry Payment Feature যোগ করেছি।
- Booking Details Dynamic করেছি।
- Modular API Layer তৈরি করেছি।
- পুরো Module TypeScript দিয়ে Strictly Typed করেছি।