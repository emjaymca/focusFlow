import React from 'react';
import { MenuItem, CartItem } from '../types';
import MenuItemComponent from './MenuItem';

interface MenuProps {
  menuItems: MenuItem[];
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({
  menuItems,
  cartItems,
  onAddToCart,
  onUpdateQuantity
}) => {
  const categories = [
    { id: 'main', name: 'Main Items', items: menuItems.filter(item => item.category === 'main') },
    { id: 'combo', name: 'Combo Meals', items: menuItems.filter(item => item.category === 'combo') },
    { id: 'side', name: 'Sides & Extras', items: menuItems.filter(item => item.category === 'side') },
    { id: 'beverage', name: 'Beverages', items: menuItems.filter(item => item.category === 'beverage') }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-primary mb-4 drop-shadow-sm">
          Authentic South Indian Flavors
        </h2>
        <p className="text-lg text-text-light max-w-2xl mx-auto">
          Experience the traditional taste of Karnataka's famous Thatte Idli, 
          made fresh daily with love and authentic recipes.
        </p>
      </div>

      {/* Menu Categories */}
      {categories.map(category => (
        category.items.length > 0 && (
          <div key={category.id} className="mb-12">
            <h3 className="text-2xl font-bold text-primary-dark mb-6 pb-2 border-b-2 border-primary">
              {category.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map(item => (
                <MenuItemComponent
                  key={item.id}
                  item={item}
                  cartItem={cartItems.find(cartItem => cartItem.id === item.id)}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Menu;