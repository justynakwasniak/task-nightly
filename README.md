# IOTA Validators Globe

This is a Next.js 19 project that visualizes IOTA validators on an interactive 3D globe using Globe.gl.

The goal of this project was to simulate a real-time network visualization inspired by blockchain monitoring dashboards.

---

## 🚀 Features

- Interactive 3D globe (Globe.gl + Three.js)
- Validators displayed as dynamic points on the map
- Click interaction with camera focus on selected validator
- Responsive UI (desktop + mobile layouts)
- Live data updates via polling (mocked API layer)
- Separation between frontend and API layer

---

## 🧱 Tech Stack

- Next.js 19 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Globe.gl (Three.js based visualization)

---

## 📦 Getting Started

First, install dependencies:

```bash

npm install

Run development server:

npm run dev

Open:

http://localhost:3000

---
🔧 Project Structure
/app/api/validators – API route with rate limiting
/components/Globe – 3D globe visualization
/hooks/useValidators – data fetching logic
/lib/validators – mock data generator

---

⚠️ Notes

Data is currently mocked for demonstration purposes
API layer is designed to simulate a secure backend for future IOTA RPC integration
This is a recruitment task implementation demonstrating frontend and API layer design for a blockchain data visualization use case.

---

📌 Future Improvements
Replace mock data with real IOTA validator API
Replace polling with WebSockets or streaming updates
Improve geolocation accuracy for validators