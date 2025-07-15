export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
}

export interface Order {
  items: CartItem[];
  customer: CustomerDetails;
  total: number;
  timestamp: Date;
}
export interface User {
  phone: string;
  name?: string;
  isAuthenticated: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  step: 'phone' | 'otp' | 'profile' | 'authenticated';
}