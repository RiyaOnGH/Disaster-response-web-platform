import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  NetworkStatus, 
  SOSAlert, 
  CitizenReport, 
  RecoveryResource, 
  LocalUpdate, 
  RecoveryChecklistItem, 
  NotificationItem, 
  RecoveryTask,
  ReportStatus 
} from '../types';
import { 
  INITIAL_SOS_ALERTS, 
  INITIAL_REPORTS, 
  INITIAL_RESOURCES, 
  INITIAL_UPDATES, 
  INITIAL_CHECKLIST, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'success' | 'info' | 'warning';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  networkStatus: NetworkStatus;
  setNetworkStatus: (status: NetworkStatus) => void;
  currentLocation: string;
  
  // SOS
  sosAlerts: SOSAlert[];
  userSos: SOSAlert | null;
  triggerSos: (emergencyType: string, victimName?: string) => Promise<SOSAlert>;
  cancelSos: () => void;
  updateSosStatus: (id: string, status: SOSAlert['status']) => void;
  
  // Reports
  reports: CitizenReport[];
  addReport: (data: Omit<CitizenReport, 'id' | 'reportedAt' | 'updatedAt' | 'status' | 'reportedBy'>) => CitizenReport;
  updateReportStatus: (id: string, status: ReportStatus, proofData?: { beforePhoto?: string; workingPhoto?: string; afterPhoto?: string; note?: string }) => void;
  
  // Resources
  resources: RecoveryResource[];
  selectedResource: RecoveryResource | null;
  setSelectedResource: (res: RecoveryResource | null) => void;
  
  // Updates
  updates: LocalUpdate[];
  addUpdate: (newUpdate: Omit<LocalUpdate, 'id' | 'timestamp'>) => void;
  
  // Checklist
  checklist: RecoveryChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  recoveryPercentage: number;
  
  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('rb_role') as UserRole) || 'citizen';
  });

  const [networkStatus, setNetworkStatusState] = useState<NetworkStatus>(() => {
    return (localStorage.getItem('rb_network') as NetworkStatus) || 'connected';
  });

  const [currentLocation] = useState('Ward 12, Patna');

  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(() => {
    const saved = localStorage.getItem('rb_sos_alerts');
    return saved ? JSON.parse(saved) : INITIAL_SOS_ALERTS;
  });

  const [userSos, setUserSos] = useState<SOSAlert | null>(() => {
    const saved = localStorage.getItem('rb_user_sos');
    return saved ? JSON.parse(saved) : null;
  });

  const [reports, setReports] = useState<CitizenReport[]>(() => {
    const saved = localStorage.getItem('rb_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [resources] = useState<RecoveryResource[]>(INITIAL_RESOURCES);
  const [selectedResource, setSelectedResource] = useState<RecoveryResource | null>(null);

  const [updates, setUpdates] = useState<LocalUpdate[]>(() => {
    const saved = localStorage.getItem('rb_updates');
    return saved ? JSON.parse(saved) : INITIAL_UPDATES;
  });

  const [checklist, setChecklist] = useState<RecoveryChecklistItem[]>(() => {
    const saved = localStorage.getItem('rb_checklist');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('rb_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rb_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('rb_network', networkStatus);
  }, [networkStatus]);

  useEffect(() => {
    localStorage.setItem('rb_sos_alerts', JSON.stringify(sosAlerts));
  }, [sosAlerts]);

  useEffect(() => {
    if (userSos) {
      localStorage.setItem('rb_user_sos', JSON.stringify(userSos));
    } else {
      localStorage.removeItem('rb_user_sos');
    }
  }, [userSos]);

  useEffect(() => {
    localStorage.setItem('rb_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('rb_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('rb_updates', JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    localStorage.setItem('rb_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helpers
  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    showToast('Role Switched', `Active view changed to ${newRole.toUpperCase()}`, 'info');
  };

  const setNetworkStatus = (status: NetworkStatus) => {
    setNetworkStatusState(status);
    if (status === 'offline') {
      showToast('Network Disconnected', 'Normal cellular/WiFi offline. RescueMesh peer routing active.', 'warning');
    } else if (status === 'limited') {
      showToast('Limited Connection', 'Low bandwidth. Text and RescueMesh packets prioritized.', 'warning');
    } else {
      showToast('Network Restored', 'Connected to municipal emergency broadband.', 'success');
    }
  };

  // SOS Action
  const triggerSos = async (emergencyType: string, victimName = 'Shikha Verma (Self)'): Promise<SOSAlert> => {
    const isOffline = networkStatus === 'offline';
    const newAlert: SOSAlert = {
      id: `#SOS-${Math.floor(2000 + Math.random() * 8000)}`,
      emergencyType,
      victimName,
      location: 'Near Plot 44, Lane 3, Kankarbagh Main',
      ward: 'Ward 12, Patna',
      coordinates: { x: 42 + Math.floor(Math.random() * 8), y: 50 + Math.floor(Math.random() * 8) },
      timestamp: 'Just now',
      severity: 'critical',
      batteryLevel: 64,
      gpsAccuracy: '±4 meters',
      networkRoute: isOffline ? 'RescueMesh (3 Hops)' : 'Normal Gateway',
      hopsCount: isOffline ? 3 : 1,
      status: 'searching',
      assignedUnit: 'NDRF Quick Triage Unit'
    };

    setUserSos(newAlert);
    setSosAlerts((prev) => [newAlert, ...prev]);

    // Add alert notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: '🚨 Emergency SOS Dispatched',
      message: `Your SOS for "${emergencyType}" is routing to the response command.`,
      type: 'critical',
      timestamp: 'Just now',
      read: false,
      linkRoute: '/rescue-mesh'
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast('🚨 SOS Dispatched', 'Emergency beacon active. Routing through RescueMesh.', 'emergency');

    return newAlert;
  };

  const cancelSos = () => {
    setUserSos(null);
    showToast('SOS Beacon Cancelled', 'Emergency call has been stand-down.', 'info');
  };

  const updateSosStatus = (id: string, status: SOSAlert['status']) => {
    setSosAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, status } : alert))
    );
    if (userSos && userSos.id === id) {
      setUserSos((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Reports
  const addReport = (data: Omit<CitizenReport, 'id' | 'reportedAt' | 'updatedAt' | 'status' | 'reportedBy'>): CitizenReport => {
    const nextNumber = 1045 + reports.length + 1;
    const newReport: CitizenReport = {
      ...data,
      id: `#RB-${nextNumber}`,
      status: 'reported',
      reportedBy: 'Shikha Verma (Citizen)',
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'Just now',
      notes: [`${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - Citizen report logged with geo-coordinates`]
    };

    setReports((prev) => [newReport, ...prev]);

    // Notification
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: '📝 New Problem Report Submitted',
      message: `Report ${newReport.id} for "${newReport.title}" received in triage queue.`,
      type: 'update',
      timestamp: 'Just now',
      read: false,
      linkRoute: '/dashboard/reports'
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast('Report Logged', `Report ${newReport.id} successfully queued for verification.`, 'success');

    return newReport;
  };

  const updateReportStatus = (
    id: string, 
    status: ReportStatus, 
    proofData?: { beforePhoto?: string; workingPhoto?: string; afterPhoto?: string; note?: string }
  ) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== id) return rep;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedNotes = rep.notes ? [...rep.notes] : [];
        if (proofData?.note) {
          updatedNotes.push(`${now} - ${proofData.note}`);
        } else {
          updatedNotes.push(`${now} - Status transitioned to ${status.toUpperCase()}`);
        }

        return {
          ...rep,
          status,
          updatedAt: 'Just now',
          notes: updatedNotes,
          beforePhoto: proofData?.beforePhoto || rep.beforePhoto,
          workingPhoto: proofData?.workingPhoto || rep.workingPhoto,
          afterPhoto: proofData?.afterPhoto || rep.afterPhoto,
          proofSubmittedAt: status === 'proof_submitted' ? now : rep.proofSubmittedAt,
          resolvedAt: status === 'resolved' ? now : rep.resolvedAt
        };
      })
    );

    showToast('Task Status Updated', `Report ${id} moved to ${status.replace('_', ' ').toUpperCase()}`, 'info');
  };

  // Updates
  const addUpdate = (newUpdate: Omit<LocalUpdate, 'id' | 'timestamp'>) => {
    const updateItem: LocalUpdate = {
      ...newUpdate,
      id: 'upd-' + Date.now(),
      timestamp: 'Just now'
    };
    setUpdates((prev) => [updateItem, ...prev]);
    showToast('Official Update Published', updateItem.title, 'success');
  };

  // Checklist
  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const recoveryPercentage = Math.round((completedCount / checklist.length) * 100);

  // Notifications
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        networkStatus,
        setNetworkStatus,
        currentLocation,
        sosAlerts,
        userSos,
        triggerSos,
        cancelSos,
        updateSosStatus,
        reports,
        addReport,
        updateReportStatus,
        resources,
        selectedResource,
        setSelectedResource,
        updates,
        addUpdate,
        checklist,
        toggleChecklistItem,
        recoveryPercentage,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
