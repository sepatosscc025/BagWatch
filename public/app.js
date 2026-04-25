/* ============================================================
   BAGWATCH — app.js
   All JavaScript logic for the BagWatch app.

   TABLE OF CONTENTS:
   1.  Screen Navigation
   2.  Auth — Sign In
   3.  Auth — Sign Up
   4.  Auth — Password Toggle
   5.  Tab Switching (inside the main app)
   6.  Modal Helpers
   7.  Bag Actions
   8.  Device Scanning (Bluetooth simulation)
   9.  Report Submission
   ============================================================ */


/* ----------------------------------------------------------
   1. SCREEN NAVIGATION (main app screens)
   ---------------------------------------------------------- */
const allScreens = ['splash', 'app'];

function goScreen(id) {
  const current = allScreens.find(s => document.getElementById(s).classList.contains('active'));

  // Slide out the current screen
  if (current && current !== id) {
    const currentEl = document.getElementById(current);
    currentEl.classList.add('slide-out');
    currentEl.classList.remove('active');
    // Clean up slide-out class after animation finishes
    setTimeout(() => currentEl.classList.remove('slide-out'), 450);
  }

  // Slide in the new screen
  const next = document.getElementById(id);
  next.scrollTop = 0;
  // Small delay so CSS transition has something to animate FROM
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.classList.add('active');
    });
  });
}

function goTo(screen) { goScreen(screen); } // legacy alias


/* ----------------------------------------------------------
   1b. AUTH DRAWER CONTROLS
   The sign in / sign up forms slide up as drawers over
   the splash screen instead of navigating to a new page.
   ---------------------------------------------------------- */
function openAuthDrawer(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAuthDrawer(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function switchAuthDrawer(closeId, openId) {
  closeAuthDrawer(closeId);
  setTimeout(() => openAuthDrawer(openId), 200);
}

function doGuestLogin() {
  closeAuthDrawer('signinDrawer');
  document.getElementById('profile-name').textContent  = 'Guest User';
  document.getElementById('profile-email').textContent = 'Browsing as guest';
  document.getElementById('profile-avatar').textContent = '?';
  goScreen('app');
  switchTab('home');
}

// Close drawer only when clicking the dark background, not the drawer itself
document.addEventListener('DOMContentLoaded', () => {
  ['signinDrawer', 'signupDrawer'].forEach(id => {
    document.getElementById(id).addEventListener('click', function(e) {
      if (e.target === this) closeAuthDrawer(id);
    });
  });
});


/* ----------------------------------------------------------
   HELPERS: In-memory user store (simulates a database)
   In a real app this would be a backend API call.
   ---------------------------------------------------------- */
const users = {}; // { email: { name, password } }

// Simple email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show an error message on an auth form
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.classList.add('show');
  // Shake animation to draw attention
  el.style.animation = 'none';
  el.offsetHeight; // force reflow
  el.style.animation = 'shake 0.4s ease';
}

function hideError(elementId) {
  document.getElementById(elementId).classList.remove('show');
}

// Set a button into loading state and back
function setButtonLoading(btn, loadingText, originalText, ms, callback) {
  btn.disabled = true;
  btn.textContent = loadingText;
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = originalText;
    btn.style.opacity = '1';
    callback();
  }, ms);
}

// Log in a user and enter the app
function enterApp(name, email) {
  // Update the profile card in Settings with real user data
  document.getElementById('profile-name').textContent   = name;
  document.getElementById('profile-email').textContent  = email;
  document.getElementById('profile-avatar').textContent = name.charAt(0).toUpperCase();

  // Update the home greeting with the user's first name
  const firstName = name.split(' ')[0];
  const greetEl = document.getElementById('home-greeting');
  if (greetEl) greetEl.textContent = 'Welcome, ' + firstName + ' 👋';

  // Render bags and alerts fresh for this user session
  renderBags();
  renderAlerts();

  // Navigate to the app dashboard
  goScreen('app');
  switchTab('home');

  // Show a brief welcome toast notification
  showToast('✅ Signed in successfully!');
}

/* ----------------------------------------------------------
   TOAST NOTIFICATION
   A small message that pops up at the top and fades away.
   ---------------------------------------------------------- */
function showToast(message) {
  // Remove any existing toast first
  const existing = document.getElementById('bw-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'bw-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 1.25rem;
    left: 50%;
    transform: translateX(-50%) translateY(-80px);
    background: var(--surface);
    border: 1px solid var(--green);
    color: var(--green);
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.65rem 1.25rem;
    border-radius: 99px;
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
    opacity: 0;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });
  });

  // Animate out after 2.5 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(-80px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}


/* ----------------------------------------------------------
   2. AUTH — SIGN IN
   Checks the user exists in our in-memory store and that
   the password matches before entering the app.
   ---------------------------------------------------------- */
function doSignIn() {
  const email = document.getElementById('signin-email').value.trim().toLowerCase();
  const pass  = document.getElementById('signin-password').value;
  const btn   = document.getElementById('signin-btn');

  // Field validation
  if (!email && !pass) {
    showError('signin-error', 'Please enter your email and password.');
    return;
  }
  if (!email) {
    showError('signin-error', 'Please enter your email address.');
    return;
  }
  if (!isValidEmail(email)) {
    showError('signin-error', 'That email address doesn\'t look right.');
    return;
  }
  if (!pass) {
    showError('signin-error', 'Please enter your password.');
    return;
  }

  hideError('signin-error');

  // Simulate network call (1.2 seconds)
  setButtonLoading(btn, 'Signing in…', 'Sign In', 1200, () => {

    // Check if this user has registered
    if (!users[email]) {
      showError('signin-error', 'No account found with that email. Please sign up first.');
      return;
    }

    // Check password
    if (users[email].password !== pass) {
      showError('signin-error', 'Incorrect password. Please try again.');
      const pwField = document.getElementById('signin-password');
      pwField.style.borderColor = 'var(--red)';
      setTimeout(() => pwField.style.borderColor = '', 1500);
      return;
    }

    // Success — close drawer then enter the app
    closeAuthDrawer('signinDrawer');
    setTimeout(() => enterApp(users[email].name, email), 150);
  });
}


/* ----------------------------------------------------------
   3. AUTH — SIGN UP
   Validates all fields in real time, saves the user to our
   in-memory store, then enters the app.
   ---------------------------------------------------------- */
function doSignUp() {
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const pass  = document.getElementById('signup-password').value;
  const btn   = document.getElementById('signup-btn');

  // ── Validation: Name ──
  if (!name) {
    showError('signup-error', '👤 Please enter your full name.');
    document.getElementById('signup-name').focus();
    return;
  }
  if (name.length < 2) {
    showError('signup-error', '👤 Name must be at least 2 characters.');
    return;
  }

  // ── Validation: Email ──
  if (!email) {
    showError('signup-error', '📧 Please enter your email address.');
    document.getElementById('signup-email').focus();
    return;
  }
  if (!isValidEmail(email)) {
    showError('signup-error', '📧 Please enter a valid email (e.g. thabo@gmail.com).');
    document.getElementById('signup-email').focus();
    return;
  }

  // ── Validation: Password ──
  if (!pass) {
    showError('signup-error', '🔒 Please create a password.');
    document.getElementById('signup-password').focus();
    return;
  }
  if (pass.length < 6) {
    showError('signup-error', '🔒 Password must be at least 6 characters.');
    document.getElementById('signup-password').focus();
    return;
  }

  hideError('signup-error');

  // Simulate network call (1.5 seconds)
  setButtonLoading(btn, 'Creating account…', 'Create My Account', 1500, () => {

    // Check if email already registered
    if (users[email]) {
      showError('signup-error', '📧 An account with this email already exists. Please sign in.');
      return;
    }

    // Save user to our in-memory store
    users[email] = { name, password: pass };

    // Show success tick before entering the app
    btn.textContent = '✅ Account created!';
    btn.style.background = 'var(--green)';
    btn.style.opacity = '1';

    setTimeout(() => {
      btn.textContent = 'Create My Account';
      btn.style.background = '';
      closeAuthDrawer('signupDrawer');
      setTimeout(() => enterApp(name, email), 150);
    }, 800);
  });
}


/* ----------------------------------------------------------
   4. AUTH — PASSWORD VISIBILITY TOGGLE
   Toggles between password (hidden) and text (visible).
   Changes the eye icon colour as feedback.
   ---------------------------------------------------------- */
function togglePw(inputId, btn) {
  const input  = document.getElementById(inputId);
  const isHidden = input.type === 'password';

  input.type = isHidden ? 'text' : 'password';
  btn.querySelector('svg').style.stroke = isHidden ? 'var(--orange)' : 'var(--muted)';
}


/* ----------------------------------------------------------
   5. LIVE FIELD VALIDATION (Sign Up)
   Gives instant green/red feedback as the user types —
   so they fix mistakes before hitting the button.
   ---------------------------------------------------------- */

function setFieldState(input, valid) {
  input.style.borderColor = valid ? 'var(--green)' : 'var(--red)';
}

function liveValidateName(input) {
  const val = input.value.trim();
  if (val.length === 0) { input.style.borderColor = ''; return; }
  setFieldState(input, val.length >= 2);
}

function liveValidateEmail(input) {
  const val = input.value.trim();
  if (val.length === 0) { input.style.borderColor = ''; return; }
  setFieldState(input, isValidEmail(val));
}

function liveValidatePassword(input) {
  const val = input.value;
  const wrap = document.getElementById('strength-bar-wrap');
  const bar  = document.getElementById('strength-bar');
  const lbl  = document.getElementById('strength-label');

  if (val.length === 0) {
    input.style.borderColor = '';
    wrap.style.display = 'none';
    return;
  }

  wrap.style.display = 'block';

  // Score the password
  let score = 0;
  if (val.length >= 6)  score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { width: '20%', color: 'var(--red)',    label: 'Too short'  },
    { width: '40%', color: 'var(--red)',    label: 'Weak'       },
    { width: '60%', color: 'var(--yellow)', label: 'Fair'       },
    { width: '80%', color: 'var(--yellow)', label: 'Good'       },
    { width: '100%',color: 'var(--green)',  label: 'Strong 💪'  },
  ];

  const level = levels[Math.min(score, 4)];
  bar.style.width      = level.width;
  bar.style.background = level.color;
  lbl.style.color      = level.color;
  lbl.textContent      = level.label;

  setFieldState(input, val.length >= 6);
}


/* ----------------------------------------------------------
   5b. TAB SWITCHING (inside the main app)
   Shows one content tab at a time and highlights the
   matching bottom nav button.
   ---------------------------------------------------------- */
const tabs = ['home', 'alerts', 'report', 'settings'];

function switchTab(tab) {
  tabs.forEach(t => {
    document.getElementById('tab-' + t).style.display = 'none';
    document.getElementById('nav-' + t).classList.remove('active');
  });
  document.getElementById('tab-' + tab).style.display = 'block';
  document.getElementById('nav-' + tab).classList.add('active');
  window.scrollTo(0, 0);
}


/* ----------------------------------------------------------
   6. MODAL HELPERS
   Open, close, and close-on-overlay-click helpers used by
   both the Add Device and Alert modals.
   ---------------------------------------------------------- */
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function closeModalOutside(event, id) {
  // Only close if the user clicked the dark overlay itself,
  // not any content inside the modal
  if (event.target.id === id) {
    closeModal(id);
  }
}


/* ----------------------------------------------------------
   7. BAG DATA STORE
   All bags and alerts are stored here as real JavaScript
   objects. This replaces all hardcoded HTML bag cards.
   ---------------------------------------------------------- */

// The user's bag list — starts empty, grows as they add devices
let bagStore = [];

// Alert history — grows as events happen
let alertStore = [];

// Emoji map for bag types
const bagEmojis = {
  'Backpack':    '🎒',
  'Suitcase':    '🧳',
  'Handbag':     '👜',
  'Briefcase':   '💼',
  'Shopping Bag':'🛍️'
};

/* Render all bags into the #bags-grid element */
function renderBags() {
  var grid  = document.getElementById('bags-grid');
  var empty = document.getElementById('empty-bags');

  if (bagStore.length === 0) {
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  // Remove old cards but keep the empty-state div
  grid.querySelectorAll('.bag-card').forEach(function(c) { c.remove(); });

  bagStore.forEach(function(bag, idx) {
    var card = document.createElement('div');
    var statusClass = bag.status === 'connected' ? ' connected'
                    : bag.status === 'lost'      ? ' lost' : '';
    card.className = 'bag-card' + statusClass;

    var pillClass = bag.status === 'connected' ? 'pill-connected'
                  : bag.status === 'lost'      ? 'pill-lost'
                  :                              'pill-away';
    var pillLabel = bag.status === 'connected' ? 'Connected'
                  : bag.status === 'lost'      ? 'Lost'
                  :                              'Away';
    var metaText  = bag.status === 'lost'
                  ? '⚠️ Signal lost · just now'
                  : 'Last seen · ' + bag.lastSeen;

    // Build HTML using string concatenation — no template literals
    card.innerHTML =
      '<div class="bag-icon">' + bag.emoji + '</div>'
      + '<div class="bag-info">'
      +   '<div class="bag-name">' + bag.name + '</div>'
      +   '<div class="bag-meta">' + metaText + '</div>'
      + '</div>'
      + '<div class="bag-status">'
      +   '<div class="status-pill ' + pillClass + '">' + pillLabel + '</div>'
      +   '<div class="bag-distance">' + bag.distance + '</div>'
      + '</div>';

    // Attach click handler via JS (not inline onclick) to avoid escaping issues
    (function(bagRef) {
      card.addEventListener('click', function() { showBagDetail(bagRef); });
    })(bag);

    grid.appendChild(card);
  });

  updateStatusBanner();
}

/* Update the top status banner based on actual bag data */
function updateStatusBanner() {
  const lostBags = bagStore.filter(b => b.status === 'lost');
  const dot   = document.getElementById('statusDot');
  const title = document.getElementById('statusTitle');
  const sub   = document.getElementById('statusSub');

  if (bagStore.length === 0) {
    dot.className   = 'status-dot';
    title.textContent = 'No devices paired';
    sub.textContent   = 'Add a BagWatch tracker to get started';
    return;
  }
  if (lostBags.length > 0) {
    dot.className   = 'status-dot red';
    title.textContent = lostBags.length === 1
      ? '⚠️ ' + lostBags[0].name + ' signal lost!'
      : '⚠️ ' + lostBags.length + ' bags have lost signal!';
    sub.textContent   = 'Tap the bag card for options';
  } else {
    dot.className   = 'status-dot';
    title.textContent = 'All bags safe';
    sub.textContent   = 'Bluetooth active · ' + bagStore.length + ' device' + (bagStore.length > 1 ? 's' : '') + ' connected';
  }
}

/* Render alerts into the #alerts-list element */
function renderAlerts() {
  var list = document.getElementById('alerts-list');
  if (!list) return;
  list.innerHTML = '';

  if (alertStore.length === 0) {
    list.innerHTML =
      '<div class="empty-state">'
      + '<div class="empty-icon">🔔</div>'
      + '<div class="empty-title">No alerts yet</div>'
      + '<div class="empty-sub">You will be notified when a bag moves or loses signal</div>'
      + '</div>';
    return;
  }

  alertStore.forEach(function(alert, i) {
    var card = document.createElement('div');
    card.className = 'alert-card';
    card.style.position = 'relative';

    // Border and accent colour based on alert type
    var borderColor  = alert.type === 'lost'    ? 'rgba(239,68,68,0.3)'
                     : alert.type === 'warning' ? 'rgba(234,179,8,0.3)'
                     :                            'var(--border)';
    var accentColor  = alert.type === 'lost'    ? 'var(--red)'
                     : alert.type === 'warning' ? 'var(--yellow)'
                     :                            'var(--green)';

    card.style.borderColor = borderColor;

    // Always show Report Theft + Dismiss for lost alerts
    // Show Report Theft option for all other alerts too (user may want to report)
    var actions = '<div class="alert-actions">';
    if (alert.type === 'lost' || alert.type === 'warning') {
      actions += '<button class="btn-sm btn-sm-primary" id="report-btn-' + i + '">Report Theft</button> ';
    }
    actions += '<button class="btn-sm btn-sm-ghost" id="dismiss-btn-' + i + '">Dismiss</button>';
    actions += '</div>';

    card.innerHTML =
      '<div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:' + accentColor + ';border-radius:4px 0 0 4px;"></div>'
      + '<div class="alert-top">'
      +   '<div class="alert-title">' + alert.title + '</div>'
      +   '<div class="alert-time">'  + alert.time  + '</div>'
      + '</div>'
      + '<div class="alert-body">' + alert.body + '</div>'
      + actions;

    list.appendChild(card);

    // Wire up buttons safely after appending to DOM
    var reportBtn  = document.getElementById('report-btn-' + i);
    var dismissBtn = document.getElementById('dismiss-btn-' + i);

    if (reportBtn) {
      reportBtn.addEventListener('click', function() {
        switchTab('report');
      });
    }
    if (dismissBtn) {
      (function(index) {
        dismissBtn.addEventListener('click', function() {
          alertStore.splice(index, 1);
          renderAlerts();
        });
      })(i);
    }
  });
}


/* Add a new alert to the store and re-render */
function addAlert(type, title, body) {
  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  alertStore.unshift({ type, title, body, time });
  renderAlerts();
}

/* Show bag detail popup */
function showBagDetail(bag) {
  alert(
    '📍 ' + bag.name + '\n\n' +
    'Status: ' + bag.status.charAt(0).toUpperCase() + bag.status.slice(1) + '\n' +
    'Last seen: ' + bag.lastSeen + '\n' +
    'Distance: ' + bag.distance + '\n' +
    'Battery: ' + bag.battery + '%\n' +
    'Device ID: ' + bag.id
  );
}

/* Open the alert modal (used by lost bag cards) */
function triggerAlert() {
  openModal('alertModal');
}


/* ----------------------------------------------------------
   8. DEVICE SCANNING (Bluetooth simulation)
   Simulates a 3.5-second BLE scan before "finding" a device.
   Real Bluetooth Web API integration will replace this.
   ---------------------------------------------------------- */
let scanning = false;

function startScan() {
  if (scanning) return;

  const ring = document.getElementById('scanRing');
  const nameInput = document.querySelector('#addModal .form-input');
  const typeSelect = document.querySelector('#addModal .form-select');

  scanning = true;
  ring.style.display = 'block';

  setTimeout(() => {
    ring.style.display = 'none';
    scanning = false;

    // Get name and type from the form
    const bagName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'My Bag';
    // Strip the emoji prefix from the option e.g. "🎒 Backpack" -> "Backpack"
    // Emojis can be multiple chars so we split on the first space
    var rawType  = typeSelect ? typeSelect.value : '🎒 Backpack';
    var bagType  = rawType.includes(' ') ? rawType.split(' ').slice(1).join(' ') : rawType;
    var emoji    = bagEmojis[bagType] || '🎒';

    // Create new bag object and add to store
    const newBag = {
      id:       'BW-' + String(bagStore.length + 1).padStart(3, '0'),
      name:     bagName,
      type:     bagType,
      emoji:    emoji,
      status:   'connected',
      lastSeen: 'Just paired',
      distance: '0.5m away',
      battery:  100
    };
    bagStore.push(newBag);

    // Add a welcome alert
    addAlert('info', '✅ ' + bagName + ' paired', bagName + ' has been added to your BagWatch. It is now being monitored.');

    closeModal('addModal');
    // Clear the form
    if (nameInput) nameInput.value = '';
    renderBags();
    showToast('✅ ' + bagName + ' added successfully!');
  }, 2500);
}


/* ----------------------------------------------------------
   9. REPORT SUBMISSION
   Simulates sending a theft report to SAPS + community.
   Will POST to a real backend in a future version.
   ---------------------------------------------------------- */
function submitReport() {
  // Generate a fake case reference number for demo purposes
  const caseRef = 'BW-2025-0' + Math.floor(Math.random() * 9000 + 1000);

  alert(
    '✅ Report submitted!\n\n' +
    'Your report has been sent to SAPS and shared with\n' +
    '23 community monitors in your area.\n\n' +
    'Case reference: ' + caseRef
  );
}