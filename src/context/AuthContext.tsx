import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole, email?: string, name?: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  registerUser: (profile: Partial<UserProfile>) => void;
}

const SAMPLE_USERS: Record<UserRole, UserProfile> = {
  farmer: {
    id: 'usr-farmer-01',
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@agritech.in',
    phone: '+91 98450 12345',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    location: 'Mandya / Kolar',
    state: 'Karnataka',
    preferredLanguage: 'kn',
    rating: 4.9,
    verified: true,
    farmName: 'GreenFields Organic Agro',
    farmSizeAcres: 14.5,
    cropSpecialties: ['Tomato (Hybrid & Native)', 'Red Onion', 'Sona Masoori Rice', 'Capsicum'],
    experienceYears: 18,
    trustScore: 96,
  },
  buyer: {
    id: 'usr-buyer-01',
    name: 'Priya Sundaram',
    email: 'priya.procure@greenmartwholesale.com',
    phone: '+91 99001 88765',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    location: 'Bengaluru APMC Zone / Whitefield',
    state: 'Karnataka',
    preferredLanguage: 'en',
    rating: 4.8,
    verified: true,
    businessName: 'GreenMart Wholesale & Retail Chain',
    businessType: 'Retail Chain',
    monthlyVolumeTons: 120,
    creditScore: 840,
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. Anand Deshmukh',
    email: 'anand.admin@agritech.gov.in',
    phone: '+91 80234 99000',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'Central Agritech Command Headquarters',
    state: 'National',
    preferredLanguage: 'en',
    verified: true,
  },
  guest: {
    id: 'guest',
    name: 'Guest Visitor',
    email: 'guest@agritech.in',
    phone: '',
    role: 'guest',
    location: 'India',
    state: 'Karnataka',
    preferredLanguage: 'en',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('agritech_user_role') as UserRole;
    return savedRole && ['farmer', 'buyer', 'admin', 'guest'].includes(savedRole) ? savedRole : 'guest';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedRole = (localStorage.getItem('agritech_user_role') as UserRole) || 'guest';
    return SAMPLE_USERS[savedRole] || SAMPLE_USERS.guest;
  });

  const login = (newRole: UserRole, email?: string, name?: string) => {
    setRole(newRole);
    localStorage.setItem('agritech_user_role', newRole);
    const base = SAMPLE_USERS[newRole] || SAMPLE_USERS.farmer;
    const updated = {
      ...base,
      ...(email ? { email } : {}),
      ...(name ? { name } : {}),
      role: newRole,
    };
    setUser(updated);
  };

  const switchRole = (newRole: UserRole) => {
    login(newRole);
  };

  const logout = () => {
    setRole('guest');
    localStorage.setItem('agritech_user_role', 'guest');
    setUser(SAMPLE_USERS.guest);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const registerUser = (profileData: Partial<UserProfile>) => {
    const assignedRole = profileData.role || 'farmer';
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: profileData.name || 'New Registered User',
      email: profileData.email || 'user@agritech.in',
      phone: profileData.phone || '+91 90000 00000',
      role: assignedRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: profileData.location || 'Bengaluru Rural',
      state: profileData.state || 'Karnataka',
      preferredLanguage: profileData.preferredLanguage || 'en',
      verified: true,
      ...profileData,
    };
    setRole(assignedRole);
    localStorage.setItem('agritech_user_role', assignedRole);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: role !== 'guest',
        login,
        logout,
        switchRole,
        updateProfile,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
