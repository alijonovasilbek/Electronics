
import React, { useEffect } from 'react';
import type { Group } from '../types';

interface GroupDetailsModalProps {
  group: Group;
  onClose: () => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({ group, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{group.name}</h2>
              <p className="text-lg text-gray-600">{group.description}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XIcon className="w-8 h-8" />
            </button>
          </div>

          <div>
             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                Group Details
            </h3>
            <div className="space-y-2">
                <p><span className="font-semibold">ID:</span> {group.id}</p>
                <p><span className="font-semibold">Status:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        group.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{group.is_active ? 'Active' : 'Inactive'}</span>
                </p>
                <p><span className="font-semibold">Created At:</span> {new Date(group.created_at).toLocaleString()}</p>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>Note: Member management functionality will be added once student-related APIs are available.</p>
            </div>
          </div>


          <div className="mt-8 flex justify-end">
            <button onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const XIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default GroupDetailsModal;
