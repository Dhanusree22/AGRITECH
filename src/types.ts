export type UserRole = 'guest' | 'farmer' | 'buyer' | 'admin';

export type LanguageCode = 'en' | 'kn' | 'hi' | 'te' | 'ta' | 'ml' | 'mr' | 'bn';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  location: string;
  state: string;
  preferredLanguage: LanguageCode;
  rating?: number;
  verified?: boolean;
  // Farmer specific
  farmName?: string;
  farmSizeAcres?: number;
  cropSpecialties?: string[];
  experienceYears?: number;
  trustScore?: number;
  // Buyer specific
  businessName?: string;
  businessType?: 'Wholesaler' | 'Retail Chain' | 'Food Processor' | 'Exporter' | 'Hotel / Institutional';
  monthlyVolumeTons?: number;
  creditScore?: number;
}

export type CropCategory = 'Vegetables' | 'Fruits' | 'Grains & Cereals' | 'Pulses' | 'Spices' | 'Oilseeds' | 'Cash Crops';

export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C';

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  farmerRating: number;
  farmerPhone: string;
  cropName: string;
  category: CropCategory;
  variety: string;
  grade: QualityGrade;
  qualityScore: number;
  currentPrice: number; // ₹ per kg
  minSellingPrice: number;
  availableQuantityKg: number;
  minOrderQuantityKg: number;
  harvestDate: string;
  expiryEstimate: string;
  images: string[];
  organicCertified: boolean;
  mandiBenchmarkPrice: number;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Sold Out';
  featured?: boolean;
  aiDemandIndex?: number; // 0-100
}

export interface MandiPriceItem {
  id: string;
  crop: string;
  mandi: string;
  state: string;
  modalPrice: number; // ₹/quintal
  minPrice: number;
  maxPrice: number;
  pricePerKg: number;
  changePercent: number;
  arrivalTons: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  ai7DayForecastPerKg: number;
  ai30DayForecastPerKg: number;
  confidence: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: string;
  orderNumber: string;
  cropId: string;
  cropName: string;
  cropCategory: CropCategory;
  cropImage: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerBusiness: string;
  buyerPhone: string;
  quantityKg: number;
  agreedPricePerKg: number;
  totalAmount: number;
  platformFee: number;
  taxAmount: number;
  status: OrderStatus;
  paymentStatus: 'Escrow Secured' | 'Released to Farmer' | 'Refunded' | 'Pending Advance';
  deliveryAddress: string;
  pickupAddress: string;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  transportProvider?: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicleNo?: string;
  digitalAgreementSigned: boolean;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  businessName: string;
  cropName: string;
  requiredQuantityKg: number;
  targetPricePerKg: number;
  deliveryLocation: string;
  urgency: 'Immediate (24-48 hrs)' | 'Within 7 days' | 'Within 30 days';
  qualityRequired: QualityGrade;
  offersReceived: number;
  status: 'Open' | 'Matched' | 'Closed';
  createdAt: string;
}

export interface ReverseBid {
  id: string;
  requirementId: string;
  buyerName: string;
  cropName: string;
  targetQuantityKg: number;
  buyerMaxPrice: number;
  farmerId: string;
  farmerName: string;
  farmerBidPrice: number;
  farmerOfferedQtyKg: number;
  farmerLocation: string;
  bidDate: string;
  status: 'Pending' | 'Accepted' | 'Outbid' | 'Rejected';
}

export interface GroupBuyingPool {
  id: string;
  cropName: string;
  variety: string;
  originLocation: string;
  targetQuantityKg: number;
  currentQuantityKg: number;
  basePricePerKg: number;
  discountedPricePerKg: number;
  discountPercent: number;
  deadline: string;
  membersCount: number;
  status: 'Active' | 'Locked' | 'Fulfilled';
  farmerName: string;
  farmerRating: number;
  image: string;
}

export interface CooperativeGroup {
  id: string;
  name: string;
  region: string;
  leadFarmer: string;
  cropSpecialty: string;
  totalMembers: number;
  pooledQuantityKg: number;
  targetWholesalePricePerKg: number;
  potentialBuyerDemandKg: number;
  status: 'Forming' | 'Negotiating' | 'Dispatched';
}

export interface LogisticsVehicle {
  id: string;
  providerName: string;
  vehicleType: 'Pickup Mini Truck (1.5 Ton)' | 'Eicher 14ft (4 Ton)' | 'Refrigerated Cold Van (3 Ton)' | 'Heavy Multi-Axle (10+ Ton)';
  capacityTons: number;
  temperatureControlled: boolean;
  ratePerKm: number;
  baseCharge: number;
  rating: number;
  completedTrips: number;
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  available: boolean;
}

export interface FarmExpense {
  id: string;
  category: 'Seeds & Saplings' | 'Fertilizers & Nutrients' | 'Pesticides' | 'Labor & Harvesting' | 'Machinery & Fuel' | 'Irrigation & Electricity' | 'Transport' | 'Packaging';
  cropName: string;
  amount: number;
  date: string;
  notes: string;
}

export interface AdvisoryAlert {
  id: string;
  title: string;
  type: 'Weather Alert' | 'Pest & Disease' | 'Mandi Price Spike' | 'Government Scheme' | 'Crop Advisory';
  severity: 'High' | 'Medium' | 'Low';
  date: string;
  region: string;
  description: string;
  actionRequired: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'price' | 'alert' | 'ai' | 'payment';
  targetRole: UserRole;
}
