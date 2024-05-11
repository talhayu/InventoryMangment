import React from 'react'
import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CreateAdminProductBatchForm from './CreateAdminProductBatchForm';
import { Link } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axios from 'axios';

function ProductBatchAdmin() {


    const [productBatch, setProductBatch] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormClosed, setCreateFormClosed] = useState(false);
    const [updatingProductId, setUpdatingProductId] = useState(null);
    const [updatedProductBatch, setUpdatedProductBatch] = useState({});

    const data = localStorage.getItem('userData');
    const convert = JSON.parse(data);
    const token = convert.token;
  
    useEffect(() => {
      const fetchData = async () => {
        try {
      

          const headers = {
            Authorization: `${token}`
          };
          const response = await axios.get(`http://localhost:5050/api/vi/admin/productBatch/find`, { headers });
          console.log('das', response)
          setProductBatch(response.data.msg.data);
          console.log(productBatch)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            toast.error(error.response.data.msg.msg);
          } else if (error.response && error.response.status === 500) {
            toast.error(error.response.data.msg.msg);
          }
        }
      };
  
      fetchData();
    }, [createFormClosed, updatingProductId]);
  
    const toggleCreateForm = () => {
      setShowCreateForm(!showCreateForm);
    };
  
    const handleCreateFormClose = () => {
      setShowCreateForm(false);
      setCreateFormClosed(prev => !prev);
    };
  
    const handleUpdateClick = productId => {
      setUpdatingProductId(productId);
    };
  
    const handleSaveClick = async (productId, updatedData) => {
      try {
        const headers = {
          Authorization: `${token}`,
        };
  
        const response = await axios.patch(
          `http://localhost:5050/api/vi/admin/productBatch/findByIdAndUpdate/${productId}`,
          updatedData,
          { headers }
        );
   
  
        setProductBatch(prevProductBatch => prevProductBatch.map(item => {
          if (item._id === productId) {
            return { ...item, ...updatedData };
          }
          return item;
        }));
        if(response){
  
          toast.success('Product batch updated successfully!');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.msg.msg);
        } else {
          toast.error('Error updating product batch.');
        }
      } finally {
        setUpdatingProductId(null);
      }
    };
  
    const handleDeleteClick = async (productId) => {
      try {
        const headers = {
          Authorization: `${token}`,
        };
  
        const response = await axios.delete(
          `http://localhost:5050/api/vi/admin/productBatch/findByIdAndDelete/${productId}`,
          { headers }
        );
        if(response){
          toast.success('Product batch deleted successfully!');
  
        }
        setProductBatch(prevProductBatch => prevProductBatch.filter(item => item._id !== productId));
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error(error.response.data.msg.msg);
        } else {
          toast.error('Error deleting product batch.');
        }
      }
    };
  
    const handleChange = (e, productId, field) => {
      const { value } = e.target;
      setUpdatedProductBatch(prevState => ({
        ...prevState,
        [productId]: {
          ...prevState[productId],
          [field]: value
        }
      }));
    };
  
    return (
      <div>
        <AdminNavbar />
  
        {productBatch.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ProductId</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>BatchNumber</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Quantity</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Remaining Qunatity</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Date Of production</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
                <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {productBatch.map(element => (
                <tr key={element._id} style={{ borderBottom: '1px solid #dddddd' }}>
                  <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}> {element._id}</td>
                  <td>{element.productId}</td>
                  <td>{element.batchNumber}</td>
                  <td>
                    {updatingProductId === element._id ? (
                      <input
                        type="text"
                        value={updatedProductBatch[element._id]?.quantity || element.quantity}
                        onChange={e => handleChange(e, element._id, 'quantity')}
                      />
                    ) : (
                      element.quantity
                    )}
                  </td>
                  <td>{element.remainingQuantity}</td>
                  <td>{element.dateOfProduction}</td>
                  <td>
                    {updatingProductId === element._id ? (
                      <button onClick={() => handleSaveClick(element._id, updatedProductBatch[element._id])}>Save</button>
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
        <h3 onClick={toggleCreateForm}>Don't have any productBatch? Create company? Click here</h3>
        {showCreateForm && <CreateAdminProductBatchForm  onClose={handleCreateFormClose} />}
        <ToastContainer />
      </div>
    );
}

export default ProductBatchAdmin