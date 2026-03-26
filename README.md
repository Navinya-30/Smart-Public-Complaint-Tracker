# 🏙️ CivicPulse — Smart Public Complaint Tracker

> **Team:** Encypherist | **Problem Statement:** PS 11 | **Domain:** Civic Tech

---

## 📁 Folder Structure
smart-complaint-tracker/
├── public/
│   └── index.html             ← HTML entry point (Leaflet CSS linked here)
├── src/
│   ├── context/
│   │   └── ComplaintsContext.js ← Global state: localStorage reads/writes, submit/update logic
│   ├── components/
│   │   ├── Navbar.js            ← Sticky top nav with mobile hamburger
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── HomePage.js          ← Landing page: hero, how-it-works, recent complaints
│   │   ├── HomePage.css
│   │   ├── ReportPage.js        ← Report form: category, GPS, image handling
│   │   ├── ReportPage.css
│   │   ├── MapPage.js           ← Live map with Leaflet + sidebar filters
│   │   ├── MapPage.css
│   │   ├── DashboardPage.js     ← All complaints: stats, search, filter, status updates
│   │   └── DashboardPage.css
│   ├── App.js                   ← Router + layout shell
│   ├── App.css                  ← Global styles, CSS variables, utilities
│   └── index.js                 ← React root render
├── package.json
└── README.md


---

## ⚙️ Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend UI | React.js 18 | Fast, component-based SPA |
| Routing | React Router DOM v6 | Multi-page navigation |
| Maps | React-Leaflet + Leaflet.js | Interactive map with free tiles (no API key needed) |
| Location | HTML5 Geolocation API | Browser-native GPS capture |
| Database | Browser `localStorage` | Zero-latency, completely offline-capable prototype data storage |
| State Management | React Context API | Seamless global data sharing across components |

