import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}/`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading product details. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        quantity: quantity
      }
    });
    navigate('/cart');
  };

  if (loading) return (
    <div className="container my-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading product details...</p>
    </div>
  );

  if (error) return (
    <div className="container my-5">
      <div className="alert alert-danger">{error}</div>
      <button 
        className="btn btn-primary"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            {product.image ? (
              <img 
                src={product.image} 
                className="card-img-top" 
                alt={product.name}
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '500px' }}>
                <div className="text-muted">No Image Available</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          <h3 className="text-primary mb-3">R {product.price}</h3>
          
          <div className="mb-4">
            <p className="lead">{product.description}</p>
          </div>
          
          <div className="mb-4">
            <h5>Product Details</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Category:</strong> {product.category}</li>
              <li className="list-group-item"><strong>Availability:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</li>
              <li className="list-group-item"><strong>Stock:</strong> {product.stock} units available</li>
            </ul>
          </div>
          
          <div className="d-flex align-items-center mb-4">
            <label className="me-3"><strong>Quantity:</strong></label>
            <div className="input-group" style={{ width: '150px' }}>
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input 
                type="number" 
                className="form-control text-center" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </button>
            </div>
          </div>
          
          {product.stock > 0 ? (
            <button className="btn btn-primary btn-lg w-100 mb-3" onClick={addToCart}>
              Add to Cart
            </button>
          ) : (
            <button className="btn btn-secondary btn-lg w-100 mb-3" disabled>
              Out of Stock
            </button>
          )}
          
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary w-50" onClick={() => navigate(-1)}>
              &larr; Back
            </button>
            <button className="btn btn-outline-primary w-50" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
