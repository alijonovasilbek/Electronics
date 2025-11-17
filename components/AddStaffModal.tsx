
import React, { useState, useEffect } from 'react';

interface NewStaffData {
  first_name: string;
  last_name: string;
  position: string;
  is_active: boolean;
}

interface AddStaffModalProps {
  onClose: () => void;
  onAddPerson: (person: NewStaffData) => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ onClose, onAddPerson }) => {
  const [formData, setFormData] = useState<NewStaffData>({
    first_name: '',
    last_name: '',
    position: '',
    is_active: true,
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === 'true' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPerson(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-staff-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 id="add-staff-title" className="text-2xl font-bold text-gray-800">Add New Staff Member</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                <XIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Position" name="position" value={formData.position} onChange={handleChange} required />
                 <Select label="Status" name="is_active" value={String(formData.is_active)} onChange={handleSelectChange}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                 </Select>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">
                Cancel
              </button>
              <button type="submit" className="bg-bunyodkor-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300">
                Add Staff Member
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

export default AddStaffModal;
