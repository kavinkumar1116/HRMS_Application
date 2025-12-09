import { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import Select from "react-select";
import '../../styles/common.css';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');  
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [edit_id, setId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    emp_id: '',
    email: '',
    department: '',
    designation: '',
    location: '',
    branch: '',
    status: false // Add a new state for employee status
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);

  const [locations, setLocations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);


  // Fetch employees from API on component mount
  useEffect(() => {
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

    const fetchDesignations = async () => {
      try {
        const response = await apiClient.get('/designations/');
        // Map the response to include both id and department_id
        const mappedDesignations = response.data.map(designation => ({
          ...designation,
          department_id: designation.department_name.id // Extract department ID from the reference
        }));
        setDesignations(mappedDesignations || []);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load designations');
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await apiClient.get('/locations/');
        setLocations(response.data || []);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load locations');
      }
    };
    const fetchBranches = async () => {
      try {
        const response = await apiClient.get('/branches/');
        // Map the response to include both id and location_id
        const mappedBranches = response.data.map(branch => ({
          ...branch,
          location_id: branch.location_name?.id // Extract location ID from the reference
        }));
        setBranches(mappedBranches || []);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load branches');
      }
    };

    fetchDepartments();
    fetchDesignations();
    fetchLocations();
    fetchBranches();
    fetchEmployees();
  }, []);

  const openModal = () => {
    setForm({
      name: '',
      emp_id: '',
      email: '',
      department: '',
      designation: '',
      location: '',
      branch: ''
    });
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeFromSubmit = async (e, edit_id) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const employeeData = {
        name: form.name,
        emp_id: form.emp_id,
        email: form.email,
        department: form.department || '',
        designation: form.designation || '',
        location: form.location || '',
        branch: form.branch || ''
      };

      const response = edit_id 
        ? await apiClient.put(`/employees/update/${edit_id}`, { id: edit_id, ...employeeData })
        : await apiClient.post('/employees/', employeeData);

      // Refresh the employee list
      const employeesResponse = await apiClient.get('/employees/');
      setEmployees(employeesResponse.data || []);
      
      // Reset form and close modal
      setForm({ 
        name: '', 
        emp_id: '',
        email: '', 
        department: '',
        designation: '',
        location: '',
        branch: ''
      });
      closeModal();
      setPage(1);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filtered = employees.filter((emp) => {
    const term = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(term) ||
      emp.emp_id.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.designation.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = String(a[sortField] ?? '').toLowerCase();
    const bVal = String(b[sortField] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paged = sorted.slice(startIndex, startIndex + pageSize);

  const handleStatusToggle = async (id, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [id]: true }));
      await apiClient.put(`/employees/update/${id}/`, { emp_status: newStatus });
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === id ? { ...emp, emp_status: newStatus } : emp
        )
      );
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/employees/delete/${id}`);
      setEmployees((prev) => prev.filter((employee, index) => employee.id !== id));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete employee');
    }
  };

  const handleEdit = async (id) => {
    openModal();
    setLoading(true);

    try {
      const response = await apiClient.get(`/employees/${id}/`);
      setId(id);
      
      // Set form with employee data
      setForm({
        name: response.data.name || '',
        emp_id: response.data.emp_id || '',
        email: response.data.email || '',
        role: response.data.role || '',
        department: response.data.department || '',
        designation: response.data.designation || '',
        location: response.data.location || '',
        branch: response.data.branch || ''
      });
      
      setIsEditModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load employee data');
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = departments.map(d => ({
  value: d.id,
  label: d.name,
}));

const designationOptions = designations.map(d => ({
  value: d.id,
  label: d.designation_name,
}));

const locationOptions = locations.map(l => ({
  value: l.id,
  label: l.location_name,
}));

const branchOptions = branches.map(b => ({
  value: b.id,
  label: b.branch_name,
}));



  const customStyles = {
    control: (base) => ({
        ...base,
        borderRadius: "8px",
        padding: "2px 4px",
        borderColor: "#ced4da",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "black", // selected text
    }),
    input: (provided) => ({
        ...provided,
        color: "black", // typing text
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#6c757d", // placeholder
    }),
    option: (provided) => ({
        ...provided,
        color: "black", // dropdown list text
    }),
    };
  return (
    <section className="employee-section">
      <div className="employee-header">
        <h2>Employees</h2>
        <div className="employee-header-actions">
          <input
            type="text"
            className="employee-search"
            placeholder="Search employees..."
            value={search}
            onChange={handleSearchChange}
          />
          <button type="button" className="employee-add-btn" onClick={openModal}>
            + Add Employee
          </button>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="employee-error-banner">
          {error}
        </div>
      )}

      {fetching ? (
        <div className="employee-loading">Loading employees...</div>
      ) : (
        <div className="employee-table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th onClick={() => handleSort('name')} className="sortable">
                Name{sortField === 'name' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
              <th onClick={() => handleSort('emp_id')} className="sortable">
                Emp ID{sortField === 'emp_id' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email{sortField === 'email' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
              <th onClick={() => handleSort('department')} className="sortable">
                Department{sortField === 'department' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
              <th onClick={() => handleSort('designation')} className="sortable">
                Designation{sortField === 'designation' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
             <th>Staus</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((emp, index) => (
              <tr key={emp.id}>
                <td>{startIndex + index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.emp_id}</td>
                <td>{emp.email}</td>
                <td>{departments.find(d => d.id === emp.department)?.name}</td>
                <td>{designations.find(d => d.id === emp.designation)?.designation_name}</td>
                <td>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={emp.emp_status !== false} 
                      onChange={() => handleStatusToggle(emp.id, !emp.emp_status)}
                      disabled={updatingStatus[emp.id]}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <div className="employee-action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(emp.id)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(emp.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} className="employee-empty">
                  No employees yet. Click &quot;Add Employee&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      <div className="employee-pagination">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="employee-pagination-buttons">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="employee-modal-backdrop" onClick={closeModal}>
          <div
            className="employee-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="employee-modal-header">
              <h3>Add Employee</h3>
              <button type="button" className="employee-modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>
            {error && (
              <div className="employee-form-error">{error}</div>
            )}
            <form className="employee-form" onSubmit={(e) => handleEmployeeFromSubmit(e, edit_id)}>
              <div className="employee-form-row">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Employee name"
                  required
                />
              </div>
              
              <div className="employee-form-row">
                <label htmlFor="emp_id">Emp ID</label>
                <input
                  id="emp_id"
                  name="emp_id"
                  type="text"
                  value={form.emp_id}
                  onChange={handleChange}
                  placeholder="Employee ID"
                  required
                />
              </div>
              
              <div className="employee-form-row">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                />
              </div>
             
              <div className="employee-form-row">
                <label htmlFor="department">Department Name</label>
                  <Select
                      styles={customStyles}
                      id="department"
                      name="department"
                      options={departmentOptions}
                      value={departmentOptions.find(option => option.value === form.department) || null}
                      onChange={(selected) => {
                        setForm(prev => ({
                          ...prev,
                          department: selected?.value || "",
                          designation: ""        // reset dependent field
                        }));
                        setFilteredDesignations([]);
                      }}
                      isSearchable
                      placeholder="Select department..."
                    />

                </div>  
                <div className="employee-form-row">
                  <label htmlFor="role">Designation</label>
                    <Select
                      styles={customStyles}
                      id="designation"
                      name="designation"
                      options={designationOptions}
                      value={designationOptions.find(option => option.value === form.designation) || null}
                      onChange={(selected) => {
                        setForm(prev => ({
                          ...prev,
                          designation: selected?.value || ""
                        }));
                      }}
                      isSearchable
                      placeholder="Select designation..."
                    />

                  </div>
              <div className="employee-form-row">
                <label htmlFor="location">Location</label>
               <Select
                  styles={customStyles}
                  id="location"
                  name="location"
                  options={locationOptions}
                  value={locationOptions.find(option => option.value === form.location) || null}
                  onChange={(selected) => {
                    setForm(prev => ({
                      ...prev,
                      location: selected?.value || "",
                      branch: ""      
                    }));
                  }}
                  isSearchable
                  placeholder="Select location..."
                />

              </div>
              <div className="employee-form-row">
                <label htmlFor="branch">Branch</label>
               <Select
                  styles={customStyles}
                  id="branch"
                  name="branch"
                  options={branchOptions}
                  value={branchOptions.find(option => option.value === form.branch) || null}
                  onChange={(selected) => {
                    setForm(prev => ({
                      ...prev,
                      branch: selected?.value || ""
                    }));
                  }}
                  isSearchable
                  placeholder="Select branch..."
                />

              </div>
              <div className="employee-form-actions">
                <button type="button" onClick={closeModal} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="employee-submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : edit_id ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Employee;


