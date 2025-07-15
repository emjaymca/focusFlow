import React from 'react';
import { ShoppingCart, Phone, MapPin, User, LogOut } from 'lucide-react';
import { CartItem, User as UserType } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  user: UserType | null;
  onCartClick: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItems, user, onCartClick, onAuthClick, onLogout }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              TJ's <span className="text-orange-600">Thatte Idli</span>
            </h1>
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+61 402 213 197</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Cloud Kitchen Delivery</span>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Hi, {user.name || 'User'}</span>
                </div>
                <button
                  onClick={onCartClick}
                  className="relative bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:block">Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-gray-800 p-2"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;