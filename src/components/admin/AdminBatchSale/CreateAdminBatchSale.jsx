import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';;


function CreateAdminBatchSale({ onClose }) {
    const [formData, setFormData] = useState({
        batchId: '',
        soldQuantity: '',
        date: '',
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
          console.log(formData)
          const response = await axios.post(
            'http://localhost:5050/api/vi/admin/batchSale/create',
            formData,
            { headers }
          );
          toast.success('done')
    
          setTimeout(() => {
            onClose();
    
          }, 3000)

        } catch (error) {
          console.log(error)
          if (error.response && error.response.status == 400) {
            toast.error(error.response.data.msg.msg)
          } else if (error.response && error.response.status == 500) {
            toast.error(error.response.data.msg.msg)
          }
        }
      };
    
    
      return (
        <div className="modal-container">
          <div className="modal-content">
            <span className="close" onClick={onClose}>X</span>
            <h2>Create BatchSales</h2>
            <form onSubmit={handleSubmit}>
            <label>
                BatchId:
                <input type="text" name="batchId" value={formData.batchId} onChange={handleChange} required />
              </label>
              <label>
                soldQuantity:
                <input type="number" name="soldQuantity" value={formData.soldQuantity} onChange={handleChange} required />
              </label>
              <label>
               Date:
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </label>
              
              <button type="submit">Create</button>
            </form>
          </div>
          <ToastContainer />
        </div>
      );
}

export default CreateAdminBatchSale