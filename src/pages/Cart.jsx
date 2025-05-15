// Cart.js (improved)
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    delivery_fee,
    getProductById,
    getCartTotal
  } = useContext(ShopContext);

  // Get enriched cart data
  const cartData = Object.entries(cartItems)
    .map(([id, quantity]) => {
      const product = getProductById(id);
      return product ? { ...product, quantity } : null;
    })
    .filter(item => item !== null);

  const totalPrice = getCartTotal();
  const grandTotal = totalPrice + delivery_fee;

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="YOUR" text2="CART" />
      </div>

      {cartData.length > 0 ? (
        <>
          {cartData.map((item) => (
            <div
              key={item._id}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name}
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{item.name}</p>
                  <div className="flex items-center gap-5 mt-5">
                    <p>{currency} {item.pricing?.basePrice?.toFixed(2) || "N/A"}</p>
                  </div>
                </div>
              </div>

              <input
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
              />
              <img
                onClick={() => updateQuantity(item._id, 0)}
                className="w-4 mr-5 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Delete"
              />
            </div>
          ))}

          <div className="mt-6 text-right text-lg font-semibold">
            <p>Total: {currency} {totalPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Delivery: {currency} {delivery_fee}</p>
            <p className="mt-1">Grand Total: {currency} {grandTotal.toFixed(2)}</p>

            <div className="w-full text-end">
              <button
                onClick={() => navigate('/place-order')}
                className="bg-black text-white text-sm my-8 px-8 py-3 hover:bg-gray-800 transition-colors"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center mt-6">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;