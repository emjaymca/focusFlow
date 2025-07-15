import React, { useState } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import { MenuItem, CartItem, CustomerDetails, User } from './types';
import { menuItems } from './data/menu';
import { sendWhatsAppOrder } from './utils/whatsapp';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handlePlaceOrder = async (customerDetails: CustomerDetails) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Send WhatsApp message silently in background
    const success = await sendWhatsAppOrder(cartItems, customerDetails, total);
    
    if (success) {
      console.log('Order sent successfully to owner');
    } else {
      console.error('Failed to send order notification');
    }
    
    // Clear cart after placing order
    setCartItems([]);
    setIsCartOpen(false);
  };

  const handleAuthenticated = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    setIsCartOpen(false);
  };

  const handleAuthRequired = () => {
    setIsCartOpen(false);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItems={cartItems}
        user={user}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      
      <main>
        <Menu
          menuItems={menuItems}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        user={user}
        onUpdateQuantity={handleUpdateQuantity}
        onPlaceOrder={handlePlaceOrder}
        onAuthRequired={handleAuthRequired}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold mb-2">TJ's Thatte Idli</h3>
          <p className="text-gray-400">Authentic South Indian Cloud Kitchen</p>
          <p className="text-gray-400 mt-2">Fresh • Delicious • Delivered</p>
        </div>
      </footer>
    </div>
  );
}

export default App;