/**
 * RecoveryBoard + RescueMesh - Authentication & Session Manager
 * Vanilla ES6+ Demo Authentication with LocalStorage & SessionStorage
 */

(function (window) {
  'use strict';

  const AUTH_STORAGE_KEYS = {
    USERS: 'rb_users_v1',
    SESSION: 'rb_session_v1',
    REMEMBER: 'rb_remember_v1'
  };

  const DEFAULT_DEMO_USERS = [
    {
      id: 'usr-cit-1',
      name: 'Shikha Verma',
      email: 'citizen@recoveryboard.org',
      password: 'password123',
      phone: '+91 94310 88219',
      role: 'citizen',
      ward: 'Ward 12, Kankarbagh',
      createdAt: '28 Sep 2026'
    },
    {
      id: 'usr-res-1',
      name: 'Officer Manoj Kumar',
      email: 'rescue@recoveryboard.org',
      password: 'password123',
      phone: '+91 98350 11442',
      role: 'responder',
      ward: 'Ward 12 Disaster Sector',
      team: 'NDRF Unit 4 - Water Rescue',
      createdAt: '20 Sep 2026'
    },
    {
      id: 'usr-adm-1',
      name: 'District Magistrate Control',
      email: 'admin@recoveryboard.org',
      password: 'password123',
      phone: '+91 612 222 1890',
      role: 'authority',
      ward: 'Patna Central Command',
      dept: 'State Emergency Operations Center',
      createdAt: '15 Sep 2026'
    }
  ];

  const Auth = {
    init() {
      // Initialize demo users list if not exists
      if (!localStorage.getItem(AUTH_STORAGE_KEYS.USERS)) {
        localStorage.setItem(AUTH_STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_DEMO_USERS));
      }

      // Check session
      let session = this.getSession();
      if (!session) {
        // By default for demo continuity, pre-login Citizen unless explicitly logged out
        const hasExplicitlyLoggedOut = localStorage.getItem('rb_logged_out_flag') === 'true';
        if (!hasExplicitlyLoggedOut) {
          const defaultUser = DEFAULT_DEMO_USERS[0];
          session = {
            isLoggedIn: true,
            user: defaultUser,
            token: 'demo-session-' + Date.now(),
            loginTime: new Date().toLocaleTimeString()
          };
          this.setSession(session, true);
        }
      }

      // Sync role with App state
      if (session && session.user && window.App) {
        window.App.setUserRole(session.user.role);
      }
    },

    getUsers() {
      try {
        return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEYS.USERS)) || DEFAULT_DEMO_USERS;
      } catch (e) {
        return DEFAULT_DEMO_USERS;
      }
    },

    getSession() {
      try {
        const local = localStorage.getItem(AUTH_STORAGE_KEYS.SESSION);
        if (local) return JSON.parse(local);
        const session = sessionStorage.getItem(AUTH_STORAGE_KEYS.SESSION);
        if (session) return JSON.parse(session);
        return null;
      } catch (e) {
        return null;
      }
    },

    setSession(sessionData, remember = true) {
      if (remember) {
        localStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
        localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
      }
      localStorage.removeItem('rb_logged_out_flag');

      if (window.App && sessionData && sessionData.user) {
        window.App.setUserRole(sessionData.user.role);
      }

      window.dispatchEvent(new CustomEvent('rb_authChanged', { detail: sessionData }));
    },

    clearSession() {
      localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
      sessionStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
      localStorage.setItem('rb_logged_out_flag', 'true');
      window.dispatchEvent(new CustomEvent('rb_authChanged', { detail: null }));
    },

    isLoggedIn() {
      const session = this.getSession();
      return !!(session && session.isLoggedIn && session.user);
    },

    getCurrentUser() {
      const session = this.getSession();
      return session ? session.user : null;
    },

    login(email, password, rememberMe = true) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      const users = this.getUsers();
      const matched = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!matched) {
        return {
          success: false,
          message: 'Invalid email or password. Please try again.'
        };
      }

      // Password comparison (allows predefined demo passwords or custom)
      if (matched.password !== cleanPass && cleanPass !== 'password123') {
        return {
          success: false,
          message: 'Invalid email or password. Please try again.'
        };
      }

      const sessionData = {
        isLoggedIn: true,
        user: matched,
        token: 'demo-token-' + Date.now(),
        loginTime: new Date().toLocaleTimeString()
      };

      this.setSession(sessionData, rememberMe);

      if (window.App) {
        window.App.showToast(`✓ Welcome back, ${matched.name}!`, 'success');
      }

      return {
        success: true,
        user: matched,
        role: matched.role
      };
    },

    register({ name, email, phone, password, role = 'citizen', ward = 'Ward 12' }) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanName = (name || '').trim();
      const cleanPhone = (phone || '').trim();
      const cleanPass = (password || '').trim();

      const users = this.getUsers();
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        return {
          success: false,
          message: 'An account with this email address already exists. Please login instead.'
        };
      }

      const newUser = {
        id: 'usr-' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: cleanPass,
        role: role,
        ward: ward || 'Ward 12',
        createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      users.push(newUser);
      localStorage.setItem(AUTH_STORAGE_KEYS.USERS, JSON.stringify(users));

      if (window.App) {
        window.App.showToast(`✅ Account created for ${newUser.name}. Please login.`, 'success');
      }

      return {
        success: true,
        user: newUser
      };
    },

    updateProfile(updatedFields) {
      const currentUser = this.getCurrentUser();
      if (!currentUser) return false;

      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);

      const updatedUser = { ...currentUser, ...updatedFields };

      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem(AUTH_STORAGE_KEYS.USERS, JSON.stringify(users));
      }

      const session = this.getSession() || { isLoggedIn: true };
      session.user = updatedUser;
      this.setSession(session, true);

      if (window.App) {
        window.App.showToast('✓ Profile updated successfully.', 'success');
      }

      return updatedUser;
    },

    logout(showToastMsg = true) {
      this.clearSession();
      if (showToastMsg && window.App) {
        window.App.showToast('You have been logged out successfully.', 'info');
      }
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location && window.location.pathname) {
          const isPagesDir = window.location.pathname.includes('/pages/');
          window.location.href = isPagesDir ? './login.html' : './pages/login.html';
        }
      }, 350);
    },

    sendPasswordReset(email) {
      const cleanEmail = (email || '').trim().toLowerCase();
      return {
        success: true,
        message: 'If this email is registered, a password reset link would be sent.'
      };
    },

    // Modal Confirmation for Logout
    confirmLogout() {
      let modal = document.getElementById('logoutConfirmModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'logoutConfirmModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
      }

      const currentUser = this.getCurrentUser();
      const userName = currentUser ? currentUser.name : 'Citizen';

      modal.innerHTML = `
        <div class="modal-container" style="max-width: 440px;">
          <div class="modal-header" style="background: var(--navy-900);">
            <h3>🚪 Confirm Logout</h3>
            <button class="modal-close-btn" data-close-modal>&times;</button>
          </div>
          <div class="modal-body" style="padding: 1.5rem; text-align: center;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #FEE2E2; color: var(--emergency-600); font-size: 1.8rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
              ⚠️
            </div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--primary-900); margin-bottom: 0.5rem;">
              End Active Session?
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-sub); line-height: 1.5; margin-bottom: 1.25rem;">
              Are you sure you want to log out, <strong>${userName}</strong>? Your submitted reports and active tasks will remain safely saved in the recovery system.
            </p>
          </div>
          <div class="modal-footer" style="justify-content: center; gap: 0.75rem;">
            <button class="btn btn-secondary" data-close-modal style="min-width: 100px;">
              Cancel
            </button>
            <button class="btn btn-emergency" id="confirmLogoutSubmitBtn" style="min-width: 130px;">
              Confirm Logout
            </button>
          </div>
        </div>
      `;

      modal.classList.add('active');

      modal.querySelector('[data-close-modal]')?.addEventListener('click', () => {
        modal.classList.remove('active');
      });

      modal.querySelector('#confirmLogoutSubmitBtn')?.addEventListener('click', () => {
        modal.classList.remove('active');
        this.logout(true);
      });
    },

    // Protected Route Gatekeeper
    protectPage(featureName = 'this feature') {
      if (this.isLoggedIn()) return true;

      // User is logged out -> render protection barrier
      const isPagesDir = window.location.pathname.includes('/pages/');
      const loginUrl = isPagesDir ? './login.html' : './pages/login.html';
      const registerUrl = isPagesDir ? './register.html' : './pages/register.html';
      const homeUrl = isPagesDir ? '../index.html' : './index.html';

      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.innerHTML = `
          <div class="protected-barrier">
            <div class="protected-barrier-icon">🔐</div>
            <span class="badge badge-assigned" style="margin-bottom: 0.5rem;">AUTHENTICATION REQUIRED</span>
            <h2 style="font-size: 1.6rem; font-weight: 900; color: var(--primary-900); margin-bottom: 0.5rem;">
              Please login to access ${featureName}
            </h2>
            <p style="font-size: 0.9rem; color: var(--text-sub); line-height: 1.5; margin-bottom: 1.75rem;">
              Access to personal recovery checklists, damage ticket submission, and response operations requires a verified citizen or responder account.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;">
              <a href="${loginUrl}?redirect=${encodeURIComponent(window.location.pathname)}" class="btn btn-primary btn-lg" style="min-width: 140px;">
                🔑 Log In
              </a>
              <a href="${registerUrl}" class="btn btn-secondary btn-lg" style="min-width: 140px;">
                📝 Create Account
              </a>
              <a href="${homeUrl}" class="btn btn-ghost btn-lg">
                &larr; Return Home
              </a>
            </div>
            <div style="margin-top: 1.5rem; font-size: 0.78rem; color: var(--text-muted); border-top: 1px solid var(--border-light); padding-top: 0.85rem;">
              🆘 <em>Note: Emergency SOS always remains accessible without login.</em>
            </div>
          </div>
        `;
      }
      return false;
    }
  };

  Auth.init();
  window.Auth = Auth;

})(window);
