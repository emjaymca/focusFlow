import React from 'react';
import { Menu as MenuIcon, ShoppingCart, User, LogOut, X } from 'lucide-react';
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
    <header className="backdrop-blur-md bg-white/70 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-20">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <button
            className={`md:hidden text-primary hover:text-primary-dark focus:outline-none transition-transform ${mobileNavOpen ? 'rotate-90' : ''}`}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Open menu"
          >
            <MenuIcon className="w-8 h-8" />
          </button>
          <span className="flex items-center space-x-3 cursor-pointer group transition-transform hover:scale-105">
            <span className="bg-primary p-2 rounded-full shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <MenuIcon className="w-8 h-8 text-white" />
            </span>
            <span className="font-extrabold text-2xl tracking-tight text-primary-dark drop-shadow-sm group-hover:text-primary">TJ's Thatte Idli</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={onCartClick}
            className="relative bg-accent text-white px-5 py-2 rounded-xl shadow hover:bg-accent-dark transition-colors flex items-center space-x-2 text-lg font-semibold"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="hidden sm:block">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow">
                {totalItems}
              </span>
            )}
          </button>
          {user ? (
            <>
              <span className="flex items-center space-x-2 text-base text-primary-dark font-semibold">
                <User className="w-5 h-5" />
                <span>Hi, {user.name || 'User'}</span>
              </span>
              <button
                onClick={onLogout}
                className="text-primary-dark hover:text-primary p-2 transition-colors"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-primary-dark text-white px-5 py-2 rounded-xl hover:bg-primary transition-colors flex items-center space-x-2 shadow text-lg font-semibold"
            >
              <User className="w-6 h-6" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 ${mobileNavOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileNavOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
        {/* Drawer */}
        <nav
          className={`fixed top-0 left-0 h-full w-72 bg-white/95 shadow-2xl p-8 flex flex-col space-y-6 transform transition-transform duration-300 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
          aria-label="Mobile menu"
        >
          <button
            onClick={() => setMobileNavOpen(false)}
            className="self-end text-primary-dark hover:text-primary p-2 mb-4"
            aria-label="Close menu"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            onClick={onCartClick}
            className="w-full flex items-center space-x-2 bg-accent text-white px-5 py-3 rounded-xl shadow hover:bg-accent-dark transition-colors text-lg font-semibold"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="ml-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow">
                {totalItems}
              </span>
            )}
          </button>
          {user ? (
            <>
              <span className="flex items-center space-x-2 text-base text-primary-dark font-semibold">
                <User className="w-5 h-5" />
                <span>Hi, {user.name || 'User'}</span>
              </span>
              <button
                onClick={onLogout}
                className="w-full text-left text-primary-dark hover:text-primary py-3 text-lg font-semibold"
              >
                <LogOut className="w-6 h-6 inline mr-2" />Logout
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="w-full flex items-center space-x-2 bg-primary-dark text-white px-5 py-3 rounded-xl hover:bg-primary transition-colors shadow text-lg font-semibold"
            >
              <User className="w-6 h-6" />
              <span>Sign In</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;