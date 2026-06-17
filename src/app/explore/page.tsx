'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Building2 as Building2Icon, Stethoscope as StethoscopeIcon, Pill as PillIcon, X, Hospital, Activity, Globe, Navigation, Video, Phone } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Hospital {
  id: string;
  name: string;
  type: 'Public' | 'Private' | 'Clinic';
  address: string;
  distance: number;
  rating: number;
  specialties: string[];
  openNow: boolean;
  latitude: number;
  longitude: number;
  phone: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  experience: number;
  rating: number;
  languages: string[];
  availableToday: boolean;
  avatar: string;
  telemedicine: boolean;
  phone: string;
}

interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: string;
  form: 'tablet' | 'capsule' | 'liquid';
  price: {
    pharmacyA: number;
    pharmacyB: number;
    pharmacyC: number;
  };
  inStock: {
    pharmacyA: boolean;
    pharmacyB: boolean;
    pharmacyC: boolean;
  };
  prescriptionRequired: boolean;
}

interface ExploreTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  phone: string;
  services: string[];
  latitude: number;
  longitude: number;
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('hospitals');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Hospital | Doctor | Medication | Pharmacy | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => {},
          { timeout: 5000 }
        );
      }
    } catch {}
  }, []);

  const hospitals: Hospital[] = [
    {
      id: 'h1',
      name: 'Cape Town General Hospital',
      type: 'Public',
      address: '123 Adderley Street, Cape Town Central',
      distance: 2.4,
      rating: 4.2,
      specialties: ['Cardiology', 'Pediatrics', 'ICU'],
      openNow: true,
      latitude: -33.9249,
      longitude: 18.4241,
      phone: '+27 21 123 4567',
    },
    {
      id: 'h2',
      name: 'Villa Health Centre',
      type: 'Private',
      address: '456 Green Point, Sea Point',
      distance: 4.1,
      rating: 4.7,
      specialties: ['Maternity', 'Dermatology', 'Orthopedic'],
      openNow: true,
      latitude: -33.9121,
      longitude: 18.3876,
      phone: '+27 21 234 5678',
    },
    {
      id: 'h3',
      name: 'Khayelitsha District Clinic',
      type: 'Public',
      address: '789 Steve Biko Road, Khayelitsha',
      distance: 6.8,
      rating: 4.0,
      specialties: ['General Practice', 'Pediatrics', 'HIV Care'],
      openNow: false,
      latitude: -34.0408,
      longitude: 18.6783,
      phone: '+27 21 345 6789',
    },
    {
      id: 'h4',
      name: 'Constantia Surgical Center',
      type: 'Private',
      address: '12 Constantia Main Road',
      distance: 5.2,
      rating: 4.9,
      specialties: ['Surgery', 'Ophthalmology', 'ENT'],
      openNow: true,
      latitude: -34.0198,
      longitude: 18.4235,
      phone: '+27 21 456 7890',
    },
    {
      id: 'h5',
      name: 'Groote Schuur Hospital',
      type: 'Public',
      address: 'Observatory, Cape Town',
      distance: 3.5,
      rating: 4.4,
      specialties: ['Cardiology', 'Neurology', 'Trauma', 'Transplant'],
      openNow: true,
      latitude: -33.9425,
      longitude: 18.4628,
      phone: '+27 21 567 8901',
    },
    {
      id: 'h6',
      name: 'MediClinic Cape Town',
      type: 'Private',
      address: '21 Hof Street, Gardens',
      distance: 1.8,
      rating: 4.6,
      specialties: ['General Medicine', 'Radiology', 'Cardiology'],
      openNow: true,
      latitude: -33.9327,
      longitude: 18.4132,
      phone: '+27 21 678 9012',
    },
  ];

  const doctors: Doctor[] = [
    {
      id: 'd1',
      name: 'Dr. Thabo Mbeki',
      specialty: 'Cardiologist',
      hospital: 'Cape Town General Hospital',
      experience: 18,
      rating: 4.8,
      languages: ['English', 'Xhosa', 'Afrikaans'],
      availableToday: true,
      avatar: '/avatars/doctor1.jpg',
      telemedicine: true,
      phone: '+27 21 123 4567',
    },
    {
      id: 'd2',
      name: 'Dr. Sarah Botha',
      specialty: 'Pediatrician',
      hospital: 'Villa Health Centre',
      experience: 12,
      rating: 4.7,
      languages: ['English', 'Afrikaans'],
      availableToday: true,
      avatar: '/avatars/doctor2.jpg',
      telemedicine: true,
      phone: '+27 21 234 5678',
    },
    {
      id: 'd3',
      name: 'Dr. Naledi Molefe',
      specialty: 'General Practitioner',
      hospital: 'Khayelitsha District Clinic',
      experience: 8,
      rating: 4.5,
      languages: ['English', 'Xhosa', 'Zulu'],
      availableToday: false,
      avatar: '/avatars/doctor3.jpg',
      telemedicine: false,
      phone: '+27 21 345 6789',
    },
    {
      id: 'd4',
      name: 'Dr. James Wilson',
      specialty: 'Orthopedic Surgeon',
      hospital: 'Constantia Surgical Center',
      experience: 22,
      rating: 4.9,
      languages: ['English'],
      availableToday: true,
      avatar: '/avatars/doctor4.jpg',
      telemedicine: false,
      phone: '+27 21 456 7890',
    },
    {
      id: 'd5',
      name: 'Dr. Priya Patel',
      specialty: 'Neurologist',
      hospital: 'Groote Schuur Hospital',
      experience: 15,
      rating: 4.6,
      languages: ['English', 'Hindi'],
      availableToday: true,
      avatar: '/avatars/doctor5.jpg',
      telemedicine: true,
      phone: '+27 21 567 8901',
    },
    {
      id: 'd6',
      name: 'Dr. Kwame Nkosi',
      specialty: 'Dermatologist',
      hospital: 'MediClinic Cape Town',
      experience: 10,
      rating: 4.4,
      languages: ['English', 'Zulu'],
      availableToday: false,
      avatar: '/avatars/doctor6.jpg',
      telemedicine: true,
      phone: '+27 21 678 9012',
    },
  ];

  const medications: Medication[] = [
    {
      id: 'm1',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin Trihydrate',
      category: 'Antibiotic',
      form: 'capsule',
      price: { pharmacyA: 45, pharmacyB: 42, pharmacyC: 48 },
      inStock: { pharmacyA: true, pharmacyB: true, pharmacyC: false },
      prescriptionRequired: true,
    },
    {
      id: 'm2',
      name: 'Losartan 50mg',
      genericName: 'Losartan Potassium',
      category: 'Anti-hypertensive',
      form: 'tablet',
      price: { pharmacyA: 78, pharmacyB: 75, pharmacyC: 80 },
      inStock: { pharmacyA: true, pharmacyB: true, pharmacyC: true },
      prescriptionRequired: true,
    },
    {
      id: 'm3',
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      category: 'NSAID',
      form: 'tablet',
      price: { pharmacyA: 22, pharmacyB: 19, pharmacyC: 25 },
      inStock: { pharmacyA: true, pharmacyB: true, pharmacyC: true },
      prescriptionRequired: false,
    },
    {
      id: 'm4',
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      category: 'PPI',
      form: 'capsule',
      price: { pharmacyA: 65, pharmacyB: 60, pharmacyC: 68 },
      inStock: { pharmacyA: false, pharmacyB: true, pharmacyC: true },
      prescriptionRequired: false,
    },
    {
      id: 'm5',
      name: 'Metformin 500mg',
      genericName: 'Metformin Hydrochloride',
      category: 'Anti-diabetic',
      form: 'tablet',
      price: { pharmacyA: 35, pharmacyB: 30, pharmacyC: 38 },
      inStock: { pharmacyA: true, pharmacyB: true, pharmacyC: true },
      prescriptionRequired: true,
    },
    {
      id: 'm6',
      name: 'Atorvastatin 10mg',
      genericName: 'Atorvastatin Calcium',
      category: 'Statin',
      form: 'tablet',
      price: { pharmacyA: 55, pharmacyB: 50, pharmacyC: 58 },
      inStock: { pharmacyA: true, pharmacyB: false, pharmacyC: true },
      prescriptionRequired: true,
    },
  ];

  const pharmacies: Pharmacy[] = [
    {
      id: 'p1',
      name: 'HealthFirst Pharmacy',
      address: '123 Main Street, Cape Town CBD',
      distance: 1.2,
      rating: 4.5,
      phone: '+27 21 111 1111',
      services: ['Prescription Fulfillment', 'Home Delivery', 'Vaccinations', 'Health Screening'],
      latitude: -33.9250,
      longitude: 18.4220,
    },
    {
      id: 'p2',
      name: 'MedPlus Pharmacy',
      address: '456 Long Street, Gardens',
      distance: 2.3,
      rating: 4.3,
      phone: '+27 21 222 2222',
      services: ['Prescription Fulfillment', 'Compounding', 'Home Delivery'],
      latitude: -33.9300,
      longitude: 18.4150,
    },
    {
      id: 'p3',
      name: 'Cape Chemist',
      address: '789 Sea Point Main Road',
      distance: 4.0,
      rating: 4.7,
      phone: '+27 21 333 3333',
      services: ['Prescription Fulfillment', 'Home Delivery', 'Vaccinations', 'Travel Clinic', 'Wellness Products'],
      latitude: -33.9150,
      longitude: 18.3900,
    },
    {
      id: 'p4',
      name: 'Kwa\'s Pharmacy',
      address: '10 Khayelitsha Drive',
      distance: 7.5,
      rating: 4.1,
      phone: '+27 21 444 4444',
      services: ['Prescription Fulfillment', 'Chronic Medication Supply'],
      latitude: -34.0380,
      longitude: 18.6800,
    },
    {
      id: 'p5',
      name: 'Clicks Pharmacy',
      address: 'Cavendish Square, Claremont',
      distance: 5.8,
      rating: 4.4,
      phone: '+27 21 555 5555',
      services: ['Prescription Fulfillment', 'Vaccinations', 'Health Screening', 'Wellness Products'],
      latitude: -33.9790,
      longitude: 18.4650,
    },
    {
      id: 'p6',
      name: 'Dis-Chem Pharmacy',
      address: 'V&A Waterfront',
      distance: 1.5,
      rating: 4.6,
      phone: '+27 21 666 6666',
      services: ['Prescription Fulfillment', 'Home Delivery', 'Vaccinations', 'Compounding', 'Health Screening', 'Optical'],
      latitude: -33.9030,
      longitude: 18.4210,
    },
  ];

  const tabs: ExploreTab[] = [
    { id: 'hospitals', label: 'Hospitals', icon: <Hospital size={16} /> },
    { id: 'doctors', label: 'Doctors', icon: <StethoscopeIcon size={16} /> },
    { id: 'pharmacies', label: 'Pharmacies', icon: <Activity size={16} /> },
    { id: 'medications', label: 'Medications', icon: <PillIcon size={16} /> },
  ];

  const getFilteredResults = () => {
    const q = searchQuery.toLowerCase();
    if (activeTab === 'hospitals') {
      return hospitals.filter(h => h.name.toLowerCase().includes(q) || h.specialties.some(s => s.toLowerCase().includes(q)) || h.address.toLowerCase().includes(q));
    }
    if (activeTab === 'doctors') {
      return doctors.filter(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q) || d.hospital.toLowerCase().includes(q));
    }
    if (activeTab === 'pharmacies') {
      return pharmacies.filter(p => p.name.toLowerCase().includes(q) || p.services.some(s => s.toLowerCase().includes(q)));
    }
    if (activeTab === 'medications') {
      return medications.filter(m => m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
    }
    return [];
  };

  const handleItemClick = (item: Hospital | Doctor | Medication | Pharmacy) => {
    setSelectedItem(item);
    setShowLightbox(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} className={i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-400'} />
        ))}
        <span className="text-xs text-gray-400 ml-1">{rating}</span>
      </div>
    );
  };

  const renderHospitalCard = (h: Hospital) => (
    <button key={h.id} onClick={() => handleItemClick(h)} className="text-left w-full card p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-sm">{h.name}</h3>
          <span className={`pill-badge mt-1 ${h.type === 'Public' ? 'pill-green' : h.type === 'Private' ? 'pill-blue' : 'pill-amber'}`}>{h.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${h.openNow ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400">{h.openNow ? 'Open' : 'Closed'}</span>
        </div>
      </div>
      <div className="flex items-start gap-1.5 mb-2">
        <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
        <span className="text-xs text-gray-500">{h.address}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Navigation size={12} className="text-blue-500" />
          <span className="text-xs font-medium text-blue-500">{h.distance} km</span>
        </div>
        {renderStars(h.rating)}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {h.specialties.slice(0, 3).map(s => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">{s}</span>
        ))}
        {h.specialties.length > 3 && <span className="text-xs text-gray-400">+{h.specialties.length - 3}</span>}
      </div>
    </button>
  );

  const renderDoctorCard = (d: Doctor) => (
    <button key={d.id} onClick={() => handleItemClick(d)} className="text-left w-full card p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {d.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">{d.name}</h3>
          <p className="text-xs text-blue-500 font-medium">{d.specialty}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <Building2Icon size={12} className="text-gray-400" />
        <span className="text-xs text-gray-500">{d.hospital}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{d.experience} yrs exp.</span>
        {renderStars(d.rating)}
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          {d.telemedicine && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center gap-1">
              <Video size={10} /> Tele
            </span>
          )}
          {d.availableToday && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">Today</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{d.languages.join(', ')}</span>
      </div>
    </button>
  );

  const renderPharmacyCard = (p: Pharmacy) => (
    <button key={p.id} onClick={() => handleItemClick(p)} className="text-left w-full card p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">{p.name}</h3>
        {renderStars(p.rating)}
      </div>
      <div className="flex items-start gap-1.5 mb-2">
        <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
        <span className="text-xs text-gray-500">{p.address}</span>
      </div>
      <div className="flex items-center gap-1 mb-3">
        <Navigation size={12} className="text-blue-500" />
        <span className="text-xs font-medium text-blue-500">{p.distance} km</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {p.services.slice(0, 3).map(s => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">{s}</span>
        ))}
        {p.services.length > 3 && <span className="text-xs text-gray-400">+{p.services.length - 3}</span>}
      </div>
    </button>
  );

  const renderMedicationCard = (m: Medication) => {
    const lowestPrice = Math.min(m.price.pharmacyA, m.price.pharmacyB, m.price.pharmacyC);
    return (
      <button key={m.id} onClick={() => handleItemClick(m)} className="text-left w-full card p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-sm">{m.name}</h3>
            <p className="text-xs text-gray-400">{m.genericName}</p>
          </div>
          <span className={`pill-badge ${m.prescriptionRequired ? 'pill-amber' : 'pill-green'}`}>{m.prescriptionRequired ? 'RX' : 'OTC'}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{m.category}</span>
          <span className="text-xs text-gray-400">{m.form}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">R{lowestPrice}</span>
            <span className="text-xs text-gray-400 ml-1">lowest price</span>
          </div>
          <span className="text-xs text-gray-400">{m.inStock.pharmacyA && m.inStock.pharmacyB && m.inStock.pharmacyC ? 'In Stock' : 'Limited Stock'}</span>
        </div>
      </button>
    );
  };

  const renderLightboxContent = () => {
    if (!selectedItem) return null;
    if (activeTab === 'hospitals') {
      const h = selectedItem as Hospital;
      return (
        <div className="p-6 w-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{h.name}</h2>
              <span className="pill-badge mt-1 inline-block">{h.type}</span>
            </div>
            <button onClick={() => setShowLightbox(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-start gap-1.5 mb-3">
            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <span className="text-sm">{h.address}</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Navigation size={14} className="text-blue-500" />
              <span className="text-sm font-medium">{h.distance} km away</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-gray-400" />
              <span className="text-sm">{h.phone}</span>
            </div>
            {renderStars(h.rating)}
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Specialties</p>
            <div className="flex flex-wrap gap-1.5">
              {h.specialties.map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">{s}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (activeTab === 'doctors') {
      const d = selectedItem as Doctor;
      return (
        <div className="p-6 w-full">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {d.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{d.name}</h2>
                <p className="text-blue-500 font-medium">{d.specialty}</p>
              </div>
            </div>
            <button onClick={() => setShowLightbox(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <Building2Icon size={14} className="text-gray-400" />
            <span className="text-sm">{d.hospital}</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-gray-500">{d.experience} years experience</span>
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-gray-400" />
              <span className="text-sm">{d.phone}</span>
            </div>
            {renderStars(d.rating)}
          </div>
          <div className="flex items-center gap-2 mb-4">
            {d.telemedicine && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center gap-1">
                <Video size={12} /> Telemedicine Available
              </span>
            )}
            {d.availableToday && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">Available Today</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Languages</p>
            <div className="flex flex-wrap gap-1.5">
              {d.languages.map(l => (
                <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{l}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (activeTab === 'pharmacies') {
      const p = selectedItem as Pharmacy;
      return (
        <div className="p-6 w-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{p.name}</h2>
              {renderStars(p.rating)}
            </div>
            <button onClick={() => setShowLightbox(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-start gap-1.5 mb-2">
            <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <span className="text-sm">{p.address}</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Navigation size={14} className="text-blue-500" />
              <span className="text-sm font-medium">{p.distance} km away</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={14} className="text-gray-400" />
              <span className="text-sm">{p.phone}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Services</p>
            <div className="flex flex-wrap gap-1.5">
              {p.services.map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">{s}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (activeTab === 'medications') {
      const m = selectedItem as Medication;
      const lowestPrice = Math.min(m.price.pharmacyA, m.price.pharmacyB, m.price.pharmacyC);
      return (
        <div className="p-6 w-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{m.name}</h2>
              <p className="text-sm text-gray-400">{m.genericName}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="pill-badge">{m.category}</span>
              <button onClick={() => setShowLightbox(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`pill-badge ${m.prescriptionRequired ? 'pill-amber' : 'pill-green'}`}>{m.prescriptionRequired ? 'Prescription Required' : 'Over the Counter'}</span>
            <span className="text-sm text-gray-400">{m.form}</span>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Pricing</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span>HealthFirst Pharmacy</span>
                <span className={m.price.pharmacyA === lowestPrice ? 'text-green-500 font-semibold' : ''}>R{m.price.pharmacyA} {!m.inStock.pharmacyA && <span className="text-red-400 text-xs ml-1">(Out of Stock)</span>}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>MedPlus Pharmacy</span>
                <span className={m.price.pharmacyB === lowestPrice ? 'text-green-500 font-semibold' : ''}>R{m.price.pharmacyB} {!m.inStock.pharmacyB && <span className="text-red-400 text-xs ml-1">(Out of Stock)</span>}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Cape Chemist</span>
                <span className={m.price.pharmacyC === lowestPrice ? 'text-green-500 font-semibold' : ''}>R{m.price.pharmacyC} {!m.inStock.pharmacyC && <span className="text-red-400 text-xs ml-1">(Out of Stock)</span>}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="pb-8 px-0 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Explore Healthcare</h1>
            <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Find hospitals, doctors, pharmacies and medications near you</p>
          </div>
          <div className="flex items-center gap-3">
              <div className="relative flex-1 md:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 z-[1]" style={{ color: 'var(--foreground-tertiary)' }} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-apple text-sm w-full md:w-64"
                  style={{ paddingLeft: 36, paddingTop: 10, paddingBottom: 10 }}
                />
              </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="btn-secondary text-xs px-3 py-2"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{showMap ? 'List' : 'Map'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                ? 'text-white' : ''
              }`}
              style={activeTab === tab.id ? { background: 'var(--accent)' } : { background: 'var(--card-bg)', color: 'var(--foreground-secondary)' }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {showMap ? (
          <div className="rounded-xl overflow-hidden card" style={{ height: 500, position: 'relative' }}>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=18.3%2C-34.1%2C18.7%2C-33.8&amp;layer=mapnik&amp;marker=-33.9249%2C18.4241"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Map"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredResults().map((item) => {
              if (activeTab === 'hospitals') return renderHospitalCard(item as Hospital);
              if (activeTab === 'doctors') return renderDoctorCard(item as Doctor);
              if (activeTab === 'pharmacies') return renderPharmacyCard(item as Pharmacy);
              if (activeTab === 'medications') return renderMedicationCard(item as Medication);
              return null;
            })}
          </div>
        )}

        {getFilteredResults().length === 0 && (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto mb-4" style={{ color: 'var(--foreground-tertiary)' }} />
            <h3 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>No results found</h3>
            <p style={{ color: 'var(--foreground-secondary)' }}>Try adjusting your search or filters</p>
          </div>
        )}

        {showLightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowLightbox(false)}>
            <div
              className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card p-0"
              onClick={(e) => e.stopPropagation()}
            >
              {renderLightboxContent()}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
