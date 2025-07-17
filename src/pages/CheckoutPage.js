import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51PJdZv2FpJpF4d7mz0c...');

const CheckoutPage = () => {
  const { items, getTotal } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'South Africa',
    email: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const total = parseFloat(getTotal()) + 50;

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Left Column - Form */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="mb-4">Checkout</h2>
              
              {/* Contact Information */}
              <div className="mb-4">
                <h5 className="mb-3 border-bottom pb-2">Contact Information</h5>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="mb-4">
                <h5 className="mb-3 border-bottom pb-2">Shipping Address</h5>
                
                <div className="form-group mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={shippingInfo.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="form-label">Postal Code</label>
                          <input
                            type="text"
                            className="form-control"
                            name="postalCode"
                            value={shippingInfo.postalCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="form-label">Country</label>
                          <select
                            className="form-select"
                            name="country"
                            value={shippingInfo.country}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="South Africa">South Africa</option>
                            <option value="Other">Other Country</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="mb-4">
                    <h5 className="mb-3 border-bottom pb-2">Payment Method</h5>
                    
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="card"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <label className="form-check-label fw-medium" htmlFor="card">
                        Credit/Debit Card
                      </label>
                    </div>
                    
                    {paymentMethod === 'card' && (
                      <div className="card border-0 bg-light p-3 mb-4">
                        <h6 className="mb-3">Card Details</h6>
                        <Elements stripe={stripePromise}>
                          <CheckoutForm 
                            shippingInfo={shippingInfo} 
                            total={total * 100}
                          />
                        </Elements>
                      </div>
                    )}
                    
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cash"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                      />
                      <label className="form-check-label fw-medium" htmlFor="cash">
                        Cash on Delivery
                      </label>
                    </div>
                    
                    {paymentMethod === 'cash' && (
                      <div className="card border-0 bg-light p-3 mt-3">
                        <h6 className="mb-3">Cash Payment Instructions</h6>
                        <p className="mb-0">
                          Please prepare the exact amount for the delivery person.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Order Summary */}
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Order Summary</h5>
                  
                  <div className="mb-3">
                    {items.map(item => (
                      <div key={item.id} className="d-flex justify-content-between mb-2">
                        <span className="text-muted">{item.name} × {item.quantity}</span>
                        <span>R {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>R {getTotal()}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>R 50.00</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total:</span>
                    <span>R {total.toFixed(2)}</span>
                  </div>
                  
                  {paymentMethod === 'cash' && (
                    <Link to="/confirmation" className="btn btn-primary w-100 mt-3">
                      Place Order
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Need Help?</h6>
                  <p className="card-text small mb-1">
                    <i className="bi bi-telephone me-2"></i> +27 12 345 6789
                  </p>
                  <p className="card-text small mb-0">
                    <i className="bi bi-envelope me-2"></i> support@mcpeculiar.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    export default CheckoutPage;