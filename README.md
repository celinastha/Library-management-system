# Library Management System Setup

## Prerequisites

- Node.js v22.17.0 installed and set up in environment variable PATH
- MySQL.exe Ver 8.0.44 installed and set up in environment variable PATH

## Setup Instructions

### 1. Database Setup

1. Create a SQL server in MySQL install version 8.0.44
2. Open a terminal and navigate to the `database` folder:
   ```bash
   cd database
   ```
3. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
4. For every SQL file in the database folder, run:
   ```sql
   source [filename].sql;
   ```

### 2. Backend Setup

1. Open a **new terminal** and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create `.env` and `firebaseServiceAccountKey.json` based on the provided example versions
   - You need to set up a Firebase account for `firebaseServiceAccountKey.json`
3. Install dependencies:
   ```bash
   npm i
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 3. Frontend Setup

1. Open a **third terminal** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Create `.env` based on the provided example version
   - You need to set up a Firebase account for `.env`
3. Install dependencies:
   ```bash
   npm i
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

**Note**: You'll need three terminals total - one for database setup, one for backend, and one for frontend.
