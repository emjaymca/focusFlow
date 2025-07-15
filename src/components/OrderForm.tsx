import React, { useState } from 'react';
import { CheckCircle, Send, X } from 'lucide-react';
import { CartItem, CustomerDetails, User } from '../types';

interface OrderFormProps {
  cartItems: CartItem[];
  total: number;
  user: User;
  onClose: () => void;
  onPlaceOrder: (customerDetails: CustomerDetails) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ cartItems, total, user, onClose, onPlaceOrder }) => {
  const [formData, setFormData] = useState<CustomerDetails>({
    name: user.name || '',
    phone: user.phone,
    email: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onPlaceOrder(formData);
      setIsSubmitting(false);
      setOrderPlaced(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl max-w-md w-full p-8 text-center shadow-2xl animate-fade-in">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-primary-dark mb-2">Order Placed Successfully!</h3>
          <p className="text-text-light mb-4">
            Your order has been received and we'll start preparing it right away.
          </p>
          <p className="text-sm text-muted">
            You'll receive a confirmation call shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface rounded-2xl max-w-md w-full p-8 shadow-2xl relative animate-slide-down">
        <button
          className="absolute top-4 right-4 text-text-light hover:text-primary-dark focus:outline-none"
          onClick={onClose}
          aria-label="Close order form"
        >
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-primary-dark mb-6 text-center">Delivery Details</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={!!user.name}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              disabled
              className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-text mb-1">
              Delivery Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-text mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Placing Order...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Place Order</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;