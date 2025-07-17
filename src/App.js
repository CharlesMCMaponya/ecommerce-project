import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

import { useCart } from './contexts/CartContext';
import { useAuth } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  const { countItems } = useCart();
  const { user, logout } = useAuth();
  
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
          <div className="container">
            <Link className="navbar-brand" to="/">MCPECULIAR</Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">Shop</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
              </ul>
              <div className="d-flex">
                <Link to="/cart" className="btn btn-outline-light position-relative me-2">
                  <i className="bi bi-cart"></i>
                  {countItems() > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {countItems()}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  )}
                </Link>
                
                {user ? (
                  <div className="dropdown">
                    <button 
                      className="btn btn-outline-light dropdown-toggle" 
                      type="button" 
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      {user.username}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                    </ul>
                  </div>
                ) : (
                  <Link to="/login" className="btn btn-outline-light">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1">
          <Routes>
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/" element={
              <div className="container text-center my-5 py-5">
                <h1 className="display-4 mb-4"> MCPECULIAR APPAREL</h1>
                <p className="lead mb-4">Your exclusive fashion destination</p>
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <p className="mb-4">
                      Discover our premium collection of unique apparel that reflects your distinctive style.
                    </p>
                    <Link 
                      to="/products" 
                      className="crystal-btn"
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '12px',
                        border: '1px solid rgba(100, 100, 100, 0.4)',
                        background: 'rgba(60, 60, 60, 0.8)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        padding: '12px 32px',
                        fontSize: '16px',
                        fontWeight: '600',
                        letterSpacing: '-0.025em',
                        color: 'rgba(240, 240, 240, 0.95)',
                        textDecoration: 'none',
                        display: 'inline-block',
                        boxShadow: 'inset 0 1px 0 rgba(150, 150, 150, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        animation: 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) both'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.boxShadow = 'inset 0 1px 0 rgba(150, 150, 150, 0.2), 0 20px 40px rgba(80, 80, 80, 0.4)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.background = 'rgba(80, 80, 80, 0.9)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'inset 0 1px 0 rgba(150, 150, 150, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.background = 'rgba(60, 60, 60, 0.8)';
                      }}
                    >
                      <span style={{ position: 'relative', zIndex: 10 }}>Shop&nbsp;Now</span>
                      <span 
                        className="crystal-sheen"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '12px',
                          background: 'rgba(120, 120, 120, 0.3)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          pointerEvents: 'none'
                        }}
                      ></span>
                      <span 
                        className="crystal-glow"
                        style={{
                          position: 'absolute',
                          inset: '-4px',
                          borderRadius: '16px',
                          background: 'linear-gradient(135deg, rgba(120, 120, 120, 0.4), transparent)',
                          opacity: 0.1,
                          filter: 'blur(4px)',
                          transition: 'opacity 0.3s ease',
                          pointerEvents: 'none'
                        }}
                      ></span>
                    </Link>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <footer className="bg-dark text-white py-4 mt-auto">
          <div className="container">
            <div className="row">
              <div className="col-md-4 text-start">
                <h5>MCPECULIAR</h5>
                <p>Premium fashion for the discerning individual.</p>
              </div>
              <div className="col-md-4 text-center">
                <h5>Quick Links</h5>
                <ul className="list-unstyled">
                  <li><Link to="/" className="text-white">Home</Link></li>
                  <li><Link to="/products" className="text-white">Shop</Link></li>
                  <li><Link to="/about" className="text-white">About Us</Link></li>
                  <li><Link to="/contact" className="text-white">Contact</Link></li>
                </ul>
              </div>
              <div className="col-md-4 text-end">
                <h5>Contact</h5>
                <p>Email:CharlesMosehla@outlook.com</p>
                <p>Phone: +27761944140</p>
              </div>
            </div>
            <div className="text-center mt-3">
              <p>&copy; {new Date().getFullYear()} MCPECULIAR. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <style jsx>{`
          @keyframes fadeIn {
            0% { 
              opacity: 0; 
              transform: translateY(8px); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          .crystal-btn:hover .crystal-sheen {
            opacity: 0.15 !important;
          }
          
          .crystal-btn:hover .crystal-glow {
            opacity: 0.25 !important;
          }
        `}</style>
      </div>
    </Router>
  );
}

export default App;