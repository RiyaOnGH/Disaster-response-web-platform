/**
 * RecoveryBoard + RescueMesh - Citizen "My Recovery" Dashboard Controller
 * Household recovery checklist, progress bar calculation, active report tickets & status tracking
 */

(function () {
  'use strict';

  function initRecoveryPage() {
    if (window.Auth && !window.Auth.protectPage('My Recovery Dashboard')) {
      return;
    }

    renderRecoverySummary();
    renderRecoveryTasks();
    renderRecoveryChecklist();

    window.addEventListener('rb_reportAdded', () => {
      renderRecoverySummary();
      renderRecoveryTasks();
    });

    window.addEventListener('rb_reportUpdated', () => {
      renderRecoverySummary();
      renderRecoveryTasks();
    });

    window.addEventListener('rb_checklistUpdated', () => {
      renderRecoverySummary();
    });
  }

  function renderRecoverySummary() {
    const reports = App.getReports();
    const checklist = App.getChecklist();
    const progress = App.calculateRecoveryProgress();

    const openCount = reports.filter(r => r.status !== 'resolved' && r.status !== 'rejected').length;
    const resolvedCount = reports.filter(r => r.status === 'resolved').length;
    const pendingCount = reports.filter(r => r.status === 'reported' || r.status === 'verified').length;

    // Progress bar and % text
    const progTextEl = document.getElementById('myRecoveryProgressPercent');
    const progBarEl = document.getElementById('myRecoveryProgressBar');
    if (progTextEl) progTextEl.textContent = `${progress}%`;
    if (progBarEl) progBarEl.style.width = `${progress}%`;

    // Counts
    const openEl = document.getElementById('countOpenReports');
    const resEl = document.getElementById('countResolvedReports');
    const penEl = document.getElementById('countPendingReports');

    if (openEl) openEl.textContent = openCount;
    if (resEl) resEl.textContent = resolvedCount;
    if (penEl) penEl.textContent = pendingCount;
  }

  function renderRecoveryTasks() {
    const container = document.getElementById('myReportTasksList');
    if (!container) return;

    const reports = App.getReports();

    if (reports.length === 0) {
      container.innerHTML = `
        <div class="empty-state card">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">No Active Reports</div>
          <div class="empty-state-desc">You currently have no submitted recovery tickets. Report a problem to track its restoration.</div>
          <a href="report.html" class="btn btn-primary btn-sm">Report a Problem</a>
        </div>
      `;
      return;
    }

    container.innerHTML = reports.map(rep => {
      const isResolved = rep.status === 'resolved';
      const isWorking = rep.status === 'working';
      const isProof = rep.status === 'proof_submitted';

      let statusBadge = 'badge-reported';
      if (isResolved) statusBadge = 'badge-resolved';
      else if (isWorking) statusBadge = 'badge-working';
      else if (isProof) statusBadge = 'badge-proof';
      else if (rep.status === 'assigned') statusBadge = 'badge-assigned';
      else if (rep.status === 'verified') statusBadge = 'badge-verified';

      return `
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; border-left: 4px solid ${isResolved ? 'var(--success-600)' : isWorking ? 'var(--warning-500)' : 'var(--navy-600)'};">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
              <div>
                <span style="font-family:var(--font-mono); font-weight:700; font-size:0.75rem; color:var(--text-muted);">${rep.id}</span>
                <span class="badge ${statusBadge}" style="margin-left:0.4rem;">
                  ${rep.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <span style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono);">
                Updated ${rep.updatedAt}
              </span>
            </div>

            <h4 style="font-size:1.05rem; font-weight:800; color:var(--primary-900); margin-bottom:0.35rem; line-height:1.3;">
              ${rep.title}
            </h4>

            <div style="font-size:0.8rem; color:var(--text-sub); margin-bottom:0.6rem;">
              📍 <strong>${rep.location}</strong> (${rep.ward})
            </div>

            <div style="font-size:0.78rem; color:var(--text-sub); background:var(--primary-50); padding:0.5rem 0.75rem; border-radius:var(--radius-md); margin-bottom:0.75rem;">
              <div>👥 <strong>Assigned Team:</strong> ${rep.assignedTeam || 'Pending Dispatch Assignment'}</div>
              ${rep.teamContact ? `<div style="color:var(--text-muted); font-size:0.72rem; margin-top:0.2rem;">📞 Contact: ${rep.teamContact}</div>` : ''}
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:0.75rem; margin-top:auto;">
            <span style="font-size:0.75rem; color:var(--text-muted);">
              ${isResolved ? '✓ Verified Safe & Restored' : 'In Municipal Recovery Pipeline'}
            </span>
            <a href="report-detail.html?id=${rep.id.replace('#', '')}" class="btn btn-secondary btn-sm">
              View Ticket &rarr;
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderRecoveryChecklist() {
    const list = document.getElementById('recoveryChecklistContainer');
    if (!list) return;

    const items = App.getChecklist();

    list.innerHTML = items.map(item => `
      <div class="card checklist-card ${item.completed ? 'completed' : ''}" style="
        padding: 1rem 1.25rem;
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        border: 1px solid ${item.completed ? 'var(--success-200, #BBF7D0)' : 'var(--border-light)'};
        background: ${item.completed ? '#F0FDF4' : 'white'};
        margin-bottom: 0.75rem;
        transition: all 0.2s ease;
      ">
        <input type="checkbox" id="chk-${item.id}" ${item.completed ? 'checked' : ''} style="
          width: 20px;
          height: 20px;
          margin-top: 2px;
          accent-color: var(--success-600);
          cursor: pointer;
        " />
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
            <label for="chk-${item.id}" style="
              font-weight: 800;
              font-size: 0.95rem;
              color: ${item.completed ? 'var(--text-muted)' : 'var(--primary-900)'};
              text-decoration: ${item.completed ? 'line-through' : 'none'};
              cursor: pointer;
            ">
              ${item.title}
            </label>
            <span class="badge ${item.priority === 'essential' ? 'badge-critical' : 'badge-low'}">
              ${item.priority.toUpperCase()}
            </span>
          </div>

          <p style="
            font-size: 0.8rem;
            color: ${item.completed ? 'var(--text-muted)' : 'var(--text-sub)'};
            margin-top: 0.25rem;
          ">
            ${item.description}
          </p>

          ${item.actionRoute ? `
            <div style="margin-top: 0.5rem;">
              <a href="${item.actionRoute}" class="btn btn-secondary btn-sm" style="font-size:0.75rem; padding:0.25rem 0.6rem;">
                ${item.actionLabel || 'Take Action'} &rarr;
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');

    // Attach checkbox toggle events
    list.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.id.replace('chk-', '');
        App.toggleChecklistItem(id);
        const isNowDone = cb.checked;
        App.showToast(isNowDone ? '✓ Recovery task marked completed' : 'Task marked pending', 'success', 2000);
        renderRecoverySummary();
        renderRecoveryChecklist();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initRecoveryPage);

})();
