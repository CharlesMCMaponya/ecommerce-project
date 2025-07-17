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
              <ul className="navbar-nav me-auto">
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
                      <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
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
                <h1 className="display-4 mb-4">Welcome to MCPECULIAR</h1>
                <p className="lead mb-4">Your exclusive fashion destination</p>
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="card bg-light border-0 shadow">
                      <div className="card-body p-5">
                        <p className="card-text mb-4">
                          Discover our premium collection of unique apparel that reflects your distinctive style.
                        </p>
                        <Link to="/products" className="btn btn-primary btn-lg px-4">
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>

        <footer className="bg-dark text-white py-4 mt-auto">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h5>MCPECULIAR</h5>
                <p>Premium fashion for the discerning individual.</p>
              </div>
              <div className="col-md-4">
                <h5>Quick Links</h5>
                <ul className="list-unstyled">
                  <li><Link to="/" className="text-white">Home</Link></li>
                  <li><Link to="/products" className="text-white">Shop</Link></li>
                  <li><Link to="/about" className="text-white">About Us</Link></li>
                  <li><Link to="/contact" className="text-white">Contact</Link></li>
                </ul>
              </div>
              <div className="col-md-4">
                <h5>Contact</h5>
                <p>Email: contact@mcpeculiar.com</p>
                <p>Phone: +27 12 345 6789</p>
              </div>
            </div>
            <div className="text-center mt-3">
              <p>&copy; {new Date().getFullYear()} MCPECULIAR. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;