import React from 'react'
import axios from 'axios';
import  { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import CreateAdminBatchSale from './CreateAdminBatchSale';
import { Navigate } from 'react-router-dom';

function BatchSaleAdmin() {

    const [BatchSales, setBatchSales] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormClosed, setCreateFormClosed] = useState(false);
    const [updatingBatchId, setUpdatingBatchId] = useState(null);
    const [updatedBatchSales, setUpdatedBatchSales] = useState({});

 
  
    useEffect(() => {
      const fetchData = async () => {
         
    const data = localStorage.getItem('userData');
    const convert = JSON.parse(data);
    const token = convert.token;
        try {
          const headers = {
            Authorization: `${token}`
          };
          const response = await axios.get(`https://productinventory.appaloinc.com/api/vi/admin/batchSale/find`, { headers });
          setBatchSales(response.data.msg.data);
          console.log(response)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            toast.error(error.response.data.msg.msg);
          } else if (error.response && error.response.status === 500) {
            toast.error(error.response.data.msg.msg);
          }
        }
      };
  
      fetchData();
    }, [createFormClosed, updatingBatchId]);

    

    const data = localStorage.getItem('userData');
    const convert = JSON.parse(data);
    const token = convert.token;
    
    const headers = {
      Authorization: `${token}`,
    };
    
    if (!convert || convert.role !== 'admin') {
      return <Navigate to="/unauthorized" />;
    }
   
  
    const toggleCreateForm = () => {
      setShowCreateForm(!showCreateForm);
    };
  
    const handleCreateFormClose = () => {
      setShowCreateForm(false);
      setCreateFormClosed(prev => !prev);
    };
  
    const handleUpdateClick = (batchId) => {
      setUpdatingBatchId(batchId);
    };
  
    const handleSaveClick = async (batchId, updatedData) => {
      try {
        const headers = {
          Authorization: `${token}`,
        };
  
        const response = await axios.patch(
          `https://productinventory.appaloinc.com/api/vi/admin/batchSale/getByIdAndUpdate/${batchId}`,
          updatedData,
          { headers }
        );
  
        setBatchSales(prevBatchSales => prevBatchSales.map(item => {
          if (item._id === batchId) {
            return { ...item, ...updatedData };
          }
          return item;
        }));
  
        toast.success('BatchSales updated successfully!');
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 404) {
          toast.error('dasd');
        } else {
          toast.error('Error updating BatchSales.');
        }
      } finally {
        setUpdatingBatchId(null);
      }
    };
  
    const handleDeleteClick = async (batchId) => {
      try {
        const headers = {
          Authorization: `${token}`,
        };
  
        const response = await axios.delete(
          `https://productinventory.appaloinc.com/api/vi/admin/batchSale/getByIdAndDelete/${batchId}`,
          { headers }
        );
  
        setBatchSales(prevBatchSales => prevBatchSales.filter(item => item._id !== batchId));
        toast.success('BatchSales deleted successfully!');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.msg.msg);
        } else {
          toast.error('Error deleting BatchSales.');
        }
      }
    };
  
    const handleChange = (e, batchId, field) => {
      const { value } = e.target;
      setUpdatedBatchSales(prevState => ({
        ...prevState,
        [batchId]: {
          ...prevState[batchId],
          [field]: value
        }
      }));
    };
  
    return (
      <div>
        <AdminNavbar />
  
        {BatchSales.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>batchId</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>soldQuantity</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Date of sale</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {BatchSales.map(element => (
                <tr key={element._id} style={{ borderBottom: '1px solid #dddddd' }}>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element._id}</td>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.batchId}</td>
                  <td>
                    {updatingBatchId === element._id ? (
                      <input
                        type="text"
                        value={updatedBatchSales[element._id]?.soldQuantity || element.soldQuantity}
                        onChange={e => handleChange(e, element._id, 'soldQuantity')}
                      />
                    ) : (
                      element.soldQuantity
                    )}
                  </td>
                  <td>{updatingBatchId === element._id ? (
                      <input
                        type="date"
                        value={updatedBatchSales[element._id]?.dateOfSale || element.dateOfSale}
                        onChange={e => handleChange(e, element._id, 'dateOfSale')}
                      />
                    ) : (
                      element.dateOfSale
                    )}</td>
                  <td>
                    {updatingBatchId === element._id ? (
                      <button onClick={() => handleSaveClick(element._id, updatedBatchSales[element._id])}>Save</button>
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
        <h3 onClick={toggleCreateForm}>Don't have any BatchSales? Create company? Click here</h3>
        {showCreateForm && <CreateAdminBatchSale  onClose={handleCreateFormClose} />}
        <ToastContainer />
      </div>
    );
}

export default BatchSaleAdmin