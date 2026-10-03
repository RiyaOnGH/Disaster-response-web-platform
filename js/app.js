/**
 * RecoveryBoard + RescueMesh - Core App State & Persistence Manager
 * Vanilla ES6+ LocalStorage Store & Event Dispatcher
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    REPORTS: 'rb_reports_v1',
    SOS_ALERTS: 'rb_sos_alerts_v1',
    RESOURCES: 'rb_resources_v1',
    UPDATES: 'rb_updates_v1',
    CHECKLIST: 'rb_checklist_v1',
    NOTIFICATIONS: 'rb_notifications_v1',
    TEAMS: 'rb_teams_v1',
    NETWORK_STATUS: 'rb_network_status_v1',
    USER_ROLE: 'rb_user_role_v1',
    USER_SOS: 'rb_user_sos_v1'
  };

  const App = {
    // 1. Initialization
    init() {
      if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.SOS_ALERTS)) {
        localStorage.setItem(STORAGE_KEYS.SOS_ALERTS, JSON.stringify(INITIAL_SOS_ALERTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.UPDATES)) {
        localStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(INITIAL_UPDATES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.CHECKLIST)) {
        localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(INITIAL_CHECKLIST));
      }
      if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.TEAMS)) {
        localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(INITIAL_TEAMS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.NETWORK_STATUS)) {
        localStorage.setItem(STORAGE_KEYS.NETWORK_STATUS, 'online');
      }
      if (!localStorage.getItem(STORAGE_KEYS.USER_ROLE)) {
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'citizen');
      }
    },

    // 2. Reports Management
    getReports() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS)) || [];
      } catch (e) {
        return INITIAL_REPORTS;
      }
    },

    getReportById(id) {
      const reports = this.getReports();
      const cleanId = id.startsWith('#') ? id : '#' + id;
      return reports.find(r => r.id.toLowerCase() === cleanId.toLowerCase() || r.id.toLowerCase() === id.toLowerCase());
    },

    saveReport(report) {
      const reports = this.getReports();
      reports.unshift(report);
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

      // Also generate notification
      this.addNotification({
        title: `📝 New Report Logged: ${report.id}`,
        message: `${report.title} reported in ${report.location}.`,
        type: 'update',
        linkRoute: `report-detail.html?id=${report.id.replace('#', '')}`
      });

      this.dispatchEvent('reportAdded', report);
      return report;
    },

    updateReportStatus(reportId, newStatus, teamName = null, noteText = null) {
      const reports = this.getReports();
      const report = reports.find(r => r.id === reportId);
      if (report) {
        report.status = newStatus;
        report.updatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (teamName) {
          report.assignedTeam = teamName;
        }

        if (newStatus === 'resolved') {
          report.resolvedAt = report.updatedAt;
        }

        if (noteText) {
          if (!report.notes) report.notes = [];
          report.notes.push(`${report.updatedAt} - ${noteText}`);
        }

        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
        
        this.addNotification({
          title: `Status Update: ${report.id}`,
          message: `${report.title} changed to status: ${newStatus.toUpperCase()}`,
          type: newStatus === 'resolved' ? 'resolved' : 'verified',
          linkRoute: `report-detail.html?id=${report.id.replace('#', '')}`
        });

        this.dispatchEvent('reportUpdated', report);
      }
      return report;
    },

    uploadProof(reportId, workingPhoto, afterPhoto, note) {
      const reports = this.getReports();
      const report = reports.find(r => r.id === reportId);
      if (report) {
        if (workingPhoto) report.workingPhoto = workingPhoto;
        if (afterPhoto) report.afterPhoto = afterPhoto;
        report.status = 'proof_submitted';
        report.proofSubmittedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (note) {
          if (!report.notes) report.notes = [];
          report.notes.push(`${report.proofSubmittedAt} - Recovery Proof: ${note}`);
        }
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
        this.dispatchEvent('reportUpdated', report);
      }
      return report;
    },

    // 3. SOS Alerts & User SOS
    getSosAlerts() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SOS_ALERTS)) || [];
      } catch (e) {
        return INITIAL_SOS_ALERTS;
      }
    },

    getUserSos() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SOS)) || null;
      } catch (e) {
        return null;
      }
    },

    setUserSos(sos) {
      localStorage.setItem(STORAGE_KEYS.USER_SOS, JSON.stringify(sos));
      
      // Also add to global SOS alerts queue if not there
      const alerts = this.getSosAlerts();
      if (!alerts.some(a => a.id === sos.id)) {
        alerts.unshift(sos);
        localStorage.setItem(STORAGE_KEYS.SOS_ALERTS, JSON.stringify(alerts));
      }

      this.addNotification({
        title: `🚨 Emergency SOS Broadcast: ${sos.id}`,
        message: `${sos.emergencyType} reported at ${sos.location}`,
        type: 'critical',
        linkRoute: 'dashboard.html'
      });

      this.dispatchEvent('sosChanged', sos);
    },

    clearUserSos() {
      localStorage.removeItem(STORAGE_KEYS.USER_SOS);
      this.dispatchEvent('sosChanged', null);
    },

    updateSosStatus(sosId, status, unit = null) {
      const alerts = this.getSosAlerts();
      const alert = alerts.find(a => a.id === sosId);
      if (alert) {
        alert.status = status;
        if (unit) alert.assignedUnit = unit;
        localStorage.setItem(STORAGE_KEYS.SOS_ALERTS, JSON.stringify(alerts));
        
        // update userSos if matches
        const userSos = this.getUserSos();
        if (userSos && userSos.id === sosId) {
          userSos.status = status;
          if (unit) userSos.assignedUnit = unit;
          localStorage.setItem(STORAGE_KEYS.USER_SOS, JSON.stringify(userSos));
        }

        this.dispatchEvent('sosChanged', alert);
      }
    },

    // 4. Resources
    getResources() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES)) || [];
      } catch (e) {
        return INITIAL_RESOURCES;
      }
    },

    // 5. Updates
    getUpdates() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.UPDATES)) || [];
      } catch (e) {
        return INITIAL_UPDATES;
      }
    },

    // 6. Checklist
    getChecklist() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKLIST)) || [];
      } catch (e) {
        return INITIAL_CHECKLIST;
      }
    },

    toggleChecklistItem(id) {
      const items = this.getChecklist();
      const item = items.find(i => i.id === id);
      if (item) {
        item.completed = !item.completed;
        localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(items));
        this.dispatchEvent('checklistUpdated', items);
      }
      return item;
    },

    // 7. Notifications
    getNotifications() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || [];
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    },

    addNotification(notif) {
      const notifications = this.getNotifications();
      const newItem = {
        id: 'notif-' + Date.now(),
        timestamp: 'Just now',
        read: false,
        ...notif
      };
      notifications.unshift(newItem);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      this.dispatchEvent('notificationsUpdated', notifications);
      return newItem;
    },

    markNotificationRead(id) {
      const notifications = this.getNotifications();
      const item = notifications.find(n => n.id === id);
      if (item) {
        item.read = true;
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        this.dispatchEvent('notificationsUpdated', notifications);
      }
    },

    markAllNotificationsRead() {
      const notifications = this.getNotifications();
      notifications.forEach(n => { n.read = true; });
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      this.dispatchEvent('notificationsUpdated', notifications);
    },

    // 8. Teams
    getTeams() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS)) || [];
      } catch (e) {
        return INITIAL_TEAMS;
      }
    },

    assignTeamToReport(reportId, teamName) {
      return this.updateReportStatus(reportId, 'assigned', teamName, `Assigned to ${teamName}`);
    },

    // 9. Network Status & Role
    getNetworkStatus() {
      return localStorage.getItem(STORAGE_KEYS.NETWORK_STATUS) || 'online';
    },

    setNetworkStatus(status) {
      localStorage.setItem(STORAGE_KEYS.NETWORK_STATUS, status);
      this.dispatchEvent('networkStatusChanged', status);
      
      const banner = document.getElementById('offline-banner');
      if (banner) {
        if (status === 'offline') {
          banner.classList.add('active');
        } else {
          banner.classList.remove('active');
        }
      }

      this.showToast(
        status === 'offline' ? '⚠️ Switched to OFFLINE mode (RescueMesh Relay Ready)' : '🌐 Online connection restored',
        status === 'offline' ? 'warning' : 'success'
      );
    },

    getUserRole() {
      return localStorage.getItem(STORAGE_KEYS.USER_ROLE) || 'citizen';
    },

    setUserRole(role) {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
      this.dispatchEvent('roleChanged', role);
      this.showToast(`Switched view to ${role.toUpperCase()}`, 'info');
    },

    // 10. Metric calculation: Dynamic Recovery Progress
    calculateRecoveryProgress() {
      const checklist = this.getChecklist();
      const reports = this.getReports();

      const chkCompleted = checklist.filter(c => c.completed).length;
      const chkTotal = checklist.length || 1;
      const chkRate = (chkCompleted / chkTotal) * 60; // 60% weight

      const repResolved = reports.filter(r => r.status === 'resolved').length;
      const repTotal = reports.length || 1;
      const repRate = (repResolved / repTotal) * 40; // 40% weight

      return Math.round(chkRate + repRate);
    },

    // 11. Custom Toast Notifications
    showToast(message, type = 'info', duration = 4000) {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let icon = 'ℹ️';
      if (type === 'success') icon = '✓';
      else if (type === 'error') icon = '🚨';
      else if (type === 'warning') icon = '⚠';

      toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-msg">${message}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
      `;

      const closeBtn = toast.querySelector('.toast-close');
      const removeToast = () => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 250);
      };

      if (closeBtn) {
        closeBtn.addEventListener('click', removeToast);
      }
      container.appendChild(toast);

      setTimeout(removeToast, duration);
    },

    // 12. Modal Utility
    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    // Event bus helper
    dispatchEvent(name, detail) {
      window.dispatchEvent(new CustomEvent('rb_' + name, { detail }));
    }
  };

  // Initialize store on script load
  App.init();

  // Export to global scope
  window.App = App;

})(window);
