import React, { useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { CartContext } from '../context/CartContext'; // Adjust path as needed

const CheckoutForm = ({ shippingInfo, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, dispatch } = useContext(CartContext); // Get cart from context
  
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const createOrder = async (paymentIntentId) => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      
      const orderData = {
        cart: cart,
        shipping_info: shippingInfo,
        payment_method: 'card',
        payment_intent_id: paymentIntentId, // Store payment intent ID for reference
        total_amount: total
      };

      const response = await axios.post(
        'http://localhost:8000/api/create-order/',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Clear cart after successful order creation
      dispatch({ type: 'CLEAR_CART' });
      
      return response.data;
    } catch (err) {
      console.error('Order creation error:', err);
      throw new Error('Failed to create order: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      return;
    }

    if (!cart || cart.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Create payment intent
      const paymentIntentResponse = await axios.post(
        'http://localhost:8000/api/create-payment-intent/',
        {
          amount: total,
          currency: 'zar',
          shipping: shippingInfo,
        }
      );

      const { client_secret: clientSecret } = paymentIntentResponse.data;

      // 2. Confirm card payment
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
            },
          },
        },
      });

      // 3. Handle payment result
      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSucceeded(true);

        // 4. Create order in backend
        try {
          await createOrder(result.paymentIntent.id);
          
          // 5. Redirect to confirmation page
          setTimeout(() => {
            window.location.href = '/confirmation';
          }, 1000);
        } catch (orderError) {
          // Payment succeeded but order creation failed
          setError(`Payment was successful, but there was an issue creating your order. Please contact support with payment ID: ${result.paymentIntent.id}`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An unexpected error occurred');
    } finally {
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

      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      {succeeded && (
        <div className="alert alert-success mb-3" role="alert">
          Payment successful! Creating your order...
        </div>
      )}

      <button
        className="btn btn-primary w-100 mt-2"
        disabled={processing || !stripe || succeeded}
        type="submit"
      >
        {processing ? 'Processing...' : succeeded ? 'Order Created!' : `Pay R ${(total / 100).toFixed(2)}`}
      </button>

      {/* Order Summary */}
      <div className="mt-3">
        <small className="text-muted">
          Items in cart: {cart?.length || 0} | Total: R {(total / 100).toFixed(2)}
        </small>
      </div>
    </form>
  );
};

export default CheckoutForm;