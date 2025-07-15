import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface MenuItemProps {
  item: MenuItem;
  cartItem?: CartItem;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({
  item,
  cartItem,
  onAddToCart,
  onUpdateQuantity
}) => {
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <span className="text-lg font-bold text-orange-600">${item.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        <div className="flex items-center justify-between">
          {quantity === 0 ? (
            <button
              onClick={() => onAddToCart(item)}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                className="bg-gray-200 text-gray-700 p-1 rounded-md hover:bg-gray-300 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                className="bg-orange-600 text-white p-1 rounded-md hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemComponent;