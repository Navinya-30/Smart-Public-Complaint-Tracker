# 🏙️ CivicPulse — Smart Public Complaint Tracker

> **Team:** Encypherist | **Problem Statement:** PS 11 | **Domain:** Civic Tech

---

## 📁 Folder Structure

```
smart-complaint-tracker/
├── public/
│   └── index.html              ← HTML entry point (Leaflet CSS linked here)
├── src/
│   ├── context/
│   │   └── ComplaintsContext.js ← Global state: Firebase reads/writes, submit/update logic
│   ├── components/
│   │   ├── Navbar.js            ← Sticky top nav with mobile hamburger
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── HomePage.js          ← Landing page: hero, how-it-works, recent complaints
│   │   ├── HomePage.css
│   │   ├── ReportPage.js        ← Report form: category, GPS, image upload
│   │   ├── ReportPage.css
│   │   ├── MapPage.js           ← Live map with Leaflet + sidebar filters
│   │   ├── MapPage.css
│   │   ├── DashboardPage.js     ← All complaints: stats, search, filter, status updates
│   │   └── DashboardPage.css
│   ├── App.js                   ← Router + layout shell
│   ├── App.css                  ← Global styles, CSS variables, utilities
│   ├── index.js                 ← React root render
│   └── firebase.js              ← Firebase config (YOU EDIT THIS)
├── firestore.rules              ← Firebase security rules to paste in console
├── package.json
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend UI | React.js 18 | Fast, component-based SPA |
| Routing | React Router DOM v6 | Multi-page navigation |
| Maps | React-Leaflet + Leaflet.js | Interactive map with free tiles (no API key needed) |
| Location | HTML5 Geolocation API | Browser-native GPS capture |
| Database | Firebase Firestore | Real-time updates, no backend needed |
| File Storage | Firebase Storage | Photo uploads for complaints |
| Hosting | Firebase Hosting (optional) | Free, fast deployment |

---

## 🚀 Step-by-Step Setup Guide

### STEP 1 — Install Node.js
Download from: https://nodejs.org (choose LTS version)
Verify: `node -v` and `npm -v` in terminal

---

### STEP 2 — Create the Project Folder

```bash
# Create the folder anywhere on your PC
mkdir smart-complaint-tracker
cd smart-complaint-tracker
```

Paste ALL the files from this project into the folder, maintaining the exact structure shown above.

---

### STEP 3 — Set Up Firebase (FREE)

1. Go to: **https://console.firebase.google.com**
2. Click **"Add project"** → Name it `civic-pulse` → Continue (disable Google Analytics is fine)
3. Once created, click the **Web icon `</>`** to add a web app
4. Register app name as `CivicPulse` → Copy the `firebaseConfig` object shown

**Enable Firestore:**
- Left sidebar → **Build → Firestore Database**
- Click **Create database** → Choose **Start in test mode** → Select a region → Done

**Enable Storage:**
- Left sidebar → **Build → Storage**
- Click **Get started** → Start in test mode → Done

**Paste Security Rules:**
- In Firestore → **Rules tab** → Paste the content of `firestore.rules` → Publish

---

### STEP 4 — Add Your Firebase Config

Open `src/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // ← your real values here
  authDomain: "civic-pulse.firebaseapp.com",
  projectId: "civic-pulse",
  storageBucket: "civic-pulse.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

### STEP 5 — Install Dependencies & Run

```bash
# In the project root folder:
npm install

# Start the development server:
npm start
```

The app opens at: **http://localhost:3000** 🎉

---

## 🌐 Pages & Features

| Route | Page | Features |
|---|---|---|
| `/` | Home | Hero section, how-it-works steps, live recent complaints feed |
| `/report` | Report Issue | Category selector, title/description form, photo upload, GPS capture, Firebase submit |
| `/map` | Live Map | Dark CartoDB map, colour-coded pins by status, sidebar with filters, Leaflet popups |
| `/dashboard` | Dashboard | Stats cards, search bar, category + status filters, inline status update, upvotes |

---

## 🔄 Status Flow

```
Reported  →  In Progress  →  Resolved
  🔴              🟡              🟢
```

Status can be updated from the Dashboard by any user (demo mode). In production, lock this to admin auth.

---

## 🏗️ How to Demo at Hackathon

1. Open the app → show the **Home** page hero + animated map preview
2. Click **"Report an Issue"** → fill form → click **"Capture My Location"** → submit
3. Go to **Live Map** → show the new pin on the map in real time
4. Go to **Dashboard** → show the complaint card → change status to "In Progress"
5. Go back to **Live Map** → pin colour has changed to yellow ✅

---

## 🚢 Optional: Deploy to Firebase Hosting (Free)

```bash
npm install -g firebase-tools
npm run build
firebase login
firebase init hosting   # select "build" as public dir, SPA: yes
firebase deploy
```

Your app will be live at: `https://your-project.web.app`

---

## 💡 Hackathon Tips

- Use **Incognito window** on phone browser to demo GPS capture live
- Pre-submit 3–4 sample complaints before the demo for a populated map
- Keep Firebase console open on a second screen to show real-time DB updates
- The Dashboard's status update feature is perfect for showing the "authority side"

---

## 👥 Team Encypherist
**Members:** Navinya & Teammates  
**Problem Statement:** PS 11 — Smart Public Complaint Tracker
