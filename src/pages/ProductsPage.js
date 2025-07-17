import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/');
        
        // Log the response for debugging
        console.log('API Response:', response.data);
        
        // Handle paginated response
        const productsData = response.data.results || response.data;
        const processedProducts = Array.isArray(productsData) ? productsData : [productsData];
        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(processedProducts.map(p => p.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        console.error('Product fetch error:', err.response);
        setError('Error loading products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when search term or category changes
  useEffect(() => {
    let result = products;
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  if (loading) return (
    <div className="container my-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading products...</p>
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
      <div className="row mb-4 align-items-center">
        <div className="col-md-6 mb-3 mb-md-0">
          <h1 className="mb-0">Our Products</h1>
        </div>
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-search"></i>
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="input-group">
            <select 
              className="form-select" 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {selectedCategory && (
              <button 
                className="btn btn-outline-danger" 
                type="button"
                onClick={() => setSelectedCategory('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="alert alert-info text-center">
          No products found. Try a different search term.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;