import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "Rs";
  const delivery_fee = 200;

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4001/api/products/getAll");

        if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products); // Case: { products: [...] }
        } else if (Array.isArray(res.data)) {
          setProducts(res.data); // Case: direct array
        } else {
          console.error("Unexpected product data format:", res.data);
          setProductError("Invalid product data format received.");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductError("Failed to load products. Please try again later.");
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (itemId, quantity = 1) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + quantity
    }));
  };

  const updateQuantity = (itemId, quantity) => {
    setCartItems(prev => {
      const updated = { ...prev };
      if (quantity > 0) {
        updated[itemId] = quantity;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((total, qty) => total + qty, 0);

  const getProductById = (id) => products.find(p => p._id === id);

  const getCartTotal = () => {
    return Object.entries(cartItems).reduce((total, [id, quantity]) => {
      const product = getProductById(id);
      const basePrice = product?.pricing?.basePrice || 0;
      return total + basePrice * quantity;
    }, 0);
  };

  const value = {
    products,
    loadingProducts,
    productError,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getProductById,
    getCartTotal,
    navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
