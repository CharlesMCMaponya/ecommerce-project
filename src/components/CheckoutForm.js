import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutForm = ({ shippingInfo, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setProcessing(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/create-payment-intent/', {
        amount: total,
        currency: 'zar',
        shipping: shippingInfo
      });
      
      const { clientSecret } = response.data;
      
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: shippingInfo.name,
            email: shippingInfo.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              postal_code: shippingInfo.postalCode,
              country: shippingInfo.country,
            }
          }
        }
      });
      
      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        window.location.href = '/confirmation';
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Card Details</label>
        <div className="border p-3 rounded">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      
      <button 
        className="btn btn-primary w-100 mt-2" 
        disabled={processing || !stripe || succeeded}
      >
        {processing ? 'Processing...' : `Pay R ${(total / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;