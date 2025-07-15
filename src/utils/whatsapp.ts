import { CartItem, CustomerDetails } from '../types';

export const sendWhatsAppOrder = async (cartItems: CartItem[], customerDetails: CustomerDetails, total: number): Promise<boolean> => {
  const ownerPhoneNumber = '+15551234567'; // Replace with actual owner's WhatsApp number
  
  // Create order summary
  const orderSummary = cartItems.map(item => 
    `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  // Create WhatsApp message
  const message = `🍽️ *NEW ORDER - TJ's Thatte Idli*

👤 *Customer Details:*
Name: ${customerDetails.name}
Phone: ${customerDetails.phone}
Email: ${customerDetails.email || 'Not provided'}

📍 *Delivery Address:*
${customerDetails.address}

🛒 *Order Details:*
${orderSummary}

💰 *Total: $${total.toFixed(2)}*

${customerDetails.notes ? `📝 *Special Instructions:*\n${customerDetails.notes}` : ''}

Order placed at: ${new Date().toLocaleString()}`;

  // Encode message for WhatsApp URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${ownerPhoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
  
  try {
    // Send message silently in background using fetch to WhatsApp Business API
    // For now, we'll use a hidden iframe approach as a fallback
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = whatsappUrl;
    document.body.appendChild(iframe);
    
    // Remove iframe after a short delay
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
    
    return true;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return false;
  }
};

// Alternative method using WhatsApp Business API (requires setup)
export const sendWhatsAppBusinessAPI = async (cartItems: CartItem[], customerDetails: CustomerDetails, total: number): Promise<boolean> => {
  // This would integrate with WhatsApp Business API
  // Requires WhatsApp Business account and API setup
  
  const orderSummary = cartItems.map(item => 
    `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  const message = `🍽️ *NEW ORDER - TJ's Thatte Idli*

👤 *Customer Details:*
Name: ${customerDetails.name}
Phone: ${customerDetails.phone}
Email: ${customerDetails.email || 'Not provided'}

📍 *Delivery Address:*
${customerDetails.address}

🛒 *Order Details:*
${orderSummary}

💰 *Total: $${total.toFixed(2)}*

${customerDetails.notes ? `📝 *Special Instructions:*\n${customerDetails.notes}` : ''}

Order placed at: ${new Date().toLocaleString()}`;

  try {
    // Replace with actual WhatsApp Business API endpoint
    const response = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: '+15551234567', // Owner's WhatsApp number
        message: message
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('WhatsApp Business API error:', error);
    return false;
  }
};