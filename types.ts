
export enum PaymentStatus {
  Paid = 'Paid',
  Due = 'Due',
  Overdue = 'Overdue',
}

export enum StudentStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface Payment {
  id: string;
  studentId: number;
  amount: number;
  date: string; // Empty if not paid
  dueDate: string;
  status: PaymentStatus;
}

export interface Contract {
  id: string; // Local ID for now
  studentId: number;
  contract_number: string;
  contract_date: string;
  expiry_date: string;
  responsible_person_id: number;
  is_active: boolean;
  expiry_reason?: string;
}

export interface ResponsiblePerson {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  is_active: boolean;
  created_at: string;
}


export interface Group {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  // FIX: Add optional properties to align with mock data and resolve type errors.
  coach?: string;
  studentIds?: number[];
  monthlyFee?: number;
}

export interface Student {
  id: number;
  name: string; // from full_name
  dob: string; // from year, e.g. "2010-01-01"
  groupId: number | null; // from group_id
  status: StudentStatus; // from is_active
  joinedDate: string; // from created_at
  
  // Kept for UI compatibility, populated with default values
  contact?: {
    phone: string;
    email: string;
    address: string;
  };
  avatarUrl?: string;
  performance?: {
    goals: number;
    assists: number;
    attendance: number; // percentage
  }
}

export type Page = 'Dashboard' | 'Students' | 'Groups' | 'Payments' | 'Contracts' | 'StudentPortal' | 'Staff';