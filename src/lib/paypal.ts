
// Extend the Window interface to include PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}

export const initializePayPal = (clientId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Check if PayPal script is already loaded
    if (window.paypal) {
      resolve(window.paypal);
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    
    script.onload = () => {
      if (window.paypal) {
        resolve(window.paypal);
      } else {
        reject(new Error('PayPal SDK failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('PayPal SDK failed to load'));
    };
    
    document.body.appendChild(script);
  });
};

// Function to save order details after successful payment
export const savePayPalOrder = async (orderDetails: any) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderDetails,
        paymentMethod: 'paypal'
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save order');
    }
    
    return data;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};
