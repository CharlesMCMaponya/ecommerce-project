import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create Cart Context
const CartContext = createContext();

// Initial cart state
const initialState = {
  items: [],
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if item already exists in cart
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // Increase quantity
        return {
          ...state,
          items: state.items.map(item => 
            item.id === action.payload.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, quantity: Math.max(1, action.payload.quantity) } 
            : item
        )
      };
      
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
      
    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    // Load cart from localStorage
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : initialState;
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Calculate total
  const getTotal = () => {
    return state.items.reduce(
      (total, item) => total + (parseFloat(item.price) * item.quantity),
      0
    ).toFixed(2);
  };

  // Count items
  const countItems = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      ...state,
      dispatch,
      getTotal,
      countItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
