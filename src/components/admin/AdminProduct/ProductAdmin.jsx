
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import CreateProductAdminForm from './CreateProductAdminForm';

function ProductAdmin() {

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});




  useEffect(() => {

    const data = localStorage.getItem('userData');
    const convert = JSON.parse(data);
    const token = convert.token;
    const headers = {
      Authorization: `${token}`
    };
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/vi/admin/product/find`, { headers });
        setProduct(response.data.msg.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [createFormClosed, editingProductId]);

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
  };

  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed((prev) => !prev);
  };

  const handleUpdateClick = (productId) => {
    setEditingProductId(productId);
  };

  const handleCancelUpdate = () => {
    setEditingProductId(null);
  };

  const handleSaveClick = async productId => {
    try {


      const updatedData = updatedProduct[productId];
      if (!updatedData) {
        console.error('No data to update');
        return;
      }
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/vi/admin/product/findByIdAndUpdate/${productId}`,
        updatedData,
        { headers }
      );
      setUpdatedProduct(prevState => ({ ...prevState, [productId]: {} }));
      if (response.data) {
        toast.success('Product updated successfully!');


      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again later.');
    } finally {
      setEditingProductId(null);
    }
  };


  const handleChange = (e, productId, field) => {
    const { value } = e.target;
    setUpdatedProduct((prevData) => ({
      ...prevData,
      [productId]: {
        ...prevData[productId],
        [field]: value
      }
    }));
  };

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/vi/admin/product/findByIdAndDelete/${productId}`, { headers });
      setProduct(product.filter(element => element._id !== productId));
    } catch (error) {
      console.error('Error deleting element:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      {loading ? (
        <p>Loading...</p>
      ) : product.length === 0 ? (
        <p>No Products found.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>UserID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Id</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Name</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Product Name</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Issue Date</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {product.map((element) => (
              <tr key={element._id} style={{ borderBottom: '1px solid #dddddd' }}>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element._id}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.userId}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.companyId}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{element.companyName}</td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingProductId === element._id ? (
                    <input
                      type="text"
                      value={updatedProduct[element._id]?.productName || element.productName}
                      onChange={e => handleChange(e, element._id, 'productName')}
                    />
                  ) : (
                    element.productName
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingProductId === element._id ? (
                    <input
                      type="date"
                      value={updatedProduct[element._id]?.issueDate || element.issueDate}
                      onChange={e => handleChange(e, element._id, 'issueDate')}
                    />
                  ) : (
                    element.issueDate
                  )}
                </td>
                <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                  {editingProductId === element._id ? (
                    <>
                      <button onClick={() => handleSaveClick(element._id)}>Save</button>

                    </>
                  ) : (
                    <button onClick={() => handleUpdateClick(element._id)}>Update</button>
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
      <h3 onClick={toggleCreateForm}> Create Product? Click here</h3>
      {showCreateForm && <CreateProductAdminForm onClose={handleCreateFormClose} />}
      <ToastContainer />
    </div>
  );
}

export default ProductAdmin;
