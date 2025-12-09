import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiBriefcase, 
  FiClock, 
  FiCalendar, 
  FiTrendingUp, 
  FiBell, 
  FiCalendar as FiCal, 
  FiClock as FiTime,
  FiUserCheck,
  FiUserX,
  FiAward,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiClock as FiPending,
  FiGift,
  FiActivity,
  FiPieChart,
  FiBarChart2
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  // Main Statistics
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: 0,
    presentToday: 0,
    leaveRequests: 0,
    onLeave: 0,
    totalProjects: 0,
    pendingTasks: 0,
    upcomingBirthdays: 0,
    totalClients: 0
  });

  // Attendance Overview
  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0
  });

  // Leave Balance
  const [leaveBalance, setLeaveBalance] = useState({
    casual: { total: 12, used: 2, remaining: 10 },
    sick: { total: 10, used: 3, remaining: 7 },
    earned: { total: 8, used: 1, remaining: 7 },
    compOff: { total: 5, used: 0, remaining: 5 }
  });

  // Recent Activities
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Upcoming Holidays
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  
  // Upcoming Birthdays
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  
  // Project Status
  const [projectStatus, setProjectStatus] = useState({
    completed: 0,
    inProgress: 0,
    onHold: 0,
    notStarted: 0
  });

  useEffect(() => {
    // In a real app, these would be API calls
    setStats({
      totalEmployees: 124,
      departments: 8,
      presentToday: 98,
      leaveRequests: 5,
      onLeave: 12,
      totalProjects: 24,
      pendingTasks: 18,
      upcomingBirthdays: 5,
      totalClients: 42
    });

    setAttendance({
      present: 98,
      absent: 14,
      late: 12,
      onLeave: 12
    });

    setProjectStatus({
      completed: 12,
      inProgress: 8,
      onHold: 2,
      notStarted: 2
    });

    setRecentActivities([
      { id: 1, user: 'John Doe', action: 'applied for leave', time: '2 hours ago', type: 'leave' },
      { id: 2, user: 'Jane Smith', action: 'submitted project report', time: '3 hours ago', type: 'project' },
      { id: 3, user: 'Mike Johnson', action: 'marked attendance', time: '4 hours ago', type: 'attendance' },
      { id: 4, user: 'Sarah Williams', action: 'updated profile information', time: '5 hours ago', type: 'profile' },
      { id: 5, user: 'David Wilson', action: 'submitted timesheet', time: '1 day ago', type: 'timesheet' },
    ]);

    setUpcomingHolidays([
      { id: 1, name: 'New Year\'s Day', date: 'Jan 1, 2024' },
      { id: 2, name: 'Republic Day', date: 'Jan 26, 2024' },
      { id: 3, name: 'Holi', date: 'Mar 8, 2024' },
      { id: 4, name: 'Independence Day', date: 'Aug 15, 2024' },
    ]);

    setUpcomingBirthdays([
      { id: 1, name: 'John Doe', date: 'Dec 15, 2023', department: 'Engineering' },
      { id: 2, name: 'Alice Smith', date: 'Dec 22, 2023', department: 'Marketing' },
      { id: 3, name: 'Robert Johnson', date: 'Dec 28, 2023', department: 'Sales' },
    ]);

    setUpcomingHolidays([
      { id: 1, date: '2023-12-25', name: 'Christmas Day' },
      { id: 2, date: '2024-01-01', name: 'New Year\'s Day' },
    ]);
  }, []);

  // Calculate attendance percentage
  const attendancePercentage = Math.round((attendance.present / (stats.totalEmployees - attendance.onLeave)) * 100);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your HRMS today.</p>
      </div>

      {/* Key Statistics */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalEmployees}</h3>
            <p>Total Employees</p>
            <span className="trend up">
              <FiTrendingUp size={14} /> 12% from last month
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiBriefcase size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalProjects}</h3>
            <p>Active Projects</p>
            <span className="trend up">
              <FiTrendingUp size={14} /> 3 new this month
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiUserCheck size={24} />
          </div>
          <div className="stat-content">
            <h3>{attendancePercentage}%</h3>
            <p>Attendance Today</p>
            <span className="trend up">
              <FiTrendingUp size={14} /> {attendance.present} present
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiDollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>${(stats.totalEmployees * 2500).toLocaleString()}</h3>
            <p>Monthly Payroll</p>
            <span className="trend down">
              <FiTrendingUp size={14} /> 5% from last month
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          {/* Attendance Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Attendance Overview</h3>
              <a href="#" className="view-all">View Details</a>
            </div>
            <div className="attendance-stats">
              <div className="attendance-stat">
                <div className="stat-icon present">
                  <FiUserCheck size={20} />
                </div>
                <div>
                  <h4>{attendance.present}</h4>
                  <p>Present</p>
                </div>
              </div>
              <div className="attendance-stat">
                <div className="stat-icon absent">
                  <FiUserX size={20} />
                </div>
                <div>
                  <h4>{attendance.absent}</h4>
                  <p>Absent</p>
                </div>
              </div>
              <div className="attendance-stat">
                <div className="stat-icon late">
                  <FiClock size={20} />
                </div>
                <div>
                  <h4>{attendance.late}</h4>
                  <p>Late</p>
                </div>
              </div>
              <div className="attendance-stat">
                <div className="stat-icon" style={{ background: '#E9D8FD', color: '#9F7AEA' }}>
                  <FiCalendar size={20} />
                </div>
                <div>
                  <h4>{attendance.onLeave}</h4>
                  <p>On Leave</p>
                </div>
              </div>
            </div>
            <div className="chart-placeholder">
              <FiBarChart2 size={40} style={{ marginBottom: '10px' }} />
              <p>Weekly attendance chart will be displayed here</p>
            </div>
          </div>

          {/* Project Status */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Project Status</h3>
              <a href="#" className="view-all">View All Projects</a>
            </div>
            <div className="attendance-stats">
              <div className="attendance-stat">
                <div className="stat-icon" style={{ background: '#C6F6D5', color: '#38A169' }}>
                  <FiCheckCircle size={20} />
                </div>
                <div>
                  <h4>{projectStatus.completed}</h4>
                  <p>Completed</p>
                </div>
              </div>
              <div className="attendance-stat">
                <div className="stat-icon" style={{ background: '#BEE3F8', color: '#3182CE' }}>
                  <FiActivity size={20} />
                </div>
                <div>
                  <h4>{projectStatus.inProgress}</h4>
                  <p>In Progress</p>
                </div>
              </div>
              <div className="attendance-stat">
                <div className="stat-icon" style={{ background: '#FEEBC8', color: '#DD6B20' }}>
                  <FiClock size={20} />
                </div>
                <div>
                  <h4>{projectStatus.onHold}</h4>
                  <p>On Hold</p>
                </div>
              </div>
              <div className="attendance-stat">
                <div className="stat-icon" style={{ background: '#E2E8F0', color: '#718096' }}>
                  <FiAlertCircle size={20} />
                </div>
                <div>
                  <h4>{projectStatus.notStarted}</h4>
                  <p>Not Started</p>
                </div>
              </div>
            </div>
            <div className="chart-placeholder">
              <FiPieChart size={40} style={{ marginBottom: '10px' }} />
              <p>Project status chart will be displayed here</p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Recent Activities</h3>
              <a href="#" className="view-all">View All</a>
            </div>
            <ul className="activity-list">
              {recentActivities.map(activity => (
                <li key={activity.id} className="activity-item">
                  <div className="activity-avatar" style={{
                    background: activity.type === 'leave' ? '#FED7D7' : 
                               activity.type === 'project' ? '#BEE3F8' : 
                               activity.type === 'attendance' ? '#C6F6D5' : 
                               activity.type === 'timesheet' ? '#FEEBC8' : '#E9D8FD',
                    color: activity.type === 'leave' ? '#E53E3E' : 
                           activity.type === 'project' ? '#3182CE' : 
                           activity.type === 'attendance' ? '#38A169' : 
                           activity.type === 'timesheet' ? '#DD6B20' : '#9F7AEA'
                  }}>
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="activity-details">
                    <p><strong>{activity.user}</strong> {activity.action}</p>
                    <div className="activity-time">
                      <FiClock size={12} /> {activity.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-sidebar">
          {/* Leave Balance */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>My Leave Balance</h3>
              <a href="#" className="view-all">Apply</a>
            </div>
            <div className="leave-balance">
              {Object.entries(leaveBalance).map(([type, data]) => (
                <div key={type} className="leave-progress">
                  <div className="leave-info">
                    <span className="leave-type">
                      {type.charAt(0).toUpperCase() + type.slice(1)} Leave
                    </span>
                    <span className="leave-count">
                      {data.remaining} / {data.total} days
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${(data.remaining / data.total) * 100}%`,
                        background: type === 'casual' ? '#4299E1' : 
                                  type === 'sick' ? '#48BB78' : 
                                  type === 'earned' ? '#9F7AEA' : '#ED8936'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              <button className="apply-leave-btn">
                <FiCalendar size={16} style={{ marginRight: '8px' }} />
                Apply for Leave
              </button>
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Upcoming Holidays</h3>
              <a href="#" className="view-all">View All</a>
            </div>
            <ul className="holiday-list">
              {upcomingHolidays.map(holiday => (
                <li key={holiday.id} className="holiday-item">
                  <span className="holiday-name">{holiday.name}</span>
                  <span className="holiday-date">
                    <FiCal size={14} /> {holiday.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Birthdays This Month */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Birthdays This Month</h3>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="birthday-list">
              {upcomingBirthdays.map(birthday => (
                <div key={birthday.id} className="birthday-item">
                  <div className="birthday-avatar">
                    {birthday.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="birthday-details">
                    <p><strong>{birthday.name}</strong></p>
                    <span>{birthday.department} • {birthday.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <FiClock size={18} />
                <span>Mark Attendance</span>
              </button>
              <button className="quick-action-btn">
                <FiCalendar size={18} />
                <span>Request Time Off</span>
              </button>
              <button className="quick-action-btn">
                <FiDollarSign size={18} />
                <span>View Payslip</span>
              </button>
              <button className="quick-action-btn">
                <FiBriefcase size={18} />
                <span>Submit Timesheet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;