# Shop

**Shop** is a full-stack web app for managing recipes, tracking pantry inventory, and **automatically ordering missing ingredients** via the [Kroger Cart API](https://developer.kroger.com/reference/cart/v1/overview).

This app helps home cooks and meal preppers avoid the hassle of last-minute grocery trips by integrating recipe management, pantry tracking, and online grocery shopping — all in one place.

---

## Current Status

- Add and view recipes  
- Track what ingredients are in your pantry  
- Identify missing ingredients for recipes  
- Connect to Kroger Developer account via API  

**Coming soon:**

- Link ingredients to Kroger products  
- Cleanly manage ingredient quantities and units  
- Build an order endpoint to populate Kroger cart with needed items  
- Determine optimal item/amount matches (e.g., 2 x 16oz vs 1 x 32oz)  

---

## Tech Stack

| Component  | Tech               |
|-----------|--------------------|
| Frontend  | React              |
| Backend   | Java (Spring Boot) |
| Database  | MySQL              |
| API       | Kroger Developer API |

---

## Getting Started

### 1. Clone and build

```bash
git clone git@github.com:mattbutcher-swe/shop.git
cd shop
docker-compose up --build
```

This starts:

- Frontend: http://localhost
- Backend: http://localhost:8080
- MySQL: exposed on port 3306

### 2. Set up Kroger API connection


1. Go to the Kroger Developer Portal
2. Register a new app to get your Client ID and Client Secret
3. Open http://localhost/settings in your browser
4. Enter your credentials to connect your Kroger account

## How It Works

1. Recipes contain a list of ingredients with required quantities.
2. You track which ingredients you already have in your pantry.
3. The app calculates what's missing.
4. The app (soon) matches those ingredients to Kroger product listings.
5. A shopping cart is built automatically through the Kroger Cart API.

## TODOs

- Ingredient ↔ Kroger item matching UI
- Quantity normalization and unit conversion
- Generate and submit Kroger cart from missing items
- Improve UX for pantry + recipe editing
