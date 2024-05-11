import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import CreateProductForm from './CreateProductForm';
import { Link } from 'react-router-dom';
import Navbar from '../../Extra/Navbar';



function Product() {
  const { companyId } = useParams();
  const [product, setProduct] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormClosed, setCreateFormClosed] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      const data = localStorage.getItem('userData');
      const convert = JSON.parse(data);
      const token = convert.token;
      try {
        const headers = {
          Authorization: `${token}`
        };
        const response = await axios.get(`http://localhost:5050/api/vi/product/findByCompanyName/${companyId}`, { headers });
        setProduct(response.data.msg.data);
      } catch (error) {
        if (error.response.status === 404) {
          toast.error('No product is assosciated with this company. Create One');
        } else if (error.response && error.response.status === 500) {
          toast.error('Internal server error');
        }
 
      }
    };

    fetchData();
  }, [createFormClosed, editingProductId]);

  const data = localStorage.getItem('userData');
  const convert = JSON.parse(data);
  const token = convert.token;

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleCreateFormClose = () => {
    setShowCreateForm(false);
    setCreateFormClosed(prev => !prev);
  };

  const handleUpdateClick = productId => {
    setEditingProductId(productId);
  };

  const handleSaveClick = async productId => {
    try {
      const headers = {
        Authorization: `${token}`,
      };

      const updatedData = updatedProduct[productId];
      if (!updatedData) {
        console.error('No data to update');
        return;
      }

      const response = await axios.patch(
        `http://localhost:5050/api/vi/product/findByIdAndUpdate/${productId}`,
        updatedData,
        { headers }
      );

      setUpdatedProduct(prevState => ({ ...prevState, [productId]: {} }));
      
      if(response.data){
        toast.success('Product updated successfully!');
      }
    } catch (error) {
      if (error.response.status === 404) {
        toast.error(error.response.data.msg.msg);
      }
    } finally {
      setEditingProductId(null);
    }
  };

  const handleDeleteClick = async productId => {
    try {
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.delete(
        `http://localhost:5050/api/vi/product/findByIdAndDelete/${productId}`,
        { headers }
      );

      setProduct(prevProduct => prevProduct.filter(item => item._id !== productId));

      // Show toast message for successful deletion
      toast.success('Product deleted successfully!');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error(error.response.data.msg.msg);
      }
    }
  };

  const handleChange = (e, productId, field) => {
    const { value } = e.target;
    setUpdatedProduct(prevState => ({
      ...prevState,
      [productId]: {
        ...prevState[productId],
        [field]: value
      }
    }));
  };

  return (
    <div>
      <Navbar/>

      {product.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>UserID</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Id</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Company Name</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>ProductName</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>issueDate</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
              <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map(element => (
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
                    <Link to={`/productBatch/${element._id}`}>{element.productName}</Link>
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
                    <button onClick={() => handleSaveClick(element._id)}>Save</button>
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
      <h3 onClick={toggleCreateForm}>Don't have any product? Create product? Click here</h3>
      {showCreateForm && <CreateProductForm companyId={companyId} onClose={handleCreateFormClose} />}
      <ToastContainer />
    </div>
  );
}

export default Product;
