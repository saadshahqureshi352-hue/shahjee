export interface PickupAddress {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  isDefault: boolean;
}

export interface Order {
  id: string; // SJC0000000XXX or similar, e.g. LNX0000000XXX
  trackingNo: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  destinationCity: string;
  courier: 'Lionex' | 'Run Courier' | 'Leopards' | 'M&P' | 'TCS' | 'Trax';
  weight: number; // in kg
  codAmount: number;
  deliveryCharges: number;
  status: 'Pending' | 'In Transit' | 'Received' | 'Processed' | 'Cancelled' | 'Returned' | 'Booked' | 'In Progress' | 'Delivered' | 'Issued' | 'Lost' | 'ReAttempt' | 'Ready to Return' | 'Return Confirmed';
  bookingDate: string;
  productDescription: string;
}

export interface ReturnOrder {
  id: string;
  order_id: string;
  tracking_no: string;
  customer_name: string;
  courier: 'Lionex' | 'Run Courier' | 'Leopards' | 'M&P' | 'TCS' | 'Trax';
  return_date: string;
  reason: string;
  cod_amount: number;
  delivery_charges: number;
  status: 'Pending' | 'Received' | 'In Transit' | 'Processed';
  is_api: boolean;
}

export interface Invoice {
  id: string; // INV-2026-XXXX
  date: string;
  billingPeriod: string;
  ordersCount: number;
  totalCod: number;
  charges: number;
  netPayout: string;
  status: 'Paid' | 'Processing' | 'On Hold';
}

export interface AlertTemplate {
  id: string;
  trigger: string;
  message: string;
  enabled: boolean;
}
