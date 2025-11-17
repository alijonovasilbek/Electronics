
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Groups from './components/Groups';
import Payments from './components/Payments';
import Contracts from './components/Contracts';
import Staff from './components/Staff';
import StudentPortal from './components/StudentPortal';
import Login from './components/Login';
import type { Page, Student, Group, Payment, ResponsiblePerson, Contract } from './types';
import { PAYMENTS } from './constants';
// FIX: Import PaymentStatus enum to fix type error when creating new invoices.
import { StudentStatus, PaymentStatus } from './types';

const API_BASE_URL = 'http://127.0.0.1:8000';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Auth state
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  
  // API Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [payments, setPayments] = useState<Payment[]>(PAYMENTS); // Still using mock data until API is available
  const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePerson[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (token) {
      setIsLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const [groupsResponse, studentsResponse, personsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/students/groups`, { headers }),
          fetch(`${API_BASE_URL}/students/list`, { headers }),
          fetch(`${API_BASE_URL}/students/responsible-persons`, { headers }),
        ]);

        if (groupsResponse.status === 401 || studentsResponse.status === 401 || personsResponse.status === 401) {
          handleLogout();
          return;
        }

        if (!groupsResponse.ok) throw new Error('Failed to fetch groups');
        const groupsData = await groupsResponse.json();
        setGroups(groupsData.groups || []);

        if (!studentsResponse.ok) throw new Error('Failed to fetch students');
        const studentsData = await studentsResponse.json();
        const transformedStudents: Student[] = studentsData.students.map((s: any) => ({
          id: s.id,
          name: s.full_name,
          dob: `${s.year}-01-01`,
          groupId: s.group_id,
          status: s.is_active ? StudentStatus.Active : StudentStatus.Inactive,
          joinedDate: new Date(s.created_at).toISOString().split('T')[0],
          avatarUrl: `https://picsum.photos/seed/${s.id}/200`,
          contact: {
            phone: 'N/A',
            email: `${s.full_name.split(' ').join('.').toLowerCase()}@example.com`,
            address: 'N/A'
          },
          performance: { goals: 0, assists: 0, attendance: 100 }
        }));
        setStudents(transformedStudents);

        if (!personsResponse.ok) throw new Error('Failed to fetch responsible persons');
        const personsData = await personsResponse.json();
        setResponsiblePersons(personsData.persons || []);

      } catch (error) {
        console.error("Error fetching data:", error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);


  const handleLogin = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setCurrentPage('Dashboard');
  };
  
  const handleLogout = () => {
      localStorage.removeItem('authToken');
      setToken(null);
      setGroups([]);
      setStudents([]);
      setResponsiblePersons([]);
      setContracts([]);
  };

  const fetchStudents = async () => {
     if(!token) return;
     try {
        const studentsResponse = await fetch(`${API_BASE_URL}/students/list`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!studentsResponse.ok) throw new Error('Failed to re-fetch students');
        const studentsData = await studentsResponse.json();
        const transformedStudents: Student[] = studentsData.students.map((s: any) => ({
            id: s.id,
            name: s.full_name,
            dob: `${s.year}-01-01`,
            groupId: s.group_id,
            status: s.is_active ? StudentStatus.Active : StudentStatus.Inactive,
            joinedDate: new Date(s.created_at).toISOString().split('T')[0],
            avatarUrl: `https://picsum.photos/seed/${s.id}/200`,
            contact: {
              phone: 'N/A',
              email: `${s.full_name.split(' ').join('.').toLowerCase()}@example.com`,
              address: 'N/A'
            },
            performance: { goals: 0, assists: 0, attendance: 100 }
          }));
        setStudents(transformedStudents);
     } catch (error) {
         console.error("Failed to refresh students list:", error);
     }
  }

  const handleAddStudent = async (studentData: { name: string; dob: string; groupId: number; status: StudentStatus; }) => {
    if (!token) return;
    
    const year = new Date(studentData.dob).getFullYear();
    if (!year || isNaN(year)) {
      alert("Invalid Date of Birth");
      return;
    }

    const payload = {
      year: year,
      full_name: studentData.name,
      group_id: studentData.groupId,
      is_active: studentData.status === StudentStatus.Active
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/students/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error('Failed to add student');
      await fetchStudents(); // Refresh student list
  
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Failed to add student. Please check the console for details.");
    }
  };

  const handleAddGroup = async (groupData: Omit<Group, 'id' | 'created_at'>) => {
    if (!token) return;
    try {
        const response = await fetch(`${API_BASE_URL}/students/groups`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupData),
        });
        if (!response.ok) throw new Error('Failed to add group');
        
        // Refetch all data to get the latest groups
        await fetchData();

    } catch (error) {
        console.error("Failed to add group:", error);
        alert("Failed to add group. Please check the console for details.");
    }
  };
  
  const handleAddStudentToGroup = (studentId: number, groupId: number) => {
      // This logic needs to be adapted for an API call (e.g., PATCH /students/{student_id})
      console.log(`Assigning student ${studentId} to group ${groupId}. API call needed.`);
      const updatedStudents = students.map(s => 
          s.id === studentId ? { ...s, groupId: groupId } : s
      );
      setStudents(updatedStudents);
  };

  const handleRecordPayment = async (newPayment: Omit<Payment, 'id'>) => {
    if (!token) return;

    const dueDate = new Date(newPayment.dueDate);
    const paymentDate = newPayment.date ? new Date(newPayment.date) : new Date();
    
    // Map frontend status to backend status
    let backendStatus = 'pending';
    if(newPayment.status === PaymentStatus.Paid) backendStatus = 'paid';

    const payload = {
      student_id: newPayment.studentId,
      year: dueDate.getFullYear(),
      month: dueDate.getMonth() + 1,
      amount: newPayment.amount,
      payment_date: paymentDate.toISOString().split('T')[0],
      status: backendStatus,
      source: 'manual',
      note: `Recorded via CRM on ${new Date().toLocaleDateString()}`
    };

    try {
        const response = await fetch(`${API_BASE_URL}/students/payments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({detail: "Unknown error"}));
            throw new Error(errorData.detail || 'Failed to record payment');
        }
        
        // No GET /payments endpoint, so add to local state for now.
        const paymentWithId = {
            ...newPayment,
            id: `p_local_${Date.now()}`
        };
        setPayments(prev => [paymentWithId, ...prev]);
        alert("Payment recorded successfully!");
    } catch (error: any) {
        console.error("Failed to record payment:", error);
        alert(`Failed to record payment: ${error.message}`);
    }
  };
  
  const handleGenerateInvoices = () => {
      const activeStudents = students.filter(s => s.status === StudentStatus.Active);
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      let newInvoicesCount = 0;

      const newPayments = activeStudents.flatMap(student => {
          const hasInvoiceForCurrentMonth = payments.some(p => 
              p.studentId === student.id &&
              new Date(p.dueDate).getMonth() === currentMonth &&
              new Date(p.dueDate).getFullYear() === currentYear
          );

          if (!hasInvoiceForCurrentMonth) {
              newInvoicesCount++;
              const groupFee = 500000; // Mock fee, needs API data
              const dueDate = new Date(currentYear, currentMonth, 5).toISOString().split('T')[0];
              return [{
                  id: `p_new_${student.id}_${Date.now()}`,
                  studentId: student.id,
                  amount: groupFee,
                  date: '',
                  dueDate,
                  status: PaymentStatus.Due
              }];
          }
          return [];
      });

      if (newPayments.length > 0) {
          setPayments(prev => [...newPayments, ...prev]);
      }
      alert(`${newInvoicesCount} new monthly invoices generated!`);
  };

  const handleAddStaff = async (staffData: { first_name: string; last_name: string; position: string; is_active: boolean }) => {
    if (!token) return;
    try {
        const response = await fetch(`${API_BASE_URL}/students/responsible-persons`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(staffData),
        });
        if (!response.ok) throw new Error('Failed to add staff member');
        await fetchData(); // Refetch all data to get the latest list
    } catch (error) {
        console.error("Failed to add staff:", error);
        alert("Failed to add staff. See console for details.");
    }
  };

  const handleAddContract = async (contractData: Omit<Contract, 'id'>) => {
    if (!token) return;
    const payload = {
        student_id: contractData.studentId,
        contract_number: Number(contractData.contract_number),
        contract_date: contractData.contract_date,
        expiry_date: contractData.expiry_date,
        responsible_person_id: contractData.responsible_person_id,
        is_active: contractData.is_active,
        expiry_reason: contractData.expiry_reason,
    };
    try {
        const response = await fetch(`${API_BASE_URL}/students/contracts`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({detail: "Unknown error"}));
            throw new Error(errorData.detail || 'Failed to create contract');
        }
        // No GET /contracts endpoint, so add locally
        const newContract = { ...contractData, id: `c_local_${Date.now()}`};
        setContracts(prev => [newContract, ...prev]);
        alert("Contract created successfully!");
    } catch (error: any) {
        console.error("Failed to create contract:", error);
        alert(`Failed to create contract: ${error.message}`);
    }
  };


  if (isLoading && token) {
      return (
          <div className="flex items-center justify-center h-screen bg-background">
              <div className="text-2xl font-semibold text-text-primary">Loading Academy Data...</div>
          </div>
      );
  }

  if (!token) {
    return <Login onLogin={handleLogin} apiBaseUrl={API_BASE_URL} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard students={students} groups={groups} payments={payments} />;
      case 'Students':
        return <Students students={students} groups={groups} onAddStudent={handleAddStudent} />;
      case 'Groups':
        return <Groups groups={groups} students={students} onAddGroup={handleAddGroup} onAddStudentToGroup={handleAddStudentToGroup} />;
      case 'Payments':
        return <Payments payments={payments} students={students} groups={groups} onRecordPayment={handleRecordPayment} onGenerateInvoices={handleGenerateInvoices} />;
      case 'Contracts':
        return <Contracts contracts={contracts} students={students} responsiblePersons={responsiblePersons} onAddContract={handleAddContract} />;
      case 'Staff':
        return <Staff persons={responsiblePersons} onAddPerson={handleAddStaff} />;
      case 'StudentPortal':
        return <StudentPortal />;
      default:
        return <Dashboard students={students} groups={groups} payments={payments}/>;
    }
  };

  const pageTitle = currentPage === 'StudentPortal' ? 'Student Portal' : currentPage;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={(page) => {
          setCurrentPage(page);
          setIsSidebarOpen(false); // Close sidebar on navigation
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
         {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center bg-card p-4 border-b z-10">
          <button onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
            <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-bunyodkor-blue">{pageTitle}</h1>
          <div className="w-6"></div> {/* Spacer */}
        </header>
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;