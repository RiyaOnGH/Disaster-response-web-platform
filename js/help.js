/**
 * RecoveryBoard + RescueMesh - "I Need Help" Category & Resource Controller
 * Search, category selection, distance sorting & resource details
 */

(function () {
  'use strict';

  let activeCategory = 'all';
  let searchQuery = '';
  let sortBy = 'distance';

  const categoryMetadata = {
    all: { label: 'All Resources', icon: '🌟' },
    water: { label: 'Drinking Water', icon: '💧' },
    food: { label: 'Food & Meals', icon: '🍲' },
    medical: { label: 'Medical Help', icon: '🏥' },
    shelter: { label: 'Emergency Shelter', icon: '🏠' },
    electricity: { label: 'Electricity / Charging', icon: '⚡' },
    transport: { label: 'Transportation', icon: '🚍' },
    documents: { label: 'Document Recovery', icon: '📄' },
    building_damage: { label: 'House Damage', icon: '🏚️' },
    emergency: { label: 'Emergency Assistance', icon: '📞' }
  };

  function initHelpPage() {
    // Check URL parameters for preset category (e.g., help.html?cat=water)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam && categoryMetadata[catParam]) {
      activeCategory = catParam;
    }

    renderCategoryButtons();
    renderResources();
    setupListeners();
  }

  function setupListeners() {
    // Search input
    const searchInput = document.getElementById('resourceSearchInput');
    searchInput?.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderResources();
    });

    // Sort select
    const sortSelect = document.getElementById('resourceSortSelect');
    sortSelect?.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderResources();
    });
  }

  function renderCategoryButtons() {
    const grid = document.getElementById('helpCategoryGrid');
    if (!grid) return;

    grid.innerHTML = Object.entries(categoryMetadata).map(([key, data]) => {
      const isActive = activeCategory === key;
      return `
        <button class="card help-cat-card ${isActive ? 'active' : ''}" data-cat="${key}" style="
          padding: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-align: left;
          cursor: pointer;
          border: 2px solid ${isActive ? 'var(--navy-600)' : 'var(--border-light)'};
          background: ${isActive ? '#EFF6FF' : 'white'};
          transition: all 0.15s ease;
        ">
          <div style="font-size: 1.8rem; line-height: 1;">${data.icon}</div>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; color: ${isActive ? 'var(--navy-800)' : 'var(--primary-900)'};">
              ${data.label}
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">
              ${key === 'all' ? 'Browse all verified posts' : 'Find nearby relief units'}
            </div>
          </div>
        </button>
      `;
    }).join('');

    // Attach click listeners
    grid.querySelectorAll('.help-cat-card').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        renderCategoryButtons();
        renderResources();
      });
    });
  }

  function renderResources() {
    const container = document.getElementById('resourcesListContainer');
    const resultCountEl = document.getElementById('resourceResultCount');
    if (!container) return;

    let items = App.getResources();

    // Filter by Category
    if (activeCategory !== 'all') {
      if (activeCategory === 'documents' || activeCategory === 'building_damage' || activeCategory === 'emergency') {
        // Redirect or show specialized civic guidance link
      } else {
        items = items.filter(r => r.category === activeCategory);
      }
    }

    // Filter by Search Query
    if (searchQuery) {
      items = items.filter(r => 
        r.name.toLowerCase().includes(searchQuery) ||
        r.address.toLowerCase().includes(searchQuery) ||
        r.ward.toLowerCase().includes(searchQuery) ||
        r.details.toLowerCase().includes(searchQuery)
      );
    }

    // Sort
    if (sortBy === 'distance') {
      items.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (resultCountEl) {
      resultCountEl.textContent = `${items.length} verified resources available`;
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="empty-state card" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">No resources found</div>
          <div class="empty-state-desc">Try clearing search terms or selecting another category above.</div>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('resourceSearchInput').value=''; window.location.search=''; window.location.reload();">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(res => `
      <div class="card resource-card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative;">
        <div>
          <!-- Header -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.75rem;">
            <div>
              <span class="badge ${res.category === 'water' ? 'badge-assigned' : res.category === 'medical' ? 'badge-critical' : res.category === 'shelter' ? 'badge-verified' : 'badge-reported'}">
                ${categoryMetadata[res.category]?.icon || '📍'} ${res.category.toUpperCase()}
              </span>
              <h3 style="font-size:1.1rem; font-weight:800; color:var(--primary-900); margin-top:0.4rem; line-height:1.25;">
                ${res.name}
              </h3>
            </div>
            <div style="text-align:right;">
              <span style="font-weight:900; font-size:1.1rem; color:var(--navy-800); font-family:var(--font-mono);">
                ${res.distanceKm} km
              </span>
              <div style="font-size:0.7rem; color:var(--text-muted);">away</div>
            </div>
          </div>

          <!-- Location & Details -->
          <div style="font-size:0.85rem; color:var(--text-sub); margin-bottom:0.75rem;">
            <div>📍 <strong>${res.address}</strong> (${res.ward})</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.25rem;">
              🕒 ${res.operatingHours} &bull; 📞 ${res.contactNumber}
            </div>
          </div>

          <p style="font-size:0.82rem; color:var(--text-sub); background:var(--primary-50); padding:0.6rem 0.8rem; border-radius:var(--radius-md); border:1px solid var(--border-light); margin-bottom:1rem;">
            ${res.details}
          </p>

          <!-- Capacity & Verified Status -->
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; margin-bottom:1rem; border-top:1px solid var(--border-light); padding-top:0.6rem;">
            <span style="font-weight:700; color:var(--success-700);">
              🟢 ${res.capacity || 'Ready & Operational'}
            </span>
            <span style="color:var(--text-muted); font-family:var(--font-mono);">
              Updated ${res.lastUpdated}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-top:auto;">
          <a href="map.html?focus=${res.id}" class="btn btn-secondary btn-sm">
            🗺️ View on Map
          </a>
          <button class="btn btn-primary btn-sm" onclick="App.showToast('📍 Route guidance to ${res.name.replace(/'/g, "\\'")} sent to GPS navigation', 'info')">
            🧭 Directions
          </button>
        </div>
      </div>
    `).join('');
  }

  document.addEventListener('DOMContentLoaded', initHelpPage);

})();
