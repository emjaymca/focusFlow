import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { CartItem, CustomerDetails, User } from '../types';
import OrderForm from './OrderForm';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  user: User | null;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onPlaceOrder: (customerDetails: CustomerDetails) => void;
  onAuthRequired: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, user, onUpdateQuantity, onPlaceOrder, onAuthRequired }) => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToOrder = () => {
    if (user) {
      setShowOrderForm(true);
    } else {
      onAuthRequired();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 relative flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-text-light hover:text-primary-dark focus:outline-none"
          onClick={onClose}
          aria-label="Close cart"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3 mb-6">
          <ShoppingCart className="w-7 h-7 text-primary" />
          <h2 className="text-2xl font-bold text-primary-dark">Your Cart</h2>
        </div>
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="w-16 h-16 text-muted mb-4" />
            <p className="text-lg text-text-light mb-2">Your cart is empty.</p>
            <button
              onClick={onClose}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-muted mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-muted" />
                    <div>
                      <h4 className="font-semibold text-primary-dark">{item.name}</h4>
                      <span className="text-sm text-text-light">${item.price} x {item.quantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-accent text-white rounded-full p-2 hover:bg-accent-dark transition-colors"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="font-semibold text-lg text-primary-dark">{item.quantity}</span>
                    <button
                      className="bg-accent text-white rounded-full p-2 hover:bg-accent-dark transition-colors"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-text">Total:</span>
              <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleProceedToOrder}
              className="w-full bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors font-semibold flex items-center justify-center space-x-2 mt-2"
            >
              <span>{user ? 'Proceed to Order' : 'Sign In to Order'}</span>
            </button>
          </>
        )}
        {/* Order Form Modal */}
        {showOrderForm && user && (
          <div className="animate-slide-down">
            <OrderForm
              cartItems={cartItems}
              total={total}
              user={user}
              onClose={() => setShowOrderForm(false)}
              onPlaceOrder={onPlaceOrder}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;