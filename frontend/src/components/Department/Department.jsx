import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import '../../styles/common.css';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    manager: '',
    location: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch departments from API on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setFetching(true);
        const response = await apiClient.get('/departments/');
        setDepartments(response.data || []);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load departments');
      } finally {
        setFetching(false);
      }
    };

    fetchDepartments();
  }, []);

  const openModal = () => {
    setForm({
      name: '',
      description: '',
      manager: '',
      location: ''
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (editingId) {
      await apiClient.put(`/departments/update/${editingId}/`, form);  // Updated this line
      setDepartments(prev => 
        prev.map(dept => (dept.id === editingId ? { ...form, id: editingId } : dept))
      );
    } else {
      const response = await apiClient.post('/departments/', form);
      setDepartments(prev => [...prev, response.data]);
    }
    closeModal();
  } catch (err) {
    setError(err.response?.data?.detail || 'Failed to save department');
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await apiClient.delete(`/departments/delete/${id}/`);
        setDepartments(prev => prev.filter(dept => dept.id !== id));
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete department');
      }
    }
  };

  const handleEdit = (department) => {
    setForm({
      name: department.name,
      description: department.description,
      manager: department.manager,
      location: department.location
    });
    setEditingId(department.id);
    setIsModalOpen(true);
  };

  // Filter and sort departments
  const filtered = departments.filter(dept => {
    const term = search.toLowerCase();
    return (
      dept.name.toLowerCase().includes(term) ||
      dept.manager.toLowerCase().includes(term) ||
      dept.location.toLowerCase().includes(term) ||
      (dept.description && dept.description.toLowerCase().includes(term))
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

  return (
    <section className="employee-section">
      <div className="employee-header">
        <h2>Departments</h2>
        <div className="employee-header-actions">
          <input
            type="text"
            className="employee-search"
            placeholder="Search departments..."
            value={search}
            onChange={handleSearchChange}
          />
          <button type="button" className="employee-add-btn" onClick={openModal}>
            + Add Department
          </button>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="employee-error-banner">
          {error}
        </div>
      )}

      {fetching ? (
        <div className="employee-loading">Loading departments...</div>
      ) : (
        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th onClick={() => handleSort('name')} className="sortable">
                  Department Name{sortField === 'name' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
                <th onClick={() => handleSort('description')} className="sortable">
                  Description{sortField === 'description' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
                <th onClick={() => handleSort('manager')} className="sortable">
                  Manager{sortField === 'manager' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
                <th onClick={() => handleSort('location')} className="sortable">
                  Location{sortField === 'location' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length > 0 ? (
                paged.map((dept, index) => (
                  <tr key={dept.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{dept.name}</td>
                    <td>{dept.description || '-'}</td>
                    <td>{dept.manager || '-'}</td>
                    <td>{dept.location || '-'}</td>
                    <td>
                      <div className="employee-action-buttons">
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => handleEdit(dept)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => handleDelete(dept.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="employee-empty">
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {sorted.length > 0 && (
            <div className="employee-pagination">
              <div>
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sorted.length)} of {sorted.length} entries
              </div>
              <div className="employee-pagination-buttons">
                <button
                  type="button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="employee-modal-backdrop">
          <div className="employee-modal">
            <div className="employee-modal-header">
              <h3>{editingId ? 'Edit Department' : 'Add New Department'}</h3>
              <button type="button" className="employee-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            
            <form className="employee-form" onSubmit={handleSubmit}>
              {error && isModalOpen && (
                <div className="employee-form-error">
                  {error}
                </div>
              )}

              <div className="employee-form-row">
                <label htmlFor="name">Department Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="employee-form-row">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="employee-form-row">
                <label htmlFor="manager">Manager</label>
                <input
                  type="text"
                  id="manager"
                  name="manager"
                  value={form.manager}
                  onChange={handleInputChange}
                />
              </div>

              <div className="employee-form-row">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="employee-form-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="employee-submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Department;
