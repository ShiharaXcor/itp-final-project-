import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/orders`);
        if (Array.isArray(response.data)) {
          setOrders(response.data); 
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (error) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCreateReturn = (orderId) => {
    navigate(`/create-return/${orderId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="mt-4">
          {orders.map((order) => (  
            <div key={order._id} className="p-4 border mb-4">
              {/* Existing order details */}
              <p><strong>Name:</strong> {order.fname} {order.lname}</p>
              {/* ... other order fields ... */}
              
              <div className="flex items-center gap-2 mt-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <p className="text-lg font-bold">{order.status || "Order Received"}</p>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  className="bg-black text-white px-4 py-2"
                  onClick={() => navigate(`/order-details/${order._id}`)}
                >
                  View Details
                </button>
                
                {order.status === "Delivered" && (
                  <button
                    className="bg-red-600 text-white px-4 py-2 hover:bg-red-700"
                    onClick={() => handleCreateReturn(order._id)}
                  >
                    Return Items
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;