# 📥 Installation Guide

## Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## Step-by-Step Installation

### 1. Navigate to the Project

```bash
cd path/to/web
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Express.js (web server)
- better-sqlite3 (database)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- Jest & Supertest (testing)

### 3. Environment Configuration

The project comes with a `.env` file with development defaults. For production, update:

```env
PORT=5000
JWT_SECRET=your_very_secure_random_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
```

### 4. Start the Application

**Development (with auto-reload):**
```bash
npm run server:dev
```

**Production:**
```bash
npm start
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5000
- **API:** http://localhost:5000/api/health

## Troubleshooting

### "better-sqlite3 build failed"
This native module requires build tools:
- **Windows:** `npm install --global windows-build-tools`
- **macOS:** `xcode-select --install`
- **Linux:** `sudo apt-get install build-essential python3`

### "Port already in use"
Change the port in `.env`:
```env
PORT=5001
```

### Database Issues
Delete `shopsphere.db` and restart — it will be recreated with fresh seed data.
