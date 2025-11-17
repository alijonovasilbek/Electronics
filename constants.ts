
import type { Group, Payment, Contract, Student } from './types';
import { PaymentStatus, StudentStatus } from './types';

// FIX: Add missing properties (description, is_active, created_at) to align with the Group type.
export const GROUPS: Group[] = [
  { id: 1, name: 'U-10 Lions', description: 'Under 10 team, focus on fundamentals.', is_active: true, created_at: '2023-01-15T09:00:00Z', coach: 'Aziz Haydarov', studentIds: [1, 2, 3, 4], monthlyFee: 500000 },
  { id: 2, name: 'U-12 Tigers', description: 'Under 12 team, competitive training.', is_active: true, created_at: '2023-01-15T09:00:00Z', coach: 'Server Djeparov', studentIds: [5, 6, 7], monthlyFee: 600000 },
  { id: 3, name: 'U-14 Eagles', description: 'Under 14 team, advanced tactics.', is_active: true, created_at: '2023-01-15T09:00:00Z', coach: 'Timur Kapadze', studentIds: [8, 9, 10], monthlyFee: 700000 },
  { id: 4, name: 'Goalkeepers', description: 'Specialized training for goalkeepers.', is_active: true, created_at: '2023-01-15T09:00:00Z', coach: 'Ignatiy Nesterov', studentIds: [1], monthlyFee: 550000 },
];

// FIX: Add mock STUDENTS data to be used by StudentPortal.tsx and resolve import error.
export const STUDENTS: Student[] = [
  { id: 1, name: 'Javohir Sidikov', dob: '2014-05-12', groupId: 1, status: StudentStatus.Active, joinedDate: '2023-09-01', avatarUrl: 'https://picsum.photos/seed/1/200', contact: { phone: '998901234567', email: 'j.sidikov@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 12, assists: 8, attendance: 98 } },
  { id: 2, name: 'Bobur Abduholikov', dob: '2014-03-22', groupId: 1, status: StudentStatus.Active, joinedDate: '2023-09-01', avatarUrl: 'https://picsum.photos/seed/2/200', contact: { phone: '998901234568', email: 'b.abduholikov@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 15, assists: 5, attendance: 95 } },
  { id: 3, name: 'Sardor Rashidov', dob: '2014-08-01', groupId: 1, status: StudentStatus.Inactive, joinedDate: '2023-09-01', avatarUrl: 'https://picsum.photos/seed/3/200', contact: { phone: '998901234569', email: 's.rashidov@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 8, assists: 10, attendance: 80 } },
  { id: 4, name: 'Eldor Shomurodov', dob: '2014-11-15', groupId: 1, status: StudentStatus.Active, joinedDate: '2023-09-10', avatarUrl: 'https://picsum.photos/seed/4/200', contact: { phone: '998901234570', email: 'e.shomurodov@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 20, assists: 12, attendance: 100 } },
  { id: 5, name: 'Odil Ahmedov Jr.', dob: '2012-01-30', groupId: 2, status: StudentStatus.Active, joinedDate: '2023-09-01', avatarUrl: 'https://picsum.photos/seed/5/200', contact: { phone: '998901234571', email: 'o.ahmedov@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 5, assists: 15, attendance: 99 } },
  { id: 6, name: 'Jaloliddin Masharipov', dob: '2012-02-18', groupId: 2, status: StudentStatus.Active, joinedDate: '2023-09-05', avatarUrl: 'https://picsum.photos/seed/6/200', contact: { phone: '998901234572', email: 'j.masharipov@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 10, assists: 18, attendance: 96 } },
  { id: 7, name: 'Otabek Shukurov', dob: '2012-06-09', groupId: 2, status: StudentStatus.Active, joinedDate: '2023-09-01', avatarUrl: 'https://picsum.photos/seed/7/200', contact: { phone: '998901234573', email: 'o.shukurov@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 3, assists: 20, attendance: 97 } },
  { id: 8, name: 'Igor Sergeev', dob: '2010-04-20', groupId: 3, status: StudentStatus.Active, joinedDate: '2023-09-01', avatarUrl: 'https://picsum.photos/seed/8/200', contact: { phone: '998901234574', email: 'i.sergeev@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 25, assists: 5, attendance: 94 } },
  { id: 9, name: 'Vitaliy Denisov', dob: '2010-07-11', groupId: 3, status: StudentStatus.Active, joinedDate: '2023-09-02', avatarUrl: 'https://picsum.photos/seed/9/200', contact: { phone: '998901234575', email: 'v.denisov@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 2, assists: 22, attendance: 99 } },
  { id: 10, name: 'Marat Bikmaev', dob: '2010-10-01', groupId: 3, status: StudentStatus.Inactive, joinedDate: '2023-09-01', avatarUrl: 'https://picsum.photos/seed/10/200', contact: { phone: '998901234576', email: 'm.bikmaev@example.com', address: 'Tashkent, Uzbekistan' }, performance: { goals: 18, assists: 9, attendance: 85 } },
];

export const PAYMENTS: Payment[] = [
  { id: 'p1', studentId: 1, amount: 500000, date: '2024-07-01', dueDate: '2024-07-05', status: PaymentStatus.Paid },
  { id: 'p2', studentId: 2, amount: 500000, date: '2024-07-02', dueDate: '2024-07-05', status: PaymentStatus.Paid },
  { id: 'p3', studentId: 3, amount: 500000, date: '', dueDate: '2024-07-05', status: PaymentStatus.Overdue },
  { id: 'p4', studentId: 4, amount: 500000, date: '2024-07-05', dueDate: '2024-07-05', status: PaymentStatus.Paid },
  { id: 'p5', studentId: 5, amount: 600000, date: '', dueDate: '2024-07-05', status: PaymentStatus.Due },
  { id: 'p6', studentId: 6, amount: 600000, date: '2024-07-01', dueDate: '2024-07-05', status: PaymentStatus.Paid },
  { id: 'p7', studentId: 7, amount: 600000, date: '', dueDate: '2024-07-05', status: PaymentStatus.Due },
  { id: 'p8', studentId: 8, amount: 700000, date: '2024-06-28', dueDate: '2024-07-05', status: PaymentStatus.Paid },
  { id: 'p9', studentId: 9, amount: 700000, date: '', dueDate: '2024-06-05', status: PaymentStatus.Overdue },
  { id: 'p10', studentId: 10, amount: 700000, date: '2024-07-04', dueDate: '2024-07-05', status: PaymentStatus.Paid },
  { id: 'p11', studentId: 1, amount: 500000, date: '2024-06-03', dueDate: '2024-06-05', status: PaymentStatus.Paid },
  { id: 'p12', studentId: 5, amount: 600000, date: '2024-06-05', dueDate: '2024-06-05', status: PaymentStatus.Paid },
];

export const CONTRACTS: Contract[] = [
  { id: 'c1', studentId: 1, contract_date: '2023-09-01', expiry_date: '2024-09-01', contract_number: 'C-001', responsible_person_id: 1, is_active: true },
  { id: 'c2', studentId: 2, contract_date: '2023-09-01', expiry_date: '2024-09-01', contract_number: 'C-002', responsible_person_id: 1, is_active: true },
];