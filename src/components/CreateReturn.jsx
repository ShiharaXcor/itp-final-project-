import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CreateReturn = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleItemToggle = (item, checked) => {
    const newItem = {
      name: item.name,
      quantity: 1,
      reason: '',
      price: item.price
    };

    setItems(prev => checked ? [...prev, newItem] : prev.filter(i => i.name !== item.name));
  };

  const updateItem = (name, field, value) => {
    setItems(prev => prev.map(item => 
      item.name === name ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('returnImages', file));
      formData.append('orderId', orderId);
      formData.append('email', email);
      formData.append('items', JSON.stringify(items));

      const res = await axios.post('http://localhost:4001/api/returns', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 201) {
        navigate(`/returnsList`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading order details...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Return Request</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Order #{order?._id}</h2>
        <p className="text-gray-600">Total Amount: ${order?.totalAmount}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Order Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="border rounded p-4">
          <h3 className="font-medium mb-4">Select Items to Return</h3>
          {order?.orderItems.map(item => (
            <div key={item.name} className="mb-4 border-b pb-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={items.some(i => i.name === item.name)}
                  onChange={(e) => handleItemToggle(item, e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-600">(Qty: {item.quantity})</span>
              </label>

              {items.some(i => i.name === item.name) && (
                <div className="ml-8 mt-3 space-y-3">
                  <div>
                    <label className="block mb-1">Return Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={item.quantity}
                      value={items.find(i => i.name === item.name)?.quantity || 1}
                      onChange={(e) => updateItem(item.name, 'quantity', e.target.value)}
                      className="p-1 border rounded w-20"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Return Reason</label>
                    <textarea
                      value={items.find(i => i.name === item.name)?.reason || ''}
                      onChange={(e) => updateItem(item.name, 'reason', e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="block mb-2 font-medium">Upload Evidence (Max 5 images)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles([...e.target.files].slice(0, 5))}
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-500 mt-1">
            {files.length} file(s) selected
          </p>
        </div>

        {error && <div className="p-3 text-red-600 bg-red-50 rounded">{error}</div>}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReturn;