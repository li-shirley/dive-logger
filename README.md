#### Project Overview / Summary
Dive Logger is a full-stack web app for recreational scuba divers to log, track, and review their dives. Users can log dive details, conditions, equipment, and marine life seen. The app features a responsive frontend with React and Tailwind, backed by a secure Node.js/Express API with MongoDB.

## Backend – Dive Logger

### Tech Stack

- **Runtime & Framework:** Node.js, Express  
- **Database:** MongoDB with Mongoose  
- **Middleware:** CORS, cookie-parser  
- **Environment Variables:**  
  - `MONGO_URI` → MongoDB connection string  
  - `CLIENT_URL` → frontend URL for CORS  
  - `PORT` → optional port override  

---

### Getting Started

1. Install dependencies:
    ```bash
    npm install
    ```
2. Set environment variables in a .env file.
3. Start the server:
    ```bash
    node server.js
    # or
    npm start
    ```
4. API will run on http://localhost:4000 by default, or on the port you set in the PORT environment variable.

---

### Dive Endpoints (Authentication Required)

All dive endpoints require the user to be logged in. Include the access token in the Authorization header (Bearer <token>) or ensure the refresh cookie is set.

- **GET /api/dives/**  
    Returns all dives for the logged-in user.

    Example Response:
    ```json
        [
            {
                "_id": "64f123abc...",
                "title": "Morning Reef Dive",
                "diveSite": "Blue Lagoon",
                "date": "2025-12-01",
                "maxDepthMeters": 18,
                "bottomTimeMinutes": 50,
                "entryType": "boat"
            },
            "...more dives..."
        ]
    ```

- **GET /api/dives/:id**  
  Returns a single dive by ID.  
  **Errors:** 404 if not found, 400 if invalid ID.

- **POST /api/dives/**  
  Create a new dive.  
  **Required fields:** `title`, `diveSite`, `date`, `maxDepthMeters`, `bottomTimeMinutes`, `entryType`  
  **Optional fields:** `time`, `avgDepthMeters`, `visibilityMeters`, `waterTempC`, `airTempC`, `surge`, `current`, `tank`, `pressure`, `exposureSuit`, `weight`, `rating`, `lifeSeen`, `additionalNotes`  
  **Auto-calculated:** `pressure.amountUsedBar` if start/end pressures provided.

    Example Request:
    ```json
        {
            "title": "Morning Shore Dive 2",
            "diveSite": "Coki Beach, USVI",
            "date": "2025-02-12",
            "time": "09:00",
            "maxDepthMeters": 10,
            "avgDepthMeters": 8.8,
            "bottomTimeMinutes": 45,
            "entryType": "shore",
            "visibilityMeters": 30,
            "waterTempC": 24,
            "airTempC": 26,
            "surge": "none",
            "current": "light",
            "tank": {
                "tankLabel": "AL80",
                "customSpecs": null,
                "gasMix": "air"
            },
            "pressure": {
                "startPressureBar": 200,
                "endPressureBar": 90,
                "amountUsedBar": 110
            },
            "weight": {
                "weightKg": 4,
                "weightType": ["integrated"]
            },
            "exposureSuit": {
                "type": "shortie",
                "thicknessMm": 3,
                "otherText": null
            },
            "rating": 5,
            "lifeSeen": [
                { "group": "Cephalopod", "detail": "octopus crawling on the sea floor", "active": true },
                { "group": "Coral / Sponge", "detail": "", "active": true }
            ],
            "additionalNotes": "Weight felt heavy. I dove with my dive buddy Frank and DM Bob"
        }

    ```

- **PATCH /api/dives/:id**  
  Update an existing dive. Same required fields as POST. Returns updated dive.

- **DELETE /api/dives/:id**  
  Deletes a dive by ID. Returns the deleted dive.

---

### Dive Model

- **User Reference:** 
    - `userId` (ObjectId referencing the User)
- **Core Info:** 
    - `title` (string)
    - `diveSite` (string)
    - `date` (string, YYYY-MM-DD) 
    - `time` (string, HH:mm, optional)
    - `maxDepthMeters` (number)
    - `avgDepthMeters` (number, optional) 
    - `bottomTimeMinutes` (number)
    - `entryType` (enum: `"boat" | "shore" | "liveaboard" | "other"`)
- **Dive Conditions:** 
    - `visibilityMeters` (number, optional)
    - `waterTempC` (number, optional)
    - `airTempC` (number, optional)
    - `surge` (enum: `"none" | "light" | "medium" | "strong"`)
    - `current` (enum: `"none" | "light" | "medium" | "strong"`)
- **Equipment & Air:** 
    - `tank`:
        - `tankLabel` (enum: `"AL80" | "AL63" | ... | "Other"`)
        - `customSpecs` (string, required if tankLabel is "Other")
        - `gasMix` (enum: `"air" | "ean32" | "ean36" | "ean40" | "customNitrox"`)
    - `pressure`:
        - `startPressureBar` (number, bar)
        - `endPressureBar` (number, bar)
        - `amountUsedBar` (number, auto-calculated, bar)
    - `weight`:
        - `weightKg` (number)
        - `weightType` (array of strings, e.g., "belt", "integrated")
    - `exposureSuit`:
        - `type` (enum: `"none" | "shortie" | "full" | "drysuit" | "other"`)
        - `thicknessMm` (number, optional)
        - `otherText` (string, optional if type is "other")
- **Misc Data:** 
    - `rating` (1–5)
    - `lifeSeen` (array of observed species):
        ```json
            [
                { "group": "Turtle", "detail": "1 adult loggerhead turtle", "active": true },
                { "group": "Reef Fish", "detail": "Clownfish", "active": true }
            ]
        ```
- **Notes:** 
    - `additionalNotes` (string, optional)

---

### User Authentication Endpoints

- **POST /api/user/signup**  
    Register a new user.

    Request Body:
    ```json
        {
            "email": "user@example.com",
            "password": "password123"
        }
    ```

    Response:
    ```json
        {
            "email": "user@example.com",
            "token": "<access_token>"
        }
    ```
    Sets a refresh token as HTTP-only cookie.

- **POST /api/user/login**  
    Login an existing user.
    Request Body: same as signup.
    Response: same as signup.
    Sets a refresh token as HTTP-only cookie.

- **POST /api/user/refresh**  
    Uses refresh token cookie to generate a new access token.
    Response: 
    ```json
        { 
            "token": "<new_access_token>" 
        }
    ```
    **Note:** Used to keep users logged in without re-entering credentials.

- **POST /api/user/logout**  
    Logs out the user by clearing refresh token from DB and cookie.

---

### User Model

A User has:

- **email** (String, unique, required)
- **password** (hashed, required)
- **refreshToken** (String, optional)

---

### Authentication Methods

- **signup(email, password)**  
  Validates input, hashes password, creates a new user.

- **login(email, password)**  
  Validates credentials, returns user

------------------------
------------------------

## Frontend – Dive Logger

### Tech Stack
- **Framework:** React 18 + Vite  
- **Styling:** Tailwind CSS (custom ocean/sand/coral theme)  
- **Routing:** React Router v6  
- **State Management:** Context API + custom hooks  
- **Fonts & Icons:** Google Fonts (Inter), Material Symbols Outlined  

---

### Getting Started

1. Install dependencies:
    ```bash
    npm install
    ```
2. Start the dev server:
    ```bash
    npm run dev
    ```
3. Open http://localhost:5173 in your browser

---

### Context Providers
- **AuthContextProvider**: Manages authentication state, user tokens, and auto-refresh of tokens. Hook: `useAuthContext()`.
- **DiveContextProvider**: Manages dive logs and supports CRUD operations. Hook: `useDiveContext()`.
- **UnitContextProvider**: Stores metric/imperial preferences and handles unit conversions. Hook: `useUnitContext()`.

---

### Pages & Routing
- `/` → Home: Dive dashboard (protected)        
- `/log-dive` → LogDive: Create a new dive (protected)     
- `/log-dive/:diveId` → LogDive: Edit existing dive (protected)    
- `/login` → Login: User login page                   
- `/signup` → Signup: User signup page                  

---

**Key Components**
- `NavBar`: responsive, dynamic links based on auth state  
- `ProtectedRoute`: guards routes requiring authentication  
- Reusable form components with client-side validation  
- Password visibility toggle on login/signup  
- Smooth transitions and UI animations  

---

### Features
- Full authentication flow integrated with backend API  
- Client-side validation and server error handling  
- Responsive design for desktop & mobile with Tailwind CSS  
- Consistent theme and polished UI  
- Automatic unit conversions for all numeric fields (depth, weight, temperature, pressure)  

---

### Dive Dashboard (Home Page)
- Displays all logged dives for the authenticated user  
- Toggle between Metric & Imperial units  
- Responsive grid layout using Tailwind CSS  
- Each dive rendered as a `DiveDetails` card  

**DiveDetails Card Features**
- Core info: Title, date/time, dive site, max/avg depth, bottom time, entry type  
- Optional info: Visibility, water/air temp, surge/current, tank, exposure suit, weights, marine life, notes  
- Metric & Imperial unit conversions (meters to/from feet, kg to/from lbs, °C to/from °F, bar to/from psi)  
- Edit button navigates to `/log-dive/:diveId`  
- Delete button has confirmation modal before API call  
- Timestamp shows “Logged X ago”  
- Dive rating display with stars  
- Smooth animations and hover effects  

---

### Log Dive Page

**Multi-step form for creating/editing dives (5 steps)**

1. **CoreDetails** – title, dive site, date/time, max/avg depth, bottom time, entry type  
2. **DiveConditions** – visibility, water temp, air temp, surge/current  
3. **EquipmentAndAir** – tank type, gas mix, start/end pressure, exposure suit, weights, estimated air used  
4. **MiscData** – marine life seen, additional notes, rating (1–5 stars)  
5. **ReviewDive** – summary of all entered info before submission  

**Form Features**
- Metric & Imperial toggle for numeric fields  
- Conditional fields appear based on previous selections  
- Required field validation  
- Pre-fill form for editing dives  
- Multi-step navigation with Back/Next buttons  
- Submission via POST (new) or PATCH (edit) using `apiFetch`  
- Success/error feedback modals  

---

### Context & Hooks Overview

**Authentication Context**
- Tracks global auth state and user tokens  
- Auto-refreshes tokens on page load  
- Exposes `user`, `loading`, `refreshToken`  
- Hook: `useAuthContext()`  

**Dive Context**
- Stores all logged dives globally  
- Supports CRUD operations: `SET_DIVES`, `CREATE_DIVE`, `DELETE_DIVE`, `UPDATE_DIVE`  
- Hook: `useDiveContext()`  

**Unit Context**
- Stores user preference for metric/imperial  
- Default: metric  
- Hook: `useUnitContext()`  

---

### Utilities
- `unitConversions.jsx` handles conversions between:  
  - Meters to/from Feet  
  - Kg to/from Lbs  
  - °C to/from °F  
  - Bar to/from Psi  
  
- `apiFetch.jsx` centralizes API requests with:  
  - JSON headers  
  - Auth token handling  
  - Automatic token refresh  
  - Error handling  
