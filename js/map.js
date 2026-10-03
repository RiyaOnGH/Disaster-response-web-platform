/**
 * RecoveryBoard + RescueMesh - Simulated Interactive Recovery Map
 * Dynamic marker rendering, category filtering, radar pulses, drawer cards & coordinate navigation
 */

(function () {
  'use strict';

  let currentFilter = 'all';
  let activeSelectedMarker = null;

  // Map markers dataset combining resources, incidents, and SOS alerts
  function getAllMapPoints() {
    const points = [];

    // Resources
    App.getResources().forEach(r => {
      points.push({
        id: r.id,
        type: 'resource',
        category: r.category,
        title: r.name,
        subtitle: `${r.address} (${r.ward})`,
        x: r.coordinates.x,
        y: r.coordinates.y,
        status: r.status === 'available' ? '🟢 Available' : '🟡 Limited',
        distance: `${r.distanceKm} km`,
        details: r.details,
        contact: r.contactNumber,
        icon: r.category === 'water' ? '💧' : r.category === 'medical' ? '🏥' : r.category === 'shelter' ? '🏠' : r.category === 'food' ? '🍲' : r.category === 'electricity' ? '⚡' : '🚍',
        badgeClass: 'badge-assigned'
      });
    });

    // Reports / Incidents
    App.getReports().forEach(rep => {
      points.push({
        id: rep.id,
        type: 'incident',
        category: rep.category === 'road_blocked' ? 'roads' : rep.category === 'electricity' ? 'electricity' : 'incident',
        title: rep.title,
        subtitle: `${rep.location} (${rep.ward})`,
        x: rep.coordinates.x,
        y: rep.coordinates.y,
        status: `Status: ${rep.status.toUpperCase()}`,
        distance: 'Local Damage',
        details: rep.description,
        contact: rep.teamContact || 'Control Room',
        icon: rep.category === 'road_blocked' ? '🚧' : rep.category === 'fallen_tree' ? '🌳' : '⚠️',
        badgeClass: 'badge-critical'
      });
    });

    // SOS Alerts
    App.getSosAlerts().forEach(sos => {
      if (sos.status !== 'rescued') {
        points.push({
          id: sos.id,
          type: 'sos',
          category: 'emergency',
          title: `SOS Distress: ${sos.emergencyType}`,
          subtitle: `${sos.location} (${sos.ward})`,
          x: sos.coordinates.x,
          y: sos.coordinates.y,
          status: '🚨 CRITICAL DISTRESS',
          distance: 'High Priority',
          details: `Victim: ${sos.victimName}. Network Route: ${sos.networkRoute}. Battery: ${sos.batteryLevel}%`,
          contact: 'Emergency Dispatch',
          icon: '🆘',
          badgeClass: 'badge-critical'
        });
      }
    });

    return points;
  }

  function initMapPage() {
    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');
    const focusParam = params.get('focus');

    if (filterParam) currentFilter = filterParam;

    renderFilterChips();
    renderMarkers();

    if (focusParam) {
      setTimeout(() => {
        selectMarkerById(focusParam);
      }, 200);
    }

    setupMapControls();
  }

  function renderFilterChips() {
    const filterBar = document.getElementById('mapFilterBar');
    if (!filterBar) return;

    const filters = [
      { id: 'all', label: 'All Markers' },
      { id: 'water', label: '💧 Water' },
      { id: 'food', label: '🍲 Food' },
      { id: 'medical', label: '🏥 Medical' },
      { id: 'shelter', label: '🏠 Shelter' },
      { id: 'roads', label: '🚧 Roads' },
      { id: 'electricity', label: '⚡ Electricity' },
      { id: 'transport', label: '🚍 Transport' },
      { id: 'emergency', label: '🆘 SOS Emergencies' }
    ];

    filterBar.innerHTML = filters.map(f => `
      <button class="filter-chip ${currentFilter === f.id ? 'active' : ''}" data-filter="${f.id}">
        ${f.label}
      </button>
    `).join('');

    filterBar.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter');
        renderFilterChips();
        renderMarkers();
      });
    });
  }

  function renderMarkers() {
    const canvas = document.getElementById('mapPinsContainer');
    if (!canvas) return;

    const allPoints = getAllMapPoints();
    const filteredPoints = allPoints.filter(p => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'roads') return p.category === 'roads' || p.category === 'road_blocked';
      return p.category === currentFilter;
    });

    canvas.innerHTML = filteredPoints.map(p => {
      let pinClass = 'marker-water';
      if (p.category === 'medical') pinClass = 'marker-medical';
      else if (p.category === 'shelter') pinClass = 'marker-shelter';
      else if (p.category === 'food') pinClass = 'marker-food';
      else if (p.category === 'roads' || p.category === 'road_blocked') pinClass = 'marker-road';
      else if (p.category === 'electricity') pinClass = 'marker-power';
      else if (p.category === 'emergency' || p.type === 'sos') pinClass = 'marker-sos';

      return `
        <div class="map-marker" data-marker-id="${p.id}" style="left: ${p.x}%; top: ${p.y}%;" title="${p.title}">
          <div class="marker-pin ${pinClass}">
            <span class="marker-pin-inner">${p.icon}</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach marker click handlers
    canvas.querySelectorAll('.map-marker').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-marker-id');
        selectMarkerById(id);
      });
    });
  }

  function selectMarkerById(id) {
    const allPoints = getAllMapPoints();
    const point = allPoints.find(p => p.id === id);
    if (!point) return;

    activeSelectedMarker = point;

    // Highlight marker visually
    document.querySelectorAll('.map-marker').forEach(m => {
      m.style.transform = m.getAttribute('data-marker-id') === id ? 'translate(-50%, -50%) scale(1.4)' : '';
    });

    renderResourceDrawer(point);
  }

  function renderResourceDrawer(point) {
    let drawer = document.getElementById('mapResourceDrawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'mapResourceDrawer';
      drawer.className = 'map-resource-drawer';
      document.getElementById('mapCanvasContainer')?.appendChild(drawer);
    }

    drawer.style.display = 'block';
    drawer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
        <span class="badge ${point.badgeClass}">
          ${point.icon} ${point.category.toUpperCase()}
        </span>
        <button id="closeMapDrawerBtn" style="font-size:1.1rem; line-height:1; color:var(--text-muted); cursor:pointer;">&times;</button>
      </div>

      <h4 style="font-size:1.05rem; font-weight:800; color:var(--primary-900); margin-bottom:0.25rem;">
        ${point.title}
      </h4>
      <div style="font-size:0.8rem; color:var(--text-sub); margin-bottom:0.5rem;">
        📍 ${point.subtitle}
      </div>

      <div style="font-size:0.75rem; color:var(--text-muted); background:var(--primary-50); padding:0.5rem 0.75rem; border-radius:var(--radius-md); margin-bottom:0.75rem;">
        ${point.details}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; font-weight:700; margin-bottom:0.75rem;">
        <span style="color:var(--success-700);">${point.status}</span>
        <span style="color:var(--navy-800); font-family:var(--font-mono);">${point.distance}</span>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
        <button class="btn btn-secondary btn-sm" onclick="App.showToast('Routing directions to ${point.title.replace(/'/g, "\\'")}', 'info')">
          🧭 Directions
        </button>
        ${point.type === 'incident' 
          ? `<a href="report-detail.html?id=${point.id.replace('#', '')}" class="btn btn-primary btn-sm">View Ticket</a>`
          : `<button class="btn btn-primary btn-sm" onclick="App.showToast('Contacting ${point.contact}: Available', 'success')">Call Contact</button>`
        }
      </div>
    `;

    document.getElementById('closeMapDrawerBtn')?.addEventListener('click', () => {
      drawer.style.display = 'none';
      activeSelectedMarker = null;
      document.querySelectorAll('.map-marker').forEach(m => m.style.transform = '');
    });
  }

  function setupMapControls() {
    const zoomInBtn = document.getElementById('mapZoomIn');
    const zoomOutBtn = document.getElementById('mapZoomOut');
    const recenterBtn = document.getElementById('mapRecenter');

    zoomInBtn?.addEventListener('click', () => {
      App.showToast('🔍 Zoomed map view in', 'info', 1500);
    });

    zoomOutBtn?.addEventListener('click', () => {
      App.showToast('🔍 Zoomed map view out', 'info', 1500);
    });

    recenterBtn?.addEventListener('click', () => {
      currentFilter = 'all';
      renderFilterChips();
      renderMarkers();
      const drawer = document.getElementById('mapResourceDrawer');
      if (drawer) drawer.style.display = 'none';
      App.showToast('📍 Map recentered to Ward 12 Disaster Zone', 'info', 1500);
    });
  }

  document.addEventListener('DOMContentLoaded', initMapPage);

})();
