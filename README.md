# 🏋️ FitTrack — Full-Stack Fitness Tracker

A complete fitness tracking web app with authentication, workout logging, calorie bar charts, goals, and full CRUD operations.

**Stack:** HTML/CSS · Node.js/Express · MongoDB Atlas · Deployed on Render (backend) + Vercel (frontend)

---

## 📁 Project Structure

```
fitness-tracker/
├── backend/                  ← Node.js + Express API
│   ├── models/
│   │   ├── User.js           ← User schema (bcrypt password hashing)
│   │   ├── Workout.js        ← Workout schema with aggregation indexes
│   │   └── Goal.js           ← Goal schema with progress tracking
│   ├── routes/
│   │   ├── auth.js           ← POST /signup, POST /login, GET /me
│   │   ├── workouts.js       ← Full CRUD + /stats endpoint (bar chart data)
│   │   ├── goals.js          ← Full CRUD for goals
│   │   └── users.js          ← Profile update, password change, delete account
│   ├── middleware/
│   │   └── auth.js           ← JWT protect middleware
│   ├── server.js             ← Express app + MongoDB connection
│   ├── package.json
│   └── .env.example          ← Copy to .env and fill in your values
│
├── frontend/                 ← Static HTML/CSS/JS
│   ├── index.html            ← Landing page
│   ├── css/style.css         ← Full design system
│   ├── js/config.js          ← API URL config + auth helpers + apiFetch()
│   └── pages/
│       ├── signup.html       ← Registration form
│       ├── login.html        ← Login form
│       ├── dashboard.html    ← Stats + animated calorie bar chart
│       ├── workouts.html     ← CRUD workout log with filters & pagination
│       ├── goals.html        ← CRUD goal tracking with progress bars
│       └── profile.html      ← Edit profile, change password, delete account
│
├── render.yaml               ← Render backend deployment config
├── vercel.json               ← Vercel frontend deployment config
└── .gitignore
```

---

## 🚀 Deployment Guide (Step by Step)

### Step 1 — Set up MongoDB Atlas (Free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account → Create a **free M0 cluster**
3. Under **Database Access**, create a user (username + password — save these)
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Under your cluster, click **Connect** → **Drivers** → Copy the connection string
   - It looks like: `mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/`
   - Append the db name: `mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/fitness-tracker?retryWrites=true&w=majority`

---

### Step 2 — Deploy Backend to Render (Free)

1. Push your code to a **GitHub repository**
2. Go to [render.com](https://render.com) → Sign up free
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name:** `fittrack-api`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Under **Environment Variables**, add:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Any long random string (e.g. `k8j3hf92jf8h3f98h23f98h`) |
   | `FRONTEND_URL` | `https://your-app.vercel.app` (fill in after Step 3) |
7. Click **Create Web Service** → wait ~2 mins for deploy
8. Copy your Render URL: `https://fittrack-api.onrender.com`

> ⚠️ **Free Render services sleep after 15min of inactivity.** First request after sleep takes ~30sec. Upgrade to a paid plan for production.

---

### Step 3 — Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Sign up free
2. Click **Add New Project** → Import your GitHub repo
3. Configure:
   - **Framework Preset:** Other (Static)
   - **Root Directory:** `frontend`
   - No build command needed
4. Click **Deploy** → copy your Vercel URL

---

### Step 4 — Connect Frontend to Backend

1. Open `frontend/js/config.js`
2. Replace the `API_BASE_URL`:
   ```js
   API_BASE_URL: 'https://fittrack-api.onrender.com/api',
   ```
3. Commit and push → Vercel auto-redeploys
4. Also go back to Render → Environment Variables → update `FRONTEND_URL` to your Vercel URL

---

### Step 5 — Test

Visit your Vercel URL → sign up → log workouts → check dashboard!

---

## 🛠️ Local Development

```bash
# 1. Clone repo
git clone https://github.com/yourusername/fitness-tracker.git
cd fitness-tracker

# 2. Setup backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev    # Runs on http://localhost:5000

# 3. Serve frontend (in another terminal)
cd ../frontend
npx serve .    # Or open index.html in browser directly
# Or use VS Code Live Server extension

# 4. In config.js, use:
# API_BASE_URL: 'http://localhost:5000/api'
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT |
| GET  | `/api/auth/me` | Get current user (auth required) |

### Workouts (CRUD — auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/workouts` | List workouts (filter: type, startDate, endDate, page) |
| GET    | `/api/workouts/stats` | Aggregated stats for bar chart (query: days=7/14/30) |
| GET    | `/api/workouts/:id` | Get single workout |
| POST   | `/api/workouts` | Create workout |
| PUT    | `/api/workouts/:id` | Update workout |
| DELETE | `/api/workouts/:id` | Delete workout |

### Goals (CRUD — auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/goals` | List all goals |
| POST   | `/api/goals` | Create goal |
| PUT    | `/api/goals/:id` | Update goal + progress |
| DELETE | `/api/goals/:id` | Delete goal |

### User Profile (auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users/profile` | Get profile |
| PUT    | `/api/users/profile` | Update profile |
| PUT    | `/api/users/password` | Change password |
| DELETE | `/api/users/account` | Delete account |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/login with bcrypt password hashing
- 📊 **Calorie Bar Chart** — Animated bars for 7/14/30 day views
- 💪 **9 Workout Types** — Cardio, Strength, Yoga, HIIT, Cycling, Swimming, Running, Walking, Other
- 🎯 **Goal Tracking** — Set targets with live progress bars
- ✏️ **Full CRUD** — Create, read, update, delete workouts and goals
- 👤 **Profile Management** — Edit info, change password, calculate BMI, delete account
- 📱 **Responsive** — Works on mobile with bottom navigation
- 🌍 **Global Deployment** — Render (backend) + Vercel (frontend) + MongoDB Atlas
