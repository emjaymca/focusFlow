import React from 'react';
import { Menu as MenuIcon, ShoppingCart, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { CartItem, User as UserType } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  user: UserType | null;
  onCartClick: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItems, user, onCartClick, onAuthClick, onLogout }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-primary shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <button
            className="md:hidden text-white hover:text-primary-light focus:outline-none"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Open menu"
          >
            <MenuIcon className="w-7 h-7" />
          </button>
          <span className="flex items-center space-x-2 text-white font-bold text-xl tracking-tight">
            <span className="bg-white rounded-full p-1"><MenuIcon className="w-7 h-7 text-primary" /></span>
            <span>TJ's Thatte Idli</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={onCartClick}
            className="relative bg-accent text-white px-4 py-2 rounded-lg shadow hover:bg-accent-dark transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:block">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          {user ? (
            <>
              <span className="flex items-center space-x-2 text-sm text-white">
                <User className="w-4 h-4" />
                <span>Hi, {user.name || 'User'}</span>
              </span>
              <button
                onClick={onLogout}
                className="text-white hover:text-primary-light p-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center space-x-2 shadow"
            >
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-primary-dark text-white px-4 py-4 space-y-4 shadow-lg animate-slide-down">
          <button
            onClick={onCartClick}
            className="w-full flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg shadow hover:bg-accent-dark transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          {user ? (
            <>
              <span className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4" />
                <span>Hi, {user.name || 'User'}</span>
              </span>
              <button
                onClick={onLogout}
                className="w-full text-left text-white hover:text-primary-light py-2"
              >
                <LogOut className="w-5 h-5 inline mr-2" />Logout
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="w-full flex items-center space-x-2 bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors shadow"
            >
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;