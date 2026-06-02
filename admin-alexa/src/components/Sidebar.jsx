import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Users, Megaphone, DollarSign, ClipboardCheck, LogOut, Shield, X } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/activity', icon: Activity, label: 'Operations Center' },
  { path: '/users', icon: Users, label: 'User Command' },
  { path: '/campaigns', icon: Megaphone, label: 'Campaign Center' },
  { path: '/finance', icon: DollarSign, label: 'Financial Control' },
  { path: '/submissions', icon: ClipboardCheck, label: 'Submission Review' },
];

const Sidebar = ({ onLogout, sidebarOpen, onCloseSidebar }) => {
  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" style={{ flex: 1 }}>
          <Shield size={28} className="text-cyan" />
          <div>
            <span className="sidebar-title">Admin Alexa</span>
            <span className="sidebar-subtitle">Control Cockpit</span>
          </div>
        </div>
        <button className="mobile-toggle" onClick={onCloseSidebar} title="Close Menu" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">MAIN OPERATIONS</div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          <span>End Session</span>
        </button>
        <div className="sidebar-version">
          <div className="status-dot online"></div>
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
