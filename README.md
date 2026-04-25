# BagWatch 🎒🇿🇦
> Affordable Bluetooth luggage tracker for South African bus commuters.

---

## Your Project Structure

```
bagwatch-project/
│
├── public/               ← Your app lives here (edit these)
│   ├── index.html        ← All the screens and buttons
│   ├── styles.css        ← All the colours and design
│   └── app.js            ← All the logic and interactivity
│
├── server.js             ← Starts the local web server
├── package.json          ← Lists the dependencies
└── README.md             ← This file
```

---

## First Time Setup (do this once)

### Step 1 — Install Node.js
Download and install from: https://nodejs.org
Choose the version that says **"LTS"** (Long Term Support).

To check it installed correctly, open your terminal and type:
```
node --version
```
You should see something like `v20.0.0`

---

### Step 2 — Open a terminal in your project folder

**On Windows:**
- Open the `bagwatch-project` folder in File Explorer
- Click the address bar at the top, type `cmd`, press Enter

**On Mac:**
- Right-click the `bagwatch-project` folder
- Click "New Terminal at Folder"

---

### Step 3 — Install dependencies (do this once)
In the terminal, type:
```
npm install
```
This downloads Express (the server library). You'll see a `node_modules` folder appear.

---

### Step 4 — Start the server
```
npm start
```

You should see:
```
  ✅ BagWatch is running!
  👉 Open your browser at: http://localhost:3000
```

---

### Step 5 — Open the app
Open your browser and go to:
```
http://localhost:3000
```

That's it! Your app is running. 🎉

---

## Daily Use (after first setup)

Every time you want to work on BagWatch:
1. Open terminal in the `bagwatch-project` folder
2. Type `npm start`
3. Open `http://localhost:3000` in your browser
4. Edit `index.html`, `styles.css`, or `app.js`
5. **Refresh your browser** to see changes

To stop the server: press `Ctrl + C` in the terminal.

---

## Pro Tip: Live Reload (auto-refresh on save)

Instead of `npm start`, use:
```
npm run dev
```
This uses `nodemon` which **automatically restarts the server** every time
you save a file — so you don't need to keep restarting manually.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm: command not found` | Install Node.js from nodejs.org |
| `Cannot find module 'express'` | Run `npm install` first |
| Port 3000 already in use | Change `3000` in server.js to `3001` |
| App shows but looks broken | Make sure all 3 files are in the `public/` folder |

---

## Files — What to Edit and When

| File | Edit when... |
|---|---|
| `public/index.html` | You want to add/move/remove buttons, inputs, or screens |
| `public/styles.css` | You want to change colours, fonts, spacing, or animations |
| `public/app.js` | You want to change what happens when buttons are clicked |
| `server.js` | You want to add backend routes (APIs) in the future |