import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function CreateProductAdminForm({ onClose }) {
  const [formData, setFormData] = useState({
    productName: '',
    issueDate: '',
    companyId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('userData')).token;
      const headers = {
        Authorization: `${token}`,
      };

      const response = await axios.post(
        'https://productinventory.appaloinc.com/api/vi/admin/product/create',
        formData,
        { headers }
      );
      if (response) {
        toast.success('Product Created Successfully');
      }

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.msg.msg);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.msg.msg);
      }
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <span className="close" onClick={onClose}>X</span>
        <h2>Create Product</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Product Name:
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
          </label>
          <label>
            Issue Date:
            <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required />
          </label>
          <label>
            Company ID:
            <input type="text" name="companyId" value={formData.companyId} onChange={handleChange} required />
          </label>
          <button type="submit">Create</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateProductAdminForm;
