// Mock SMS service for development - replace with real SMS provider in production
class AuthService {
  private otpStore: Map<string, { otp: string; expires: number }> = new Map();

  // Generate a random 6-digit OTP
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Format Australian phone number for display
  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
      // Format: 0XXX XXX XXX
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (cleaned.length === 9) {
      // Format: XXX XXX XXX (mobile without leading 0)
      return `0${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('61')) {
      // Format +61 from international
      const local = cleaned.substring(2);
      return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
    }
    
    return phone;
  }

  // Validate Australian phone number
  isValidAustralianPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    
    // Australian mobile numbers: 04XX XXX XXX (10 digits starting with 04)
    // Or without leading 0: 4XX XXX XXX (9 digits starting with 4)
    // Or international: +61 4XX XXX XXX
    
    if (cleaned.length === 10 && cleaned.startsWith('04')) {
      return true;
    } else if (cleaned.length === 9 && cleaned.startsWith('4')) {
      return true;
    } else if (cleaned.length === 12 && cleaned.startsWith('614')) {
      return true;
    }
    
    return false;
  }

  // Send OTP via backend
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send SMS. Please try again.'
      };
    }
  }

  // Verify OTP via backend
  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.'
      };
    }
  }
}

export const authService = new AuthService();