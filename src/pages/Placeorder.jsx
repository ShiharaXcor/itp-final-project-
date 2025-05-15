import React, { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to access user data
import axios from 'axios';
import { backendUrl } from "../App";

const Placeorder = () => {
  const { products, cartItems, navigate } = useContext(ShopContext);
  const { user } = useContext(AuthContext); // Get the logged-in user data

  const [orderData, setOrderData] = useState({
    fname: '',
    lname: '',
    email: '', // Ensure the email is initialized as an empty string
    address: '',
    state: '',
    city: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (user && user.email) {
      setOrderData((prevState) => ({
        ...prevState,
        email: user.email, // Auto-fill the email if the user is logged in
      }));
    }
  }, [user]); // Ensure email is set when user context changes

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmailError(value && !value.includes("@") ? "Please enter a valid email." : "");
    }

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 15) return;
      setPhoneError("");
    }

    setOrderData({ ...orderData, [name]: value });
  };

  const handlePhoneBlur = () => {
    if (orderData.phone.length < 10) {
      setPhoneError("Phone number must be at least 10 digits.");
    }
  };

  // Define the delivery cost, you can modify this logic if it's dynamic
  const DELIVERY_COST = 200; // Fixed delivery charge, can be dynamic based on the order

  const getTotalPrice = () => {
    const totalProductPrice = Object.entries(cartItems).reduce((total, [id, quantity]) => {
      const product = products.find((p) => p._id === id);
      const basePrice = product?.pricing?.basePrice || 0;
      return total + basePrice * quantity;
    }, 0);

    return totalProductPrice + DELIVERY_COST; // Add the delivery cost to the total
  };

  const orderItems = Object.entries(cartItems).map(([id, quantity]) => {
    const product = products.find((p) => p._id === id);
    const basePrice = product?.pricing?.basePrice || 0;
    return product ? { name: product.name, quantity, price: basePrice } : null;
  }).filter(item => item !== null);

  const handleSubmit = async () => {
    if (phoneError || emailError || orderData.phone.length < 10 || !orderData.email.includes("@")) {
      alert("Please fix the errors before placing an order.");
      return;
    }
  
    const orderPayload = {
      ...orderData,
      orderItems,
      totalAmount: getTotalPrice(),
      status: "Pending Payment",
      email: orderData.email,
    };
  
    try {
      const response = await axios.post(`${backendUrl}/api/orders`, orderPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      if (response.data.success) {
        const orderId = response.data.order._id;
        navigate(`/payment/${orderId}`); // 🔁 Go to payment screen with order ID
      }
    } catch (error) {
      console.error("Order placement failed:", error.response?.data || error.message);
      alert("Error placing order. Please try again.");
    }
  };
  

  return (
    <div className='flex flex-col sm:flex-row justify-center items-start gap-12 pt-14 min-h-screen border-t px-4 sm:px-0'>

      <div className='flex flex-col gap-6 w-full sm:max-w-[550px] bg-white p-8 rounded-lg shadow-lg'>
        <div className='text-2xl font-semibold text-center'>
          <Title text1="Delivery" text2="Information" />
        </div>

        <div className='flex gap-4'>
          <input name="fname" onChange={handleChange} value={orderData.fname} className='border border-gray-300 rounded-lg py-3 px-4 w-full text-lg' type='text' placeholder='First Name' />
          <input name="lname" onChange={handleChange} value={orderData.lname} className='border border-gray-300 rounded-lg py-3 px-4 w-full text-lg' type='text' placeholder='Last Name' />
        </div>

        <input name="email" onChange={handleChange} onBlur={() => setEmailError(orderData.email && !orderData.email.includes("@") ? "Please enter a valid email." : "")} value={orderData.email} className='border border-gray-300 rounded-lg py-3 px-4 w-full text-lg' type='email' placeholder='Email' />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

        <input name="address" onChange={handleChange} value={orderData.address} className='border border-gray-300 rounded-lg py-3 px-4 w-full text-lg' type='text' placeholder='Street Address' />

        <div className='flex gap-4'>
          <input name="state" onChange={handleChange} value={orderData.state} className='border border-gray-300 rounded-lg py-3 px-4 w-full text-lg' type='text' placeholder='State' />
          <input name="city" onChange={handleChange} value={orderData.city} className='border border-gray-300 rounded-lg py-3 px-4 w-full text-lg' type='text' placeholder='City' />
        </div>

        <div className='flex gap-4'>
          <input name="zipCode" onChange={handleChange} value={orderData.zipCode} className='border border-gray-300 rounded-lg py-3 px-4 w-full text-lg' type='number' placeholder='ZIP Code' />
          <input name="country" onChange={handleChange} value={orderData.country} className='border border-gray-300 rounded-lg py-3 px-4 w-full text-lg' type='text' placeholder='Country' />
        </div>

        <input name="phone" onChange={handleChange} onBlur={handlePhoneBlur} value={orderData.phone} className='border border-gray-300 rounded-lg py-3 px-4 w-full text-lg' type='text' placeholder='Phone' />
        {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
      </div>

      <div className='mt-8 w-full sm:max-w-[400px] p-6 bg-gray-50 rounded-lg shadow-md'>
        <div className='text-xl font-semibold'>
          <p className='mb-4 text-gray-700'>Order Summary:</p>
          {Object.entries(cartItems).map(([id, quantity]) => {
            const product = products.find((p) => p._id === id);
            const basePrice = product?.pricing?.basePrice || 0;
            return product ? (
              <div key={id} className='flex justify-between text-gray-600 text-lg'>
                <p>{product.name} x{quantity} Kg</p>
                <p>Rs.{basePrice * quantity}</p>
              </div>
            ) : null;
          })}
        </div>

        <div className="mt-6 flex justify-between text-lg">
          <p className="font-semibold">Delivery Cost:</p>
          <p>Rs.{DELIVERY_COST}</p>
        </div>

        <div className="mt-4 text-right text-xl font-semibold">
          <p>Total: Rs.{getTotalPrice()}</p>
        </div>

        <div className='w-full text-center mt-8'>
          <button onClick={handleSubmit} className='bg-black text-white text-lg px-6 py-3 rounded-lg hover:bg-gray-800 transition w-full'>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Placeorder;
