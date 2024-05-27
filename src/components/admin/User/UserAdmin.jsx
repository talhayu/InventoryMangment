import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axios from 'axios';
import UserAdminCreateForm from './CreateUserAdminForm';
import CreateUserAdminForm from './CreateUserAdminForm';
import { ToastContainer } from 'react-toastify';

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      const data = localStorage.getItem('userData');
      const convert = JSON.parse(data);
      const token = convert.token;

      const headers = {
        Authorization: `${token}`
      };
      try {
        const response = await axios.get('https://productinventory.appaloinc.com/api/vi/admin/user/find', { headers });
        setUsers(response.data.msg.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [createFormClosed]);

  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);
  const token = convert.token;
  const headers = {
    Authorization: `${token}`
  };

  if (!convert || convert.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }


  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  }
  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed(prev => !prev);
  }

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`https://productinventory.appaloinc.com/api/vi/admin/user/delete/${userId}`, { headers });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Username</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Role</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user._id}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.name}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.role}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  <button onClick={() => handleDeleteClick(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 onClick={toggleCreateForm}> Create create? Click here</h3>
      {showCreateForm && <CreateUserAdminForm onClose={handleCreateFormClose} />}
      <ToastContainer />
    </div>
  );
}

export default UserAdmin;
