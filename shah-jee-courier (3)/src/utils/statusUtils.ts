import { Order } from '../types';

export const getStatusCount = (orders: Order[], statusName: string): number => {
  return orders.filter(o => {
    const ost = o.status as string;
    if (statusName === 'All') return true;
    
    if (statusName === 'Active') {
      return ost !== 'Pending' && 
             ost !== 'Booked' && 
             ost !== 'Delivered' && 
             ost !== 'Returned' && 
             ost !== 'Return Confirmed' && 
             ost !== 'Cancelled';
    }
    if (statusName === 'Booked') {
      return ost === 'Pending' || ost === 'Booked';
    }
    if (statusName === 'Rider Picked') {
      return ost === 'Processed' || ost === 'Received';
    }
    if (statusName === 'In Transit') {
      return ost === 'In Transit' || ost === 'In Progress';
    }
    if (statusName === 'Out for Delivery') {
      return ost === 'Out for Delivery';
    }
    if (statusName === 'Issue Detected') {
      return ost === 'Issued' || ost === 'Issue Detected';
    }
    if (statusName === 'Re-Attempt') {
      return ost === 'ReAttempt';
    }
    if (statusName === 'Ready to Return') {
      return ost === 'Ready to Return';
    }
    if (statusName === 'Delivered') {
      return ost === 'Delivered';
    }
    if (statusName === 'Return Confirmed') {
      return ost === 'Return Confirmed';
    }
    if (statusName === 'Returned to Shipper') {
      return ost === 'Returned';
    }
    if (statusName === 'Lost') {
      return ost === 'Lost';
    }
    if (statusName === 'Cancelled') {
      return ost === 'Cancelled';
    }
    if (statusName === 'At Destination') {
      return ost === 'At Destination';
    }
    return ost === statusName;
  }).length;
};
