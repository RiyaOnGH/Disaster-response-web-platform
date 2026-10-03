/**
 * RecoveryBoard + RescueMesh - Report a Problem Wizard Controller
 * 5-step form wizard, validation, GPS simulation, photo upload preview & status progression
 */

(function () {
  'use strict';

  let currentStep = 1;
  const totalSteps = 5;

  const reportFormData = {
    category: '',
    categoryLabel: '',
    categoryIcon: '',
    location: '',
    ward: 'Ward 12',
    coordinates: { x: 50, y: 50 },
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    title: '',
    description: '',
    severity: 'high'
  };

  const categoryPresets = {
    road_blocked: { label: 'Road Blocked / Submerged', icon: '🚧', defaultTitle: 'Main Road Blocked by Inundation & Debris' },
    fallen_tree: { label: 'Fallen Tree / Heavy Obstruction', icon: '🌳', defaultTitle: 'Uprooted Peepal Tree Blocking Road' },
    electricity: { label: 'Electricity / Severed Cable', icon: '💡', defaultTitle: 'Transformer Substation Sparking in Floodwater' },
    water: { label: 'Water Supply / Pipeline Leak', icon: '💧', defaultTitle: 'Municipal Drinking Water Pipeline Ruptured' },
    building_damage: { label: 'Building / Wall Collapse', icon: '🏚️', defaultTitle: 'Residential Boundary Wall Collapsed' },
    transportation: { label: 'Transportation Blocked', icon: '🚍', defaultTitle: 'Transit Route Submerged & Impassable' },
    other: { label: 'Other Civic Hazard', icon: '⚠️', defaultTitle: 'Unclassified Emergency Hazard' }
  };

  function initReportWizard() {
    if (window.Auth && !window.Auth.protectPage('Report a Problem')) {
      return;
    }

    setupStepNavigation();
    setupCategorySelection();
    setupLocationControls();
    setupPhotoUpload();
    setupValidationAndSubmit();
  }

  function setupStepNavigation() {
    const nextBtn = document.getElementById('wizardNextBtn');
    const prevBtn = document.getElementById('wizardPrevBtn');

    nextBtn?.addEventListener('click', () => {
      if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
          goToStep(currentStep + 1);
        }
      }
    });

    prevBtn?.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  }

  function goToStep(stepNumber) {
    currentStep = stepNumber;

    // Update step panels visibility
    for (let i = 1; i <= totalSteps; i++) {
      const panel = document.getElementById(`step-panel-${i}`);
      if (panel) {
        panel.style.display = i === currentStep ? 'block' : 'none';
      }

      // Update stepper header circles
      const stepItem = document.getElementById(`stepper-item-${i}`);
      if (stepItem) {
        stepItem.className = 'step-item';
        if (i < currentStep) stepItem.classList.add('completed');
        else if (i === currentStep) stepItem.classList.add('active');
      }
    }

    // Toggle button visibility
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');
    const submitBtn = document.getElementById('wizardSubmitBtn');

    if (prevBtn) prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';

    // Populate review if step 5
    if (currentStep === 5) {
      populateReviewSummary();
    }
  }

  function setupCategorySelection() {
    const container = document.getElementById('categorySelectionGrid');
    if (!container) return;

    container.innerHTML = Object.entries(categoryPresets).map(([key, item]) => `
      <div class="card cat-select-card" data-cat="${key}" style="
        padding: 1.25rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        border: 2px solid var(--border-light);
        transition: all 0.15s ease;
      ">
        <span style="font-size: 2rem;">${item.icon}</span>
        <div>
          <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary-900);">${item.label}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Click to select category</div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.cat-select-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.cat-select-card').forEach(c => {
          c.style.borderColor = 'var(--border-light)';
          c.style.background = 'white';
        });

        card.style.borderColor = 'var(--navy-600)';
        card.style.background = '#EFF6FF';

        const catKey = card.getAttribute('data-cat');
        reportFormData.category = catKey;
        reportFormData.categoryLabel = categoryPresets[catKey].label;
        reportFormData.categoryIcon = categoryPresets[catKey].icon;
        reportFormData.title = categoryPresets[catKey].defaultTitle;

        document.getElementById('cat-validation-error')?.classList.remove('visible');
      });
    });
  }

  function setupLocationControls() {
    const useGpsBtn = document.getElementById('useCurrentLocationBtn');
    const locationInput = document.getElementById('reportLocationInput');
    const wardInput = document.getElementById('reportWardInput');

    useGpsBtn?.addEventListener('click', () => {
      useGpsBtn.innerHTML = '<span>📡 Acquiring GPS...</span>';
      setTimeout(() => {
        const simulatedLocations = [
          { address: 'Bailey Road Flyover Junction', ward: 'Ward 12', x: 44, y: 52 },
          { address: 'Lohia Nagar, Kankarbagh Main Road', ward: 'Ward 12', x: 48, y: 60 },
          { address: 'Ashok Rajpath, Near Hospital Gate', ward: 'Ward 8', x: 68, y: 30 },
          { address: 'Boring Canal Road Substation', ward: 'Ward 10', x: 30, y: 36 }
        ];
        const chosen = simulatedLocations[Math.floor(Math.random() * simulatedLocations.length)];

        if (locationInput) locationInput.value = chosen.address;
        if (wardInput) wardInput.value = chosen.ward;

        reportFormData.location = chosen.address;
        reportFormData.ward = chosen.ward;
        reportFormData.coordinates = { x: chosen.x, y: chosen.y };

        useGpsBtn.innerHTML = '<span>📍 GPS Coordinates Locked (±4m)</span>';
        useGpsBtn.className = 'btn btn-success btn-sm';
        App.showToast('📍 High-accuracy GPS location attached', 'success');
      }, 600);
    });

    locationInput?.addEventListener('input', (e) => {
      reportFormData.location = e.target.value.trim();
    });

    wardInput?.addEventListener('input', (e) => {
      reportFormData.ward = e.target.value.trim();
    });
  }

  function setupPhotoUpload() {
    const dropzone = document.getElementById('photoDropzone');
    const fileInput = document.getElementById('photoFileInput');
    const previewContainer = document.getElementById('photoPreviewContainer');
    const previewImage = document.getElementById('photoPreviewImg');

    const sampleImages = [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80'
    ];

    dropzone?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          showPreview(event.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });

    // Quick sample image buttons
    document.querySelectorAll('.sample-photo-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        showPreview(sampleImages[index % sampleImages.length]);
      });
    });

    function showPreview(url) {
      reportFormData.photoUrl = url;
      if (previewImage) previewImage.src = url;
      if (previewContainer) previewContainer.style.display = 'block';
      if (dropzone) dropzone.style.display = 'none';
      App.showToast('📸 Photo attached with geo-tag metadata', 'success');
    }

    document.getElementById('removePhotoBtn')?.addEventListener('click', () => {
      if (previewContainer) previewContainer.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';
      if (fileInput) fileInput.value = '';
    });
  }

  function validateCurrentStep() {
    if (currentStep === 1) {
      if (!reportFormData.category) {
        const err = document.getElementById('cat-validation-error');
        if (err) {
          err.textContent = 'Please select a problem category to continue.';
          err.classList.add('visible');
        }
        App.showToast('Please select a problem category', 'warning');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      const locInput = document.getElementById('reportLocationInput');
      const val = locInput ? locInput.value.trim() : '';
      if (!val) {
        const err = document.getElementById('loc-validation-error');
        if (err) {
          err.textContent = 'Please enter a location or click "Use Current Location".';
          err.classList.add('visible');
        }
        locInput?.classList.add('is-invalid');
        App.showToast('Location is required', 'warning');
        return false;
      }
      reportFormData.location = val;
      return true;
    }

    if (currentStep === 3) {
      // Photo is optional or preset
      return true;
    }

    if (currentStep === 4) {
      const descInput = document.getElementById('reportDescInput');
      const titleInput = document.getElementById('reportTitleInput');
      const severityInput = document.getElementById('reportSeveritySelect');

      const descVal = descInput ? descInput.value.trim() : '';
      if (!descVal) {
        const err = document.getElementById('desc-validation-error');
        if (err) {
          err.textContent = 'Please describe the problem so crews can prepare equipment.';
          err.classList.add('visible');
        }
        descInput?.classList.add('is-invalid');
        App.showToast('Description is required', 'warning');
        return false;
      }

      reportFormData.description = descVal;
      if (titleInput && titleInput.value.trim()) {
        reportFormData.title = titleInput.value.trim();
      }
      if (severityInput) {
        reportFormData.severity = severityInput.value;
      }
      return true;
    }

    return true;
  }

  function populateReviewSummary() {
    const revCat = document.getElementById('rev-category');
    const revLoc = document.getElementById('rev-location');
    const revTitle = document.getElementById('rev-title');
    const revDesc = document.getElementById('rev-desc');
    const revSeverity = document.getElementById('rev-severity');
    const revPhoto = document.getElementById('rev-photo-img');

    if (revCat) revCat.textContent = `${reportFormData.categoryIcon} ${reportFormData.categoryLabel}`;
    if (revLoc) revLoc.textContent = `${reportFormData.location}, ${reportFormData.ward}`;
    if (revTitle) revTitle.textContent = reportFormData.title;
    if (revDesc) revDesc.textContent = reportFormData.description;
    if (revSeverity) {
      revSeverity.textContent = reportFormData.severity.toUpperCase();
      revSeverity.className = `badge badge-${reportFormData.severity}`;
    }
    if (revPhoto) revPhoto.src = reportFormData.photoUrl;
  }

  function setupValidationAndSubmit() {
    const submitBtn = document.getElementById('wizardSubmitBtn');
    submitBtn?.addEventListener('click', () => {
      // Generate ID like #RB-1052
      const randomNum = Math.floor(1050 + Math.random() * 900);
      const reportId = `#RB-${randomNum}`;

      const currentUser = window.Auth ? window.Auth.getCurrentUser() : null;
      const reporterName = currentUser ? `${currentUser.name} (${currentUser.role})` : 'Citizen (You)';

      const newReport = {
        id: reportId,
        category: reportFormData.category,
        title: reportFormData.title,
        description: reportFormData.description,
        location: reportFormData.location,
        ward: reportFormData.ward,
        coordinates: reportFormData.coordinates,
        severity: reportFormData.severity,
        status: 'reported',
        reportedBy: reporterName,
        reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        photoUrl: reportFormData.photoUrl,
        beforePhoto: reportFormData.photoUrl,
        notes: [
          `${new Date().toLocaleTimeString()} - Report submitted by ${reporterName} via RecoveryBoard form`
        ]
      };

      App.saveReport(newReport);
      App.showToast(`✅ Report ${reportId} submitted successfully!`, 'success');

      // Hide form card, show success state
      const formCard = document.getElementById('reportWizardCard');
      const successCard = document.getElementById('reportSuccessCard');

      if (formCard) formCard.style.display = 'none';
      if (successCard) {
        successCard.style.display = 'block';
        document.getElementById('success-report-id').textContent = reportId;
        document.getElementById('success-report-title').textContent = newReport.title;
        document.getElementById('success-report-loc').textContent = `${newReport.location} (${newReport.ward})`;
        successCard.scrollIntoView({ behavior: 'smooth' });

        // Setup detail button link
        document.getElementById('viewSubmittedReportBtn').href = `report-detail.html?id=${reportId.replace('#', '')}`;
      }
    });

    // Simulate status progression button
    document.getElementById('simulateProgressionBtn')?.addEventListener('click', () => {
      const repId = document.getElementById('success-report-id').textContent;
      simulateReportProgression(repId);
    });
  }

  function simulateReportProgression(reportId) {
    const steps = ['verified', 'assigned', 'working', 'proof_submitted', 'resolved'];
    let idx = 0;

    const stepLabel = document.getElementById('progressionCurrentStatus');
    const progressBar = document.getElementById('progressionProgressBar');

    const interval = setInterval(() => {
      if (idx < steps.length) {
        const nextStatus = steps[idx];
        App.updateReportStatus(reportId, nextStatus, nextStatus === 'assigned' || nextStatus === 'working' ? 'Road Clearance Team Alpha' : null);
        
        if (stepLabel) {
          stepLabel.textContent = `Status: ${nextStatus.toUpperCase()}`;
          stepLabel.className = `badge badge-${nextStatus}`;
        }
        if (progressBar) {
          progressBar.style.width = `${((idx + 2) / 6) * 100}%`;
        }

        // Highlight timeline nodes
        document.querySelectorAll('.progression-step-node').forEach((node, nIdx) => {
          if (nIdx <= idx + 1) node.classList.add('completed');
        });

        idx++;
      } else {
        clearInterval(interval);
        App.showToast(`✅ ${reportId} is now FULLY RESOLVED!`, 'success');
      }
    }, 1400);
  }

  document.addEventListener('DOMContentLoaded', initReportWizard);

})();
