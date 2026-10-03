/**
 * RecoveryBoard + RescueMesh - Global Navigation & Header Controller
 * Renders consistent navbar, mobile bottom bar, offline banner, notification center,
 * user authentication profile widget, login/register CTA, and role switcher
 */

(function () {
  'use strict';

  function isPagesDir() {
    return window.location.pathname.includes('/pages/');
  }

  function getBaseUrl(page) {
    if (page === 'home' || page === 'index.html') {
      return isPagesDir() ? '../index.html' : './index.html';
    }
    return isPagesDir() ? `./${page}` : `./pages/${page}`;
  }

  function renderOfflineBanner() {
    let banner = document.getElementById('offline-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'offline-banner';
      banner.innerHTML = `
        <span>⚠️ <strong>NETWORK UNAVAILABLE</strong> &mdash; Normal cellular & internet connection is offline.</span>
        <span class="badge-relay">RescueMesh Relay Mode: READY</span>
      `;
      document.body.prepend(banner);
    }
    if (App.getNetworkStatus() === 'offline') {
      banner.classList.add('active');
    } else {
      banner.classList.remove('active');
    }
  }

  function renderNavbar() {
    const navPlaceholder = document.getElementById('global-header');
    if (!navPlaceholder) return;

    const currentPath = window.location.pathname;
    const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
    const isEmergency = currentPath.includes('emergency.html');
    const isHelp = currentPath.includes('help.html');
    const isMap = currentPath.includes('map.html');
    const isUpdates = currentPath.includes('updates.html');
    const isReport = currentPath.includes('report.html');
    const isRecovery = currentPath.includes('recovery.html');
    const isGuidance = currentPath.includes('guidance.html');
    const isDashboard = currentPath.includes('dashboard.html');

    const networkStatus = App.getNetworkStatus();
    const notifications = App.getNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;

    // Check Auth State
    const isLoggedIn = window.Auth ? window.Auth.isLoggedIn() : false;
    const currentUser = window.Auth ? window.Auth.getCurrentUser() : null;
    const currentRole = currentUser ? currentUser.role : App.getUserRole();

    // User initials helper
    let userInitials = 'CB';
    if (currentUser && currentUser.name) {
      const parts = currentUser.name.trim().split(' ');
      userInitials = parts.length > 1 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
    }

    navPlaceholder.innerHTML = `
      <header class="site-header">
        <div class="container nav-inner">
          
          <!-- Brand Logo -->
          <a href="${getBaseUrl('index.html')}" class="brand-wrapper">
            <div class="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              <div class="brand-badge"></div>
            </div>
            <div class="brand-text">
              <h1>RecoveryBoard<span>+</span></h1>
              <div class="brand-tagline">Disaster &amp; RescueMesh Platform</div>
            </div>
          </a>

          <!-- Desktop Navigation Links -->
          <nav>
            <ul class="nav-links">
              <li><a href="${getBaseUrl('index.html')}" class="nav-link ${isHome ? 'active' : ''}">Home</a></li>
              <li><a href="${getBaseUrl('emergency.html')}" class="nav-link nav-sos-pill ${isEmergency ? 'active' : ''}">🆘 Emergency SOS</a></li>
              <li><a href="${getBaseUrl('help.html')}" class="nav-link ${isHelp ? 'active' : ''}">I Need Help</a></li>
              <li><a href="${getBaseUrl('map.html')}" class="nav-link ${isMap ? 'active' : ''}">Recovery Map</a></li>
              <li><a href="${getBaseUrl('updates.html')}" class="nav-link ${isUpdates ? 'active' : ''}">Local Updates</a></li>
              <li><a href="${getBaseUrl('report.html')}" class="nav-link ${isReport ? 'active' : ''}">Report Problem</a></li>
              <li><a href="${getBaseUrl('recovery.html')}" class="nav-link ${isRecovery ? 'active' : ''}">My Recovery</a></li>
              <li><a href="${getBaseUrl('guidance.html')}" class="nav-link ${isGuidance ? 'active' : ''}">Guidance</a></li>
              <li><a href="${getBaseUrl('dashboard.html')}" class="nav-link ${isDashboard ? 'active' : ''}" style="color:var(--navy-700); font-weight:700;">🏢 Operations</a></li>
            </ul>
          </nav>

          <!-- Right Action Controls -->
          <div class="nav-actions">
            
            <!-- Network Status Widget -->
            <div class="network-widget">
              <button class="network-pill ${networkStatus === 'offline' ? 'offline' : ''}" id="networkPillBtn" title="Click to view network details">
                <span class="network-dot"></span>
                <span id="networkPillText">${networkStatus === 'offline' ? 'Offline (Mesh Ready)' : 'Network Available'}</span>
              </button>
              
              <div class="network-dropdown" id="networkDropdown">
                <div class="network-dropdown-header">
                  <span>Network Status</span>
                  <span style="font-size:0.7rem; font-family:var(--font-mono); color:var(--text-muted)">DEMO TELEMETRY</span>
                </div>
                <div class="network-stat-row">
                  <span>Internet:</span>
                  <span class="network-stat-val ${networkStatus === 'offline' ? 'offline' : 'online'}">
                    ${networkStatus === 'offline' ? 'UNAVAILABLE' : 'AVAILABLE'}
                  </span>
                </div>
                <div class="network-stat-row">
                  <span>GPS Satellite:</span>
                  <span class="network-stat-val online">LOCKED (±4m)</span>
                </div>
                <div class="network-stat-row">
                  <span>Emergency Mode:</span>
                  <span class="network-stat-val online">READY</span>
                </div>
                <div class="network-stat-row">
                  <span>RescueMesh Relay:</span>
                  <span class="network-stat-val" style="color:var(--info-600)">STANDBY</span>
                </div>
                <button class="network-toggle-btn" id="networkToggleBtn">
                  🔄 Switch to ${networkStatus === 'offline' ? 'ONLINE Mode' : 'OFFLINE Mode'}
                </button>
              </div>
            </div>

            <!-- Notifications Center -->
            <div class="notification-widget">
              <button class="notification-btn" id="notifBellBtn" title="Notifications">
                🔔
                ${unreadCount > 0 ? `<span class="notification-badge">${unreadCount}</span>` : ''}
              </button>

              <div class="notification-dropdown" id="notifDropdown">
                <div class="notification-header">
                  <h4>Alerts &amp; Updates</h4>
                  <button class="mark-read-btn" id="markAllReadBtn">Mark all read</button>
                </div>
                <ul class="notification-list" id="notifList">
                  ${notifications.map(n => `
                    <li class="notification-item ${!n.read ? 'unread' : ''}" onclick="window.location.href='${getBaseUrl(n.linkRoute || 'dashboard.html')}'">
                      <span class="notif-icon">${n.type === 'critical' ? '🚨' : n.type === 'verified' ? '✓' : n.type === 'resolved' ? '✅' : '💧'}</span>
                      <div class="notif-body">
                        <div class="notif-title">${n.title}</div>
                        <div class="notif-text">${n.message}</div>
                        <div class="notif-time">${n.timestamp}</div>
                      </div>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <!-- AUTHENTICATION STATE UI (Section 4 & 6) -->
            ${isLoggedIn && currentUser ? `
              <!-- User Profile Dropdown Widget -->
              <div class="user-profile-widget">
                <button class="user-profile-pill" id="userProfileBtn" title="Account Menu">
                  <span class="user-avatar-circle">${userInitials}</span>
                  <span class="user-name-label">${currentUser.name}</span>
                  <span class="user-role-badge">${currentUser.role === 'responder' ? 'Rescue' : currentUser.role === 'authority' ? 'Admin' : 'Citizen'}</span>
                  <span style="font-size:0.65rem; color:var(--text-muted);">▼</span>
                </button>

                <div class="user-dropdown-menu" id="userDropdownMenu">
                  <div class="user-dropdown-header">
                    <div class="user-header-name">${currentUser.name}</div>
                    <div class="user-header-email">${currentUser.email}</div>
                    <div style="font-size:0.7rem; color:var(--navy-700); font-family:var(--font-mono); margin-top:0.25rem;">
                      📍 ${currentUser.ward || 'Ward 12 Disaster Sector'}
                    </div>
                  </div>

                  <a href="${getBaseUrl('profile.html')}" class="user-menu-item">
                    <span>👤</span>
                    <span>My Profile &amp; Settings</span>
                  </a>

                  <a href="${getBaseUrl('recovery.html')}" class="user-menu-item">
                    <span>📋</span>
                    <span>My Recovery Dashboard</span>
                  </a>

                  <a href="${getBaseUrl('dashboard.html')}" class="user-menu-item">
                    <span>🏢</span>
                    <span>Operations Command</span>
                  </a>

                  <div class="user-menu-divider"></div>

                  <!-- Role Switcher submenu in user profile -->
                  <div style="padding: 0.35rem 0.85rem; font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">
                    Simulate Role:
                  </div>
                  <button class="user-menu-item" id="switchRoleCitizenBtn" style="font-size:0.78rem;">
                    <span>👤</span> <span>Switch to Citizen</span>
                  </button>
                  <button class="user-menu-item" id="switchRoleRescueBtn" style="font-size:0.78rem;">
                    <span>🚑</span> <span>Switch to Rescue Squad</span>
                  </button>
                  <button class="user-menu-item" id="switchRoleAuthorityBtn" style="font-size:0.78rem;">
                    <span>🏢</span> <span>Switch to Authority</span>
                  </button>

                  <div class="user-menu-divider"></div>

                  <button class="user-menu-item logout-item" id="logoutActionBtn">
                    <span>🚪</span>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ` : `
              <!-- Logged-Out UI: Login & Register CTA Buttons -->
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <a href="${getBaseUrl('login.html')}" class="btn btn-secondary btn-sm" style="font-weight:700;">
                  Log In
                </a>
                <a href="${getBaseUrl('register.html')}" class="btn btn-primary btn-sm" style="font-weight:700;">
                  Register
                </a>
              </div>
            `}

          </div>
        </div>
      </header>
    `;

    setupHeaderListeners();
  }

  function renderMobileBottomNav() {
    let bottomNav = document.getElementById('mobile-bottom-nav');
    if (!bottomNav) {
      bottomNav = document.createElement('nav');
      bottomNav.id = 'mobile-bottom-nav';
      bottomNav.className = 'mobile-bottom-nav';
      document.body.appendChild(bottomNav);
    }

    const currentPath = window.location.pathname;
    const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
    const isMap = currentPath.includes('map.html');
    const isRecovery = currentPath.includes('recovery.html');

    bottomNav.innerHTML = `
      <ul class="bottom-nav-items">
        <li class="bottom-nav-item">
          <a href="${getBaseUrl('index.html')}" class="bottom-nav-link ${isHome ? 'active' : ''}">
            <span class="nav-emoji">🏠</span>
            <span>Home</span>
          </a>
        </li>
        <li class="bottom-nav-item">
          <a href="${getBaseUrl('map.html')}" class="bottom-nav-link ${isMap ? 'active' : ''}">
            <span class="nav-emoji">🗺️</span>
            <span>Map</span>
          </a>
        </li>
        <li class="bottom-nav-item sos-item">
          <a href="${getBaseUrl('emergency.html')}" class="bottom-sos-btn" title="Send SOS">
            <span>🆘</span>
            <span>SOS</span>
          </a>
        </li>
        <li class="bottom-nav-item">
          <a href="${getBaseUrl('recovery.html')}" class="bottom-nav-link ${isRecovery ? 'active' : ''}">
            <span class="nav-emoji">📋</span>
            <span>Recovery</span>
          </a>
        </li>
        <li class="bottom-nav-item">
          <button class="bottom-nav-link" id="mobileMoreBtn">
            <span class="nav-emoji">☰</span>
            <span>More</span>
          </button>
        </li>
      </ul>
    `;

    // Render mobile "More" drawer
    let drawer = document.getElementById('mobile-more-drawer');
    const isLoggedIn = window.Auth ? window.Auth.isLoggedIn() : false;
    const currentUser = window.Auth ? window.Auth.getCurrentUser() : null;

    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'mobile-more-drawer';
      drawer.className = 'mobile-more-drawer';
      document.body.appendChild(drawer);
    }

    drawer.innerHTML = `
      <div class="drawer-content">
        <div class="drawer-handle"></div>

        <!-- User Status In Mobile Drawer -->
        ${isLoggedIn && currentUser ? `
          <div style="background:var(--primary-50); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:0.85rem 1rem; margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:800; font-size:0.95rem; color:var(--primary-900);">${currentUser.name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${currentUser.email} &bull; ${currentUser.role.toUpperCase()}</div>
            </div>
            <a href="${getBaseUrl('profile.html')}" class="btn btn-secondary btn-sm">Profile</a>
          </div>
        ` : `
          <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:var(--radius-lg); padding:0.85rem 1rem; margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:800; font-size:0.9rem; color:var(--navy-900);">Citizen Account</div>
              <div style="font-size:0.75rem; color:var(--navy-700);">Sign in to save reports</div>
            </div>
            <div style="display:flex; gap:0.4rem;">
              <a href="${getBaseUrl('login.html')}" class="btn btn-secondary btn-sm">Login</a>
              <a href="${getBaseUrl('register.html')}" class="btn btn-primary btn-sm">Register</a>
            </div>
          </div>
        `}

        <div class="drawer-links-grid">
          <a href="${getBaseUrl('emergency.html')}" class="drawer-item" style="color:var(--emergency-600);">
            <span>🆘</span>
            <span>Emergency SOS</span>
          </a>
          <a href="${getBaseUrl('help.html')}" class="drawer-item">
            <span>💧</span>
            <span>I Need Help</span>
          </a>
          <a href="${getBaseUrl('updates.html')}" class="drawer-item">
            <span>📢</span>
            <span>Local Updates</span>
          </a>
          <a href="${getBaseUrl('report.html')}" class="drawer-item">
            <span>📝</span>
            <span>Report Damage</span>
          </a>
          <a href="${getBaseUrl('guidance.html')}" class="drawer-item">
            <span>🧭</span>
            <span>Disaster Guides</span>
          </a>
          <a href="${getBaseUrl('dashboard.html')}" class="drawer-item">
            <span>🏢</span>
            <span>Response Team</span>
          </a>
        </div>

        <div style="border-top:1px solid var(--border-light); padding-top:1rem; display:flex; justify-content:space-between; align-items:center;">
          <button class="btn btn-secondary btn-sm" id="mobileNetworkToggle">
            🔄 Network: ${App.getNetworkStatus().toUpperCase()}
          </button>
          ${isLoggedIn ? `
            <button class="btn btn-danger-outline btn-sm" id="mobileDrawerLogoutBtn">
              🚪 Log Out
            </button>
          ` : `
            <button class="btn btn-ghost btn-sm" id="closeDrawerBtn">Close</button>
          `}
        </div>
      </div>
    `;

    // Drawer events
    document.getElementById('mobileMoreBtn')?.addEventListener('click', () => {
      drawer.classList.add('open');
    });
    document.getElementById('closeDrawerBtn')?.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
    document.getElementById('mobileDrawerLogoutBtn')?.addEventListener('click', () => {
      drawer.classList.remove('open');
      if (window.Auth) window.Auth.confirmLogout();
    });
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) drawer.classList.remove('open');
    });
    document.getElementById('mobileNetworkToggle')?.addEventListener('click', () => {
      const next = App.getNetworkStatus() === 'online' ? 'offline' : 'online';
      App.setNetworkStatus(next);
      drawer.classList.remove('open');
      renderNavbar();
      renderOfflineBanner();
    });
  }

  function renderFooter() {
    const footerPlaceholder = document.getElementById('global-footer');
    if (!footerPlaceholder) return;

    footerPlaceholder.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            
            <div class="footer-brand">
              <h3>RecoveryBoard + RescueMesh</h3>
              <p>One unified civic resilience web platform connecting citizen distress SOS beacons to municipal infrastructure recovery.</p>
              <div style="margin-top:1rem; display:flex; gap:0.5rem; align-items:center;">
                <span class="badge badge-assigned">Vanilla Web 2026</span>
                <span class="badge badge-verified">Civic Resilience</span>
              </div>
            </div>

            <div class="footer-col">
              <h4>Citizen Access</h4>
              <ul class="footer-links">
                <li><a href="${getBaseUrl('emergency.html')}">Emergency SOS</a></li>
                <li><a href="${getBaseUrl('help.html')}">I Need Help (Resources)</a></li>
                <li><a href="${getBaseUrl('map.html')}">Recovery Map</a></li>
                <li><a href="${getBaseUrl('updates.html')}">Verified Bulletins</a></li>
                <li><a href="${getBaseUrl('report.html')}">Report a Problem</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Recovery &amp; Guides</h4>
              <ul class="footer-links">
                <li><a href="${getBaseUrl('recovery.html')}">My Recovery Checklist</a></li>
                <li><a href="${getBaseUrl('guidance.html')}">House Damage Protocol</a></li>
                <li><a href="${getBaseUrl('guidance.html')}">Lost Documents Recovery</a></li>
                <li><a href="${getBaseUrl('guidance.html')}">Insurance &amp; SDRF Claims</a></li>
                <li><a href="${getBaseUrl('dashboard.html')}">Operations Dashboard</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>RescueMesh Protocol</h4>
              <p style="font-size:0.8rem; line-height:1.5; color:var(--primary-400); margin-bottom:0.75rem;">
                Ad-hoc Bluetooth Low Energy (BLE) &amp; Wi-Fi Aware store-and-forward mesh routing simulation for cellular blackouts.
              </p>
              <div style="font-family:var(--font-mono); font-size:0.75rem; color:#38BDF8;">
                Mesh Status: ACTIVE (5 Nodes Simulated)
              </div>
            </div>

          </div>

          <div class="footer-bottom">
            <div>
              &copy; 2026 RecoveryBoard + RescueMesh. All rights reserved.
            </div>
            <div class="footer-disclaimer">
              ⚠️ PROTOTYPE DEMO SIMULATION: Not connected to live 112 emergency services.
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  function setupHeaderListeners() {
    // Network Dropdown
    const networkBtn = document.getElementById('networkPillBtn');
    const networkDropdown = document.getElementById('networkDropdown');
    const networkToggle = document.getElementById('networkToggleBtn');

    networkBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      networkDropdown?.classList.toggle('show');
      document.getElementById('notifDropdown')?.classList.remove('show');
      document.getElementById('userDropdownMenu')?.classList.remove('show');
    });

    networkToggle?.addEventListener('click', () => {
      const next = App.getNetworkStatus() === 'online' ? 'offline' : 'online';
      App.setNetworkStatus(next);
      networkDropdown?.classList.remove('show');
      renderNavbar();
      renderOfflineBanner();
    });

    // Notification Dropdown
    const notifBtn = document.getElementById('notifBellBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    const markAllRead = document.getElementById('markAllReadBtn');

    notifBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown?.classList.toggle('show');
      networkDropdown?.classList.remove('show');
      document.getElementById('userDropdownMenu')?.classList.remove('show');
    });

    markAllRead?.addEventListener('click', () => {
      App.markAllNotificationsRead();
      renderNavbar();
    });

    // User Profile Dropdown
    const userBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdownMenu');

    userBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown?.classList.toggle('show');
      networkDropdown?.classList.remove('show');
      notifDropdown?.classList.remove('show');
    });

    // Logout Action
    document.getElementById('logoutActionBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      userDropdown?.classList.remove('show');
      if (window.Auth) {
        window.Auth.confirmLogout();
      }
    });

    // Role switcher shortcuts inside user dropdown
    document.getElementById('switchRoleCitizenBtn')?.addEventListener('click', () => {
      if (window.Auth) {
        window.Auth.updateProfile({ role: 'citizen' });
        App.setUserRole('citizen');
        userDropdown?.classList.remove('show');
        renderNavbar();
        if (window.location.pathname.includes('dashboard.html')) {
          window.location.href = getBaseUrl('index.html');
        }
      }
    });

    document.getElementById('switchRoleRescueBtn')?.addEventListener('click', () => {
      if (window.Auth) {
        window.Auth.updateProfile({ role: 'responder' });
        App.setUserRole('responder');
        userDropdown?.classList.remove('show');
        renderNavbar();
        if (!window.location.pathname.includes('dashboard.html')) {
          window.location.href = getBaseUrl('dashboard.html');
        }
      }
    });

    document.getElementById('switchRoleAuthorityBtn')?.addEventListener('click', () => {
      if (window.Auth) {
        window.Auth.updateProfile({ role: 'authority' });
        App.setUserRole('authority');
        userDropdown?.classList.remove('show');
        renderNavbar();
        if (!window.location.pathname.includes('dashboard.html')) {
          window.location.href = getBaseUrl('dashboard.html');
        }
      }
    });

    // Close on outside click
    document.addEventListener('click', () => {
      networkDropdown?.classList.remove('show');
      notifDropdown?.classList.remove('show');
      userDropdown?.classList.remove('show');
    });

    // Modal ESC & Backdrop listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
      modal.querySelectorAll('.modal-close-btn, [data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    });
  }

  // Global bootstrap on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    renderOfflineBanner();
    renderNavbar();
    renderMobileBottomNav();
    renderFooter();
  });

  // Re-sync on network, notification, or auth events
  window.addEventListener('rb_networkStatusChanged', () => {
    renderOfflineBanner();
    renderNavbar();
  });
  window.addEventListener('rb_notificationsUpdated', () => {
    renderNavbar();
  });
  window.addEventListener('rb_authChanged', () => {
    renderNavbar();
    renderMobileBottomNav();
  });

})();
