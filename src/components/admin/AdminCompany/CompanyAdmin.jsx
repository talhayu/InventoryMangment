import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axios from 'axios';
import CompanyAdminCreateForm from './CreateCompanyAdminForm';
import CreateCompanyAdminForm from './CreateCompanyAdminForm';
import { ToastContainer, toast } from 'react-toastify';

function CompanyAdmin() {

    const [company, setCompany] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showCreateForm, setShowCreateForm] = useState(false);

    const [createFormClosed, setCreateFormClosed] = useState(false);

    const [editingCompanyId, setEditingCompanyId] = useState(null);

    const data = localStorage.getItem('userData');

    const convert = JSON.parse(data);
    
    const token = convert.token;

    if (!convert || convert.role !== 'admin') {
        return <Navigate to="/unauthorized" />;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5050/api/vi/admin/company/find', { headers });
                setCompany(response.data.msg.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Company:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [createFormClosed, editingCompanyId]);

    
    const headers = {
        Authorization: `${token}`
    };

    const handleUpdateClick = (companyId) => {
        setEditingCompanyId(companyId);
    };

    const handleCancelUpdate = () => {
        setEditingCompanyId(null);
    };
    const handleSaveUpdate = async (companyId, updatedData) => {
        try {
            const response = await axios.patch(
                `http://localhost:5050/api/vi/admin/company/findByIdAndUpdate/${companyId}`,
                updatedData,
                { headers }
            );
            if (response.data) {
                toast.success('Company updated successfully!');
                setEditingCompanyId(null);
            }
        } catch (error) {
            console.error('Error updating company:', error);
            toast.error('Failed to update company. Please try again later.');
        }
    };

 

    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
    }
    const handleCreateFormClose = () => {
        setShowCreateForm(false);
        setCreateFormClosed(prev => !prev);
    }

    const handleDeleteClick = async (companyId) => {
        try {
            await axios.delete(`http://localhost:5050/api/vi/admin/company/findByIdAndDelete/${companyId}`, { headers });
            setCompany(company.filter(element => element._id !== companyId));
        } catch (error) {
            console.error('Error deleting element:', error);
        }
    };

    return (
        <div>
            <AdminNavbar />
            {loading ? (
                <p>Loading...</p>
            ) : company.length === 0 ? (
                <p>No Company found.</p>
            ) : (
                <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>userId</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>CompanyName</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Companyaddress</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Contact</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>
                            <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {company.map(element => (
                            <tr key={element._id} style={{ borderBottom: '1px solid #dddddd' }}>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element._id}</td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.userId}</td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>

                                    {editingCompanyId === element._id ? (
                                        <input
                                            type="text"
                                            defaultValue={element.companyName}
                                            onBlur={(e) =>
                                                handleSaveUpdate(element._id, { companyName: e.target.value })
                                            }
                                        />
                                    ) : (
                                        element.companyName
                                    )}
                                </td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                    {editingCompanyId === element._id ? (
                                        <input
                                            type="text"
                                            defaultValue={element.companyAddress}
                                            onBlur={(e) =>
                                                handleSaveUpdate(element._id, { companyAddress: e.target.value })
                                            }
                                        />
                                    ) : (
                                        element.companyAddress
                                    )}

                                </td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                    {editingCompanyId === element._id ? (
                                        <input
                                            type="text"
                                            defaultValue={element.contact}
                                            onBlur={(e) =>
                                                handleSaveUpdate(element._id, { contact: e.target.value })
                                            }
                                        />
                                    ) : (
                                        element.contact
                                    )}
                                </td>
                                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                    {editingCompanyId === element._id ? (
                                        <>
                                            <button onClick={() => handleSaveUpdate(element._id)}>Save</button>
                                          
                                        </>
                                    ) : (
                                        <button onClick={() => handleUpdateClick(element._id)}>Update</button>
                                    )}
                                </td>
                                <td>
                                <button onClick={() => handleDeleteClick(element._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h3 onClick={toggleCreateForm}> Create create? Click here</h3>
            {showCreateForm && <CreateCompanyAdminForm onClose={handleCreateFormClose} />}
            <ToastContainer />
        </div>
    );
}

export default CompanyAdmin;
