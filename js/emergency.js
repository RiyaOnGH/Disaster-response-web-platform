/**
 * RecoveryBoard + RescueMesh - Emergency SOS & Mesh Simulation Controller
 * Multi-hop ad-hoc store-and-forward routing simulation with animated nodes & telemetry
 */

(function () {
  'use strict';

  let currentSimulationStep = 0;
  let simulationTimer = null;
  let isSimulating = false;

  const simulationSteps = [
    {
      stepIndex: 0,
      nodeId: 'node-origin',
      title: '1. Distress Originator Broadcast',
      desc: 'Encrypted distress beacon broadcasting via Bluetooth Low Energy (BLE) and Wi-Fi Direct ad-hoc channels.',
      log: 'SOS Beacon packet #0x7F2A broadcast on 2.4GHz ISM sub-band. Searching for peer devices...'
    },
    {
      stepIndex: 1,
      nodeId: 'node-peer',
      title: '2. Hop 1: Nearby Citizen Relay',
      desc: 'Neighboring device #84-B accepted store-and-forward encrypted packet without decrypting citizen payload.',
      log: 'Peer handshake acknowledged by Device #84-B (Distance ~42m, Signal -68dBm). Packet forwarded.'
    },
    {
      stepIndex: 2,
      nodeId: 'node-mesh',
      title: '3. Hop 2: Autonomous Solar Repeater',
      desc: 'Elevated solar street pole node amplified packet over long-range LoRa mesh link across flooded corridor.',
      log: 'Hop 2 locked: Bailey Road Solar Pole Repeater #12 routed burst across riverine zone.'
    },
    {
      stepIndex: 3,
      nodeId: 'node-gateway',
      title: '4. Hop 3: Emergency Satellite Gateway',
      desc: 'Bypassed offline cellular towers; linked with district disaster satellite uplink at BSNL Exchange.',
      log: 'Satellite ground terminal received packet. Uplink to State Emergency Command established.'
    },
    {
      stepIndex: 4,
      nodeId: 'node-rescue',
      title: '5. SOS Delivered to Response Team',
      desc: 'NDRF Unit 4 & Municipal Command acknowledged distress ticket with verified GPS coordinates ±4m.',
      log: '✅ ACK CONFIRMED by Patna Central Command. Ticket #SOS-1042 dispatched to NDRF Water Rescue Squad.'
    }
  ];

  function initEmergencyPage() {
    const userSos = App.getUserSos();
    const sosDisplayCard = document.getElementById('sos-display-container');
    const simulationCard = document.getElementById('mesh-simulation-container');
    const successCard = document.getElementById('sos-success-container');

    // Telemetry updates
    const batteryElem = document.getElementById('telemetry-battery');
    const networkElem = document.getElementById('telemetry-network');
    if (batteryElem) batteryElem.textContent = '78%';
    if (networkElem) {
      const net = App.getNetworkStatus();
      networkElem.textContent = net === 'offline' ? 'Offline (Mesh Standby)' : 'Available (Cellular/IP)';
      networkElem.className = net === 'offline' ? 'telemetry-val offline' : 'telemetry-val online';
    }

    if (userSos) {
      if (sosDisplayCard) sosDisplayCard.style.display = 'none';
      if (simulationCard) simulationCard.style.display = 'none';
      if (successCard) {
        successCard.style.display = 'block';
        renderSuccessDetails(userSos);
      }
    } else {
      if (sosDisplayCard) sosDisplayCard.style.display = 'block';
      if (simulationCard) simulationCard.style.display = 'none';
      if (successCard) successCard.style.display = 'none';
    }

    setupEventListeners();
  }

  function setupEventListeners() {
    // SOS main button -> open confirm modal
    const sendSosBtn = document.getElementById('triggerSosModalBtn');
    sendSosBtn?.addEventListener('click', () => {
      App.openModal('sosConfirmModal');
    });

    // Confirm SOS button in modal
    const confirmSosBtn = document.getElementById('confirmSosActionBtn');
    confirmSosBtn?.addEventListener('click', () => {
      App.closeModal('sosConfirmModal');
      startSosProcess();
    });

    // Re-simulate button
    const restartSimBtn = document.getElementById('restartSimulationBtn');
    restartSimBtn?.addEventListener('click', () => {
      startSosProcess();
    });

    // Cancel SOS Beacon button
    const cancelSosBtn = document.getElementById('cancelSosBtn');
    cancelSosBtn?.addEventListener('click', () => {
      if (confirm('Cancel active emergency SOS beacon? Only do this if you are safe.')) {
        App.clearUserSos();
        App.showToast('Emergency SOS beacon deactivated.', 'info');
        window.location.reload();
      }
    });

    // Contact help modal simulation
    const contactHelpBtn = document.getElementById('contactHelpBtn');
    contactHelpBtn?.addEventListener('click', () => {
      App.openModal('contactHelpModal');
    });
  }

  function startSosProcess() {
    const sosDisplayCard = document.getElementById('sos-display-container');
    const simulationCard = document.getElementById('mesh-simulation-container');
    const successCard = document.getElementById('sos-success-container');

    if (sosDisplayCard) sosDisplayCard.style.display = 'none';
    if (successCard) successCard.style.display = 'none';
    if (simulationCard) {
      simulationCard.style.display = 'block';
      simulationCard.scrollIntoView({ behavior: 'smooth' });
    }

    currentSimulationStep = 0;
    isSimulating = true;
    clearTimeout(simulationTimer);

    // Reset nodes visual
    for (let i = 0; i < 5; i++) {
      const node = document.getElementById(`mesh-node-${i}`);
      if (node) {
        node.className = 'mesh-node';
        const statusEl = node.querySelector('.mesh-node-status');
        if (statusEl) statusEl.textContent = 'Waiting';
      }
    }

    // Reset console
    const consoleBox = document.getElementById('meshConsoleOutput');
    if (consoleBox) {
      consoleBox.innerHTML = `
        <div class="mesh-console-line highlight">[RESCUEMESH AD-HOC KERNEL v2.6] Protocol initialized.</div>
        <div class="mesh-console-line">00:00.000 - Channel scan initiated across ad-hoc BLE & Wi-Fi Aware frequencies...</div>
      `;
    }

    advanceStep();
  }

  function advanceStep() {
    if (!isSimulating) return;

    if (currentSimulationStep < simulationSteps.length) {
      const stepData = simulationSteps[currentSimulationStep];
      const nodeEl = document.getElementById(`mesh-node-${currentSimulationStep}`);

      // Mark previous completed
      if (currentSimulationStep > 0) {
        const prevNode = document.getElementById(`mesh-node-${currentSimulationStep - 1}`);
        if (prevNode) {
          prevNode.className = 'mesh-node completed';
          const s = prevNode.querySelector('.mesh-node-status');
          if (s) s.textContent = currentSimulationStep === 1 ? 'Forwarded' : 'Relayed';
        }
      }

      // Mark current active
      if (nodeEl) {
        nodeEl.className = 'mesh-node active';
        const s = nodeEl.querySelector('.mesh-node-status');
        if (s) s.textContent = currentSimulationStep === 4 ? 'Delivered' : 'Connected';
      }

      // Add log
      const consoleBox = document.getElementById('meshConsoleOutput');
      if (consoleBox) {
        const line = document.createElement('div');
        line.className = currentSimulationStep === 4 ? 'mesh-console-line success' : 'mesh-console-line';
        const now = new Date().toLocaleTimeString();
        line.textContent = `${now} - ${stepData.log}`;
        consoleBox.appendChild(line);
        consoleBox.scrollTop = consoleBox.scrollHeight;
      }

      // Step text indicator
      const stepInfo = document.getElementById('meshStepInfo');
      if (stepInfo) {
        stepInfo.innerHTML = `<strong>${stepData.title}</strong>: ${stepData.desc}`;
      }

      currentSimulationStep++;
      simulationTimer = setTimeout(advanceStep, 1700);
    } else {
      // Completed!
      isSimulating = false;
      finishSosSimulation();
    }
  }

  function finishSosSimulation() {
    const selectedType = document.querySelector('input[name="emergencyType"]:checked')?.value || 'Person Trapped (Water Ingress)';
    const newSos = {
      id: '#SOS-1042',
      emergencyType: selectedType,
      victimName: 'Citizen (You)',
      location: 'Plot 42, Lane 3, Kankarbagh Main',
      ward: 'Ward 12',
      coordinates: { x: 42, y: 56 },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      severity: 'critical',
      batteryLevel: 78,
      gpsAccuracy: '±4 meters',
      networkRoute: App.getNetworkStatus() === 'offline' ? 'RescueMesh (3 Hops)' : 'RescueMesh + Satellite Gateway',
      hopsCount: 3,
      status: 'delivered',
      assignedUnit: 'NDRF Unit 4 - Water Rescue'
    };

    App.setUserSos(newSos);
    App.showToast('✅ Emergency SOS Confirmed & Received by Rescue Control', 'success', 5000);

    setTimeout(() => {
      const simulationCard = document.getElementById('mesh-simulation-container');
      const successCard = document.getElementById('sos-success-container');
      if (simulationCard) simulationCard.style.display = 'none';
      if (successCard) {
        successCard.style.display = 'block';
        renderSuccessDetails(newSos);
        successCard.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  }

  function renderSuccessDetails(sos) {
    const idEl = document.getElementById('success-sos-id');
    const locEl = document.getElementById('success-sos-location');
    const typeEl = document.getElementById('success-sos-type');
    const timeEl = document.getElementById('success-sos-time');
    const statusEl = document.getElementById('success-sos-status');
    const unitEl = document.getElementById('success-sos-unit');

    if (idEl) idEl.textContent = sos.id;
    if (locEl) locEl.textContent = `${sos.location}, ${sos.ward}`;
    if (typeEl) typeEl.textContent = sos.emergencyType;
    if (timeEl) timeEl.textContent = sos.timestamp;
    if (statusEl) {
      statusEl.textContent = sos.status === 'delivered' ? 'SOS Received & Triaged' : sos.status.toUpperCase();
      statusEl.className = 'badge badge-resolved';
    }
    if (unitEl) unitEl.textContent = sos.assignedUnit || 'NDRF Unit 4 - Dispatch En Route';
  }

  document.addEventListener('DOMContentLoaded', initEmergencyPage);

})();
