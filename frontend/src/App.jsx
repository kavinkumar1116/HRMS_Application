import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import Dashboard from './components/Dashboard/Dashboard';  
import HealthCheck from './pages/HealthCheck';
import Employees from './pages/Employees';
import Department from './components/Department/Department';
import Designation from './components/Designation/Designation';
import Locations from './components/Locations/Locations';
import Branches from './components/Branches/Branches';
import Attendance from './components/Attendance/Attendance';
import EmployeeAttendance from './components/Attendance/Employee_attendance';
import Payroll from './components/Payroll/Payroll';
import PlaceholderPage from './pages/PlaceholderPage';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/health"
        element={
          <RequireAuth>
            <Layout>
              <HealthCheck />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/employees"
        element={
          <RequireAuth>
            <Layout>
              <Employees />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/attendance"
        element={
          <RequireAuth>
            <Layout>
              <Attendance />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/employee_attendance"
        element={
          <RequireAuth>
            <Layout>
              <EmployeeAttendance />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/payroll"
        element={
          <RequireAuth>
            <Layout>
              <Payroll />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/department"
        element={
          <RequireAuth>
            <Layout>
              <Department />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/designations"
        element={
          <RequireAuth>
            <Layout>
              <Designation />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/locations"
        element={
          <RequireAuth>
            <Layout>
              <Locations />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/branches"
        element={
          <RequireAuth>
            <Layout>
              <Branches />
            </Layout>
          </RequireAuth>
        }
      />
    </Routes>
    
  );
}

export default App;