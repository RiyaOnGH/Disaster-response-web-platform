/**
 * RecoveryBoard + RescueMesh - Mock & Seed Data
 * Vanilla ES6+ Data Store
 */

const INITIAL_SOS_ALERTS = [
  {
    id: '#SOS-1042',
    emergencyType: 'Person Trapped (Water Ingress)',
    victimName: 'Ramesh Kumar & Family (4 persons)',
    location: 'Plot 42, Lane 3, Kankarbagh Main',
    ward: 'Ward 12',
    coordinates: { x: 38, y: 54 },
    timestamp: '14:32 (3 min ago)',
    severity: 'critical',
    batteryLevel: 64,
    gpsAccuracy: '±4 meters',
    networkRoute: 'RescueMesh (3 Hops)',
    hopsCount: 3,
    status: 'delivered',
    assignedUnit: 'NDRF Unit 4 - Boat Team'
  },
  {
    id: '#SOS-1045',
    emergencyType: 'Elderly Oxygen Supply Depletion',
    victimName: 'Mrs. Sunita Devi (Age 74)',
    location: 'Sector 2B, Rajendra Nagar',
    ward: 'Ward 14',
    coordinates: { x: 62, y: 41 },
    timestamp: '14:24 (11 min ago)',
    severity: 'critical',
    batteryLevel: 42,
    gpsAccuracy: '±6 meters',
    networkRoute: 'RescueMesh (Relay-4)',
    hopsCount: 4,
    status: 'dispatched',
    assignedUnit: 'Health Quick Response #2'
  },
  {
    id: '#SOS-1048',
    emergencyType: 'Structural Roof Collapse Alert',
    victimName: 'Anil Verma',
    location: 'Old Market Chowk, Ashok Rajpath',
    ward: 'Ward 8',
    coordinates: { x: 74, y: 28 },
    timestamp: '14:15 (20 min ago)',
    severity: 'high',
    batteryLevel: 81,
    gpsAccuracy: '±8 meters',
    networkRoute: 'Normal Gateway',
    hopsCount: 1,
    status: 'dispatched',
    assignedUnit: 'SDRF Extrication Squad'
  }
];

const INITIAL_REPORTS = [
  {
    id: '#RB-1042',
    category: 'road_blocked',
    title: 'Bailey Road Underpass Blocked by Inundation & Debris',
    description: 'Underpass completely submerged with 4 feet standing water and fallen electric wire. All vehicular traffic diverted towards Saguna More.',
    location: 'Bailey Road Flyover Junction',
    ward: 'Ward 12',
    coordinates: { x: 42, y: 48 },
    severity: 'high',
    status: 'working',
    reportedBy: 'Shikha Verma (Citizen)',
    assignedTeam: 'Road Clearance Team Alpha',
    teamContact: '+91 94310 88219 (Er. Alok)',
    reportedAt: '14:10',
    updatedAt: '14:28',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    beforePhoto: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    workingPhoto: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    notes: [
      '14:10 - Citizen report submitted with GPS metadata',
      '14:18 - Verified by District Control Room Operator',
      '14:25 - Assigned to Road Clearance Team Alpha with heavy pumping unit'
    ]
  },
  {
    id: '#RB-1045',
    category: 'fallen_tree',
    title: 'Uprooted Peepal Tree Blocking Hospital Ambulance Gate',
    description: 'Large trunk fallen across emergency gate of City Hospital. Ambulances forced to use rear cargo lane.',
    location: 'City Hospital Gate No. 2, Ashok Rajpath',
    ward: 'Ward 8',
    coordinates: { x: 70, y: 32 },
    severity: 'critical',
    status: 'working',
    reportedBy: 'Dr. Vivek Sinha (Staff)',
    assignedTeam: 'Forestry & Debris Unit #3',
    teamContact: '+91 98350 11442 (Officer Manoj)',
    reportedAt: '13:45',
    updatedAt: '14:15',
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    beforePhoto: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    workingPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80',
    notes: [
      '13:45 - High priority notification received',
      '13:50 - Emergency clearance authorized',
      '14:02 - Chainsaw teams deployed on site'
    ]
  },
  {
    id: '#RB-1038',
    category: 'electricity',
    title: 'Transformer Substation Submerged and Sparking',
    description: '11kV substation flooded near Boring Canal Road. Power isolated to prevent electrocution hazards.',
    location: 'Boring Canal Road Substation',
    ward: 'Ward 10',
    coordinates: { x: 30, y: 36 },
    severity: 'critical',
    status: 'resolved',
    reportedBy: 'Amitabh Sen',
    assignedTeam: 'Rapid Power Grid Team 4',
    teamContact: '+91 94318 00551',
    reportedAt: '11:20',
    updatedAt: '13:50',
    photoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    beforePhoto: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    workingPhoto: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
    proofSubmittedAt: '13:30',
    resolvedAt: '13:50',
    notes: [
      '11:20 - Citizen report logged with photos',
      '12:00 - Feeder isolated remotely',
      '13:30 - Water pumped out, dry testing complete, photographic proof uploaded',
      '13:50 - Verified safe and grid re-energized'
    ]
  },
  {
    id: '#RB-1049',
    category: 'water',
    title: 'Municipal Drinking Water Pipeline Ruptured',
    description: 'Main potable supply pipe ruptured due to soil erosion. Flooding surrounding 30 homes with non-potable mix.',
    location: 'Lohia Nagar, Kankarbagh',
    ward: 'Ward 12',
    coordinates: { x: 48, y: 60 },
    severity: 'medium',
    status: 'reported',
    reportedBy: 'Kavita Kumari',
    reportedAt: '14:20',
    updatedAt: '14:20',
    photoUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=600&q=80',
    notes: [
      '14:20 - Logged by citizen. Pending control room triage.'
    ]
  },
  {
    id: '#RB-1051',
    category: 'building_damage',
    title: 'Residential Boundary Wall Collapsed',
    description: 'Brick boundary wall collapsed into lane, obstructing drainage channel and pedestrian access.',
    location: 'Sector 4, Rajendra Nagar',
    ward: 'Ward 14',
    coordinates: { x: 60, y: 46 },
    severity: 'medium',
    status: 'verified',
    reportedBy: 'Sunil Rao',
    reportedAt: '13:10',
    updatedAt: '13:40',
    photoUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    notes: [
      '13:10 - Incident logged',
      '13:40 - Verified by Ward Supervisor'
    ]
  }
];

const INITIAL_RESOURCES = [
  {
    id: 'res-water-1',
    name: 'Community Water Point - Ward 12 Hub',
    category: 'water',
    address: 'Near Shiv Mandir Park, Kankarbagh Colony',
    ward: 'Ward 12',
    distanceKm: 1.2,
    status: 'available',
    isVerified: true,
    operatingHours: '24/7 Operational',
    contactNumber: '+91 1800 345 6112',
    capacity: '12,000 Liters (Regular Tanker Refill)',
    coordinates: { x: 44, y: 52 },
    lastUpdated: '20 min ago',
    details: 'Equipped with 6 stainless steel push-taps and RO filtration unit. Clean drinking containers distributed on site.'
  },
  {
    id: 'res-water-2',
    name: 'Disaster Relief Mobile RO Tanker #7',
    category: 'water',
    address: 'Rajendra Nagar Stadium Gate 3',
    ward: 'Ward 14',
    distanceKm: 2.8,
    status: 'available',
    isVerified: true,
    operatingHours: '06:00 AM - 10:00 PM',
    contactNumber: '+91 94310 99401',
    capacity: '8,000 Liters remaining',
    coordinates: { x: 60, y: 44 },
    lastUpdated: '45 min ago',
    details: 'Purified drinking water with chlorine treatment. Free distribution by State Disaster Management.'
  },
  {
    id: 'res-med-1',
    name: 'City Emergency Care & Hospital',
    category: 'medical',
    address: 'Ashok Rajpath, Near Central Square',
    ward: 'Ward 8',
    distanceKm: 2.4,
    status: 'available',
    isVerified: true,
    operatingHours: '24/7 Emergency Trauma',
    contactNumber: '+91 612 230 0044',
    capacity: '38 Trauma Beds Available, Blood Bank Active',
    coordinates: { x: 68, y: 30 },
    lastUpdated: '10 min ago',
    details: 'Full trauma center with emergency surgery, anti-venom, burn units, and 12-hour reserve backup diesel generators.'
  },
  {
    id: 'res-med-2',
    name: 'Red Cross Mobile First-Aid & Triage Post',
    category: 'medical',
    address: 'Patliputra Sports Complex Outer Plaza',
    ward: 'Ward 12',
    distanceKm: 0.9,
    status: 'available',
    isVerified: true,
    operatingHours: '24/7 Active',
    contactNumber: '+91 612 222 1890',
    capacity: 'Doctor on duty, 10 recovery cots',
    coordinates: { x: 40, y: 56 },
    lastUpdated: '15 min ago',
    details: 'Wound dressing, dehydration IV fluids, pediatric care, ORS packets, and basic prescription medications.'
  },
  {
    id: 'res-shelter-1',
    name: 'Temporary Relief Shelter #4 (Govt. Inter College)',
    category: 'shelter',
    address: 'Lohia Nagar High School Ground, Kankarbagh',
    ward: 'Ward 12',
    distanceKm: 1.5,
    status: 'available',
    isVerified: true,
    operatingHours: 'Open 24/7',
    contactNumber: '+91 94312 88711',
    capacity: 'Capacity: 450 (Current Occupancy: 280)',
    coordinates: { x: 46, y: 58 },
    lastUpdated: '35 min ago',
    details: 'Dry concrete bedding, solar lighting, sanitation facilities, hot meal service, and child-safe space.'
  },
  {
    id: 'res-food-1',
    name: 'Community Food Kitchen & Ration Distribution',
    category: 'food',
    address: 'Gandhi Maidan Pavilion Gate 5',
    ward: 'Ward 5',
    distanceKm: 3.1,
    status: 'available',
    isVerified: true,
    operatingHours: 'Meals: 07:00, 13:00, 19:30',
    contactNumber: '+91 1800 120 4455',
    capacity: '4,000 Hot Meals Prepared Per Shift',
    coordinates: { x: 55, y: 24 },
    lastUpdated: '12 min ago',
    details: 'Cooked khichdi, roti, baby milk powder, packaged biscuits, and oral rehydration salts.'
  },
  {
    id: 'res-power-1',
    name: 'Disaster Power Hub & Solar Charging Station',
    category: 'electricity',
    address: 'Telecom Exchange Compound, Exhibition Road',
    ward: 'Ward 10',
    distanceKm: 2.1,
    status: 'limited',
    isVerified: true,
    operatingHours: '08:00 AM - 08:00 PM',
    contactNumber: '+91 612 250 1199',
    capacity: '120 Phone Charging Ports Available',
    coordinates: { x: 50, y: 38 },
    lastUpdated: '50 min ago',
    details: 'Emergency device recharging, power bank swaps, and radio broadcast listening point.'
  },
  {
    id: 'res-trans-1',
    name: 'Emergency Evacuation & Boat Ferry Point',
    category: 'transport',
    address: 'Digha Ghat Road Junction',
    ward: 'Ward 1',
    distanceKm: 4.5,
    status: 'available',
    isVerified: true,
    operatingHours: '06:00 AM - 06:30 PM (Daylight Only)',
    contactNumber: '+91 94314 00223',
    capacity: '8 Motorized Inflatable Rescue Boats',
    coordinates: { x: 22, y: 18 },
    lastUpdated: '1 hour ago',
    details: 'NDRF boat shuttle to elevated high-ground bypass areas. Life jackets mandatory.'
  }
];

const INITIAL_UPDATES = [
  {
    id: 'upd-1',
    title: 'Bailey Road Flyover Underpass CLOSED',
    category: 'roads',
    status: 'CLOSED',
    statusType: 'danger',
    source: 'Municipal Response Team',
    isVerified: true,
    content: 'Underpass flooded with 4 feet water. Traffic diverted to Saguna More. De-watering pumps deployed.',
    affectedArea: 'Ward 12',
    timestamp: '30 min ago'
  },
  {
    id: 'upd-2',
    title: 'Water Supply Restored in Kankarbagh Sector 4 & 5',
    category: 'water',
    status: 'OPERATIONAL',
    statusType: 'success',
    source: 'Municipal Water Board',
    isVerified: true,
    content: 'Repairs on 200mm pipeline completed. Potable water running through gravity feeders. Please boil water before consumption.',
    affectedArea: 'Ward 12 & 14',
    timestamp: '1 hour ago'
  },
  {
    id: 'upd-3',
    title: '11kV Feeder Restoration Ongoing - Boring Canal Road',
    category: 'electricity',
    status: 'RESTORATION ONGOING',
    statusType: 'warning',
    source: 'Power Grid Operations',
    isVerified: true,
    content: 'Grid crews actively drying transformer coils. Estimated full power restoration by 17:00 IST.',
    affectedArea: 'Ward 10',
    timestamp: '1.5 hours ago'
  },
  {
    id: 'upd-4',
    title: 'City Hospital Operating at Full Backup Capacity',
    category: 'medical',
    status: 'OPERATIONAL',
    statusType: 'success',
    source: 'Medical Health Directorate',
    isVerified: true,
    content: 'Ambulance entrance cleared via Gate 1. Sufficient reserves of tetanus toxoid, blood units, and surgical supplies.',
    affectedArea: 'Ward 8',
    timestamp: '2 hours ago'
  },
  {
    id: 'upd-5',
    title: 'Temporary Shelter #4 Open & Receiving Families',
    category: 'shelters',
    status: 'OPERATIONAL',
    statusType: 'info',
    source: 'District Relief Office',
    isVerified: true,
    content: 'Dry bedding and warm meals ready. Free hygiene and infant care supplies distributed.',
    affectedArea: 'Ward 12',
    timestamp: '3 hours ago'
  }
];

const INITIAL_CHECKLIST = [
  {
    id: 'chk-1',
    title: 'Find Temporary Safe Shelter',
    description: 'Ensure family and pets are in verified elevated building or Govt relief shelter.',
    category: 'Safety & Shelter',
    completed: true,
    priority: 'essential',
    actionRoute: 'help.html?cat=shelter',
    actionLabel: 'Find Shelters'
  },
  {
    id: 'chk-2',
    title: 'Get Safe Drinking Water',
    description: 'Collect minimum 3 liters per person from verified potable tanker or water point.',
    category: 'Water & Food',
    completed: true,
    priority: 'essential',
    actionRoute: 'help.html?cat=water',
    actionLabel: 'Locate Water'
  },
  {
    id: 'chk-3',
    title: 'Find Medical Assistance / First-Aid',
    description: 'Inspect wounds for waterborne contamination and get booster shots if required.',
    category: 'Health',
    completed: true,
    priority: 'essential',
    actionRoute: 'help.html?cat=medical',
    actionLabel: 'Emergency Care'
  },
  {
    id: 'chk-4',
    title: 'Report House & Property Damage',
    description: 'Submit geo-tagged photos and structural assessment for disaster relief compensation.',
    category: 'Recovery & Claims',
    completed: false,
    priority: 'essential',
    actionRoute: 'report.html?cat=building_damage',
    actionLabel: 'Report Damage'
  },
  {
    id: 'chk-5',
    title: 'Check Lost / Damaged Document Recovery',
    description: 'Access digital locker guidelines to reissue Aadhaar, Ration Card, and property papers.',
    category: 'Documents',
    completed: false,
    priority: 'recommended',
    actionRoute: 'guidance.html#lost_documents',
    actionLabel: 'Document Steps'
  },
  {
    id: 'chk-6',
    title: 'Check Available Disaster Assistance Grants',
    description: 'Register with State Disaster Relief Fund (SDRF) desk at Ward 12 Help Center.',
    category: 'Financial Help',
    completed: false,
    priority: 'recommended',
    actionRoute: 'guidance.html#insurance',
    actionLabel: 'View Relief Funds'
  },
  {
    id: 'chk-7',
    title: 'Check Electricity & Gas Line Safety Before Returning',
    description: 'Verify municipal safety certificate before switching on household main breaker.',
    category: 'Utilities',
    completed: false,
    priority: 'essential',
    actionRoute: 'updates.html?filter=electricity',
    actionLabel: 'Grid Updates'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: '🚨 Emergency SOS Received',
    message: 'New SOS #SOS-1042 received from Ward 12 via RescueMesh relay.',
    type: 'critical',
    timestamp: '2 min ago',
    read: false,
    linkRoute: 'dashboard.html'
  },
  {
    id: 'notif-2',
    title: '🚧 Report #RB-1042 Verified',
    message: 'Bailey Road obstruction verified by Municipal Response Team.',
    type: 'verified',
    timestamp: '10 min ago',
    read: false,
    linkRoute: 'report-detail.html?id=RB-1042'
  },
  {
    id: 'notif-3',
    title: '💧 Water Point Availability Updated',
    message: 'Ward 12 Community Water Hub refilled with 12,000L fresh water.',
    type: 'update',
    timestamp: '20 min ago',
    read: true,
    linkRoute: 'help.html?cat=water'
  },
  {
    id: 'notif-4',
    title: '✅ Task #RB-1038 Resolved',
    message: 'Boring Canal Road 11kV Substation power safely restored.',
    type: 'resolved',
    timestamp: '1 hour ago',
    read: true,
    linkRoute: 'report-detail.html?id=RB-1038'
  }
];

const INITIAL_TEAMS = [
  {
    id: 'team-road',
    name: 'Road Clearance Team Alpha',
    specialty: 'Debris & Pumping',
    members: 6,
    activeTasks: 3,
    status: 'working',
    contact: '+91 94310 88219 (Er. Alok)',
    assignedReports: ['#RB-1042']
  },
  {
    id: 'team-forest',
    name: 'Forestry & Debris Unit #3',
    specialty: 'Tree Removal & Chainsaw',
    members: 5,
    activeTasks: 1,
    status: 'working',
    contact: '+91 98350 11442 (Officer Manoj)',
    assignedReports: ['#RB-1045']
  },
  {
    id: 'team-power',
    name: 'Rapid Power Grid Team 4',
    specialty: '11kV High Voltage Isolation',
    members: 8,
    activeTasks: 0,
    status: 'available',
    contact: '+91 94318 00551',
    assignedReports: []
  },
  {
    id: 'team-med',
    name: 'Medical Response Unit 2',
    specialty: 'Mobile Trauma & Evacuation',
    members: 4,
    activeTasks: 2,
    status: 'available',
    contact: '+91 612 222 1890',
    assignedReports: []
  },
  {
    id: 'team-water',
    name: 'Water Supply Tanker Squad',
    specialty: 'Potable Water Distribution',
    members: 7,
    activeTasks: 4,
    status: 'working',
    contact: '+91 1800 345 6112',
    assignedReports: ['#RB-1049']
  }
];

const IMPACT_CHAINS = {
  transport: {
    id: 'imp-road',
    title: 'Bailey Road Underpass Submerged (ID: #RB-1042)',
    level: 'Level 1: Primary Damage Node',
    severity: 'HIGH',
    impactedServices: 3,
    steps: [
      {
        level: 'Primary Obstruction',
        icon: '🚧',
        title: 'Bailey Road Underpass Blocked',
        desc: '4 feet standing floodwaters prevent vehicular passage on primary arterial corridor.',
        badge: 'Impact: HIGH'
      },
      {
        level: 'Direct Consequence',
        icon: '🏥',
        title: 'City Hospital Access Affected',
        desc: 'Ambulances forced to take 25-minute detours through congested residential bylanes.',
        badge: 'Critical Service'
      },
      {
        level: 'Cascading Impact',
        icon: '🚑',
        title: 'Medical Response Delayed (+18 min)',
        desc: 'Emergency triage response times elevated until underpass de-watering pumps are activated.',
        badge: 'Secondary Risk'
      }
    ]
  },
  power: {
    id: 'imp-power',
    title: '11kV Substation Inundated (ID: #RB-1038)',
    level: 'Level 1: Primary Grid Node',
    severity: 'HIGH',
    impactedServices: 4,
    steps: [
      {
        level: 'Primary Damage',
        icon: '💡',
        title: '11kV Substation Submerged',
        desc: 'Main electrical distribution equipment flooded, automated breaker protection tripped.',
        badge: 'Impact: HIGH'
      },
      {
        level: 'Direct Service Failure',
        icon: '⚙️',
        title: 'Water Pumping Station #3 Affected',
        desc: 'Water treatment pumps starved of electrical power feed, halting municipal pipe pressurization.',
        badge: 'Utility Offline'
      },
      {
        level: 'Citizen Impact',
        icon: '💧',
        title: 'Drinking Water Disrupted (20,000 Citizens)',
        desc: 'Ward 12 & 14 potable taps dry. Emergency mobile tankers must be dispatched to avoid contamination.',
        badge: 'Public Health Risk'
      }
    ]
  }
};

const GUIDANCE_TOPICS = [
  {
    id: 'house_damage',
    title: 'House & Property Damage',
    icon: '🏚️',
    badge: 'Step-by-step relief protocol',
    steps: [
      {
        num: '01',
        title: 'Move to a Safe Location',
        desc: 'Do not enter if walls are bowed, roof is sagging, or floodwater touches outlets. Turn off main breaker from external dry disconnect.'
      },
      {
        num: '02',
        title: 'Document Visible Damage',
        desc: 'Take wide shots of all 4 exterior walls, high watermarks, cracked foundations, and damaged personal assets before cleaning anything.'
      },
      {
        num: '03',
        title: 'Report Structural Damage',
        desc: 'Use RecoveryBoard to log the report (#RB) with precise GPS coordinates. This initiates the municipal damage assessor ticket.'
      },
      {
        num: '04',
        title: 'Contact Authorized Assistance',
        desc: 'Municipal structural engineer visits within 48-72 hours to verify Category A (Destroyed), B (Severe), or C (Minor).'
      },
      {
        num: '05',
        title: 'Track Recovery Status',
        desc: 'Follow ticket progression from Assigned to Verified to Relief Compensation Credit in your My Recovery dashboard.'
      }
    ]
  },
  {
    id: 'lost_documents',
    title: 'Lost or Damaged Documents',
    icon: '📄',
    badge: 'Fast-track identity restoration',
    steps: [
      {
        num: '01',
        title: 'File Combined Lost Document Police Diary (GD)',
        desc: 'Obtain an online digital GD receipt from State Police Portal for Aadhaar, Voter ID, Ration Card, and Land Deeds.'
      },
      {
        num: '02',
        title: 'Access DigiLocker Cloud Copies',
        desc: 'Visit the Recovery Help Center internet kiosk to retrieve digitally signed certificates valid under IT Act.'
      },
      {
        num: '03',
        title: 'Biometric Aadhaar Re-authentication at Camp',
        desc: 'Special biometric mobile vans in Ward 12 reissue updated Aadhaar printouts with iris/fingerprint match.'
      },
      {
        num: '04',
        title: 'Emergency Banking Account Access',
        desc: 'Present temporary disaster identity slip at Lead Bank disaster counters to withdraw emergency cash.'
      }
    ]
  },
  {
    id: 'utilities',
    title: 'Utility Restoration & Gas Safety',
    icon: '⚡',
    badge: 'Hazard prevention guidelines',
    steps: [
      {
        num: '01',
        title: 'Check Neighborhood Grid Clearance Status',
        desc: 'Verify on RecoveryBoard updates whether your street feeder has been certified dry and safe to energize.'
      },
      {
        num: '02',
        title: 'Inspect LPG Cylinders & Regulators',
        desc: 'If gas cylinder was submerged, do not light stove. Check regulator rubber gasket for debris and contact supplier helpline.'
      },
      {
        num: '03',
        title: 'Boil or Chlorinate Water Supply',
        desc: 'For first 48 hours after pipe restoration, boil tap water for at least 1 minute or use chlorine purification tablets.'
      }
    ]
  },
  {
    id: 'insurance',
    title: 'Insurance Recovery & Grants',
    icon: '🛡️',
    badge: 'Claim filing process',
    steps: [
      {
        num: '01',
        title: 'Notify Insurer Within 72 Hours',
        desc: 'Send intimation via SMS/WhatsApp with policy number and photo evidence of flood inundation.'
      },
      {
        num: '02',
        title: 'Mitigate Secondary Damages',
        desc: 'Cover broken windows and elevate undamaged belongings; insurers inspect that reasonable care was taken.'
      },
      {
        num: '03',
        title: 'Fast-Track Spot Survey for Claims under ₹50,000',
        desc: 'IRDAI disaster guidelines permit digital photo survey approval without physical inspector delay.'
      }
    ]
  },
  {
    id: 'transportation',
    title: 'Transportation & Safe Travel',
    icon: '🚍',
    badge: 'Transit route guidelines',
    steps: [
      {
        num: '01',
        title: 'Check Live Road Closures on Recovery Map',
        desc: 'Never drive through flooded underpasses; water depth can be deceptively fatal.'
      },
      {
        num: '02',
        title: 'Board Verified Relief Shuttles',
        desc: 'Municipal disaster buses operate hourly between Ward 12 and elevated high-ground shelter hubs.'
      }
    ]
  },
  {
    id: 'medical_assist',
    title: 'Medical Assistance & Sanitation',
    icon: '🏥',
    badge: 'Healthcare access',
    steps: [
      {
        num: '01',
        title: 'Locate Nearest First-Aid Post',
        desc: 'Visit Red Cross mobile post for lacerations, tetanus injections, and waterborne disease screening.'
      },
      {
        num: '02',
        title: 'Collect Oral Rehydration Salts (ORS)',
        desc: 'Maintain electrolyte hydration for children and elderly during utility disruptions.'
      }
    ]
  }
];
