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

  // Mock SMS sending - logs OTP to console for development
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP with 5-minute expiry
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      this.otpStore.set(cleanPhone, {
        otp,
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes
      });

      // Mock SMS sending - log to console for development
      console.log('='.repeat(50));
      console.log('📱 MOCK SMS SERVICE - DEVELOPMENT MODE');
      console.log('='.repeat(50));
      console.log(`📞 To: ${this.formatPhoneNumber(phoneNumber)}`);
      console.log(`🔐 Your verification code: ${otp}`);
      console.log(`⏰ Valid for: 5 minutes`);
      console.log('='.repeat(50));
      console.log('💡 In production, replace this with a real SMS service like:');
      console.log('   • Twilio SMS API');
      console.log('   • AWS SNS');
      console.log('   • MessageBird');
      console.log('   • Vonage (Nexmo)');
      console.log('='.repeat(50));

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'SMS sent successfully! Check the browser console for your verification code.'
      };
    } catch (error) {
      console.error('Mock SMS service error:', error);
      return {
        success: false,
        message: 'Failed to send SMS. Please try again.'
      };
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const storedData = this.otpStore.get(cleanPhone);

      if (!storedData) {
        return {
          success: false,
          message: 'OTP not found or expired. Please request a new one.'
        };
      }

      if (Date.now() > storedData.expires) {
        this.otpStore.delete(cleanPhone);
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.'
        };
      }

      if (storedData.otp !== otp) {
        return {
          success: false,
          message: 'Invalid OTP. Please check and try again.'
        };
      }

      // Clean up used OTP
      this.otpStore.delete(cleanPhone);

      return {
        success: true,
        message: 'Phone number verified successfully'
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.'
      };
    }
  }
}

export const authService = new AuthService();