# Food Redistribution Platform

## Purpose
A web platform to redistribute leftover food from events, restaurants, etc. Users can list excess food, and volunteers can claim and redistribute it.

## Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js (Express)
- Database: MySQL

## Features
- User registration and login
- List excess food (amount, dishes, expiry, venue)
- Claim food (mark as claimed by user)
- Auth-protected routes for listing/claiming

## Setup
1. Install dependencies: `npm install`
2. Configure MySQL in `backend/db.js`
3. Run backend: `node backend/server.js`
4. Open `frontend/index.html` in your browser 