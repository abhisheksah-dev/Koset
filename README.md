# Koset1

A minimal **MERN** auth starter + marketing site and a GPU pod UI mock. This repository is split into two apps:

* **backend/** – Express 5 + Mongoose + JWT auth
* **frontend/** – React 19 + Vite 7 + React Router 7 + Tailwind CSS v4

---

## ⚙️ Tech stack

**Backend**

* express@5, mongoose@8, jsonwebtoken, bcryptjs, cors, dotenv
* dev: nodemon

**Frontend**

* react@19, react-router-dom@7, vite@7, @vitejs/plugin-react
* tailwindcss@4, @tailwindcss/vite, axios, lucide-react
* dev: eslint@9 (+ react-refresh, react-hooks), types

---

## 📁 Monorepo layout

```
Koset1/
├─ backend/
│  ├─ models/User.js
│  ├─ routes/auth.js
│  ├─ server.js
│  ├─ package.json
│  └─ .env  (create – see below)
└─ frontend/
   ├─ src/
   │  ├─ components/* (KosetWebsite, Login, Signup, Dashboard, GPUPodDeploy, etc.)
   │  ├─ context/AuthContext.jsx
   │  ├─ App.jsx, main.jsx, index.css
   ├─ package.json
   ├─ vite.config.js
   └─ .env  (optional)
```

---

## ✅ Prerequisites

* **Node.js 20+** (LTS recommended) and **npm 10+**
* **MongoDB** (local instance or a hosted URI)

Check versions:

```bash
node -v
npm -v
```

---

## 🔐 Environment variables

### backend/.env

Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/koset1
JWT_SECRET=change_this_to_a_long_random_string
```

> `PORT` is optional (defaults to 5000). Replace `MONGO_URI` with your local/hosted URI.

### frontend/.env (optional)

The current code calls the API with a hard‑coded base URL (`http://localhost:5000`). If you prefer using an env var, you can change it and then add:

```env
VITE_API_URL=http://localhost:5000
```

…and read it in `AuthContext.jsx` via `import.meta.env.VITE_API_URL`.

---

## 🚀 Quick start (two terminals)

### 1) Backend

```bash
cd backend
npm install
npm run dev   # starts with nodemon on http://localhost:5000
```

If you prefer plain node:

```bash
npm start
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev   # starts Vite dev server (prints a Local URL, e.g. http://localhost:5173)
```

Open the frontend URL in your browser. Make sure the backend is running on **[http://localhost:5000](http://localhost:5000)**.

---

## 🔌 API – Auth routes (backend)

Base URL: `http://localhost:5000/api/auth`

### POST /signup

Create a user and return a JWT.

```json
{
  "username": "abhishek",
  "email": "user@example.com",
  "password": "secret123"
}
```

**200 OK**

```json
{ "token": "<jwt>" }
```

**409/400** if email exists.

### POST /login

Login with email + password; returns a JWT.

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**200 OK** → `{ "token": "<jwt>" }`

### GET /me (protected)

Returns current user (without password).
Headers:

```
Authorization: Bearer <jwt>
```

**200 OK** → user object

---

## 🖥️ Frontend – pages & flow

* `/` – Marketing site (`KosetWebsite`) with theme toggle and CTAs
* `/signup` – Sign up form → calls **POST /signup**
* `/login` – Login form → calls **POST /login**
* `/dashboard` – Protected page (`PrivateRoute`) – visible after auth
* `/gpu` – GPU Pod deploy UI mock

**AuthContext.jsx**

* Persists the JWT in `localStorage` as `token`
* Adds `Authorization: Bearer <token>` to axios defaults
* On app load, `GET /me` is called to hydrate the user
* `Alert` component surfaces backend error messages (e.g., duplicate email)

---

## 🧰 Available scripts

### Backend

```bash
npm run dev     # nodemon server.js
npm start       # node server.js
```

### Frontend

```bash
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # ESLint
```

---

## 📦 Dependencies (full list)

### Backend

* **express** – HTTP server (v5)
* **mongoose** – MongoDB ODM
* **jsonwebtoken** – JWT issuance/verification
* **bcryptjs** – password hashing
* **cors** – CORS headers
* **dotenv** – env vars
* **nodemon** (dev) – auto‑reload

### Frontend

* **react, react-dom** – UI
* **react-router-dom** – routing (v7)
* **vite** – dev/build tool
* **@vitejs/plugin-react** – React fast‑refresh
* **tailwindcss v4, @tailwindcss/vite** – styling
* **axios** – HTTP client
* **lucide-react** – icons
* **eslint** (+ plugins) – linting

---

## 🧪 cURL examples

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"abi","email":"abi@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"abi@example.com","password":"secret123"}'

# Me
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <paste_jwt_here>"
```

---

## 🛡️ Security notes

* Passwords are hashed with `bcryptjs` before storage
* JWT secret must be strong and private (`JWT_SECRET`)
* Never commit `.env` files; use `.gitignore`

---

## 🧩 Common issues & fixes

### 1) MongoDB connection error

* Ensure Mongo is running and your `MONGO_URI` is correct
* Local example: `mongodb://127.0.0.1:27017/koset1`

### 2) CORS errors from the browser

* Backend enables `cors()` globally. If you changed ports, confirm frontend calls `http://localhost:5000` or set `VITE_API_URL` accordingly and use it in `AuthContext.jsx`.

### 3) Vite/Tailwind CSS import warning

* Tailwind v4 requires `@import "tailwindcss";` at the **top** of `index.css` (already set). Do not place other `@import`s before it.

### 4) JWT ‘invalid token’ on /me

* Make sure you send `Authorization: Bearer <token>` and that `JWT_SECRET` in `.env` matches the server used to sign the token
* If you changed secrets, log out (clears localStorage) and log in again

### 5) React Router – protected routes

* `PrivateRoute` checks the token from context; if missing, you’ll be redirected to `/login`

---

## 🏗️ Production build

### Frontend

```bash
cd frontend
npm run build
# Static assets in dist/
```

Serve `dist/` behind any static host (Nginx, Netlify, Vercel, S3+CF, etc.).

### Backend

Deploy the Node app (Render/Railway/Fly/EC2/PM2/etc.). Set env vars in your host. Allow CORS from your frontend domain.

---

## 🗺️ Next steps (optional)

* Replace hard‑coded API URL with `VITE_API_URL`
* Add refresh token rotation & expiry handling
* Add rate limiting (`express-rate-limit`) and request validation (`zod`/`yup`)
* Add avatar upload (S3/Cloudinary) for `profileImage`

---

