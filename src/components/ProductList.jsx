import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products with pricing on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:4001/api/products/getAll'); // Adjust to your backend route
        if (res.data.success) {
          setProducts(res.data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))
      ) : (
        <p className="col-span-full text-center">No products available.</p>
      )}
    </div>
  );
};

export default ProductList;
