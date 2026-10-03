/**
 * RecoveryBoard + RescueMesh - Notification Center & Toast Engine
 * Handles floating alerts, push simulation, read receipts, and system alerts
 */

(function (window) {
  'use strict';

  const NotificationEngine = {
    init() {
      // Listen for notification updates
      window.addEventListener('rb_notificationsUpdated', (e) => {
        this.updateBadge(e.detail);
      });
    },

    updateBadge(notifications) {
      const unread = notifications.filter(n => !n.read).length;
      const badge = document.querySelector('.notification-badge');
      if (badge) {
        if (unread > 0) {
          badge.textContent = unread;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }
    },

    notify(title, message, type = 'update', linkRoute = null) {
      return App.addNotification({
        title,
        message,
        type,
        linkRoute
      });
    }
  };

  NotificationEngine.init();
  window.NotificationEngine = NotificationEngine;

})(window);
