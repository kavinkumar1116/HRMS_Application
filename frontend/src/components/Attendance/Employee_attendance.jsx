import { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import DatePicker from 'react-datepicker';
import { format, parse, getDaysInMonth, isWeekend } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/common.css';

const Employee_attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [monthDays, setMonthDays] = useState([]);

    // Fetch employees on component mount
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await apiClient.get('/employees/');
                setEmployees(response.data || []);
            } catch (err) {
                setError('Failed to load employees');
                console.error(err);
            }
        };
        fetchEmployees();
    }, []);

    // Generate days for the selected month
    useEffect(() => {
        if (!selectedDate) return;

        const daysInMonth = getDaysInMonth(selectedDate);
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        
        const days = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(year, month - 1, day);
            return {
                day,
                date: format(date, 'yyyy-MM-dd'),
                isWeekend: isWeekend(date)
            };
        });
        
        setMonthDays(days);
        fetchAttendance(month, year);
    }, [selectedDate]);

    // Fetch attendance data
    const fetchAttendance = async (month, year) => {
        if (!selectedEmployee) return;
        
        try {
            setLoading(true);
            const response = await apiClient.get(`/attendance/`, {
                params: {
                    employee_id: selectedEmployee,
                    month,
                    year
                }
            });
            
            // Convert array of attendance records to a map by date
            const attendanceMap = {};
            response.data.forEach(record => {
                attendanceMap[record.date] = {
                    id: record.id,
                    check_in: record.check_in,
                    check_out: record.check_out,
                    status: record.status
                };
            });
            
            setAttendance(attendanceMap);
        } catch (err) {
            setError('Failed to load attendance data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle check-in/check-out
    const handleAttendanceAction = async (date, action) => {
        if (!selectedEmployee) {
            setError('Please select an employee');
            return;
        }

        try {
            const time = format(new Date(), 'HH:mm');
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            
            if (action === 'check_in') {
                const response = await apiClient.post('/attendance/', {
                    employee_id: selectedEmployee,
                    date: dateStr,
                    check_in: time
                });
                
                setAttendance(prev => ({
                    ...prev,
                    [dateStr]: {
                        ...prev[dateStr],
                        id: response.data.id,
                        check_in: time,
                        status: 'Present'
                    }
                }));
            } else if (action === 'check_out' && attendance[date]?.id) {
                const response = await apiClient.post(`/attendance/${attendance[date].id}/check_out/`, {
                    check_out: time
                });
                
                setAttendance(prev => ({
                    ...prev,
                    [date]: {
                        ...prev[date],
                        check_out: time,
                        status: response.data.status
                    }
                }));
            }
        } catch (err) {
            setError(`Failed to update ${action === 'check_in' ? 'check-in' : 'check-out'}`);
            console.error(err);
        }
    };

    // Check if action is allowed
    const isActionDisabled = (day, action) => {
        const dateStr = day.date;
        if (action === 'check_in') {
            return !!attendance[dateStr]?.check_in;
        } else {
            return !attendance[dateStr]?.check_in || !!attendance[dateStr]?.check_out;
        }
    };

    return (
        <div className="container">
            <h2>Employee Attendance</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3 row">
                <div className="col-md-4">
                    <label className="form-label">Select Employee</label>
                    <select
                        className="form-select"
                        value={selectedEmployee || ''}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} ({emp.emp_id})
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="col-md-4">
                    <label className="form-label">Select Month</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        className="form-control"
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Date</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthDays.map(({ day, date, isWeekend }) => {
                            const dayAttendance = attendance[date] || {};
                            const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                            
                            return (
                                <tr key={date} className={`${isWeekend ? "table-secondary" : ""} ${day % 2 === 0 ? "even" : "odd"}`}>

                                    <td>{dayOfWeek}</td>
                                    <td>{day}</td>
                                    <td>{dayAttendance.check_in || '-'}</td>
                                    <td>{dayAttendance.check_out || '-'}</td>
                                    <td>
                                        <span className={`badge ${
                                            dayAttendance.status === 'Present' ? 'bg-success' : 
                                            dayAttendance.status === 'Half-day' ? 'bg-warning' : 'bg-secondary'
                                        }`}>
                                            {dayAttendance.status || 'Absent'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleAttendanceAction(date, 'check_in')}
                                                disabled={loading || isWeekend || isActionDisabled({ date }, 'check_in')}
                                                style={{marginRight: 13}}
                                            >
                                                Check In
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleAttendanceAction(date, 'check_out')}
                                                disabled={loading || isWeekend || isActionDisabled({ date }, 'check_out')}
                                                style={{marginLeft: 13}}
                                            >
                                                Check Out
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Employee_attendance;