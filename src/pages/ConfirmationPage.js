import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmationPage = () => {
  return (
    <div className="container my-5 text-center">
      <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body p-5">
          <div className="text-success mb-4">
            <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem' }}></i>
          </div>
          
          <h1 className="mb-3">Thank You for Your Order!</h1>
          <p className="lead mb-4">
            Your order has been placed successfully. We've sent a confirmation email to your inbox.
          </p>
          
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Order Details</h5>
              <p className="mb-1"><strong>Order ID:</strong> MC-20250716-001</p>
              <p className="mb-1"><strong>Estimated Delivery:</strong> 3-5 business days</p>
              <p><strong>Payment Method:</strong> Credit Card</p>
            </div>
          </div>
          
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-outline-primary">
              Continue Shopping
            </Link>
            <Link to="/orders" className="btn btn-primary">
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
