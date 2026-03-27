import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, CheckCircle, XCircle, LayoutGrid, Award, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [bulkSelect, setBulkSelect] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    fetchApplications(token);
  }, []);

  const fetchApplications = async (token) => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/admin/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
         localStorage.removeItem('adminToken');
         navigate('/admin-login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:3000/api/admin/applications/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
      if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, status });
    } catch (err) {
      console.error('Failed to update status');
      alert('Failed to update status. Please try again.');
    }
  };

  const processBulk = async (status) => {
    if (bulkSelect.length === 0) return;
    try {
       const token = localStorage.getItem('adminToken');
       await axios.post('http://localhost:3000/api/admin/applications/bulk-status', { ids: bulkSelect, status }, {
         headers: { Authorization: `Bearer ${token}` }
       });
       setApplications(applications.map(app => bulkSelect.includes(app.id) ? { ...app, status } : app));
       setBulkSelect([]);
    } catch (err) {
       console.error('Bulk update failed');
       alert('Bulk update failed.');
    }
  };

  const generateMeritList = () => {
    const sorted = [...applications].sort((a, b) => b.gpa - a.gpa);
    setApplications(sorted);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const filteredApps = applications.filter(app => {
    const matchSearch = (app.first_name + ' ' + app.last_name + ' ' + app.email).toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 border-t border-gray-200">
      
      {/* Sidebar / List View */}
      <div className={`w-full md:w-1/2 lg:w-2/3 flex flex-col border-r bg-white ${selectedApp ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex space-x-2">
               <button onClick={generateMeritList} className="flex items-center text-sm px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200" data-testid="btn-merit-list">
                 <Award className="w-4 h-4 mr-1" /> Merit List
               </button>
               <button onClick={handleLogout} className="flex items-center text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" data-testid="btn-logout">
                 <LogOut className="w-4 h-4 mr-1" /> Logout
               </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                type="text" placeholder="Search applicant name or email..." 
                className="pl-9 w-full rounded border-gray-300 shadow-sm p-2 text-sm border focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                data-testid="admin-search-input"
              />
            </div>
            <select 
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} 
              className="rounded border-gray-300 shadow-sm p-2 text-sm border focus:ring-indigo-500"
              data-testid="admin-status-filter"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {bulkSelect.length > 0 && (
          <div className="bg-indigo-50 p-2 px-4 flex justify-between items-center border-b border-indigo-100">
             <span className="text-sm font-medium text-indigo-800">{bulkSelect.length} selected</span>
             <div className="space-x-2">
               <button onClick={() => processBulk('Accepted')} className="text-xs bg-green-600 text-white px-2 py-1 rounded" data-testid="btn-bulk-accept">Accept All</button>
               <button onClick={() => processBulk('Rejected')} className="text-xs bg-red-600 text-white px-2 py-1 rounded" data-testid="btn-bulk-reject">Reject All</button>
             </div>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center text-gray-500"><span data-testid="loading-spinner">Loading applicants...</span></div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 sticky top-0 border-b">
                <tr>
                  <th className="p-3 w-10">
                    <input type="checkbox" onChange={(e) => setBulkSelect(e.target.checked ? applications.map(a=>a.id) : [])} checked={bulkSelect.length === applications.length && applications.length > 0} data-testid="checkbox-bulk-all"/>
                  </th>
                  <th className="p-3 font-medium">Applicant</th>
                  <th className="p-3 font-medium">Course & GPA</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map(app => (
                  <tr key={app.id} data-testid={`app-row-${app.id}`} className={`hover:bg-indigo-50/50 cursor-pointer ${selectedApp?.id === app.id ? 'bg-indigo-50' : ''}`} onClick={() => setSelectedApp(app)}>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" data-testid={`checkbox-app-${app.id}`} checked={bulkSelect.includes(app.id)} onChange={(e) => {
                        if(e.target.checked) setBulkSelect([...bulkSelect, app.id]);
                        else setBulkSelect(bulkSelect.filter(id => id !== app.id));
                      }} />
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-800">{app.first_name} {app.last_name}</div>
                      <div className="text-gray-500 text-xs">{app.email}</div>
                    </td>
                    <td className="p-3">
                      <div>{app.course}</div>
                      <div className="text-xs text-gray-500 font-semibold" data-testid={`app-gpa-${app.id}`}>GPA: {app.gpa}</div>
                    </td>
                    <td className="p-3">
                      <span data-testid={`app-status-${app.id}`} className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                          app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-indigo-600 hover:underline text-xs">Review</button>
                    </td>
                  </tr>
                ))}
                {filteredApps.length === 0 && (
                  <tr><td colSpan="5" className="p-4 text-center text-gray-500">No applicants found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Workstation / Detail View */}
      <div className={`w-full md:w-1/2 lg:w-1/3 bg-white flex flex-col shadow-inner ${!selectedApp ? 'hidden md:flex' : 'flex'}`}>
        {!selectedApp ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <LayoutGrid className="w-16 h-16 mb-4 text-gray-200" />
            <p>Select an applicant to review</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedApp.first_name} {selectedApp.last_name}</h2>
                <div className="text-sm text-gray-500">Submitted: {new Date(selectedApp.submission_date).toLocaleDateString()}</div>
              </div>
              <button className="md:hidden text-gray-500" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
            
            <div className="flex-1 p-6 overflow-auto space-y-6">
               <div>
                 <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider mb-2">Profile Details</h3>
                 <div className="bg-gray-50 p-3 rounded-lg border text-sm">
                   <p><span className="font-medium">Email:</span> {selectedApp.email}</p>
                   <p><span className="font-medium">Program:</span> {selectedApp.course}</p>
                   <p><span className="font-medium">GPA:</span> {selectedApp.gpa} / 4.0</p>
                 </div>
               </div>

               <div>
                 <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider mb-2">Attached Documents</h3>
                 <div className="border border-gray-200 rounded-lg divide-y bg-gray-50">
                    <div className="p-3 flex justify-between items-center bg-white">
                      <span className="text-sm font-medium text-gray-700">Transcript.pdf</span>
                      <button className="text-xs text-indigo-600 border border-indigo-600 px-2 py-1 rounded hover:bg-indigo-50">View</button>
                    </div>
                    <div className="p-3 flex justify-between items-center bg-white">
                      <span className="text-sm font-medium text-gray-700">ID_Passport.jpg</span>
                      <button className="text-xs text-indigo-600 border border-indigo-600 px-2 py-1 rounded hover:bg-indigo-50">View</button>
                    </div>
                 </div>
               </div>

               <div className="pt-4 border-t">
                 <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider mb-3">Decision Engine</h3>
                 <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => updateStatus(selectedApp.id, 'Accepted')} className="flex justify-center items-center py-2 bg-green-600 text-white rounded hover:bg-green-700" data-testid="btn-decision-accept">
                     <CheckCircle className="w-4 h-4 mr-2" /> Accept
                   </button>
                   <button onClick={() => updateStatus(selectedApp.id, 'Rejected')} className="flex justify-center items-center py-2 bg-red-600 text-white rounded hover:bg-red-700" data-testid="btn-decision-reject">
                     <XCircle className="w-4 h-4 mr-2" /> Reject
                   </button>
                 </div>
                 <button className="mt-2 w-full flex justify-center items-center py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100" data-testid="btn-decision-mail">
                    <Mail className="w-4 h-4 mr-2" /> Send Clarification Email
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

