
import React, { useState } from 'react';
import type { Group, Student } from '../types';
import GroupDetailsModal from './GroupDetailsModal';
import AddGroupModal from './AddGroupModal';

interface GroupsProps {
  groups: Group[];
  students: Student[];
  onAddGroup: (groupData: Omit<Group, 'id' | 'created_at'>) => void;
  onAddStudentToGroup: (studentId: number, groupId: number) => void;
}

const Groups: React.FC<GroupsProps> = ({ groups, students, onAddGroup, onAddStudentToGroup }) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  const handleAddGroup = (groupData: Omit<Group, 'id' | 'created_at'>) => {
    onAddGroup(groupData);
    setIsAddGroupModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-text-primary">Training Groups</h1>
        <button onClick={() => setIsAddGroupModalOpen(true)} className="bg-bunyodkor-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition duration-300 flex items-center w-full sm:w-auto justify-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => {
            return (
                <div key={group.id} className="bg-card rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div>
                        <div className="flex justify-between items-start">
                           <h2 className="text-xl font-bold text-bunyodkor-blue">{group.name}</h2>
                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                group.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>{group.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        <p className="text-text-secondary mt-1 min-h-[40px]">{group.description}</p>
                        
                        <div className="mt-4 border-t pt-4">
                            <h3 className="text-sm font-semibold text-text-secondary mb-2">Created On:</h3>
                            <p className="text-sm text-text-primary">{new Date(group.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="mt-6">
                         <button onClick={() => setSelectedGroup(group)} className="w-full bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300">
                            Manage Group
                        </button>
                    </div>
                </div>
            )
        })}
      </div>
      {selectedGroup && <GroupDetailsModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />}
      {isAddGroupModalOpen && <AddGroupModal onClose={() => setIsAddGroupModalOpen(false)} onAddGroup={handleAddGroup} />}
    </div>
  );
};

// Icons
const PlusIcon = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

export default Groups;
