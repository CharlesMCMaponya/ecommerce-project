import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();

  const addToCart = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_ITEM',
      payload: product
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="card h-100 border-0 shadow-sm text-decoration-none text-dark">
      <div className="ratio ratio-1x1 bg-light">
        {product.image ? (
          <img 
            src={product.image} 
            className="card-img-top p-3" 
            alt={product.name}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center text-muted">
            <div>No Image</div>
          </div>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{product.name}</h5>
        <p className="card-text flex-grow-1 text-muted small">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="text-primary fw-bold">R {product.price}</span>
          <button 
            className="btn btn-primary btn-sm"
            onClick={addToCart}
          >
            <i className="bi bi-cart-plus me-1"></i> Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;