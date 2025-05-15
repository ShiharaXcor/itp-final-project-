import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ReturnsList = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const res = await axios.get('http://localhost:4001/api/returns');
        setReturns(res.data);
      } catch (err) {
        setError('Failed to load return requests');
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Return Requests</h1>
      
      {loading && <p>Loading returns...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {returns.map(ret => (
          <div key={ret._id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Return ID: {ret._id}</h3>
                <p className="text-sm text-gray-600">
                  Order: {ret.order?._id || 'N/A'}
                </p>
                <p className="text-sm">Status: 
                  <span className={`ml-2 px-2 py-1 rounded ${
                    ret.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    ret.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ret.status}
                  </span>
                </p>
              </div>
              <Link 
                to={`/returns/${ret._id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReturnsList;