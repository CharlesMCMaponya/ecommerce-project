import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { items, dispatch, getTotal, countItems } = useCart();

  const removeItem = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  const updateQuantity = (item, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { ...item, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Your Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-5">
          <div className="fs-1 mb-3">🛒</div>
          <h3>Your cart is empty</h3>
          <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet</p>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">{countItems()} items in cart</h5>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
                
                {items.map(item => (
                  <div key={item.id} className="row align-items-center mb-4 border-bottom pb-3">
                    <div className="col-md-2">
                      <img 
                        src={item.image || 'https://via.placeholder.com/100'} 
                        alt={item.name} 
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-4">
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="text-muted small mb-0">{item.description.substring(0, 50)}...</p>
                    </div>
                    <div className="col-md-3">
                      <div className="input-group">
                        <button 
                          className="btn btn-outline-secondary btn-sm" 
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          className="form-control form-control-sm text-center" 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button 
                          className="btn btn-outline-secondary btn-sm" 
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      <span className="fw-bold">R {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="col-md-1 text-end">
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(item)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Order Summary</h5>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>R {getTotal()}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>R 50.00</span> {/* Fixed shipping for now */}
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total:</span>
                  <span>R {(parseFloat(getTotal()) + 50).toFixed(2)}</span>
                </div>
                
                <Link to="/checkout" className="btn btn-primary w-100">
                  Proceed to Checkout
                </Link>
                
                <Link to="/products" className="btn btn-outline-secondary w-100 mt-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
