import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface MenuItemComponentProps {
  item: MenuItem;
  cartItem?: CartItem;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ item, cartItem, onAddToCart, onUpdateQuantity }) => {
  return (
    <div className="bg-surface rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col overflow-hidden group animate-fade-in">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <div className="flex-1 flex flex-col p-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xl font-bold text-primary-dark">{item.name}</h4>
          <span className="bg-primary text-white px-3 py-1 rounded-full font-semibold text-sm shadow">${item.price}</span>
        </div>
        <p className="text-text-light mb-4 flex-1">{item.description}</p>
        <div className="mt-auto flex items-center space-x-2">
          {cartItem ? (
            <>
              <button
                className="bg-accent text-white rounded-full p-2 hover:bg-accent-dark transition-colors"
                onClick={() => onUpdateQuantity(item.id, cartItem.quantity - 1)}
                aria-label="Decrease quantity"
                disabled={cartItem.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-lg text-primary-dark">{cartItem.quantity}</span>
              <button
                className="bg-accent text-white rounded-full p-2 hover:bg-accent-dark transition-colors"
                onClick={() => onUpdateQuantity(item.id, cartItem.quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors"
              onClick={() => onAddToCart(item)}
            >
              <Plus className="inline w-4 h-4 mr-1 align-text-bottom" /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemComponent;