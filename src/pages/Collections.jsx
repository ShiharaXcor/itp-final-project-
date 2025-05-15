import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from "../components/ProductList";

const Collections = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length) {
      // Sort by createdAt descending
      const sorted = [...products].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
     
    }
  }, [products]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"LATEST"} text2={"PRODUCTS"} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        
      <ProductItem />
      </div>
    </div>
  );
};

export default Collections;
