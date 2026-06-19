# 🏗️ Project Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                       │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Frontend SPA (Vanilla JS)               │ │
│  │                                                       │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐            │ │
│  │  │  Router  │  │  State  │  │   API   │            │ │
│  │  │ (Hash)   │  │ (Local  │  │ Client  │            │ │
│  │  │         │  │ Storage) │  │ (Fetch) │            │ │
│  │  └─────────┘  └─────────┘  └────┬────┘            │ │
│  │                                   │                  │ │
│  │  ┌──────────────┐  ┌────────────────┐              │ │
│  │  │  Components  │  │    Pages (10)   │              │ │
│  │  │  (8 modules) │  │                 │              │ │
│  │  └──────────────┘  └────────────────┘              │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTP (REST API)
┌───────────────────────────┴─────────────────────────────┐
│                    SERVER (Node.js)                        │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Express.js Application                   │ │
│  │                                                       │ │
│  │  ┌──────────┐  ┌────────────┐  ┌──────────┐       │ │
│  │  │  Routes  │→ │ Controllers │→ │ Database │       │ │
│  │  │ (7 files)│  │  (7 files)  │  │ (SQLite) │       │ │
│  │  └──────────┘  └────────────┘  └──────────┘       │ │
│  │       ↑                                              │ │
│  │  ┌──────────────────────┐                           │ │
│  │  │     Middleware       │                           │ │
│  │  │ Auth │ Admin │ Error │                           │ │
│  │  └──────────────────────┘                           │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `users` | User accounts | id, name, email, password (hashed), role |
| `products` | Product catalog | id, name, description, price, image, category_id, stock, rating |
| `categories` | Product categories | id, name, description, image |
| `cart` | Shopping cart items | id, user_id, product_id, quantity |
| `orders` | Placed orders | id, user_id, items (JSON), total, status |
| `contact_messages` | Contact form submissions | id, name, email, subject, message |

### Relationships
- Users → Cart (one-to-many)
- Users → Orders (one-to-many)
- Categories → Products (one-to-many)
- Products → Cart (one-to-many)

## Authentication Flow

```
1. User registers → Password hashed (bcrypt) → Saved to DB → JWT issued
2. User logs in → Password verified → JWT issued
3. Protected requests → JWT sent in Authorization header → Verified by middleware
4. Admin requests → JWT verified → Role checked → Access granted/denied
```

## Frontend Architecture

### Client-Side Routing
- Hash-based routing (`#/page`)
- Page transitions (fade in/out)
- Scroll position management
- Dynamic title updates

### State Management
- **AppState** object stores: user, token, cart, wishlist
- Persisted to localStorage for session survival
- Centralized state mutation methods

### Component Pattern
Each component/page follows this pattern:
```javascript
const Component = {
  render() { /* Returns HTML or updates DOM */ },
  // Event handlers and methods
};
```

## API Design

### Response Format
All API responses follow a consistent structure:
```json
{
  "success": true/false,
  "message": "Human-readable message",
  "data": { /* Response payload */ }
}
```

### Error Handling
- Validation errors: 400
- Authentication errors: 401
- Authorization errors: 403
- Not found: 404
- Server errors: 500

## Folder Structure

```
web/
├── frontend/                  # Client-side SPA
│   ├── index.html            # HTML shell
│   ├── css/
│   │   └── index.css         # Complete design system (900+ lines)
│   └── js/
│       ├── app.js            # Entry point
│       ├── router.js         # Hash-based router
│       ├── state.js          # Global state
│       ├── api.js            # API client
│       ├── components/       # 8 reusable components
│       │   ├── navbar.js     # Responsive navigation
│       │   ├── footer.js     # Fixed footer
│       │   ├── productCard.js # Product card
│       │   ├── modal.js      # Product detail modal
│       │   ├── toast.js      # Notifications
│       │   ├── spinner.js    # Loading spinner
│       │   ├── pagination.js # Page navigation
│       │   └── scrollReveal.js # Scroll animations
│       └── pages/            # 10 page modules
│           ├── home.js       # Landing page
│           ├── products.js   # Product listing
│           ├── categories.js # Category listing
│           ├── cart.js       # Shopping cart
│           ├── login.js      # Login form
│           ├── register.js   # Registration form
│           ├── dashboard.js  # User dashboard
│           ├── admin.js      # Admin panel
│           ├── about.js      # About page
│           └── contact.js    # Contact form
├── backend/                   # Server-side API
│   ├── server.js             # Express app
│   ├── config/
│   │   ├── db.js             # Database initialization
│   │   └── seed.js           # Sample data
│   ├── controllers/          # 7 route handlers
│   ├── middleware/            # Auth, admin, validation, errors
│   └── routes/               # 7 route definitions
├── tests/                     # Test suite
│   ├── unit/                 # Unit tests
│   └── integration/          # API tests
├── docs/                      # Documentation
├── package.json
├── jest.config.js
├── vercel.json
├── netlify.toml
└── render.yaml
```

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#000000` | Main background |
| `--color-primary` | `#FF1493` | Primary accent (Deep Pink) |
| `--color-accent` | `#FF69B4` | Secondary accent (Hot Pink) |
| `--text-primary` | `#FFFFFF` | Main text |

### Typography
- **Display:** Outfit (headings, branding)
- **Body:** Inter (body text, UI elements)

### Design Patterns
- **Glassmorphism:** Semi-transparent backgrounds with backdrop blur
- **Glow Effects:** Pink box-shadows on hover/active states
- **Micro-animations:** Smooth transitions on all interactive elements
- **Scroll Reveal:** Elements animate in as they enter the viewport
