import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";

const OrdersDetails = () => {
  const { id } = useParams();
  console.log("Order ID from URL:", id);
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log("Fetching order with ID:", id);
  
        const response = await axios.get(`${backendUrl}/api/orders/${id}`);
  
        console.log("Order data received:", response.data);
  
        setOrder(response.data);
        setUpdatedOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error.response?.data || error.message);
        setError("Failed to fetch order");
        setLoading(false);
      }
    };
  
    fetchOrder(); 
  }, [id]);

  const handleChange = (e) => {
    setUpdatedOrder({ ...updatedOrder, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${backendUrl}/api/orders/${id}`, updatedOrder);
      setOrder(updatedOrder);
      setEditMode(false);
      alert("Order updated successfully!");
    } catch (error) {
      alert("Error updating order");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${backendUrl}/api/orders/${id}`);
      alert("Order deleted successfully!");
      navigate("/orderlist"); 
    } catch (error) {
      alert("Error deleting order");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Order Details</h2>

      {editMode ? (
        <div className="mt-4 p-4 border">
          <label className="block">First Name</label>
          <input type="text" name="fname" value={updatedOrder.fname} onChange={handleChange} className="border p-2 w-full" />

          <label className="block">Last Name</label>
          <input type="text" name="lname" value={updatedOrder.lname} onChange={handleChange} className="border p-2 w-full" />

          <label className="block">Email</label>
          <input type="email" name="email" value={updatedOrder.email} onChange={handleChange} className="border p-2 w-full" />

          <label className="block">Phone</label>
          <input type="text" name="phone" value={updatedOrder.phone} onChange={handleChange} className="border p-2 w-full" />
          

          <button className="bg-black text-white px-4 py-2 mt-4" onClick={handleUpdate}>Save</button>
          <button className="bg-gray-500 text-white px-4 py-2 mt-4 ml-2" onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className="mt-4 p-4 border">
          <p><strong>Name:</strong> {order.fname} {order.lname}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}, {order.zipCode}, {order.country}</p>
          <p><strong>Total Amount:</strong> Rs {order.totalAmount}</p>
          <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>


          <div className="flex items-center gap-2 mt-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <p className="text-lg font-bold">{order.status || "Order Received"}</p>
          </div>
          <h3 className="text-xl font-bold mt-4">Order Items:</h3>
          <ul className="mt-2">
            {order.orderItems.map((item, index) => (
              <li key={index} className="border p-2 my-2">
                {item.name} - Quantity: {item.quantity} Kg - Unit Price: Rs {item.price}
              </li>
            ))}
          </ul>

          <button className="bg-black text-white px-4 py-2 mt-4" onClick={() => setEditMode(true)}>Update Order</button>
          <button className="bg-black text-white px-4 py-2 mt-4 ml-2" onClick={handleDelete}>Cancel Order</button>
        </div>
      )}
    </div>
  );
};

export default OrdersDetails;
