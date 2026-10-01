import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  DollarSign,
  PieChart,
  Building2,
  Users,
  FileCheck,
  FileText,
  CheckCircle2,
  UserCheck,
  ListTodo,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user } = useAuth();
  const role = user?.role || 'MUNICIPAL_ADMIN';

  const getNavItems = () => {
    switch (role) {
      case 'DEPT_HEAD':
        return [
          { to: '/dept-dashboard', label: 'Dept Dashboard', icon: LayoutDashboard },
          { to: '/services', label: 'Services', icon: Activity },
          { to: '/grievances', label: 'Grievances', icon: AlertTriangle },
          { to: '/budget', label: 'Dept Budget', icon: PieChart },
        ];
      case 'COMPLIANCE_AUDITOR':
        return [
          { to: '/dashboard', label: 'Audit Cockpit', icon: LayoutDashboard },
          { to: '/revenue', label: 'Revenue Reports', icon: DollarSign },
          { to: '/budget', label: 'Budget Ledgers', icon: PieChart },
          { to: '/reports', label: 'Audit Logs & Export', icon: FileText },
        ];
      case 'FIELD_OFFICER':
        return [
          { to: '/field-tasks', label: 'My Assigned Tasks', icon: ListTodo },
          { to: '/services', label: 'Municipal Services', icon: Activity },
          { to: '/grievances', label: 'Grievances Queue', icon: AlertTriangle },
        ];
      case 'CITIZEN':
        return [
          { to: '/citizen-portal', label: 'Citizen Dashboard', icon: LayoutDashboard },
          { to: '/citizen-tracking', label: 'Track My Dockets', icon: Search },
          { to: '/citizen-receipts', label: 'Bills & Receipts', icon: FileText },
        ];
      default:
        return [
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/services', label: 'Services', icon: Activity },
          { to: '/grievances', label: 'Grievances', icon: AlertTriangle },
          { to: '/revenue', label: 'Revenue', icon: DollarSign },
          { to: '/budget', label: 'Budget', icon: PieChart },
          { to: '/departments', label: 'Departments', icon: Building2 },
          { to: '/citizens', label: 'Citizens', icon: Users },
          { to: '/permits', label: 'Permits', icon: FileCheck },
          { to: '/reports', label: 'Reports', icon: FileText },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {mobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose} 
        />
      )}

      <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && (
            <span className="sidebar-role-tag">
              {role.replace('_', ' ')}
            </span>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="sidebar-collapse-btn"
              title={isCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
              aria-label="Toggle sidebar width"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
