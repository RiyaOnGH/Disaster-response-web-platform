/**
 * RecoveryBoard + RescueMesh - User Profile Controller
 * Handles profile inspection, statistics, and detail updates
 */

(function () {
  'use strict';

  function initProfilePage() {
    // Check page protection: if logged out, Auth.protectPage will show the barrier
    if (!Auth.protectPage('your Profile & Account Settings')) {
      return;
    }

    const user = Auth.getCurrentUser();
    if (!user) return;

    // Populate header
    const avatarLarge = document.getElementById('profileAvatarLarge');
    const displayName = document.getElementById('profileDisplayName');
    const displayEmail = document.getElementById('profileDisplayEmail');
    const roleBadge = document.getElementById('profileRoleBadge');
    const memberSince = document.getElementById('profileMemberSince');

    let initials = 'CB';
    if (user.name) {
      const parts = user.name.trim().split(' ');
      initials = parts.length > 1 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
    }

    if (avatarLarge) avatarLarge.textContent = initials;
    if (displayName) displayName.textContent = user.name;
    if (displayEmail) displayEmail.textContent = user.email;
    if (roleBadge) {
      roleBadge.textContent = user.role.toUpperCase();
      roleBadge.className = `badge ${user.role === 'responder' ? 'badge-critical' : user.role === 'authority' ? 'badge-verified' : 'badge-assigned'}`;
    }
    if (memberSince) memberSince.textContent = user.createdAt || '28 Sep 2026';

    // Populate stats
    const reports = App.getReports();
    const checklist = App.getChecklist();
    const userSos = App.getUserSos();

    const repCountEl = document.getElementById('profileReportsCount');
    const chkCountEl = document.getElementById('profileChecklistCount');
    const sosStatusEl = document.getElementById('profileSosStatus');

    if (repCountEl) repCountEl.textContent = reports.length;
    if (chkCountEl) chkCountEl.textContent = `${checklist.filter(c => c.completed).length} / ${checklist.length}`;
    if (sosStatusEl) {
      if (userSos) {
        sosStatusEl.textContent = `🚨 ACTIVE BEACON (${userSos.id})`;
        sosStatusEl.style.color = 'var(--emergency-600)';
      } else {
        sosStatusEl.textContent = '🟢 Normal Standby';
        sosStatusEl.style.color = 'var(--success-700)';
      }
    }

    // Populate edit form
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const editWard = document.getElementById('editWard');
    const editRole = document.getElementById('editRole');

    if (editName) editName.value = user.name || '';
    if (editEmail) editEmail.value = user.email || '';
    if (editPhone) editPhone.value = user.phone || '';
    if (editWard) editWard.value = user.ward || 'Ward 12, Kankarbagh';
    if (editRole) editRole.value = user.role || 'citizen';

    // Edit form submit
    document.getElementById('editProfileForm')?.addEventListener('submit', (e) => {
      e.preventDefault();

      const updated = Auth.updateProfile({
        name: editName.value.trim(),
        phone: editPhone.value.trim(),
        ward: editWard.value.trim(),
        role: editRole.value
      });

      if (updated) {
        initProfilePage();
        if (window.renderNavbar) window.renderNavbar();
      }
    });

    // Profile logout button
    document.getElementById('profileLogoutBtn')?.addEventListener('click', () => {
      Auth.confirmLogout();
    });
  }

  document.addEventListener('DOMContentLoaded', initProfilePage);
})();
