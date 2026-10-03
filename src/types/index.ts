export type UserRole = 'citizen' | 'responder' | 'authority';

export type NetworkStatus = 'connected' | 'limited' | 'offline';

export type EmergencySeverity = 'critical' | 'high' | 'medium' | 'low';

export type ReportCategory = 
  | 'road_blocked'
  | 'fallen_tree'
  | 'electricity'
  | 'water'
  | 'building_damage'
  | 'transportation'
  | 'medical_emergency'
  | 'other';

export type ReportStatus = 
  | 'reported'
  | 'verified'
  | 'assigned'
  | 'working'
  | 'proof_submitted'
  | 'resolved'
  | 'rejected';

export interface CitizenReport {
  id: string; // e.g. #RB-1042
  category: ReportCategory;
  title: string;
  description: string;
  location: string;
  ward: string;
  coordinates: { x: number; y: number }; // Percentage 0-100 on map
  severity: EmergencySeverity;
  status: ReportStatus;
  photoUrl?: string;
  beforePhoto?: string;
  workingPhoto?: string;
  afterPhoto?: string;
  reportedBy: string;
  assignedTeam?: string;
  teamContact?: string;
  reportedAt: string;
  updatedAt: string;
  proofSubmittedAt?: string;
  resolvedAt?: string;
  notes?: string[];
}

export type ResourceCategory = 
  | 'water'
  | 'food'
  | 'medical'
  | 'shelter'
  | 'electricity'
  | 'transport'
  | 'help_center';

export interface RecoveryResource {
  id: string;
  name: string;
  category: ResourceCategory;
  address: string;
  ward: string;
  distanceKm: number;
  status: 'available' | 'limited' | 'exhausted' | 'closed';
  isVerified: boolean;
  operatingHours: string;
  contactNumber: string;
  capacity?: string;
  coordinates: { x: number; y: number };
  lastUpdated: string;
  details: string;
}

export interface SOSAlert {
  id: string; // #SOS-2381
  emergencyType: string;
  victimName: string;
  location: string;
  ward: string;
  coordinates: { x: number; y: number };
  timestamp: string;
  severity: EmergencySeverity;
  batteryLevel: number;
  gpsAccuracy: string;
  networkRoute: 'Normal Gateway' | 'RescueMesh (3 Hops)' | 'RescueMesh (Relay-4)' | 'Direct Cellular';
  hopsCount: number;
  status: 'searching' | 'relaying' | 'delivered' | 'dispatched' | 'rescued';
  assignedUnit?: string;
}

export interface LocalUpdate {
  id: string;
  title: string;
  category: 'roads' | 'water' | 'electricity' | 'medical' | 'shelters' | 'transport';
  status: 'VERIFIED' | 'PENDING' | 'OUTDATED' | 'RESTORATION ONGOING' | 'OPERATIONAL' | 'CLOSED';
  statusType: 'success' | 'warning' | 'danger' | 'info';
  source: string;
  isVerified: boolean;
  content: string;
  affectedArea: string;
  timestamp: string;
}

export interface RecoveryTask {
  id: string;
  reportId: string;
  title: string;
  category: ReportCategory;
  location: string;
  assignedTeam: string;
  status: ReportStatus;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  teamLead: string;
  assignedAt: string;
  proofEvidence?: {
    before?: string;
    working?: string;
    after?: string;
    notes?: string;
    submittedAt?: string;
    verifiedBy?: string;
  };
}

export interface RecoveryChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  priority: 'essential' | 'recommended' | 'optional';
  actionRoute?: string;
  actionLabel?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'verified' | 'update' | 'resolved';
  timestamp: string;
  read: boolean;
  linkRoute?: string;
}

export interface ImpactNode {
  id: string;
  name: string;
  category: 'problem' | 'service' | 'secondary';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  affectedArea: string;
  iconName: string;
  children?: string[]; // IDs of impacted downstream nodes
  description: string;
}
