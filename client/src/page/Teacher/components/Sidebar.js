import React from 'react';
import { 
  UserCircle, 
  BookOpen, 
  FileText, 
  Users, 
  Bell, 
  CheckCircle, 
  Activity,
  LogOut
} from 'lucide-react';

const navItems = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'completeProfile', label: 'Complete Profile', icon: FileText },
  { id: 'showClass', label: 'My Classes', icon: BookOpen },
  { id: 'Subscribed', label: 'Subscribed Students', icon: Users },
  { id: 'Document', label: 'Documents', icon: FileText },
  { id: 'Request', label: 'Requests', icon: Bell },
  { id: 'accepted', label: 'Accepted Requests', icon: CheckCircle },
  { id: 'activity', label: 'Activity', icon: Activity }
];

const Sidebar = ({ activeTab, onTabChange, onLogout }) => {
  return (
    <div className="sidebar p-3">
      <div className="d-flex flex-column">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-item btn text-start d-flex align-items-center gap-2 mb-2 p-3 border-0 ${
                activeTab === item.id ? 'active' : ''
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="nav-item btn text-start d-flex align-items-center gap-2 mb-2 p-3 border-0 text-danger"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;