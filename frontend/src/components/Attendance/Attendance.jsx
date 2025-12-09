import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Box,
  IconButton,
  TablePagination,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { format, getDaysInMonth, isWeekend, addMonths, subMonths } from 'date-fns';
import { ArrowLeft, ArrowRight, Save, Download, FilterList } from '@mui/icons-material';
import './Attendance.css';
import '../../styles/common.css';
import apiClient from '../../services/apiClient';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [attendance, setAttendance] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState('all');
  
  const fetchEmployees = async () => {
        try {
          setFetching(true);
          const response = await apiClient.get('/employees/');
          setEmployees(response.data || []);
        } catch (err) {
          setError(err.response?.data?.detail || 'Failed to load employees');
        } finally {
          setFetching(false);
        }
      };
  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get('/departments/');
      setDepartments(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load departments');
    }
  };
      useEffect(()=>{
        fetchEmployees();
        fetchDepartments();
      },[])

 

  // Initialize days of the current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = getDaysInMonth(new Date(year, month));
    
    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      days.push(new Date(year, month, i));
    }
    setDaysInMonth(days);

    // Initialize attendance state
    const initialAttendance = {};
    employees.forEach(emp => {
      initialAttendance[emp.id] = {};
      days.forEach(day => {
        initialAttendance[emp.id][format(day, 'yyyy-MM-dd')] = false;
      });
    });
    setAttendance(initialAttendance);
  }, [currentDate, employees]);

  const handleAttendanceChange = (employeeId, date, isPresent) => {
    setAttendance(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [format(date, 'yyyy-MM-dd')]: isPresent
      }
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isWeekendDay = (date) => {
    return isWeekend(date);
  };

  const getDayCellStyle = (date) => {
    return {
      backgroundColor: isWeekendDay(date) ? '#f9f9f9' : 'white',
      color: isWeekendDay(date) ? '#999' : 'inherit',
      textAlign: 'center',
    };
  };

  const filteredEmployees = employees.filter(employee => 
    filterDepartment === 'all' || employee.department === filterDepartment
  );

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving attendance:', attendance);
  };

  return (
    <section className="employee-section">
      <div className="employee-header">
        <h2>Attendance</h2>
        <div className="employee-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <IconButton onClick={handlePrevMonth} size="small">
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle1" style={{ margin: '0 10px' }}>
              {format(currentDate, 'MMMM yyyy')}
            </Typography>
            <IconButton onClick={handleNextMonth} size="small">
              <ArrowRight />
            </IconButton>
          </div>
        </div>
        <div className="attendance-actions">
          <FormControl size="small" variant="outlined" style={{ minWidth: 150, marginRight: '10px' }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              label="Select Department"
            >
              <MenuItem value="all">Select Department</MenuItem>
              {departments.map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
            style={{ marginRight: '10px' }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-scroll-container">
          <table className="attendance-table">
            <TableHead>
              <TableRow>
                <th className="employee-name-cell">Employee Name</th>
                {daysInMonth.map((day) => (
                  <th 
                    key={day.getTime()}
                    className={isWeekendDay(day) ? 'weekend' : ''}
                  >
                    <div>{format(day, 'd')}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>
                      {format(day, 'EEE')}
                    </div>
                  </th>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                  <TableRow key={employee.id} hover>
                    <td className="employee-name-cell">
                      <div style={{ fontWeight: '500' }}>{employee.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>{departments.find((depat)=>depat.id===employee.department).name}</div>
                    </td>
                    {daysInMonth.map((day) => (
                      <td 
                        key={`${employee.id}-${day.getTime()}`}
                        className={isWeekendDay(day) ? 'weekend' : ''}
                      >
                        <Checkbox
                          checked={attendance[employee.id]?.[format(day, 'yyyy-MM-dd')] || false}
                          onChange={(e) => 
                            handleAttendanceChange(employee.id, day, e.target.checked)
                          }
                          color="primary"
                          size="small"
                          disabled={isWeekendDay(day)}
                          style={{ padding: '4px' }}
                        />
                      </td>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </table>
        </div>
        
        <div className="pagination-container">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEmployees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div> 
     </section>
  );
};

export default Attendance;