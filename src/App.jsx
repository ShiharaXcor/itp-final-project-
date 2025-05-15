import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Placeorder from './pages/Placeorder';
import Login from './pages/Login';
import OrderList from './pages/OrderList';
import About from './pages/About';
import Navbar from './components/Navbar';
import Collections from './pages/Collections';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrdersDetails from './pages/OrdersDetails';
import Register from './pages/Register';
import AuthProvider from './context/AuthContext';  // Import AuthProvider
import Logout from './pages/Logout';
import PaymentPage from './pages/PaymentPage';
import CreateReturn from './components/CreateReturn';
import ReturnsList from './pages/ReturnsList';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const location = useLocation();
  const noNavbarPaths = ['/', '/login', '/register'];
  const hideNavbar = noNavbarPaths.includes(location.pathname);

  return (
    <AuthProvider>  {/* Wrap the entire app with AuthProvider */}
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer />
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/collection' element={<Collections />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/place-order' element={<Placeorder />} />
          <Route path='/orderlist' element={<OrderList />} />
          <Route path='/about' element={<About />} />
          <Route path='/order-details/:id' element={<OrdersDetails />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/payment/:id' element={<PaymentPage />}/>
          <Route path="/create-return/:orderId" element={<CreateReturn />} />
          <Route path="/returnsList" element={<ReturnsList />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
