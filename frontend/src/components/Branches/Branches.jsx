import React, { useState, useEffect } from 'react';
import Select from "react-select";
import apiClient from '../../services/apiClient';
import '../../styles/common.css';

const Branches = () => {

        const [branches, setBranches] = useState([]);
        const [search, setSearch] = useState('');
        const [sortField, setSortField] = useState('name');
        const [sortDirection, setSortDirection] = useState('asc');
        const [page, setPage] = useState(1);
        const pageSize = 5;
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [editingId, setEditingId] = useState(null);
        const [form, setForm] = useState({ name: '', location_name: '' });
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(false);
        const [fetching, setFetching] = useState(true);
        const [locations, setLocations] = useState([]);

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

    const handleEdit = (data) => {
          setForm({
            branch_name: data.branch_name,
            location_name: data.location_name  
          });
          setEditingId(data.id);
          setIsModalOpen(true);
        };


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
          try {
            await apiClient.delete(`/branches/delete/${id}/`);
            setBranches(prev => prev.filter(location => location.id !== id));
          } catch (err) {
            setError(err.response?.data?.detail || 'Failed to delete location');
          }
        }
      };

    const openModal = () => {
        setForm({ location_name: '' });
        setEditingId(null);
        setIsModalOpen(true);
      };

    const closeModal = () => {
        setIsModalOpen(false);
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
          ...prev,
          [name]: value
        }));
      };


    useEffect(()=>{
  
    const fetchLocations = async () => {
        try {
            const response = await apiClient.get('/locations/');
            setLocations(response.data);
        } catch (err) {
            setError('Failed to fetch locations');
            console.error('Error fetching locations:', err);
        }
    };

    const fetchBranch = async () =>{
        try {
            setFetching(true);
            const response = await apiClient.get('/branches/');
            setBranches(response.data || []);
          } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load branches');
          } finally {
            setFetching(false);
          }
    }

        fetchLocations();
        fetchBranch();
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          if (editingId) {
            await apiClient.put(`/branches/update/${editingId}/`, form);
            setBranches(prev => 
              prev.map(location => (location.id === editingId ? { ...form, id: editingId } : location))
            );
          } else {
            const response = await apiClient.post('/branches/', form);
            setBranches(prev => [...prev, response.data]);
          }
          closeModal();
        } catch (err) {
          setError(err.response?.data?.detail || 'Failed to save location');
        } finally {
          setLoading(false);
        }
      };


    const locationOptions = locations.map(loc => ({
        value: loc.id,
        label: loc.location_name,
        }));
   // Filter and sort departments
  const filtered = branches.filter(location => {
    const term = search.toLowerCase();
    return location.location_name.toLowerCase().includes(term);
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
        <h2>Branches</h2>
        <div className="employee-header-actions">
          <input
            type="text"
            className="employee-search"
            placeholder="Search branches..."
            value={search}
            onChange={handleSearchChange}
          />
          <button type="button" className="employee-add-btn" onClick={openModal}>
            + Add Branch
          </button>
        </div>
      </div>
      
      {fetching ? (
        <div className="employee-loading">Loading Branches...</div>
      ) : (
        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th 
                  onClick={() => handleSort('name')} 
                  className="sortable"
                  style={{ cursor: 'pointer' }}
                >
                  Branch Name {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th 
                  onClick={() => handleSort('location_name')} 
                  className="sortable"
                  style={{ cursor: 'pointer' }}
                >
                  Location Name {sortField === 'location_name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length > 0 ? (
                paged.map((dept, index) => (
                  <tr key={dept.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{dept.branch_name}</td>
                    <td>{locations.find((loc) => loc.id === dept.location_name)?.location_name}</td>
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
                  <td colSpan="3" className="employee-empty">
                    No Branches found
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
              <h3>{editingId ? 'Edit Designation' : 'Add New Designation'}</h3>
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
                <label htmlFor="location_name">Location Name</label>
                <Select
                    styles={customStyles}
                    id="location_name"
                    name="location_name"
                    options={locationOptions}
                    value={locationOptions.find(option => option.value === form.location_name) || null}
                    onChange={(selectedOption) => {
                      setForm(prev => ({
                        ...prev,
                        location_name: selectedOption?.value || ""
                      }));
                    }}
                    isSearchable
                    placeholder="Select a location..."
                  />
                </div>   

            <div className="employee-form-row">
                <label htmlFor="name">Branch Name</label>
                <input
                  type="text"
                  id="branch_name"
                  name="branch_name"
                  value={form.branch_name}
                  onChange={handleInputChange}
                  required
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

export default Branches;