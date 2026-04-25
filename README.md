# BagWatch
**Affordable Bluetooth luggage tracking for South African bus commuters.**

> Built from personal experience. My belongings were stolen on an Intercity Xpress bus. Like hundreds of South Africans every week, I reported it and got nothing back. No tracking. No alerts. No recourse. Most people move on. I decided to build a solution instead.

![Status](https://img.shields.io/badge/status-active%20development-orange)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Node.js-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Made in SA](https://img.shields.io/badge/made%20in-South%20Africa-green)

---

## The Problem

Luggage theft on South African buses and taxis is a daily reality for working-class commuters. Existing solutions like Apple AirTags and Tile cost hundreds of rands and charge monthly fees — completely out of reach for the average person. There is no affordable, locally-built alternative.

BagWatch aims to change that.

- Target hardware cost: **under R100**
- App: **free, forever**
- No SIM card required — runs on Bluetooth with a community relay network

---

## Current Features (Week 1 Prototype)

| Feature | Status |
|---|---|
| Sign Up / Sign In with real-time validation | Done |
| Password strength meter | Done |
| Slide-up drawer UI (like Uber / WhatsApp) | Done |
| Animated screen transitions | Done |
| Live bag status system (Connected / Away / Lost) | Done |
| Smart alert system with meaningful actions | Done |
| "I Found It" — marks a lost bag as safe again | Done |
| Profile card populated from real account data | Done |
| Local dev server (Node.js + Express) | Done |
| Toast notifications | Done |
| Real Bluetooth Web API integration | In progress |
| Backend + database (persistent accounts) | Planned |
| Community relay network (anonymous mesh) | Planned |
| ESP32 hardware design (~R80) | Planned |

---

## Tech Stack

```
Frontend  →  HTML5, CSS3, Vanilla JavaScript
Server    →  Node.js + Express
Styling   →  Custom CSS animations, Google Fonts (Barlow Condensed)
Hardware  →  Bluetooth Low Energy (BLE) — ESP32 planned
```

No frameworks — pure fundamentals first. Every line written and understood from scratch.

---

## Running Locally

**Prerequisites:** [Node.js](https://nodejs.org) LTS

```bash
# Clone the repo
git clone https://github.com/sepatosscc025/BagWatch.git
cd BagWatch

# Install dependencies
npm install

# Start the server
npm start
```

Open **http://localhost:3000** in your browser.

For auto-restart on file save:
```bash
npm run dev
```

---

## Project Structure

```
BagWatch/
├── public/
│   ├── index.html      — All screens and UI components
│   ├── styles.css      — All styling, animations, design tokens
│   └── app.js          — All logic, data store, event handling
├── server.js           — Express server (API routes go here)
├── package.json
└── README.md
```

---

## Roadmap

| Week | Focus |
|---|---|
| Week 2 | Real Bluetooth Web API — filter by BagWatch device UUID |
| Week 3 | Backend with user database (PostgreSQL or MongoDB) |
| Week 4 | Persistent bag data, push notifications |
| Week 5 | Community relay network architecture |
| Later | ESP32 hardware prototype, SAPS report integration |

---

## Looking for Collaborators

This project is bigger than one person. If you have experience in any of these areas and believe in tech that solves real problems for real people, I would love to connect:

- **BLE / ESP32 hardware** — help design the sub-R100 tracker device
- **UI/UX design** — make the app more accessible for low-income users
- **Backend development** — Node.js, databases, real-time systems
- **Mesh networking** — anonymous community relay architecture
- **Investors or NGOs** interested in safety tech for South African commuters

---

## Built by

**Senzeliwe Patosi**  
Data Engineering Student @ [WeThinkCode\_](https://wethinkcodeacademy.com)  
[LinkedIn](https://www.linkedin.com/in/senzeliwe-patosi-520323379) · [GitHub](https://github.com/sepatosscc025)

*"I used the technical skills I was acquiring to fix a problem that affects thousands of people — and goes unnoticed every single day."*

---

## License

MIT — free to use, adapt, and build on. Credit appreciated.
