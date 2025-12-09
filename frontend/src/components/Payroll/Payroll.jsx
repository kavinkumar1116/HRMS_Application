import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  TablePagination,
  Chip,
  CircularProgress
} from '@mui/material';
import { Download, Search, FilterList, Print } from '@mui/icons-material';
import { format } from 'date-fns';
import apiClient from '../../services/apiClient';
import './Payroll.css';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: 'all',
    department: 'all'
  });
  const [departments, setDepartments] = useState([]);

  // Fetch payroll data
  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const params = {
        month: filters.month,
        year: filters.year,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.department !== 'all' && { department: filters.department })
      };
      
      const response = await apiClient.get('/payroll/', { params });
      setPayrolls(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get('/departments/');
      setDepartments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  useEffect(() => {
    fetchPayrolls();
    fetchDepartments();
  }, [filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0);
  };

  const handleGeneratePayslips = async () => {
    try {
      await apiClient.post('/payroll/generate/', {
        month: filters.month,
        year: filters.year
      });
      fetchPayrolls();
    } catch (err) {
      setError('Failed to generate payslips');
    }
  };

  const handleDownloadPayslip = async (employeeId) => {
    try {
      const response = await apiClient.get(`/payroll/${employeeId}/payslip/`, {
        params: {
          month: filters.month,
          year: filters.year,
          responseType: 'blob'
        }
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip-${employeeId}-${filters.month}-${filters.year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download payslip');
    }
  };

  const getStatusChip = (status) => {
    const statusMap = {
      'paid': { label: 'Paid', color: 'success' },
      'pending': { label: 'Pending', color: 'warning' },
      'processing': { label: 'Processing', color: 'info' },
      'failed': { label: 'Failed', color: 'error' }
    };
    
    const statusInfo = statusMap[status.toLowerCase()] || { label: status, color: 'default' };
    return (
      <Chip 
        label={statusInfo.label} 
        color={statusInfo.color} 
        size="small"
        variant="outlined"
      />
    );
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="payroll-container">
      <div className="payroll-header">
        <Typography variant="h5" component="h2" gutterBottom>
          Employee Payroll
        </Typography>
        <div className="action-buttons">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Download />}
            onClick={handleGeneratePayslips}
            disabled={loading}
          >
            Generate Payslips
          </Button>
        </div>
      </div>

      <Paper className="filters-container" elevation={1}>
        <div className="filter-row">
          <FormControl size="small" className="filter-field">
            <InputLabel>Month</InputLabel>
            <Select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              label="Month"
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" className="filter-field">
            <InputLabel>Year</InputLabel>
            <Select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              label="Year"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" className="filter-field">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" className="filter-field">
            <InputLabel>Department</InputLabel>
            <Select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              label="Department"
            >
              <MenuItem value="all">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Paper>

      {error && (
        <div className="error-message">
          <Typography color="error">{error}</Typography>
        </div>
      )}

      <Paper className="payroll-table-container" elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Basic Salary</TableCell>
                <TableCell>Allowances</TableCell>
                <TableCell>Deductions</TableCell>
                <TableCell>Net Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Box p={4}>
                      <CircularProgress />
                      <Typography variant="body2" color="textSecondary" style={{ marginTop: '1rem' }}>
                        Loading payroll data...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : payrolls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Box p={4}>
                      <Typography variant="body1" color="textSecondary">
                        No payroll records found for the selected filters.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                payrolls
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell>{payroll.employee_name}</TableCell>
                      <TableCell>{payroll.employee_id}</TableCell>
                      <TableCell>{payroll.department}</TableCell>
                      <TableCell>${payroll.basic_salary?.toFixed(2)}</TableCell>
                      <TableCell>${payroll.total_allowances?.toFixed(2)}</TableCell>
                      <TableCell>${payroll.total_deductions?.toFixed(2)}</TableCell>
                      <TableCell>${payroll.net_salary?.toFixed(2)}</TableCell>
                      <TableCell>{getStatusChip(payroll.status)}</TableCell>
                      <TableCell>
                        {payroll.payment_date 
                          ? format(new Date(payroll.payment_date), 'MMM dd, yyyy') 
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleDownloadPayslip(payroll.employee_id)}
                          disabled={payroll.status !== 'paid'}
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={payrolls.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default Payroll;