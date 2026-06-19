# 🛍️ ShopSphere – Modern E-Commerce Product Catalog

A **full-stack e-commerce web application** built as a capstone project demonstrating professional web development skills. Features a premium **Black + Pink glassmorphism** design with a Node.js backend, SQLite database, and vanilla JavaScript SPA frontend.

![ShopSphere](https://img.shields.io/badge/ShopSphere-v1.0.0-FF1493?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## ✨ Features

### Frontend
- 🎨 Premium Black + Pink Glassmorphism Theme
- 📱 Fully Responsive (Mobile, Tablet, Desktop)
- 🔍 Product Search & Category Filters
- 🛒 Shopping Cart with Guest & Authenticated modes
- ❤️ Wishlist functionality
- 🔔 Toast Notifications
- 📄 10 Complete Pages with smooth transitions
- ⚡ Loading animations & Scroll reveal effects
- 🖼️ Product Detail Modal with Quick View

### Backend
- 🔐 JWT Authentication with bcrypt password hashing
- 📦 Full REST API (CRUD operations)
- 👤 User Registration & Login
- 🛍️ Product, Category, Cart, Order management
- 👑 Admin Dashboard with analytics
- 📬 Contact Form API
- 🛡️ Role-based access control (User/Admin)

### Database
- 📊 6 Tables: Users, Products, Categories, Cart, Orders, Contact Messages
- 🌱 Auto-seeded with 23 products, 6 categories, 4 users, 3 orders

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Navigate to project directory
cd web

# 2. Install dependencies
npm install

# 3. Start the application
npm run server
```

The app will be available at **http://localhost:5000**

### Development Mode (with auto-reload)

```bash
npm run server:dev
```

---

## 📁 Project Structure

```
web/
├── frontend/                 # Frontend SPA
│   ├── index.html           # Main HTML entry
│   ├── css/index.css        # Complete design system
│   └── js/
│       ├── app.js           # App initialization
│       ├── router.js        # Hash-based SPA router
│       ├── state.js         # Global state management
│       ├── api.js           # API client
│       ├── components/      # Reusable UI components
│       └── pages/           # 10 page modules
├── backend/                  # Express.js API
│   ├── server.js            # Server entry point
│   ├── config/              # DB & seed data
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, admin, validation
│   └── routes/              # API route definitions
├── tests/                    # Jest tests
│   ├── unit/                # Unit tests
│   └── integration/         # API integration tests
├── docs/                     # Documentation
├── package.json
├── vercel.json              # Vercel config
├── netlify.toml             # Netlify config
└── render.yaml              # Render config
```

---

## 📱 Pages

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | Home | `#/home` | Hero section, featured products, categories |
| 2 | Products | `#/products` | Search, filter, sort, paginated grid |
| 3 | Categories | `#/categories` | Category cards with product counts |
| 4 | Cart | `#/cart` | Cart management, order summary |
| 5 | Login | `#/login` | User authentication |
| 6 | Register | `#/register` | New user registration |
| 7 | Dashboard | `#/dashboard` | User profile, orders, wishlist |
| 8 | Admin | `#/admin` | Admin panel (products, orders, users) |
| 9 | About | `#/about` | Company info, team, values |
| 10 | Contact | `#/contact` | Contact form, company info |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Auth | Get current user |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List products (search, filter, sort, paginate) |
| GET | `/api/products/featured` | Public | Get top 8 rated products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | List all categories |
| GET | `/api/categories/:id` | Public | Get category with products |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |

### Cart, Orders, Contact, Admin
See [API Documentation](docs/ARCHITECTURE.md) for complete endpoint details.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run verbose
npm run test:verbose
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopsphere.com | Admin@123 |
| User | deva@shopsphere.com | User@123 |

---

## 🚀 Deployment

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions on deploying to:
- ▲ **Vercel**
- ◆ **Netlify**
- 🔵 **Render**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5, CSS3, JavaScript | Frontend |
| Node.js + Express | Backend API |
| SQLite (better-sqlite3) | Database |
| JWT + bcryptjs | Authentication |
| Jest + Supertest | Testing |
| Google Fonts (Inter, Outfit) | Typography |
| Font Awesome | Icons |

---

## 📄 Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [User Guide](docs/USER_GUIDE.md)
- [Testing Guide](docs/TESTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture](docs/ARCHITECTURE.md)

---

## 👤 Author

**Created by Deva ❤️**

---

## 📝 License

This project is licensed under the MIT License.
