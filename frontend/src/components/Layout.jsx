import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiMenu, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiLogOut 
} from 'react-icons/fi';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`hrms-app ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
      <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="hrms-content-shell">
        <aside className={`hrms-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
          <div className="hrms-sidebar-section">
            <ul>
              <li className="sidebar-item">
                <FiUser className="sidebar-icon" />
                <NavLink to="/employees" className="sidebar-link">Employees</NavLink>
              </li>
              <li className="sidebar-item">
                <FiClock className="sidebar-icon" />
                <NavLink to="/attendance" className="sidebar-link">Attendance</NavLink>
              </li>
              <li className="sidebar-item">
                <FiCalendar className="sidebar-icon" />
                <NavLink to="/leave-requests" className="sidebar-link">Leave Requests</NavLink>
              </li>
            </ul>
          </div>
        </aside>
        
        <main className="hrms-main">
          {isMobile && !isSidebarOpen && (
            <button className="mobile-menu-toggle" onClick={toggleSidebar}>
              <FiMenu size={24} />
            </button>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;