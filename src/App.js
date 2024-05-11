// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';// Make sure PrivateRoute is imported correctly
import Login from './components/user/Auth/Login';
import Userdashboarb from './components/user/Auth/Userdashboarb';
import AdminDashboard from './components/admin/AdminDashboard';
import Unauthorized from './components/Extra/Unauthorized';
import Missing from './components/Extra/Missing';
import RequireAuth from './components/user/Auth/RequireAuth';

import Company from './components/user/Company/Company';
import Navbar from './components/Extra/Navbar';
import Product from './components/user/Product/Product';
import ProductBatch from './components/user/ProductBatch/ProductBatch';
import BatchSales from './components/user/BatchSales/BatchSales';
import UserAdmin from './components/admin/User/UserAdmin';
import CompanyAdmin from './components/admin/AdminCompany/CompanyAdmin';
import ProductAdmin from './components/admin/AdminProduct/ProductAdmin';
import ProductBatchAdmin from './components/admin/AdminProductBatch/ProductBatchAdmin';
import BatchSaleAdmin from './components/admin/AdminBatchSale/BatchSaleAdmin';
import Register from './components/user/Auth/Register';
import ForgetPassword from './components/user/Auth/ForgetPassword';
import ResetPassword from './components/user/Auth/ResetPassword';


function App() {
  return (
    <>


      <Routes>

        <Route path='/' element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path='/forgetpassword' element={<ForgetPassword/>} />
        <Route path='/reset-password/:userId/:token' element={<ResetPassword/>} />


        <Route element={<RequireAuth allowedRoles={['user']} />}>
          <Route path="user" element={<Userdashboarb />} />
          <Route path="company" element={<Company />} />
          <Route path="product/:companyId" element={<Product />} />
          <Route path="productBatch/:productId" element={<ProductBatch/>} />
          <Route path='batchSale/:batchId' element={<BatchSales/>}/>
        </Route>

        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="adminUser" element = {<UserAdmin/>} /> 
          <Route path="adminCompany" element={<CompanyAdmin/>}/>
          <Route path="adminProduct" element={<ProductAdmin/>}/>
          <Route path="adminProductBatch" element={<ProductBatchAdmin/>}/>
          <Route path="adminBatchSale" element={<BatchSaleAdmin/>}/>

          

        </Route>


        <Route path="*" element={<Missing />} />
      </Routes>
    </>

  );
}

export default App;
