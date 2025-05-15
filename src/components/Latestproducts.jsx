import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "./Title";
import ProductItem from "./ProductItem";

const Latestproducts = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4001/api/products/getAll");
        const products = Array.isArray(res.data.products)
          ? res.data.products
          : res.data;

        const sorted = products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setLatestProducts(sorted.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className="my-10 px-4">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"PRODUCTS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Check out our newest products added to inventory.
        </p>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {latestProducts.map((item) => (
            <ProductItem key={item._id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Latestproducts;
