import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CropListing,
  MandiPriceItem,
  OrderItem,
  BuyerRequirement,
  ReverseBid,
  GroupBuyingPool,
  CooperativeGroup,
  LogisticsVehicle,
  FarmExpense,
  AdvisoryAlert,
  NotificationItem,
  KYCRequest,
  DisputeItem,
} from '../types';

interface StoreContextType {
  crops: CropListing[];
  mandiPrices: MandiPriceItem[];
  orders: OrderItem[];
  buyerRequirements: BuyerRequirement[];
  reverseBids: ReverseBid[];
  groupBuyingPools: GroupBuyingPool[];
  cooperativeGroups: CooperativeGroup[];
  logisticsVehicles: LogisticsVehicle[];
  expenses: FarmExpense[];
  advisoryAlerts: AdvisoryAlert[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  kycRequests: KYCRequest[];
  disputes: DisputeItem[];

  // Actions
  addCrop: (crop: Omit<CropListing, 'id' | 'status'>) => void;
  updateCrop: (id: string, crop: Partial<CropListing>) => void;
  deleteCrop: (id: string) => void;
  approveCrop: (id: string) => void;
  rejectCrop: (id: string, reason?: string) => void;
  updateCropStatus: (id: string, status: CropListing['status']) => void;

  createOrder: (order: Omit<OrderItem, 'id' | 'orderNumber' | 'createdAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderItem['status']) => void;

  verifyKYC: (id: string, status: 'Approved' | 'Rejected') => void;
  resolveDispute: (id: string, outcome: string, notes: string) => void;

  submitReverseBid: (bid: Omit<ReverseBid, 'id' | 'bidDate' | 'status'>) => void;
  createBuyerRequirement: (req: Omit<BuyerRequirement, 'id' | 'offersReceived' | 'status' | 'createdAt'>) => void;
  joinGroupBuyingPool: (poolId: string, quantityKg: number) => void;
  joinCooperative: (groupId: string, memberName: string, quantityKg: number) => void;

  addExpense: (expense: Omit<FarmExpense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  bookLogistics: (vehicleId: string, pickup: string, dropoff: string, cropName: string, weightTons: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
}

const INITIAL_CROPS: CropListing[] = [
  {
    id: 'crop-01',
    farmerId: 'usr-farmer-01',
    farmerName: 'Ramesh Patel',
    farmerLocation: 'Kolar / Malur Agro Belt',
    farmerRating: 4.9,
    farmerPhone: '+91 98450 12345',
    cropName: 'Tomato (Hybrid Shivam)',
    category: 'Vegetables',
    variety: 'Shivam Semi-Determinate',
    grade: 'Grade A',
    qualityScore: 94,
    currentPrice: 32,
    minSellingPrice: 28,
    availableQuantityKg: 4500,
    minOrderQuantityKg: 500,
    harvestDate: '2026-08-22',
    expiryEstimate: '2026-09-05',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546470427-0d4db154ceb7?w=600&auto=format&fit=crop&q=80',
    ],
    organicCertified: true,
    mandiBenchmarkPrice: 30,
    description: 'Crisp, bright red, firm skin hybrid tomatoes with zero chemical residue. Grown under drip irrigation and bio-mulching.',
    status: 'Approved',
    featured: true,
    aiDemandIndex: 94,
  },
  {
    id: 'crop-02',
    farmerId: 'usr-farmer-02',
    farmerName: 'Suresh Gowda',
    farmerLocation: 'Mandya Canal Basin',
    farmerRating: 4.8,
    farmerPhone: '+91 98801 22334',
    cropName: 'Sona Masoori Raw Rice',
    category: 'Grains & Cereals',
    variety: 'Old Crop Aged 12-Month',
    grade: 'Grade A',
    qualityScore: 96,
    currentPrice: 58,
    minSellingPrice: 54,
    availableQuantityKg: 12000,
    minOrderQuantityKg: 1000,
    harvestDate: '2026-07-15',
    expiryEstimate: '2027-07-15',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    ],
    organicCertified: false,
    mandiBenchmarkPrice: 55,
    description: 'Aromatic, slender grain polished Sona Masoori rice with minimal broken grain (<2%). Double winnowed and bagged in 50kg jute bags.',
    status: 'Approved',
    featured: true,
    aiDemandIndex: 89,
  },
  {
    id: 'crop-03',
    farmerId: 'usr-farmer-03',
    farmerName: 'Basavaraj Hiremath',
    farmerLocation: 'Hubli / Dharwad Agro Hub',
    farmerRating: 4.7,
    farmerPhone: '+91 94480 67890',
    cropName: 'Red Onion (Nashik-Hubli Hybrid)',
    category: 'Vegetables',
    variety: 'Dark Red Medium-Large',
    grade: 'Grade B',
    qualityScore: 88,
    currentPrice: 28,
    minSellingPrice: 24,
    availableQuantityKg: 8000,
    minOrderQuantityKg: 1000,
    harvestDate: '2026-08-18',
    expiryEstimate: '2026-09-30',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    ],
    organicCertified: false,
    mandiBenchmarkPrice: 27,
    description: 'Thick pungent dark red skins, fully cured in ventilated storage sheds, ideal for wholesale restaurant chains.',
    status: 'Approved',
    featured: false,
    aiDemandIndex: 91,
  },
  {
    id: 'crop-04',
    farmerId: 'usr-farmer-01',
    farmerName: 'Ramesh Patel',
    farmerLocation: 'Kolar / Chintamani',
    farmerRating: 4.9,
    farmerPhone: '+91 98450 12345',
    cropName: 'Green Capsicum (Bell Pepper)',
    category: 'Vegetables',
    variety: 'Indra Shade-Net Polyhouse',
    grade: 'Grade A',
    qualityScore: 95,
    currentPrice: 46,
    minSellingPrice: 42,
    availableQuantityKg: 2800,
    minOrderQuantityKg: 300,
    harvestDate: '2026-08-24',
    expiryEstimate: '2026-09-08',
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80',
    ],
    organicCertified: true,
    mandiBenchmarkPrice: 44,
    description: 'Polyhouse grown, four-lobed thick green capsicum. Uniform size (180g-220g), spotless, zero pest damage.',
    status: 'Approved',
    featured: true,
    aiDemandIndex: 86,
  },
  {
    id: 'crop-05',
    farmerId: 'usr-farmer-04',
    farmerName: 'Girish Kumar',
    farmerLocation: 'Shimoga / Thirthahalli',
    farmerRating: 4.9,
    farmerPhone: '+91 97312 45678',
    cropName: 'Premium Arecanut (Chali White)',
    category: 'Cash Crops',
    variety: 'Thirthahalli Superior Sun-Dried',
    grade: 'Grade A',
    qualityScore: 97,
    currentPrice: 490,
    minSellingPrice: 470,
    availableQuantityKg: 3500,
    minOrderQuantityKg: 200,
    harvestDate: '2026-06-10',
    expiryEstimate: '2027-12-31',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    ],
    organicCertified: true,
    mandiBenchmarkPrice: 480,
    description: 'Export-grade dried white supari arecanut with zero moisture defects. Moisture content strictly maintained under 9.5%.',
    status: 'Approved',
    featured: false,
    aiDemandIndex: 78,
  },
  {
    id: 'crop-06',
    farmerId: 'usr-farmer-05',
    farmerName: 'Kaveri Amma',
    farmerLocation: 'Mysuru Organic Belt',
    farmerRating: 4.9,
    farmerPhone: '+91 96111 89012',
    cropName: 'Nanjangud Rasabale Banana',
    category: 'Fruits',
    variety: 'GI-Tagged Rasabale',
    grade: 'Grade A',
    qualityScore: 98,
    currentPrice: 75,
    minSellingPrice: 68,
    availableQuantityKg: 1800,
    minOrderQuantityKg: 200,
    harvestDate: '2026-08-23',
    expiryEstimate: '2026-08-30',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    ],
    organicCertified: true,
    mandiBenchmarkPrice: 70,
    description: 'Geographical Indication (GI) tagged royal dessert bananas known for unique aroma, thin peel, and creamy taste.',
    status: 'Approved',
    featured: true,
    aiDemandIndex: 96,
  },
  {
    id: 'crop-07',
    farmerId: 'usr-farmer-06',
    farmerName: 'Manjunath Reddy',
    farmerLocation: 'Chikkaballapur',
    farmerRating: 4.6,
    farmerPhone: '+91 99012 34567',
    cropName: 'Potato (Kufri Jyoti)',
    category: 'Vegetables',
    variety: 'Kufri Table Variety',
    grade: 'Grade B',
    qualityScore: 87,
    currentPrice: 24,
    minSellingPrice: 21,
    availableQuantityKg: 9500,
    minOrderQuantityKg: 1000,
    harvestDate: '2026-08-15',
    expiryEstimate: '2026-10-15',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    ],
    organicCertified: false,
    mandiBenchmarkPrice: 23,
    description: 'Medium to large round tubers, low sugar content, perfect for chips processing and table consumption.',
    status: 'Pending',
    featured: false,
    aiDemandIndex: 82,
  },
];

const INITIAL_MANDI_PRICES: MandiPriceItem[] = [
  {
    id: 'mandi-01',
    crop: 'Tomato (Hybrid)',
    mandi: 'Kolar APMC Market',
    state: 'Karnataka',
    modalPrice: 3200,
    minPrice: 2700,
    maxPrice: 3600,
    pricePerKg: 32.0,
    changePercent: 8.4,
    arrivalTons: 420,
    trend: 'up',
    lastUpdated: '10 mins ago',
    ai7DayForecastPerKg: 35.5,
    ai30DayForecastPerKg: 39.0,
    confidence: 94,
  },
  {
    id: 'mandi-02',
    crop: 'Red Onion',
    mandi: 'Yeshwanthpur APMC (Bengaluru)',
    state: 'Karnataka',
    modalPrice: 2800,
    minPrice: 2300,
    maxPrice: 3100,
    pricePerKg: 28.0,
    changePercent: -2.1,
    arrivalTons: 890,
    trend: 'down',
    lastUpdated: '25 mins ago',
    ai7DayForecastPerKg: 27.2,
    ai30DayForecastPerKg: 31.5,
    confidence: 91,
  },
  {
    id: 'mandi-03',
    crop: 'Potato (Kufri)',
    mandi: 'Azadpur Mandi (Delhi)',
    state: 'Delhi NCR',
    modalPrice: 2400,
    minPrice: 2000,
    maxPrice: 2650,
    pricePerKg: 24.0,
    changePercent: 4.7,
    arrivalTons: 1250,
    trend: 'up',
    lastUpdated: '5 mins ago',
    ai7DayForecastPerKg: 26.0,
    ai30DayForecastPerKg: 27.5,
    confidence: 93,
  },
  {
    id: 'mandi-04',
    crop: 'Sona Masoori Rice',
    mandi: 'Raichur Grain Market',
    state: 'Karnataka',
    modalPrice: 5800,
    minPrice: 5400,
    maxPrice: 6200,
    pricePerKg: 58.0,
    changePercent: 1.8,
    arrivalTons: 640,
    trend: 'up',
    lastUpdated: '1 hour ago',
    ai7DayForecastPerKg: 59.2,
    ai30DayForecastPerKg: 62.0,
    confidence: 96,
  },
  {
    id: 'mandi-05',
    crop: 'Green Capsicum',
    mandi: 'Pune Gultekdi Mandi',
    state: 'Maharashtra',
    modalPrice: 4600,
    minPrice: 3900,
    maxPrice: 5100,
    pricePerKg: 46.0,
    changePercent: 5.2,
    arrivalTons: 180,
    trend: 'up',
    lastUpdated: '35 mins ago',
    ai7DayForecastPerKg: 49.0,
    ai30DayForecastPerKg: 47.5,
    confidence: 88,
  },
  {
    id: 'mandi-06',
    crop: 'Turmeric (Finger)',
    mandi: 'Nizamabad APMC',
    state: 'Telangana',
    modalPrice: 14200,
    minPrice: 13100,
    maxPrice: 15500,
    pricePerKg: 142.0,
    changePercent: 11.5,
    arrivalTons: 95,
    trend: 'up',
    lastUpdated: '15 mins ago',
    ai7DayForecastPerKg: 154.0,
    ai30DayForecastPerKg: 168.0,
    confidence: 95,
  },
];

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-8901',
    orderNumber: 'AGRI-2026-8901',
    cropId: 'crop-01',
    cropName: 'Tomato (Hybrid Shivam)',
    cropCategory: 'Vegetables',
    cropImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop&q=80',
    farmerId: 'usr-farmer-01',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98450 12345',
    buyerId: 'usr-buyer-01',
    buyerName: 'Priya Sundaram',
    buyerBusiness: 'GreenMart Wholesale',
    buyerPhone: '+91 99001 88765',
    quantityKg: 2000,
    agreedPricePerKg: 32.5,
    totalAmount: 65000,
    platformFee: 650,
    taxAmount: 0,
    status: 'Shipped',
    paymentStatus: 'Escrow Secured',
    deliveryAddress: 'GreenMart Central Cold Hub, Hosur Road, Bengaluru 560068',
    pickupAddress: 'GreenFields Farm Gate, Kolar-Malur Highway, Karnataka',
    createdAt: '2026-08-24 09:30',
    estimatedDelivery: '2026-08-25 18:00',
    trackingNumber: 'TRK-KA-9921',
    transportProvider: 'AgriLogistics Rapid ColdFleet',
    driverName: 'Chandrashekar Gowda',
    driverPhone: '+91 98800 44332',
    driverVehicleNo: 'KA-04-E-8890 (Refrigerated)',
    digitalAgreementSigned: true,
  },
  {
    id: 'ord-8902',
    orderNumber: 'AGRI-2026-8902',
    cropId: 'crop-04',
    cropName: 'Green Capsicum (Bell Pepper)',
    cropCategory: 'Vegetables',
    cropImage: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&auto=format&fit=crop&q=80',
    farmerId: 'usr-farmer-01',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98450 12345',
    buyerId: 'usr-buyer-02',
    buyerName: 'Vikram Joshi',
    buyerBusiness: 'FreshBazaar Hypermarkets',
    buyerPhone: '+91 98230 11223',
    quantityKg: 1000,
    agreedPricePerKg: 45.0,
    totalAmount: 45000,
    platformFee: 450,
    taxAmount: 0,
    status: 'Confirmed',
    paymentStatus: 'Escrow Secured',
    deliveryAddress: 'FreshBazaar DC #4, Whitefield Tech Corridor, Bengaluru',
    pickupAddress: 'GreenFields Farm Gate, Kolar, Karnataka',
    createdAt: '2026-08-25 02:15',
    estimatedDelivery: '2026-08-26 14:00',
    trackingNumber: 'TRK-KA-9944',
    digitalAgreementSigned: true,
  },
  {
    id: 'ord-8900',
    orderNumber: 'AGRI-2026-8900',
    cropId: 'crop-02',
    cropName: 'Sona Masoori Raw Rice',
    cropCategory: 'Grains & Cereals',
    cropImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80',
    farmerId: 'usr-farmer-02',
    farmerName: 'Suresh Gowda',
    farmerPhone: '+91 98801 22334',
    buyerId: 'usr-buyer-01',
    buyerName: 'Priya Sundaram',
    buyerBusiness: 'GreenMart Wholesale',
    buyerPhone: '+91 99001 88765',
    quantityKg: 5000,
    agreedPricePerKg: 57.0,
    totalAmount: 285000,
    platformFee: 2850,
    taxAmount: 0,
    status: 'Delivered',
    paymentStatus: 'Released to Farmer',
    deliveryAddress: 'GreenMart Wholesale Warehouse 2, APMC Yard Bengaluru',
    pickupAddress: 'Mandya Canal Farm #12, Mandya, Karnataka',
    createdAt: '2026-08-19 11:00',
    estimatedDelivery: '2026-08-21 16:00',
    trackingNumber: 'TRK-KA-8810',
    transportProvider: 'VRL Heavy Agrilogistics',
    driverName: 'Raju Nayak',
    driverPhone: '+91 97400 33211',
    driverVehicleNo: 'KA-11-F-3241',
    digitalAgreementSigned: true,
  },
];

const INITIAL_BUYER_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: 'req-01',
    buyerId: 'usr-buyer-01',
    buyerName: 'Priya Sundaram',
    businessName: 'GreenMart Wholesale',
    cropName: 'Tomato (Hybrid or Native)',
    requiredQuantityKg: 5000,
    targetPricePerKg: 31,
    deliveryLocation: 'Bengaluru APMC Zone',
    urgency: 'Within 7 days',
    qualityRequired: 'Grade A',
    offersReceived: 4,
    status: 'Open',
    createdAt: '2026-08-24',
  },
  {
    id: 'req-02',
    buyerId: 'usr-buyer-03',
    buyerName: 'Chef Rahul Anand',
    businessName: 'Spices of South Gourmet Hotels',
    cropName: 'Nanjangud Rasabale Banana',
    requiredQuantityKg: 1000,
    targetPricePerKg: 72,
    deliveryLocation: 'Mysuru & Bengaluru Hotels',
    urgency: 'Immediate (24-48 hrs)',
    qualityRequired: 'Grade A',
    offersReceived: 2,
    status: 'Open',
    createdAt: '2026-08-25',
  },
  {
    id: 'req-03',
    buyerId: 'usr-buyer-04',
    buyerName: 'Deepak Agarwal',
    businessName: 'Apex Food Processing Ltd',
    cropName: 'Potato (Chip Quality / Kufri)',
    requiredQuantityKg: 25000,
    targetPricePerKg: 22.5,
    deliveryLocation: 'Hubli Industrial Estate',
    urgency: 'Within 30 days',
    qualityRequired: 'Grade B',
    offersReceived: 7,
    status: 'Open',
    createdAt: '2026-08-20',
  },
];

const INITIAL_REVERSE_BIDS: ReverseBid[] = [
  {
    id: 'bid-01',
    requirementId: 'req-01',
    buyerName: 'GreenMart Wholesale',
    cropName: 'Tomato (Hybrid)',
    targetQuantityKg: 5000,
    buyerMaxPrice: 31,
    farmerId: 'usr-farmer-01',
    farmerName: 'Ramesh Patel',
    farmerBidPrice: 32,
    farmerOfferedQtyKg: 3000,
    farmerLocation: 'Kolar Agro Belt',
    bidDate: '2026-08-24 14:30',
    status: 'Pending',
  },
  {
    id: 'bid-02',
    requirementId: 'req-01',
    buyerName: 'GreenMart Wholesale',
    cropName: 'Tomato (Hybrid)',
    targetQuantityKg: 5000,
    buyerMaxPrice: 31,
    farmerId: 'usr-farmer-07',
    farmerName: 'Chennappa Gowda',
    farmerBidPrice: 30.5,
    farmerOfferedQtyKg: 2000,
    farmerLocation: 'Doddaballapur',
    bidDate: '2026-08-24 16:10',
    status: 'Accepted',
  },
];

const INITIAL_GROUP_BUYING: GroupBuyingPool[] = [
  {
    id: 'pool-01',
    cropName: 'Grade-A Organic Tomato',
    variety: 'Shivam Premium Red',
    originLocation: 'Kolar Agro Cluster',
    targetQuantityKg: 10000,
    currentQuantityKg: 7800,
    basePricePerKg: 35,
    discountedPricePerKg: 29.5,
    discountPercent: 15.7,
    deadline: '2026-08-28',
    membersCount: 14,
    status: 'Active',
    farmerName: 'Kolar Agro Producer Collective',
    farmerRating: 4.9,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'pool-02',
    cropName: 'Sona Masoori 12-Month Aged Rice',
    variety: 'Aromatic Raw Polish',
    originLocation: 'Raichur & Tungabhadra Basin',
    targetQuantityKg: 25000,
    currentQuantityKg: 21500,
    basePricePerKg: 62,
    discountedPricePerKg: 53.0,
    discountPercent: 14.5,
    deadline: '2026-08-30',
    membersCount: 22,
    status: 'Active',
    farmerName: 'Tungabhadra Rice Growers Union',
    farmerRating: 4.8,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'pool-03',
    cropName: 'Nashik Dark Red Onions',
    variety: 'Export Size Medium-Large',
    originLocation: 'Nashik / Hubli Corridor',
    targetQuantityKg: 20000,
    currentQuantityKg: 14000,
    basePricePerKg: 31,
    discountedPricePerKg: 25.8,
    discountPercent: 16.7,
    deadline: '2026-09-02',
    membersCount: 18,
    status: 'Active',
    farmerName: 'Hubli Agro Consortium',
    farmerRating: 4.7,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
  },
];

const INITIAL_COOPERATIVES: CooperativeGroup[] = [
  {
    id: 'coop-01',
    name: 'Kolar Tomato & Vegetable Farmer Collective',
    region: 'Kolar / Chintamani',
    leadFarmer: 'Ramesh Patel (President)',
    cropSpecialty: 'Tomato, Capsicum, Beans',
    totalMembers: 34,
    pooledQuantityKg: 28500,
    targetWholesalePricePerKg: 34.0,
    potentialBuyerDemandKg: 35000,
    status: 'Negotiating',
  },
  {
    id: 'coop-02',
    name: 'Cauvery Basin Organic Paddy Union',
    region: 'Mandya / Mysuru',
    leadFarmer: 'Suresh Gowda',
    cropSpecialty: 'Sona Masoori, Rajamudi, Black Rice',
    totalMembers: 48,
    pooledQuantityKg: 65000,
    targetWholesalePricePerKg: 60.0,
    potentialBuyerDemandKg: 80000,
    status: 'Forming',
  },
];

const INITIAL_LOGISTICS: LogisticsVehicle[] = [
  {
    id: 'veh-01',
    providerName: 'AgriLogistics Rapid ColdFleet',
    vehicleType: 'Refrigerated Cold Van (3 Ton)',
    capacityTons: 3.0,
    temperatureControlled: true,
    ratePerKm: 28,
    baseCharge: 1200,
    rating: 4.9,
    completedTrips: 340,
    driverName: 'Chandrashekar Gowda',
    driverPhone: '+91 98800 44332',
    currentLocation: 'Kolar Mandi Hub (Within 12 km)',
    available: true,
  },
  {
    id: 'veh-02',
    providerName: 'Kisan Express Mini Trucking',
    vehicleType: 'Pickup Mini Truck (1.5 Ton)',
    capacityTons: 1.5,
    temperatureControlled: false,
    ratePerKm: 18,
    baseCharge: 600,
    rating: 4.8,
    completedTrips: 520,
    driverName: 'Manjunath Swamy',
    driverPhone: '+91 99801 11223',
    currentLocation: 'Malur Industrial Area (Within 5 km)',
    available: true,
  },
  {
    id: 'veh-03',
    providerName: 'VRL Heavy Agro Transports',
    vehicleType: 'Eicher 14ft (4 Ton)',
    capacityTons: 4.0,
    temperatureControlled: false,
    ratePerKm: 32,
    baseCharge: 1500,
    rating: 4.7,
    completedTrips: 890,
    driverName: 'Santosh Biradar',
    driverPhone: '+91 94481 99887',
    currentLocation: 'Bengaluru Ring Road (Within 25 km)',
    available: true,
  },
  {
    id: 'veh-04',
    providerName: 'National Agri Highway Liners',
    vehicleType: 'Heavy Multi-Axle (10+ Ton)',
    capacityTons: 15.0,
    temperatureControlled: false,
    ratePerKm: 55,
    baseCharge: 4000,
    rating: 4.9,
    completedTrips: 1200,
    driverName: 'Gurmeet Singh',
    driverPhone: '+91 98110 55443',
    currentLocation: 'Tumakuru Highway Corridor',
    available: true,
  },
];

const INITIAL_EXPENSES: FarmExpense[] = [
  {
    id: 'exp-01',
    category: 'Seeds & Saplings',
    cropName: 'Tomato Hybrid Shivam',
    amount: 14500,
    date: '2026-06-15',
    notes: 'Premium high-germination hybrid seeds for 3.5 acres',
  },
  {
    id: 'exp-02',
    category: 'Fertilizers & Nutrients',
    cropName: 'Tomato Hybrid Shivam',
    amount: 22000,
    date: '2026-07-02',
    notes: 'Organic compost + 19:19:19 drip soluble fertilizer',
  },
  {
    id: 'exp-03',
    category: 'Irrigation & Electricity',
    cropName: 'Tomato & Capsicum',
    amount: 6800,
    date: '2026-07-20',
    notes: 'Drip line replacement & solar pump maintenance',
  },
  {
    id: 'exp-04',
    category: 'Labor & Harvesting',
    cropName: 'Tomato Hybrid Shivam',
    amount: 18500,
    date: '2026-08-20',
    notes: 'First and second picking labor (12 workers x 3 days)',
  },
  {
    id: 'exp-05',
    category: 'Packaging',
    cropName: 'Tomato Hybrid Shivam',
    amount: 7200,
    date: '2026-08-22',
    notes: '350 plastic ventilated harvest crates',
  },
];

const INITIAL_ADVISORY: AdvisoryAlert[] = [
  {
    id: 'adv-01',
    title: 'Rain & Wind Gust Alert in Southern Karnataka',
    type: 'Weather Alert',
    severity: 'High',
    date: '2026-08-25',
    region: 'Kolar, Chikkaballapur, Bengaluru Rural',
    description: 'Moderate to heavy evening thundershowers expected with 35km/h wind gusts over the next 48 hours.',
    actionRequired: 'Ensure drainage channels around tomato and capsicum plots are cleared. Delay spray applications until rain ceases.',
  },
  {
    id: 'adv-02',
    title: 'Tomato Spot Price Spike Projected (+8% to +14%)',
    type: 'Mandi Price Spike',
    severity: 'Medium',
    date: '2026-08-24',
    region: 'All APMC Mandis',
    description: 'Arrivals from neighboring regions dropped by 18% due to localized transport maintenance.',
    actionRequired: 'Optimal selling window between Aug 26 - Sep 02. Consider holding grade-A batches in ventilated shade sheds.',
  },
  {
    id: 'adv-03',
    title: 'Early Blight (Alternaria Solani) Preventive Protocol',
    type: 'Pest & Disease',
    severity: 'Medium',
    date: '2026-08-23',
    region: 'Eastern Agro Agro-Climatic Zone',
    description: 'High relative humidity (88%) favors fungal spore development on lower leaves.',
    actionRequired: 'Apply bio-fungicide Trichoderma viride or copper oxychloride 2g/L as preventative foliage wash.',
  },
  {
    id: 'adv-04',
    title: 'PM-Kisan & Agri-Infrastructure Fund Subsidies Open',
    type: 'Government Scheme',
    severity: 'Low',
    date: '2026-08-21',
    region: 'Pan-India',
    description: '3% interest subvention for solar cold rooms and on-farm sorting machinery under AIF scheme.',
    actionRequired: 'Apply via Agritech Government Schemes portal with verified farmer KYC.',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'New Bulk Order Received!',
    message: 'GreenMart Wholesale placed an order for 2,000 kg Grade-A Tomatoes (₹65,000). Escrow payment secured.',
    time: '15 mins ago',
    read: false,
    type: 'order',
    targetRole: 'farmer',
  },
  {
    id: 'notif-02',
    title: 'AI Price Surge Alert: Tomato +8.4%',
    message: 'Kolar APMC modal price jumped to ₹32/kg. 7-day predicted range: ₹34 - ₹38/kg.',
    time: '1 hour ago',
    read: false,
    type: 'price',
    targetRole: 'farmer',
  },
  {
    id: 'notif-03',
    title: 'Transport Dispatched: Order #AGRI-8901',
    message: 'Driver Chandrashekar Gowda is en route with Refrigerated Cold Van. ETA: 2 hrs.',
    time: '2 hours ago',
    read: true,
    type: 'ai',
    targetRole: 'buyer',
  },
  {
    id: 'notif-04',
    title: 'Platform Audit: KYC Verification Cleared',
    message: 'Your farmer identity and land records verified with 96% Trust Score.',
    time: '1 day ago',
    read: true,
    type: 'alert',
    targetRole: 'farmer',
  },
  {
    id: 'notif-05',
    title: 'Reverse Bidding Match Found',
    message: 'Farmer Ramesh Patel submitted a competitive bid of ₹32/kg for your 5 Ton Tomato requirement.',
    time: '4 hours ago',
    read: false,
    type: 'order',
    targetRole: 'buyer',
  },
];

const INITIAL_KYC_REQUESTS: KYCRequest[] = [
  {
    id: 'kyc-01',
    userId: 'usr-farmer-01',
    userName: 'Ramesh Patel',
    userRole: 'farmer',
    docType: 'Kisan Credit Card',
    docNumber: 'KCC-KA-5928104',
    submittedDate: '2026-08-20',
    status: 'Pending',
  },
  {
    id: 'kyc-02',
    userId: 'usr-farmer-02',
    userName: 'Suresh Gowda',
    userRole: 'farmer',
    docType: 'Land Record 7/12',
    docNumber: 'KA-MND-48201',
    submittedDate: '2026-08-22',
    status: 'Approved',
  },
  {
    id: 'kyc-03',
    userId: 'usr-buyer-01',
    userName: 'FreshMart Retail Hypermarkets',
    userRole: 'buyer',
    docType: 'GSTIN Certificate',
    docNumber: '29ABCDE1234F1Z5',
    submittedDate: '2026-08-24',
    status: 'Pending',
  },
  {
    id: 'kyc-04',
    userId: 'usr-buyer-02',
    userName: 'Deccan Agro Processors Ltd',
    userRole: 'buyer',
    docType: 'FSSAI License',
    docNumber: 'FSSAI-112233445566',
    submittedDate: '2026-08-19',
    status: 'Approved',
  },
];

const INITIAL_DISPUTES: DisputeItem[] = [
  {
    id: 'disp-01',
    orderId: 'AGRI-2026-4821',
    cropName: 'Tomato (Hybrid Shivam)',
    buyerName: 'FreshMart Hypermarkets',
    farmerName: 'Ramesh Patel',
    disputedAmount: 48000,
    reason: 'Buyer claims 12% produce bruised during 600km transit; farmer claims digital proof of packaging was verified by cold storage.',
    status: 'Under Review',
    createdAt: '2026-08-26',
  },
  {
    id: 'disp-02',
    orderId: 'AGRI-2026-3910',
    cropName: 'Sona Masoori Rice (10 Ton)',
    buyerName: 'Deccan Food Processors',
    farmerName: 'Suresh Gowda',
    disputedAmount: 120000,
    reason: 'Moisture content reported at 15.2% vs contract spec 13.5%. Lab test sample dispatched to accredited APMC testing station.',
    status: 'Under Review',
    createdAt: '2026-08-27',
  },
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crops, setCrops] = useState<CropListing[]>(() => {
    try {
      const saved = localStorage.getItem('agritech_crops');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CROPS;
    } catch {
      return INITIAL_CROPS;
    }
  });

  const [mandiPrices, setMandiPrices] = useState<MandiPriceItem[]>(() => {
    try {
      const saved = localStorage.getItem('agritech_mandi');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MANDI_PRICES;
    } catch {
      return INITIAL_MANDI_PRICES;
    }
  });

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('agritech_orders');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [buyerRequirements, setBuyerRequirements] = useState<BuyerRequirement[]>(INITIAL_BUYER_REQUIREMENTS);
  const [reverseBids, setReverseBids] = useState<ReverseBid[]>(INITIAL_REVERSE_BIDS);
  const [groupBuyingPools, setGroupBuyingPools] = useState<GroupBuyingPool[]>(INITIAL_GROUP_BUYING);
  const [cooperativeGroups, setCooperativeGroups] = useState<CooperativeGroup[]>(INITIAL_COOPERATIVES);
  const [logisticsVehicles, setLogisticsVehicles] = useState<LogisticsVehicle[]>(INITIAL_LOGISTICS);
  const [expenses, setExpenses] = useState<FarmExpense[]>(() => {
    try {
      const saved = localStorage.getItem('agritech_expenses');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });
  const [advisoryAlerts, setAdvisoryAlerts] = useState<AdvisoryAlert[]>(INITIAL_ADVISORY);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('agritech_notifs');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [kycRequests, setKycRequests] = useState<KYCRequest[]>(() => {
    try {
      const saved = localStorage.getItem('agritech_kyc');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_KYC_REQUESTS;
    } catch {
      return INITIAL_KYC_REQUESTS;
    }
  });

  const [disputes, setDisputes] = useState<DisputeItem[]>(() => {
    try {
      const saved = localStorage.getItem('agritech_disputes');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DISPUTES;
    } catch {
      return INITIAL_DISPUTES;
    }
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem('agritech_crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('agritech_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('agritech_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('agritech_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('agritech_kyc', JSON.stringify(kycRequests));
  }, [kycRequests]);

  useEffect(() => {
    localStorage.setItem('agritech_disputes', JSON.stringify(disputes));
  }, [disputes]);

  // Crop CRUD
  const addCrop = (cropData: Omit<CropListing, 'id' | 'status'>) => {
    const newCrop: CropListing = {
      ...cropData,
      id: `crop-${Date.now()}`,
      status: 'Approved',
      aiDemandIndex: Math.floor(Math.random() * 20 + 80),
    };
    setCrops((prev) => [newCrop, ...prev]);
    addNotification({
      title: 'New Crop Listing Published',
      message: `${newCrop.cropName} (${newCrop.availableQuantityKg} kg at ₹${newCrop.currentPrice}/kg) is now active in marketplace.`,
      type: 'ai',
      targetRole: 'farmer',
    });
  };

  const updateCrop = (id: string, updated: Partial<CropListing>) => {
    setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const updateCropStatus = (id: string, status: CropListing['status']) => {
    setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const deleteCrop = (id: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== id));
  };

  const approveCrop = (id: string) => {
    setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Approved' } : c)));
  };

  const rejectCrop = (id: string) => {
    setCrops((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Rejected' } : c)));
  };

  // KYC & Dispute Actions
  const verifyKYC = (id: string, status: 'Approved' | 'Rejected') => {
    setKycRequests((prev) => prev.map((k) => (k.id === id ? { ...k, status } : k)));
    addNotification({
      title: `KYC Document ${status}`,
      message: `KYC verification status has been marked as ${status}.`,
      type: 'alert',
      targetRole: 'admin',
    });
  };

  const resolveDispute = (id: string, outcome: string, notes: string) => {
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const newStatus = outcome.includes('Refund') ? 'Resolved - Buyer Refunded' : 'Resolved - Released to Farmer';
          return { ...d, status: newStatus as any, resolutionNotes: notes };
        }
        return d;
      })
    );
    addNotification({
      title: 'Dispute Arbitration Concluded',
      message: `Arbitration outcome: ${outcome}. Notes: ${notes}`,
      type: 'payment',
      targetRole: 'admin',
    });
  };

  // Orders
  const createOrder = (orderData: Omit<OrderItem, 'id' | 'orderNumber' | 'createdAt'>): string => {
    const orderId = `ord-${Date.now().toString().slice(-4)}`;
    const newOrder: OrderItem = {
      ...orderData,
      id: orderId,
      orderNumber: `AGRI-2026-${orderId.slice(-4)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      digitalAgreementSigned: true,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Update crop available quantity
    setCrops((prev) =>
      prev.map((c) =>
        c.id === orderData.cropId
          ? {
              ...c,
              availableQuantityKg: Math.max(0, c.availableQuantityKg - orderData.quantityKg),
            }
          : c
      )
    );

    addNotification({
      title: 'Order Placed Successfully!',
      message: `Order #${newOrder.orderNumber} for ${newOrder.cropName} (${newOrder.quantityKg} kg) created. Escrow payment secured.`,
      type: 'order',
      targetRole: 'buyer',
    });

    addNotification({
      title: 'New Order Received!',
      message: `Buyer ${newOrder.buyerName} placed an order #${newOrder.orderNumber} for ${newOrder.quantityKg} kg ${newOrder.cropName}.`,
      type: 'order',
      targetRole: 'farmer',
    });

    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const paymentStatus =
            status === 'Delivered'
              ? 'Released to Farmer'
              : status === 'Cancelled'
              ? 'Refunded'
              : o.paymentStatus;
          return { ...o, status, paymentStatus };
        }
        return o;
      })
    );
  };

  // Reverse Bidding
  const submitReverseBid = (bidData: Omit<ReverseBid, 'id' | 'bidDate' | 'status'>) => {
    const newBid: ReverseBid = {
      ...bidData,
      id: `bid-${Date.now()}`,
      bidDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending',
    };
    setReverseBids((prev) => [newBid, ...prev]);
    setBuyerRequirements((prev) =>
      prev.map((r) => (r.id === bidData.requirementId ? { ...r, offersReceived: r.offersReceived + 1 } : r))
    );
  };

  const createBuyerRequirement = (reqData: Omit<BuyerRequirement, 'id' | 'offersReceived' | 'status' | 'createdAt'>) => {
    const newReq: BuyerRequirement = {
      ...reqData,
      id: `req-${Date.now()}`,
      offersReceived: 0,
      status: 'Open',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setBuyerRequirements((prev) => [newReq, ...prev]);
  };

  // Group buying
  const joinGroupBuyingPool = (poolId: string, quantityKg: number) => {
    setGroupBuyingPools((prev) =>
      prev.map((p) =>
        p.id === poolId
          ? {
              ...p,
              currentQuantityKg: Math.min(p.targetQuantityKg, p.currentQuantityKg + quantityKg),
              membersCount: p.membersCount + 1,
            }
          : p
      )
    );
  };

  const joinCooperative = (groupId: string, memberName: string, quantityKg: number) => {
    setCooperativeGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              totalMembers: g.totalMembers + 1,
              pooledQuantityKg: g.pooledQuantityKg + quantityKg,
            }
          : g
      )
    );
  };

  // Expenses
  const addExpense = (expense: Omit<FarmExpense, 'id'>) => {
    const newExp: FarmExpense = { ...expense, id: `exp-${Date.now()}` };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Logistics
  const bookLogistics = (vehicleId: string, pickup: string, dropoff: string, cropName: string, weightTons: number) => {
    setLogisticsVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, available: false, completedTrips: v.completedTrips + 1 } : v))
    );
    addNotification({
      title: 'Logistics Vehicle Booked',
      message: `Transport confirmed for ${weightTons} tons of ${cropName} from ${pickup} to ${dropoff}.`,
      type: 'ai',
      targetRole: 'farmer',
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <StoreContext.Provider
      value={{
        crops,
        mandiPrices,
        orders,
        buyerRequirements,
        reverseBids,
        groupBuyingPools,
        cooperativeGroups,
        logisticsVehicles,
        expenses,
        advisoryAlerts,
        notifications,
        unreadNotificationCount,
        kycRequests,
        disputes,

        addCrop,
        updateCrop,
        deleteCrop,
        approveCrop,
        rejectCrop,
        updateCropStatus,

        createOrder,
        updateOrderStatus,

        verifyKYC,
        resolveDispute,

        submitReverseBid,
        createBuyerRequirement,
        joinGroupBuyingPool,
        joinCooperative,

        addExpense,
        deleteExpense,

        bookLogistics,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
