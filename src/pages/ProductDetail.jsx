import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(ShopContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/api/products/getAll/${id}`);
        console.log("API Response:", res.data); // Check if res.data.product exists and is valid
        setProduct(res.data.product); // Correctly set product from the API response
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Unable to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const productId = product._id || product.pricing?.product;
  
    if (!productId) {
      console.warn("Product data is not available or invalid.");
      return;
    }
  
    addToCart(productId, quantity);
  };
  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) setQuantity(val);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return null;

  const { name, description, images, category, pricing } = product;
  const discounts = pricing?.quantityDiscounts || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={images?.[0] || '/placeholder.png'}
          alt={name}
          className="w-full h-auto rounded-lg object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold mb-2">{name}</h2>
          <p className="text-gray-600 mb-4">{description}</p>

          {category && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">Category</h3>
              <p className="font-bold">{category.name}</p>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
          )}

          {pricing ? (
            <>
              <p className="text-lg font-semibold mb-2">
                Base Price: ${pricing.basePrice?.toFixed(2) ?? 'N/A'}
              </p>

              {discounts.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">Bulk Discounts:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {discounts.map((d, idx) => (
                      <li key={idx}>
                        Buy {d.minQuantity}+ units: {d.discountPercent}% off
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-red-500">Pricing unavailable.</p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <label htmlFor="quantity">Qty:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="border rounded px-3 py-1 w-24"
            />
            <button
              onClick={handleAddToCart}
              disabled={loading || !product}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
