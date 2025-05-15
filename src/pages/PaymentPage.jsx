import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Upload, AlertCircle, Check, Loader } from 'lucide-react';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('card');

  const [slip, setSlip] = useState(null);
  const [slipFileName, setSlipFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [cardProcessing, setCardProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, backendUrl]);

  const handleSlipUpload = async () => {
    if (!slip) {
      setUploadError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append('slip', slip);
      formData.append('orderId', order._id);
      await axios.post(`${backendUrl}/api/payments/upload-slip`, formData);
      setUploadSuccess(true);
      navigate('/orderlist');
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Failed to upload slip.');
    } finally {
      setUploading(false);
    }
  };

  const handleCardPayment = async () => {
    if (!cardDetails.name.trim()) return setCardError('Cardholder name is required');
    if (!cardDetails.number.replace(/\s/g, '').match(/^\d{16}$/)) return setCardError('Valid 16-digit card number required');
    if (!cardDetails.expiry.match(/^\d{2}\/\d{2}$/)) return setCardError('Expiry must be in MM/YY');
    if (!cardDetails.cvv.match(/^\d{3}$/)) return setCardError('CVV must be 3 digits');

    setCardProcessing(true);
    setCardError(null);
    try {
      await axios.post(`${backendUrl}/api/payments/card`, {
        orderId: order._id,
        ...cardDetails
      });
      alert('Payment successful!');
      navigate('/orderlist');
    } catch (err) {
      console.error('Card payment error:', err);
      setCardError('Payment failed. Check your details.');
    } finally {
      setCardProcessing(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSlip(e.target.files[0]);
      setSlipFileName(e.target.files[0].name);
      setUploadSuccess(false);
      setUploadError(null);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    return v.match(/.{1,4}/g)?.join(' ') || value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin mr-2" size={24} />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (!order) return <div className="text-center p-6 text-red-500">Order not found.</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 border border-gray-200">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pay for Order #{order._id}</h2>
        <div className="mt-4 bg-blue-50 p-3 rounded-md">
          <p className="font-semibold text-lg">Amount: <span className="text-blue-600">LKR {order.totalAmount.toFixed(2)}</span></p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center"><span className="w-20 font-medium text-gray-600">Name:</span>{order.fname} {order.lname}</div>
        <div className="flex items-center"><span className="w-20 font-medium text-gray-600">Email:</span>{order.email}</div>
        <div className="flex items-center"><span className="w-20 font-medium text-gray-600">Phone:</span>{order.phone}</div>
        <div className="flex items-start"><span className="w-20 font-medium text-gray-600">Address:</span>{order.address}, {order.city}</div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button className={`flex-1 py-3 font-medium flex items-center justify-center ${activeTab === 'card' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('card')}>
          <CreditCard size={18} className="mr-2" />
          Credit Card
        </button>
        <button className={`flex-1 py-3 font-medium flex items-center justify-center ${activeTab === 'slip' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`} onClick={() => setActiveTab('slip')}>
          <Upload size={18} className="mr-2" />
          Bank Slip
        </button>
      </div>

      {/* CARD PAYMENT */}
      {activeTab === 'card' && (
        <div className="space-y-4">
          <input type="text" placeholder="Cardholder Name" value={cardDetails.name} onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })} className="w-full border p-3 rounded" />
          <input type="text" placeholder="Card Number" value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })} maxLength={19} className="w-full border p-3 rounded" />
          <div className="flex gap-4">
            <input type="text" placeholder="MM/YY" value={cardDetails.expiry} onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{1,2})/, '$1/$2') })} maxLength={5} className="w-1/2 border p-3 rounded" />
            <input type="text" placeholder="CVV" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} maxLength={3} className="w-1/2 border p-3 rounded" />
          </div>
          {cardError && <div className="text-sm text-red-600 flex items-center"><AlertCircle className="mr-2" size={18} /> {cardError}</div>}
          <button onClick={handleCardPayment} disabled={cardProcessing} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 flex justify-center items-center">
            {cardProcessing ? <><Loader className="animate-spin mr-2" size={18} /> Processing...</> : 'Pay Now'}
          </button>
        </div>
      )}

      {/* BANK SLIP */}
      {activeTab === 'slip' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-500">
            <input type="file" id="slip-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="slip-upload" className="cursor-pointer block">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to upload your bank slip</p>
              <p className="text-xs text-gray-500">JPG, PNG or PDF (max. 5MB)</p>
            </label>
          </div>
          {slipFileName && (
            <div className="bg-gray-50 p-3 rounded flex justify-between items-center">
              <span className="text-sm">{slipFileName}</span>
              <button className="text-red-500 hover:text-red-700" onClick={() => { setSlip(null); setSlipFileName(""); }}>Remove</button>
            </div>
          )}
          {uploadError && <div className="text-sm text-red-600 flex items-center"><AlertCircle className="mr-2" size={18} /> {uploadError}</div>}
          {uploadSuccess && <div className="text-sm text-green-600 flex items-center"><Check className="mr-2" size={18} /> Slip uploaded successfully!</div>}
          <button onClick={handleSlipUpload} disabled={!slip || uploading} className={`w-full py-3 rounded ${slip ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} flex items-center justify-center`}>
            {uploading ? <><Loader className="animate-spin mr-2" size={18} /> Uploading...</> : 'Submit Payment Slip'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
