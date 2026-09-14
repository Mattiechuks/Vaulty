export interface Brand {
  id: string;
  name: string;
  category: string;
  color: string;
  secondaryColor: string;
  initial: string;
  blurb: string;
  discount: number; // percentage, e.g. 7 for 7%
  flashDeal?: boolean;
  popular?: boolean;
  rating: number;
  deliveryType: 'Instant eCode' | 'Barcode & PIN' | 'In-App Voucher';
  denominations: number[];
  terms: string;
}

export interface PurchasedCard {
  id: string;
  brandId: string;
  brandName: string;
  initial: string;
  color: string;
  secondaryColor: string;
  category: string;
  faceValue: number;
  currentBalance: number;
  purchasePrice: number;
  code: string;
  pin: string;
  purchasedAt: string;
  isGift: boolean;
  recipientName?: string;
  recipientEmail?: string;
  giftMessage?: string;
  giftTheme?: string;
  redeemed: boolean;
  barcodeNumber: string;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'deposit' | 'sell';
  title: string;
  brandName?: string;
  amount: number; // positive for deposit/sell, negative for purchase
  faceValue?: number;
  discountAmount?: number;
  code?: string;
  timestamp: string;
}

export interface UserAccount {
  name: string;
  email: string;
  balance: number;
  totalSaved: number;
  memberSince: string;
}
