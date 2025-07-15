import React, { useState } from 'react';
import { X, Phone, Shield, User, Loader } from 'lucide-react';
import { AuthState, User as UserType } from '../types';
import { authService } from '../services/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    step: 'phone'
  });
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthState(prev => ({ ...prev, isLoading: true }));

    const result = await authService.sendOTP(phoneNumber);
    
    if (result.success) {
      setAuthState(prev => ({ ...prev, step: 'otp', isLoading: false }));
    } else {
      setError(result.message);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthState(prev => ({ ...prev, isLoading: true }));

    const result = await authService.verifyOTP(phoneNumber, otp);
    
    if (result.success) {
      setAuthState(prev => ({ ...prev, step: 'profile', isLoading: false }));
    } else {
      setError(result.message);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserType = {
      phone: phoneNumber,
      name: name.trim(),
      isAuthenticated: true
    };
    
    onAuthenticated(user);
    onClose();
  };

  const renderPhoneStep = () => (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div className="text-center mb-6">
        <Phone className="w-12 h-12 text-orange-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-900">Enter Your Phone Number</h3>
        <p className="text-gray-600 text-sm mt-2">We'll send you a verification code</p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Australian Mobile Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="04XX XXX XXX"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your Australian mobile number (e.g., 0412 345 678)
        </p>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={authState.isLoading || !phoneNumber.trim() || !authService.isValidAustralianPhone(phoneNumber)}
        className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {authState.isLoading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Phone className="w-5 h-5" />
            <span>Send SMS Code</span>
          </>
        )}
      </button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-900">Enter Verification Code</h3>
        <p className="text-gray-600 text-sm mt-2">
          SMS code sent to {authService.formatPhoneNumber(phoneNumber)}
        </p>
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
          6-Digit Code
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="123456"
          maxLength={6}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg text-center tracking-widest"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setAuthState(prev => ({ ...prev, step: 'phone' }))}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={authState.isLoading || otp.length !== 6}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {authState.isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Shield className="w-5 h-5" />
              <span>Verify</span>
            </>
          )}
        </button>
      </div>
    </form>
  );

  const renderProfileStep = () => (
    <form onSubmit={handleCompleteProfile} className="space-y-4">
      <div className="text-center mb-6">
        <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-900">Complete Your Profile</h3>
        <p className="text-gray-600 text-sm mt-2">Help us personalize your experience</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <User className="w-5 h-5" />
        <span>Complete Setup</span>
      </button>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">Sign In</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {authState.step === 'phone' && renderPhoneStep()}
          {authState.step === 'otp' && renderOTPStep()}
          {authState.step === 'profile' && renderProfileStep()}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;