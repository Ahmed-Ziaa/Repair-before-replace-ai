# Repair Before Replace AI

An AI-powered repair diagnosis and cost comparison platform that helps users make smarter decisions about repairing or replacing broken household and electronic items.

## Overview

Repair Before Replace AI allows users to upload an image of a broken item, describe the problem, and receive an AI-generated diagnosis with estimated repair costs, replacement costs, safety warnings, and repair guidance.

The platform is designed to help users understand their repair options before spending money on a replacement.

## Features

### AI Diagnosis

* Upload images of broken items.
* Select item categories.
* Describe symptoms and problems.
* Get AI-generated possible causes.
* Receive repairability and difficulty estimates.

### Repair vs Replace

* Compare estimated repair and replacement costs.
* View potential savings.
* Receive a repair, replace, or professional inspection recommendation.
* See required tools and estimated repair time.

### User Dashboard

* View total diagnoses.
* Track repaired and replaced items.
* Monitor estimated money saved.
* Access recent diagnosis history.

### Repair History

* Save and review previous diagnoses.
* View detailed repair recommendations.
* Update repair and replacement status.
* Submit feedback about repair results.

### Maintenance Reminders

* Create maintenance tasks.
* Track upcoming and overdue reminders.
* Mark maintenance tasks as completed.

### Authentication & Security

* User registration and login.
* JWT-based authentication.
* Password hashing with bcrypt.
* Protected routes.
* Input validation and error handling.
* Security middleware and rate limiting.

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* React Router DOM
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Cloudinary

### AI

* Backend-owned AI service abstraction.
* Image and text-based diagnosis support.
* Structured diagnosis and repair recommendations.
* Configurable AI provider through environment variables.

## Project Structure

```text
repair-before-replace-ai/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── controllers/
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/repair-before-replace-ai.git
cd repair-before-replace-ai
```

### 2. Install Dependencies

```bash
npm install
```

If frontend and backend have separate package.json files:

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Configure Environment Variables

Create `.env` files according to the `.env.example` files.

Required configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

Never commit real credentials or API keys to GitHub.

### 4. Start the Application

From the project root:

```bash
npm run dev:full
```

Or start frontend and backend separately:

```bash
cd client
npm run dev
```

```bash
cd server
npm run dev
```

## Application Flow

```text
Landing Page
    ↓
Register / Login
    ↓
Dashboard
    ↓
Diagnose an Item
    ↓
Upload Image & Describe Problem
    ↓
AI Analysis
    ↓
Repair vs Replace Result
    ↓
Save Diagnosis
    ↓
Repair History
    ↓
Maintenance Tracking
```

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Diagnoses

```text
POST   /api/diagnoses
GET    /api/diagnoses
GET    /api/diagnoses/:id
PUT    /api/diagnoses/:id
DELETE /api/diagnoses/:id
```

### AI

```text
POST /api/ai/analyze
POST /api/ai/questions
```

### Maintenance

```text
POST   /api/maintenance
GET    /api/maintenance
PUT    /api/maintenance/:id
DELETE /api/maintenance/:id
```

### Dashboard

```text
GET /api/dashboard/stats
```

## Safety Disclaimer

AI-generated diagnoses are estimates and should not be considered professional repair inspections.

For electrical, gas, high-voltage, battery, or other hazardous repairs, consult a qualified professional.

Repair and replacement costs are estimates and may vary based on location, item condition, and service provider.

## Future Improvements

* Real-time repair expert consultations.
* Local repair service discovery.
* More accurate regional cost estimation.
* AI-generated visual repair guides.
* Mobile application.
* Community repair knowledge base.
* Sustainability and waste reduction analytics.
