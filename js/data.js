/* ============================================
   MedLink SA — Mock Data & Storage
   ============================================ */

/**
 * Mock data initial state
 */
const INITIAL_DATA = {
  users: [
    {
      id: 'usr_pat_001',
      role: 'patient',
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'JD',
      phone: '+27 82 123 4567',
      dob: '1985-04-12',
      bloodType: 'O+',
      medicalAid: 'Discovery Health',
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Hypertension']
    },
    {
      id: 'usr_doc_001',
      role: 'doctor',
      email: 'dr.smith@medlink.sa',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Smith',
      title: 'Dr.',
      specialty: 'General Practitioner',
      avatar: 'SS',
      hospital: 'hosp_001',
      verified: true
    },
    {
      id: 'usr_phar_001',
      role: 'pharmacy',
      email: 'pharmacy@clicks.co.za',
      password: 'password123',
      name: 'Clicks Pharmacy Sandton',
      avatar: 'CP',
      verified: true
    },
    {
      id: 'usr_hosp_001',
      role: 'hospital',
      email: 'admin@mediclinic.co.za',
      password: 'password123',
      name: 'Mediclinic Sandton',
      avatar: 'MS',
      verified: true
    },
    {
      id: 'usr_admin_001',
      role: 'admin',
      email: 'admin@medlink.sa',
      password: 'admin123',
      firstName: 'System',
      lastName: 'Administrator',
      avatar: 'SA'
    }
  ],
  appointments: [
    {
      id: 'apt_001',
      patientId: 'usr_pat_001',
      doctorId: 'usr_doc_001',
      date: '2026-06-15',
      time: '09:00',
      type: 'Routine Checkup',
      status: 'upcoming',
      isTelehealth: false
    },
    {
      id: 'apt_002',
      patientId: 'usr_pat_001',
      doctorId: 'usr_doc_001',
      date: '2026-06-10',
      time: '14:30',
      type: 'Follow-up (Hypertension)',
      status: 'completed',
      isTelehealth: true,
      notes: 'Blood pressure is stable. Continue current medication.'
    }
  ],
  prescriptions: [
    {
      id: 'rx_001',
      patientId: 'usr_pat_001',
      doctorId: 'usr_doc_001',
      dateIssued: '2026-06-10',
      medication: 'Amlodipine 5mg',
      dosage: '1 tablet daily',
      frequency: 'Morning',
      status: 'active',
      refillsRemaining: 2,
      pharmacyId: 'usr_phar_001'
    },
    {
      id: 'rx_002',
      patientId: 'usr_pat_001',
      doctorId: 'usr_doc_001',
      dateIssued: '2026-05-01',
      medication: 'Amoxicillin 500mg',
      dosage: '1 capsule three times a day',
      frequency: 'Morning, Afternoon, Evening',
      status: 'completed',
      refillsRemaining: 0,
      pharmacyId: 'usr_phar_001'
    }
  ],
  medications: [
    {
      id: 'med_001',
      patientId: 'usr_pat_001',
      rxId: 'rx_001',
      name: 'Amlodipine',
      strength: '5mg',
      time: '08:00',
      takenToday: true,
      adherence: 95
    }
  ],
  medicalRecords: [
    {
      id: 'rec_001',
      patientId: 'usr_pat_001',
      doctorId: 'usr_doc_001',
      date: '2026-01-15',
      type: 'Diagnosis',
      title: 'Essential Hypertension',
      description: 'Patient diagnosed with primary hypertension. Started on Amlodipine 5mg daily.',
      attachments: []
    },
    {
      id: 'rec_002',
      patientId: 'usr_pat_001',
      doctorId: 'usr_doc_001',
      date: '2026-06-05',
      type: 'Lab Results',
      title: 'Complete Blood Count & Lipid Panel',
      description: 'Cholesterol levels slightly elevated. Recommend dietary changes.',
      attachments: ['lipid_panel_20260605.pdf']
    }
  ],
  healthMetrics: [
    {
      patientId: 'usr_pat_001',
      date: '2026-06-01',
      bloodPressure: '135/85',
      heartRate: 72,
      weight: 82.5,
      bloodSugar: 5.4
    },
    {
      patientId: 'usr_pat_001',
      date: '2026-06-05',
      bloodPressure: '130/80',
      heartRate: 70,
      weight: 82.1,
      bloodSugar: 5.2
    },
    {
      patientId: 'usr_pat_001',
      date: '2026-06-07',
      bloodPressure: '128/78',
      heartRate: 68,
      weight: 81.8,
      bloodSugar: 5.3
    }
  ],
  hospitalBeds: [
    { id: 'bed_001', ward: 'General A', number: 'A01', status: 'occupied', patientId: 'usr_pat_xxx' },
    { id: 'bed_002', ward: 'General A', number: 'A02', status: 'available', patientId: null },
    { id: 'bed_003', ward: 'ICU', number: 'I01', status: 'occupied', patientId: 'usr_pat_yyy' },
    { id: 'bed_004', ward: 'ICU', number: 'I02', status: 'maintenance', patientId: null }
  ],
  pharmacyInventory: [
    { id: 'inv_001', medication: 'Amoxicillin 500mg', stock: 1500, threshold: 500, expiry: '2027-12-01' },
    { id: 'inv_002', medication: 'Amlodipine 5mg', stock: 320, threshold: 500, expiry: '2028-06-15' },
    { id: 'inv_003', medication: 'Metformin 850mg', stock: 2100, threshold: 1000, expiry: '2027-08-20' },
    { id: 'inv_004', medication: 'Ibuprofen 400mg', stock: 50, threshold: 200, expiry: '2026-07-01' }
  ],
  messages: [
    {
      id: 'msg_001',
      senderId: 'usr_doc_001',
      receiverId: 'usr_pat_001',
      date: '2026-06-06T10:30:00Z',
      text: 'Hi John, your recent blood test results look good. Just try to reduce sodium intake.',
      read: false
    }
  ]
};

/**
 * Data Storage Manager
 */
class DataStore {
  constructor() {
    this.init();
  }

  init() {
    // Initialize if empty
    if (!localStorage.getItem('medlink_db')) {
      localStorage.setItem('medlink_db', JSON.stringify(INITIAL_DATA));
      console.log('Database initialized with mock data.');
    }
  }

  // --- Generic Getters/Setters ---

  getDb() {
    return JSON.parse(localStorage.getItem('medlink_db') || '{}');
  }

  saveDb(db) {
    localStorage.setItem('medlink_db', JSON.stringify(db));
  }

  getTable(tableName) {
    const db = this.getDb();
    return db[tableName] || [];
  }

  saveTable(tableName, data) {
    const db = this.getDb();
    db[tableName] = data;
    this.saveDb(db);
  }

  // --- Specific Operations ---

  getUserById(id) {
    return this.getTable('users').find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.getTable('users').find(u => u.email === email);
  }

  getAppointmentsForUser(userId, role = 'patient') {
    const appts = this.getTable('appointments');
    return appts.filter(a => role === 'patient' ? a.patientId === userId : a.doctorId === userId);
  }

  getPrescriptionsForPatient(patientId) {
    return this.getTable('prescriptions').filter(p => p.patientId === patientId);
  }

  getPrescriptionsForDoctor(doctorId) {
    return this.getTable('prescriptions').filter(p => p.doctorId === doctorId);
  }

  getPrescriptionsForPharmacy(pharmacyId) {
    return this.getTable('prescriptions').filter(p => p.pharmacyId === pharmacyId);
  }

  getMedicationsForPatient(patientId) {
    return this.getTable('medications').filter(m => m.patientId === patientId);
  }

  getMedicalRecordsForPatient(patientId) {
    return this.getTable('medicalRecords').filter(r => r.patientId === patientId);
  }

  getHealthMetrics(patientId) {
    return this.getTable('healthMetrics').filter(m => m.patientId === patientId);
  }

  getHospitalBeds() {
    return this.getTable('hospitalBeds');
  }

  getPharmacyInventory() {
    return this.getTable('pharmacyInventory');
  }

  getMessagesForUser(userId) {
    return this.getTable('messages').filter(m => m.receiverId === userId || m.senderId === userId);
  }

  // Add a new record
  addRecord(tableName, record) {
    const table = this.getTable(tableName);
    // Generate simple ID
    record.id = `${tableName.substring(0, 3)}_${Date.now()}`;
    table.push(record);
    this.saveTable(tableName, table);
    return record;
  }

  // Update a record
  updateRecord(tableName, id, updates) {
    const table = this.getTable(tableName);
    const index = table.findIndex(r => r.id === id);
    if (index !== -1) {
      table[index] = { ...table[index], ...updates };
      this.saveTable(tableName, table);
      return table[index];
    }
    return null;
  }

  // Reset database (for testing)
  resetDatabase() {
    localStorage.setItem('medlink_db', JSON.stringify(INITIAL_DATA));
    console.log('Database reset to initial mock data.');
  }
}

// Global instance
window.db = new DataStore();
