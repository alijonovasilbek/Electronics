
import React, { useState, useEffect, useMemo } from 'react';
import type { Contract, Student, ResponsiblePerson } from '../types';

interface AddContractModalProps {
  onClose: () => void;
  onAddContract: (contract: Omit<Contract, 'id'>) => void;
  students: Student[];
  responsiblePersons: ResponsiblePerson[];
}

const AddContractModal: React.FC<AddContractModalProps> = ({ onClose, onAddContract, students, responsiblePersons }) => {
  
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || 0,
    contract_number: '',
    contract_date: new Date().toISOString().split('T')[0],
    expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    responsible_person_id: responsiblePersons[0]?.id || 0,
    is_active: true,
    expiry_reason: ''
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['studentId', 'responsible_person_id'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value === 'true'}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.responsible_person_id || !formData.contract_number) {
        alert("Please fill out all required fields.");
        return;
    }
    onAddContract(formData);
  };
  
  const sortedStudents = useMemo(() => [...students].sort((a,b) => a.name.localeCompare(b.name)), [students]);
  const sortedPersons = useMemo(() => [...responsiblePersons].sort((a,b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)), [responsiblePersons]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-contract-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 id="add-contract-title" className="text-2xl font-bold text-gray-800">Add New Contract</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                <XIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Select label="Student" name="studentId" value={formData.studentId} onChange={handleChange} required>
                    {sortedStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                 </Select>
                 <Select label="Responsible Person" name="responsible_person_id" value={formData.responsible_person_id} onChange={handleChange} required>
                    {sortedPersons.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                 </Select>
              </div>
               <Input label="Contract Number" name="contract_number" value={formData.contract_number} onChange={handleChange} placeholder="e.g., C-00123" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Contract Date" name="contract_date" type="date" value={formData.contract_date} onChange={handleChange} required />
                 <Input label="Expiry Date" name="expiry_date" type="date" value={formData.expiry_date} onChange={handleChange} required />
              </div>
              <Select label="Status" name="is_active" value={String(formData.is_active)} onChange={handleSelectChange}>
                <option value="true">Active</option>
                <option value="false">Inactive/Expired</option>
              </Select>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Reason (Optional)</label>
                  <textarea 
                    name="expiry_reason"
                    value={formData.expiry_reason}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bunyodkor-blue bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Reason for early termination or non-renewal..."
                  />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">
                Cancel
              </button>
              <button type="submit" className="bg-bunyodkor-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300">
                Add Contract
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bunyodkor-blue bg-white text-gray-900 placeholder-gray-400" />
    </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bunyodkor-blue bg-white text-gray-900">
            {children}
        </select>
    </div>
);


const XIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default AddContractModal;
