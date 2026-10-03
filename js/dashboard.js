/**
 * RecoveryBoard + RescueMesh - Response Team & Operations Command Dashboard
 * KPIs, SOS Triage, Incident Table, Team Management, Impact Graph, Priority Decision Support & Analytics
 */

(function () {
  'use strict';

  let tableFilter = 'all';
  let tableSearch = '';
  let activeImpactChain = 'transport';

  function initDashboard() {
    if (window.Auth && !window.Auth.protectPage('Operations Command Console')) {
      return;
    }

    renderKPIs();
    renderActiveSosPanel();
    renderReportsTable();
    renderTeams();
    renderImpactGraph();
    renderAnalyticsCharts();
    setupDashboardListeners();

    window.addEventListener('rb_reportAdded', () => {
      renderKPIs();
      renderReportsTable();
      renderAnalyticsCharts();
    });

    window.addEventListener('rb_reportUpdated', () => {
      renderKPIs();
      renderReportsTable();
      renderTeams();
      renderAnalyticsCharts();
    });

    window.addEventListener('rb_sosChanged', () => {
      renderActiveSosPanel();
      renderKPIs();
    });
  }

  function renderKPIs() {
    const reports = App.getReports();
    const sosAlerts = App.getSosAlerts();

    const total = reports.length;
    const verified = reports.filter(r => r.status !== 'reported').length;
    const working = reports.filter(r => r.status === 'working').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const activeSos = sosAlerts.filter(s => s.status !== 'rescued').length;

    const elTotal = document.getElementById('kpi-total-reports');
    const elVer = document.getElementById('kpi-verified-reports');
    const elWork = document.getElementById('kpi-working-reports');
    const elRes = document.getElementById('kpi-resolved-reports');
    const elSos = document.getElementById('kpi-active-sos');

    if (elTotal) elTotal.textContent = total;
    if (elVer) elVer.textContent = verified;
    if (elWork) elWork.textContent = working;
    if (elRes) elRes.textContent = resolved;
    if (elSos) elSos.textContent = activeSos;
  }

  function renderActiveSosPanel() {
    const container = document.getElementById('activeSosPanelList');
    if (!container) return;

    const sosAlerts = App.getSosAlerts().filter(s => s.status !== 'rescued');

    if (sosAlerts.length === 0) {
      container.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          🟢 All citizen SOS distress beacons currently triaged & rescued.
        </div>
      `;
      return;
    }

    container.innerHTML = sosAlerts.map(sos => `
      <div class="card" style="border: 2px solid #FCA5A5; background: #FEF2F2; margin-bottom: 0.85rem; padding: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <div>
            <span class="badge badge-critical">🚨 CRITICAL SOS</span>
            <span style="font-family:var(--font-mono); font-weight:800; font-size:0.85rem; color:#991B1B; margin-left:0.5rem;">
              ${sos.id}
            </span>
          </div>
          <span style="font-size:0.75rem; font-family:var(--font-mono); color:#B91C1C;">
            ${sos.timestamp}
          </span>
        </div>

        <h4 style="font-size:1.1rem; font-weight:900; color:#7F1D1D; margin-bottom:0.35rem;">
          ${sos.emergencyType}
        </h4>

        <div style="font-size:0.82rem; color:#991B1B; margin-bottom:0.5rem;">
          📍 <strong>${sos.location}</strong> (${sos.ward}) &bull; Victim: ${sos.victimName}
        </div>

        <div style="display:flex; gap:1rem; font-size:0.75rem; font-family:var(--font-mono); color:#B91C1C; margin-bottom:0.85rem;">
          <span>🔋 Battery: ${sos.batteryLevel}%</span>
          <span>🛰 GPS: ${sos.gpsAccuracy}</span>
          <span>📶 Relay: ${sos.networkRoute}</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #FCA5A5; padding-top:0.75rem;">
          <span style="font-size:0.78rem; font-weight:700; color:#991B1B;">
            Unit: ${sos.assignedUnit || 'Dispatching squad...'}
          </span>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="App.showToast('Connecting to distress communicator for ${sos.id}', 'info')">
              📞 Contact
            </button>
            <button class="btn btn-emergency btn-sm" onclick="App.updateSosStatus('${sos.id}', 'rescued'); App.showToast('✅ ${sos.id} marked as RESCUED!', 'success');">
              Mark Rescued
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderReportsTable() {
    const tbody = document.getElementById('reportsTableBody');
    if (!tbody) return;

    let reports = App.getReports();

    // Filter
    if (tableFilter !== 'all') {
      reports = reports.filter(r => r.status === tableFilter);
    }

    // Search
    if (tableSearch) {
      reports = reports.filter(r => 
        r.id.toLowerCase().includes(tableSearch) ||
        r.title.toLowerCase().includes(tableSearch) ||
        r.location.toLowerCase().includes(tableSearch) ||
        r.ward.toLowerCase().includes(tableSearch) ||
        (r.assignedTeam && r.assignedTeam.toLowerCase().includes(tableSearch))
      );
    }

    if (reports.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">
            No incident reports found matching current filters.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = reports.map(r => {
      let statusBadge = 'badge-reported';
      if (r.status === 'resolved') statusBadge = 'badge-resolved';
      else if (r.status === 'working') statusBadge = 'badge-working';
      else if (r.status === 'proof_submitted') statusBadge = 'badge-proof';
      else if (r.status === 'assigned') statusBadge = 'badge-assigned';
      else if (r.status === 'verified') statusBadge = 'badge-verified';

      return `
        <tr>
          <td style="font-family:var(--font-mono); font-weight:800; color:var(--navy-800);">
            <a href="report-detail.html?id=${r.id.replace('#', '')}" style="text-decoration:underline;">
              ${r.id}
            </a>
          </td>
          <td>
            <div style="font-weight:700; color:var(--primary-900);">${r.title}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${r.category.replace('_', ' ')}</div>
          </td>
          <td>
            <div>${r.location}</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">${r.ward}</div>
          </td>
          <td>
            <span class="badge badge-${r.severity}">
              ${r.severity.toUpperCase()}
            </span>
          </td>
          <td>
            <span class="badge ${statusBadge}">
              ${r.status.replace('_', ' ').toUpperCase()}
            </span>
          </td>
          <td>
            <div style="font-size:0.8rem; font-weight:600; color:var(--primary-900);">
              ${r.assignedTeam || '<span style="color:var(--text-muted);">Unassigned</span>'}
            </div>
          </td>
          <td>
            <div style="display:flex; gap:0.35rem;">
              <a href="report-detail.html?id=${r.id.replace('#', '')}" class="btn btn-secondary btn-sm" title="View & Edit">
                Inspect
              </a>
              <button class="btn btn-ghost btn-sm" onclick="openAssignModal('${r.id}')" title="Assign Squad">
                Assign
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderTeams() {
    const container = document.getElementById('teamsGridContainer');
    if (!container) return;

    const teams = App.getTeams();
    container.innerHTML = teams.map(t => `
      <div class="card" style="padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <div>
            <h4 style="font-size:0.95rem; font-weight:800; color:var(--primary-900);">${t.name}</h4>
            <div style="font-size:0.72rem; color:var(--text-muted);">${t.specialty}</div>
          </div>
          <span class="badge ${t.status === 'working' ? 'badge-working' : 'badge-resolved'}">
            ${t.status === 'working' ? '🟢 WORKING' : '⚪ READY'}
          </span>
        </div>

        <div style="font-size:0.8rem; color:var(--text-sub); margin-bottom:0.75rem;">
          <div>👥 Members: <strong>${t.members} crew</strong></div>
          <div>🔧 Active Tasks: <strong>${t.activeTasks} assigned</strong></div>
          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.25rem;">📞 ${t.contact}</div>
        </div>

        <button class="btn btn-secondary btn-sm btn-block" onclick="App.showToast('Paging ${t.name.replace(/'/g, "\\'")}', 'info')">
          Page Team Lead
        </button>
      </div>
    `).join('');
  }

  function renderImpactGraph() {
    const container = document.getElementById('impactGraphDisplay');
    if (!container) return;

    const chain = IMPACT_CHAINS[activeImpactChain];
    if (!chain) return;

    container.innerHTML = `
      <div style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span class="badge badge-critical">${chain.level}</span>
          <h4 style="font-size:1.1rem; font-weight:800; color:var(--primary-900); margin-top:0.25rem;">
            ${chain.title}
          </h4>
        </div>
        <span class="badge badge-high">Impact: ${chain.severity} (${chain.impactedServices} Services Affected)</span>
      </div>

      <div class="impact-cascade">
        ${chain.steps.map((st, idx) => `
          <div class="impact-node-card ${idx === 0 ? 'level-primary' : idx === 1 ? 'level-secondary' : 'level-cascade'}">
            <span style="font-size:2rem;">${st.icon}</span>
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h5 style="font-size:0.95rem; font-weight:800; color:var(--primary-900);">${st.title}</h5>
                <span class="badge ${idx === 0 ? 'badge-critical' : 'badge-high'}">${st.badge}</span>
              </div>
              <p style="font-size:0.8rem; color:var(--text-sub); margin-top:0.25rem;">
                ${st.desc}
              </p>
            </div>
          </div>
          ${idx < chain.steps.length - 1 ? '<div class="impact-arrow-down">↓</div>' : ''}
        `).join('')}
      </div>
    `;
  }

  function renderAnalyticsCharts() {
    const reports = App.getReports();
    const categories = {
      road_blocked: { label: 'Roads & Submerged Underpasses', count: 0, color: 'var(--navy-700)' },
      water: { label: 'Water & Pipeline Breaches', count: 0, color: 'var(--info-600)' },
      electricity: { label: 'Grid & High-Voltage Feeder', count: 0, color: 'var(--warning-500)' },
      building_damage: { label: 'Structural & Wall Collapses', count: 0, color: 'var(--emergency-600)' },
      fallen_tree: { label: 'Fallen Trees & Debris', count: 0, color: 'var(--success-600)' }
    };

    reports.forEach(r => {
      if (categories[r.category]) {
        categories[r.category].count++;
      }
    });

    const chartContainer = document.getElementById('reportsByCategoryChart');
    if (chartContainer) {
      const maxCount = Math.max(...Object.values(categories).map(c => c.count), 1);
      chartContainer.innerHTML = Object.entries(categories).map(([k, cat]) => {
        const pct = Math.round((cat.count / maxCount) * 100);
        return `
          <div style="margin-bottom:0.75rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; color:var(--primary-900); margin-bottom:0.2rem;">
              <span>${cat.label}</span>
              <span style="font-family:var(--font-mono);">${cat.count} reports</span>
            </div>
            <div style="height:12px; background:var(--primary-100); border-radius:var(--radius-full); overflow:hidden;">
              <div style="height:100%; width:${pct}%; background:${cat.color}; border-radius:var(--radius-full); transition:width 0.4s ease;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function setupDashboardListeners() {
    // Filter chips
    document.querySelectorAll('.table-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.table-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tableFilter = btn.getAttribute('data-status');
        renderReportsTable();
      });
    });

    // Search
    document.getElementById('tableSearchInput')?.addEventListener('input', (e) => {
      tableSearch = e.target.value.toLowerCase().trim();
      renderReportsTable();
    });

    // Impact chain switcher
    document.getElementById('btnChainTransport')?.addEventListener('click', (e) => {
      activeImpactChain = 'transport';
      e.target.className = 'btn btn-primary btn-sm';
      document.getElementById('btnChainPower').className = 'btn btn-secondary btn-sm';
      renderImpactGraph();
    });

    document.getElementById('btnChainPower')?.addEventListener('click', (e) => {
      activeImpactChain = 'power';
      e.target.className = 'btn btn-primary btn-sm';
      document.getElementById('btnChainTransport').className = 'btn btn-secondary btn-sm';
      renderImpactGraph();
    });
  }

  // Assign modal
  window.openAssignModal = function (reportId) {
    const report = App.getReportById(reportId);
    if (!report) return;

    let modal = document.getElementById('assignTeamModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'assignTeamModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const teams = App.getTeams();
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>👥 Assign Team to ${report.id}</h3>
          <button class="modal-close-btn" data-close-modal>&times;</button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom:1rem; font-size:0.85rem; color:var(--text-sub);">
            Select emergency response team for: <strong>${report.title}</strong> (${report.location})
          </p>
          <div class="form-group">
            <label class="form-label">Available Response Teams</label>
            <select class="form-control" id="selectTeamDropdown">
              ${teams.map(t => `<option value="${t.name}">${t.name} (${t.specialty}) - ${t.members} members</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-close-modal>Cancel</button>
          <button class="btn btn-primary" id="confirmAssignBtn">Confirm Assignment</button>
        </div>
      </div>
    `;

    modal.classList.add('active');

    modal.querySelector('[data-close-modal]')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.querySelector('#confirmAssignBtn')?.addEventListener('click', () => {
      const selectedTeam = document.getElementById('selectTeamDropdown').value;
      App.assignTeamToReport(report.id, selectedTeam);
      App.showToast(`✓ Assigned ${report.id} to ${selectedTeam}`, 'success');
      modal.classList.remove('active');
      renderReportsTable();
      renderTeams();
    });
  };

  document.addEventListener('DOMContentLoaded', initDashboard);

})();
