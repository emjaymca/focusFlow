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
    <form onSubmit={handleSendOTP} className="space-y-5">
      <div className="text-center mb-4">
        <Phone className="w-12 h-12 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-bold text-primary-dark">Enter Your Phone Number</h3>
        <p className="text-text-light text-sm mt-2">We'll send you a verification code</p>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">
          Mobile Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="04XX XXX XXX"
          required
          className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
        />
        <p className="text-xs text-muted mt-1">
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
        className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
    <form onSubmit={handleVerifyOTP} className="space-y-5">
      <div className="text-center mb-4">
        <Shield className="w-12 h-12 text-accent mx-auto mb-3" />
        <h3 className="text-xl font-bold text-primary-dark">Enter Verification Code</h3>
        <p className="text-text-light text-sm mt-2">
          SMS code sent to {authService.formatPhoneNumber(phoneNumber)}
        </p>
      </div>
      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-text mb-1">
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
          className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-lg text-center tracking-widest"
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
          className="flex-1 bg-muted text-text py-3 px-6 rounded-lg hover:bg-background transition-colors font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={authState.isLoading || otp.length !== 6}
          className="flex-1 bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
    <form onSubmit={handleCompleteProfile} className="space-y-5">
      <div className="text-center mb-4">
        <User className="w-12 h-12 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-bold text-primary-dark">Complete Your Profile</h3>
        <p className="text-text-light text-sm mt-2">Help us personalize your experience</p>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
          className="w-full px-4 py-3 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
        />
      </div>
      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full bg-primary-dark text-white py-3 px-6 rounded-lg hover:bg-primary transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <User className="w-5 h-5" />
        <span>Complete Setup</span>
      </button>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface rounded-2xl max-w-md w-full shadow-2xl relative">
        <div className="flex items-center justify-between p-6 border-b border-muted">
          <h2 className="text-2xl font-bold text-primary-dark">Sign In</h2>
          <button
            onClick={onClose}
            className="text-text-light hover:text-primary-dark p-1"
            aria-label="Close auth modal"
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