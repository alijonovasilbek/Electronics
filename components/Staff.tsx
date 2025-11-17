
import React, { useState, useMemo } from 'react';
import type { ResponsiblePerson } from '../types';
import AddStaffModal from './AddStaffModal';

interface StaffProps {
  persons: ResponsiblePerson[];
  onAddPerson: (personData: { first_name: string; last_name: string; position: string; is_active: boolean; }) => void;
}

const Staff: React.FC<StaffProps> = ({ persons, onAddPerson }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredPersons = useMemo(() => {
        return persons.filter(person => {
            const fullName = `${person.first_name} ${person.last_name}`;
            return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   person.position.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [searchTerm, persons]);
    
    const handleAddPerson = (newPersonData: { first_name: string; last_name: string; position: string; is_active: boolean; }) => {
        onAddPerson(newPersonData);
        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <h1 className="text-3xl font-bold text-text-primary">Staff</h1>
                 <button onClick={() => setIsAddModalOpen(true)} className="bg-bunyodkor-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300 flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Staff Member
                </button>
            </div>
           
            <div className="bg-card p-4 rounded-xl shadow-md">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or position..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bunyodkor-blue bg-white text-gray-900 placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-md overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr className="text-sm text-text-secondary">
                                <th className="py-3 px-4 font-medium">Name</th>
                                <th className="py-3 px-4 font-medium">Position</th>
                                <th className="py-3 px-4 font-medium">Date Joined</th>
                                <th className="py-3 px-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPersons.map(person => (
                                <tr key={person.id} className="border-t hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <p className="font-semibold text-text-primary">{person.first_name} {person.last_name}</p>
                                        <p className="text-sm text-text-secondary">ID: {person.id}</p>
                                    </td>
                                    <td className="py-3 px-4 text-text-secondary">{person.position}</td>
                                    <td className="py-3 px-4 text-text-secondary">{new Date(person.created_at).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            person.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>{person.is_active ? 'Active' : 'Inactive'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isAddModalOpen && (
                <AddStaffModal onClose={() => setIsAddModalOpen(false)} onAddPerson={handleAddPerson} />
            )}
        </div>
    );
};


// Icons
const PlusIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const SearchIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


export default Staff;
