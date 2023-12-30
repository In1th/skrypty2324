import { useState } from 'react';
import { Menu } from './Menu';
import { ProductDialog } from './ProductDialog';
import { ProductContextProvider } from './hooks/useProducts';
import { CartDialog } from './CartDialog';
import { CartContext } from './hooks/useCart';
import { CheckoutContext } from './hooks/useCheckout';
import { Checkout } from './Checkout';

function App() {

  const [product, setProduct] = useState({});
  const [items, setItems] = useState([]);
  const [checkoutEnabled, setCheckoutEnabled] = useState(false);

  const onCart = () => {
    document.getElementById('cart').showModal();
  }

  return (
    <ProductContextProvider value={{product, setProduct}}>
      <CartContext.Provider value={{cartItems: items, setCartItems: setItems}}>
        <CheckoutContext.Provider value={{checkoutEnabled, setCheckoutEnabled}}>
          <main className='flex flex-col min-h-screen text-slate-50'>
            <header className='flex w-screen px-6 py-4 text-2xl items-center'>
              <span>Shop App</span>
              <button className='ml-auto flex gap-2 px-4 py-2' onClick={onCart}>
                <span>Cart</span>
                <span className=' bg-slate-500 text-white h-8 aspect-square rounded-xl'>{items.length}</span>
              </button>
            </header>
            <div className=' h-px bg-gradient-to-r from-transparent via-slate-50 to-transparent opacity-40 mb-4'></div>
            <section className='flex-grow px-6'>
              {checkoutEnabled? <Checkout/> : <Menu/>}
            </section>
            <div className='h-px bg-gradient-to-r from-transparent via-slate-50 to-transparent opacity-40 mt-4'></div>
            <footer className='p-2'>
              2023, Mateusz Kruk
            </footer>
            <ProductDialog/>
            <CartDialog/>
          </main>
        </CheckoutContext.Provider>
      </CartContext.Provider>
    </ProductContextProvider>
  )
}

export default App
