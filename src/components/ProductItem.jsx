import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const pricing = product.pricing || {};
  const discountAvailable = pricing.quantityDiscounts && pricing.quantityDiscounts.length > 0;

  return (
    <div className="border p-4 rounded shadow hover:shadow-md transition-all duration-200">
      <Link to={`/product/${product._id}`}>
        <img src={product.images?.[0]} alt={product.name} className="w-full h-48 object-cover mb-2" />
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.description?.slice(0, 60)}...</p>
        <p className="mt-1 text-md font-medium">
          Price: ${pricing.basePrice?.toFixed(2) ?? 'N/A'}
        </p>
        {discountAvailable && (
          <p className="text-green-600 text-sm mt-1">Discounts available on bulk!</p>
        )}
      </Link>
      <button
        className="bg-black text-white px-4 py-2 mt-3 w-full rounded hover:bg-gray-800"
        onClick={() => addToCart(product._id)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductItem;
