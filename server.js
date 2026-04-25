// ============================================================
// BAGWATCH — server.js
// Local development server.
// Run with:  node server.js
// Then open: http://localhost:3000
// ============================================================

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = 3000;

// Serve everything in the /public folder (index.html, styles.css, app.js)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log('');
  console.log('  ✅ BagWatch is running!');
  console.log(`  👉 Open your browser at: http://localhost:${PORT}`);
  console.log('');
  console.log('  Press Ctrl + C to stop the server.');
  console.log('');
});