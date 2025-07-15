import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Twilio config from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// In-memory OTP store: { phone: { otp, expires } }
const otpStore = {};

// Helper to generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });

  const otp = generateOTP();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore[phone] = { otp, expires };

  try {
    await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: twilioPhone,
      to: phone
    });
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP required' });

  const record = otpStore[phone];
  if (!record) return res.status(400).json({ success: false, message: 'OTP not found or expired' });
  if (Date.now() > record.expires) {
    delete otpStore[phone];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }
  if (record.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });

  delete otpStore[phone];
  res.json({ success: true, message: 'OTP verified successfully' });
});

app.listen(port, () => {
  console.log(`OTP backend running on port ${port}`);
}); 