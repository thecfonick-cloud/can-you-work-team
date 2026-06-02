import { Bell, Clock, Menu } from 'lucide-react';

const Topbar = ({ title, onToggleSidebar }) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-toggle" onClick={onToggleSidebar} title="Open Menu">
          <Menu size={20} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-clock">
          <Clock size={14} />
          <span className="text-mono">{timeStr}</span>
          <span className="text-muted">{dateStr}</span>
        </div>
        <button className="topbar-icon-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        <div className="topbar-avatar">
          <span>A</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
