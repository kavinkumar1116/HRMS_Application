import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import './Header.css';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuClick, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const userName = user?.username || 'User';
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="hrms-header">
        <div className="hrms-header-left">
          <button className="menu-toggle" onClick={onMenuClick}>
            <FiMenu size={24} />
          </button>
          <div className="hrms-logo">
            <span className="hrms-logo-mark">HR</span>
            <span className="hrms-logo-text">HRMS</span>
          </div>
          <nav className="hrms-nav">
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/employees">Employees</NavLink>
            <div className="dropdown">
              <button className="dropbtn">Attendance</button>
              <div className="dropdown-content">
                <NavLink to="/attendance">Man Day Attendance</NavLink>
                <NavLink to="/employee_attendance">Employee Attendance</NavLink>
              </div>
            </div>
            <NavLink to="/payroll">Payroll</NavLink>
            <div className="dropdown">
              <button className="dropbtn">Masters</button>
              <div className="dropdown-content">
                <NavLink to="/department">Departments</NavLink>
                <NavLink to="/designations">Designations</NavLink>
                <NavLink to="/locations">Location</NavLink>
                <NavLink to="/branches">Branch</NavLink>
              </div>
            </div>
            <div className="dropdown">
              <button className="dropbtn">Settings</button>
              <div className="dropdown-content">
                <NavLink to="/permissions">Permissions</NavLink>
                <NavLink to="/users">Users</NavLink>
                <NavLink to="/roles">Roles</NavLink>
                <NavLink to="/billing">Billing</NavLink>
                <NavLink to="/notifications">Notifications</NavLink>
                <NavLink to="/backup">Backup & Restore</NavLink>
              </div>
            </div>
          </nav>
        </div>

        <div className="hrms-header-right">
          {isLoggedIn ? (
            <>
              <button
                type="button"
                className="hrms-header-icon-button"
                title="Notifications"
              >
                🔔
              </button>
              <div className="hrms-profile">
                <div className="hrms-avatar">
                  <span>{userName.charAt(0)}</span>
                </div>
                <div className="hrms-profile-info">
                  <span className="hrms-profile-name">{userName}</span>
                  <button
                    type="button"
                    className="hrms-logout-btn"
                    onClick={handleLogoutClick}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button type="button" className="hrms-login-btn">
              Login
            </button>
          )}
        </div>
      </header>

      {showLogoutConfirm && (
        <div className="hrms-logout-backdrop">
          <div className="hrms-logout-modal">
            <h3>Are you sure you want to logout?</h3>
            <div className="hrms-logout-actions">
              <button type="button" onClick={handleCancelLogout}>
                No
              </button>
              <button type="button" className="confirm" onClick={handleConfirmLogout}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;


            <NavLink to="/settings">Setup</NavLink>
