import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItem from '../UI/cartitem';
import { toggleStatusTab, toggleAuthModal } from '../store/cart';

const Carttab = () => {
  const carts = useSelector(store => store.cart.items);
  const statusTab = useSelector(store => store.cart.statusTab);
  const isAuthenticated = useSelector(store => store.cart.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseTabCart = () => {
    dispatch(toggleStatusTab())
  }
  return (
    <div className={`fixed z-50 top-0 right-0 bg-gray-700 shadow-2xl w-96 h-full grid grid-rows-[60px_1fr_60px]
    transform transition-transform duration-500
     ${statusTab === false ? "translate-x-full" : ""}
    `}>
      <h2 className='p-5 text-white text-2xl'>Shopping Cart</h2>
      <div className='p-5'>
        {carts.map((item, key) =>
          <CartItem key={key} data={item} />
        )}
      </div>
      <div className='grid grid-cols-2'>
        <button className='bg-black text-white' onClick={handleCloseTabCart} >CLOSE</button>
        <button
          className='bg-amber-600 text-white'
          onClick={() => {
            handleCloseTabCart(); // Close the drawer first
            if (isAuthenticated) {
              navigate('/checkout');
            } else {
              dispatch(toggleAuthModal());
            }
          }}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Carttab;