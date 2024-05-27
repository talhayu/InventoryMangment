import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CreateCompanyForm from './CreateCompanyForm';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import Navbar from '../../Extra/Navbar';

function Company() {
  const [companies, setCompanies] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [updatedCompanies, setUpdatedCompanies] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = localStorage.getItem('userData');
        const convert = JSON.parse(data)
        const token = convert.token
        console.log(token)
        const headers = {
          Authorization: `${token}`
        };

        const response = await axios.get('https://productinventory.appaloinc.com/api/vi/company/getAllCompanies', { headers });
        // console.log(response)
        setCompanies(response.data.msg.data);
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status == 404) {
          toast.error(error.response.data.msg.msg)
        } else if (error.response && error.response.status == 500) {
          toast.error(error.response.data.msg.msg)
        }
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [createFormClosed, editingCompanyId]);
  // Fetch data whenever editingCompanyId state changes
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  }
  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed(prev => !prev);
  }
  const handleUpdateClick = (companyId) => {
    setEditingCompanyId(companyId);
  };

  const handleSaveClick = async (companyId) => {
    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
      const headers = {
        Authorization: `${token}`,
      };

      const updatedData = updatedCompanies[companyId];
      if (!updatedData) {
        console.error('No data to update');
        return;
      }

      const response = await axios.patch(
        `https://productinventory.appaloinc.com/api/vi/company/findByIdAndUpdate/${companyId}`,
        updatedData,
        { headers }
      );
      if (response) {
        toast.success('Company Updated succesfully')
      }


      console.log('Update successful:', response.data);

      setUpdatedCompanies(prevState => ({ ...prevState, [companyId]: {} }));


    } catch (error) {
      if (error.response && error.response.status == 404) {
        toast.error(error.response.data.msg.msg)
      }

    } finally {
      setEditingCompanyId(null);
    }
  };

  const handleDeleteClick = async (companyId) => {
    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.delete(
        `https://productinventory.appaloinc.com/api/vi/company/findByIdAndDelete/${companyId}`,
        { headers }
      );
      if (response) {
        console.log(response)
        toast.success('Company deleted successfully!');
      }
      console.log('Delete successful:', response.data);
      setCompanies(prevCompanies => prevCompanies.filter(company => company._id !== companyId));

    } catch (error) {
      if (error.response && error.response.status == 404) {
        toast.error(error.response.data.msg.msg)
      }
    }
  };

  const handleChange = (e, companyId, field) => {
    const { value } = e.target;
    // Update the updatedCompanies state with the new value
    setUpdatedCompanies(prevState => ({
      ...prevState,
      [companyId]: {
        ...prevState[companyId],
        [field]: value
      }
    }));
  };

  return (
    <div>
      <Navbar />

      {companies.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Name</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Address</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Contact</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>

            </tr>
          </thead>
          <tbody>
            {companies.map((element) => (
              <tr key={element._id} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element._id}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingCompanyId === element._id ? (
                    <input
                      type="text"
                      value={updatedCompanies[element._id]?.companyName || element.companyName}
                      onChange={(e) => handleChange(e, element._id, 'companyName')}
                    />
                  ) : (
                    <Link to={`/product/${element._id}`}>{element.companyName}</Link>
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingCompanyId === element._id ? (
                    <input
                      type="text"
                      value={updatedCompanies[element._id]?.companyAddress || element.companyAddress}
                      onChange={(e) => handleChange(e, element._id, 'companyAddress')}
                    />
                  ) : (
                    element.companyAddress
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingCompanyId === element._id ? (
                    <input
                      type="text"
                      value={updatedCompanies[element._id]?.contact || element.contact}
                      onChange={(e) => handleChange(e, element._id, 'contact')}
                    />
                  ) : (
                    element.contact
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingCompanyId === element._id ? (
                    <button onClick={() => handleSaveClick(element._id)}>Save</button>
                  ) : (
                    <>
                      <button onClick={() => handleUpdateClick(element._id)}>Update</button>
                    </>
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>


                  <button onClick={() => handleDeleteClick(element._id)}>Delete</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 onClick={toggleCreateForm}>Don't have any company? Create company? Click here</h3>
      {showCreateForm && <CreateCompanyForm onClose={handleCreateFormClose} />}
      <ToastContainer />
    </div>
  );
}

export default Company;
