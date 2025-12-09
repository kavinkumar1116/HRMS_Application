import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiClock, 
  FiDollarSign, 
  FiSettings,
  FiBriefcase,
  FiShield,
  FiUser,
  FiCreditCard,
  FiBell,
  FiDatabase
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>HRMS</h3>
      </div>
      
      <nav className="main-nav">
        <div className="nav-section">
          <p className="nav-section-title">Main</p>
          <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiHome className="nav-icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiUsers className="nav-icon" />
                <span>Employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/attendance" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiClock className="nav-icon" />
                <span>Attendance</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/payroll" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiDollarSign className="nav-icon" />
                <span>Payroll</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="nav-section">
          <p className="nav-section-title">Setup</p>
          <ul>
            <li>
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiSettings className="nav-icon" />
                <span>Settings</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/departments" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiBriefcase className="nav-icon" />
                <span>Departments</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/permissions" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiShield className="nav-icon" />
                <span>Permissions</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
