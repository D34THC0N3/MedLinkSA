export type UserRole = 'patient' | 'provider' | 'facility' | 'admin' | 'pharmacy';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
}

export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  accent: 'teal' | 'blue' | 'amber' | 'green' | 'red' | 'purple';
  delta?: { value: string; positive: boolean };
  progress?: number;
  subtext?: string;
}

export interface AuditLog {
  id: string;
  message: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
}

export interface VerificationItem {
  id: string;
  name: string;
  credentialType: string;
  licenseStatus: 'Clear' | 'Done' | 'Approved' | 'Pending';
  backgroundStatus: 'Clear' | 'Done' | 'Pending';
  avatar?: string;
}

export interface SystemAlert {
  id: string;
  message: string;
  severity: 'warning' | 'critical' | 'resolved';
  timestamp: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  type: 'In-Person' | 'Telehealth';
  time: string;
  status: 'Arrived' | 'In Progress' | 'Scheduled';
}

export interface ClinicalNote {
  id: string;
  doctorName: string;
  patientName: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface HighRiskPatient {
  id: string;
  name: string;
  reason: string;
  severity: 'red' | 'amber' | 'yellow';
}

export interface PrescriptionRequest {
  id: string;
  patientName: string;
  medication: string;
  type: 'renewal' | 'new';
  status: 'pending' | 'filled' | 'verified';
}

export interface Message {
  id: string;
  senderName: string;
  senderAvatar?: string;
  preview: string;
  timestamp: string;
  unread: boolean;
}

export interface FloorData {
  id: string;
  ward: string;
  section: string;
  occupancy: number;
  total: number;
}

export interface StaffShift {
  id: string;
  name: string;
  staffCount: number;
  attendance: number;
  type: 'day' | 'night' | 'oncall';
}

export interface Department {
  id: string;
  name: string;
  patientsWaiting: number;
  avgWaitTime: number;
  queuePosition: number;
}

export interface MedicationPrice {
  id: string;
  name: string;
  genericName: string;
  category: string;
  form: string;
  prices: { pharmacy: string; price: number; inStock: boolean }[];
  lowestPrice: number;
  prescriptionRequired: boolean;
}

export interface MapItem {
  id: string;
  name: string;
  type: 'hospitals' | 'doctors' | 'pharmacies' | 'medications';
  lat?: number;
  lng?: number;
  area?: string;
  rating?: number;
  fee?: string;
  tag?: string;
  specialty?: string;
  avail?: string;
  hours?: string;
  delivery?: boolean;
  er?: boolean;
  priceRange?: string;
  brand?: string;
  price?: number;
  compare?: string;
  pharmacies?: number;
}
