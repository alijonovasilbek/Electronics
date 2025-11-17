
import React, { useState, useMemo } from 'react';
import type { Contract, Student, ResponsiblePerson } from '../types';
import AddContractModal from './AddContractModal';

interface ContractsProps {
  contracts: Contract[];
  students: Student[];
  responsiblePersons: ResponsiblePerson[];
  onAddContract: (contractData: Omit<Contract, 'id'>) => void;
}

const Contracts: React.FC<ContractsProps> = ({ contracts, students, responsiblePersons, onAddContract }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const contractsWithDetails = useMemo(() => {
        return contracts.map(contract => ({
            ...contract,
            studentName: students.find(s => s.id === contract.studentId)?.name || 'Unknown Student',
            responsiblePersonName: responsiblePersons.find(p => p.id === contract.responsible_person_id) 
                ? `${responsiblePersons.find(p => p.id === contract.responsible_person_id)?.first_name} ${responsiblePersons.find(p => p.id === contract.responsible_person_id)?.last_name}`
                : 'Unknown Person',
        })).sort((a,b) => new Date(b.contract_date).getTime() - new Date(a.contract_date).getTime());
    }, [contracts, students, responsiblePersons]);

    const handleAddContract = (newContractData: Omit<Contract, 'id'>) => {
        onAddContract(newContractData);
        setIsAddModalOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <h1 className="text-3xl font-bold text-text-primary">Contracts</h1>
                 <button onClick={() => setIsAddModalOpen(true)} className="bg-bunyodkor-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300 flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Contract
                </button>
            </div>

            <div className="bg-card rounded-xl shadow-md overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-gray-50">
                            <tr className="text-sm text-text-secondary">
                                <th className="py-3 px-4 font-medium">Student</th>
                                <th className="py-3 px-4 font-medium">Contract #</th>
                                <th className="py-3 px-4 font-medium">Dates (Start - End)</th>
                                <th className="py-3 px-4 font-medium">Responsible Person</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contractsWithDetails.map(contract => (
                                <tr key={contract.id} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4 font-semibold text-text-primary">{contract.studentName}</td>
                                    <td className="py-3 px-4 text-text-secondary">{contract.contract_number}</td>
                                    <td className="py-3 px-4 text-text-secondary">
                                        {new Date(contract.contract_date).toLocaleDateString()} - {new Date(contract.expiry_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 text-text-secondary">{contract.responsiblePersonName}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            contract.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>{contract.is_active ? 'Active' : 'Expired'}</span>
                                    </td>
                                </tr>
                            ))}
                             {contractsWithDetails.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        No contracts created yet. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isAddModalOpen && (
                <AddContractModal 
                    onClose={() => setIsAddModalOpen(false)} 
                    onAddContract={handleAddContract} 
                    students={students}
                    responsiblePersons={responsiblePersons}
                />
            )}
        </div>
    );
};


// Icons
const PlusIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

export default Contracts;
