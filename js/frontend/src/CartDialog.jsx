import { Img } from "./Img";
import { useCart } from "./hooks/useCart";
import { useCheckout } from "./hooks/useCheckout";

export const CartDialog = () => {
    const {items, total, clearCart, deleteItem} = useCart();
    const {startCheckout} = useCheckout();

    const onClear = () => {
        document.getElementById('cart').close();
        clearCart();
    }

    const onCheckout = () => {
        startCheckout();
        document.getElementById('cart').close();
    }

    return <dialog id='cart' className='bg-slate-900 absolute top-0 right-0 mr-6 mt-4 w-96 h-[450px] border-white border-2 rounded-2xl text-slate-100 p-2'>
        <div className="w-full h-full flex flex-col">
            <div className="flex p-2">
                <h1>Cart ({items.length} items)</h1>
                <button className="ml-auto px-2" onClick={() => document.getElementById('cart').close()} autoFocus>X</button>
            </div>
            <div className={`flex-grow flex flex-col items-center gap-2 ${!items.length? 'justify-center': ''}`}>
                {items.length?
                <>
                    {items.map(it => 
                    <section key={`cart-${it.id}`} className="flex gap-3 text-sm min-w-[350px]">
                        <Img src={it.img} className="h-24 aspect-square"/>
                        <div className="flex-grow flex flex-col">
                            <p>{it.name ?? 'N/A'}</p>
                            <p>{it.cost ?? 'N/A'} PLN x {it.quantity ?? 'N/A'}</p>
                            <div className="mt-auto flex">
                                <p className="ml-auto italic">= {it.cost * it.quantity} PLN</p>
                            </div>
                        </div>
                        <button className="px-1" onClick={() => deleteItem(it.id)}>D</button>
                    </section>)}
                </>
                :<h3>No items added :)</h3>}
            </div>
            <div className="h-px w-full bg-white mt-auto"></div>
            <div className="flex p-2 gap-2">
                <h3>Total: {total ?? 'N/A'} PLN</h3>
                <button className="ml-auto" onClick={onClear} disabled={!items.length}>Clear</button>
                <button disabled={!items.length} onClick={onCheckout}>Checkout</button>
            </div>
        </div>
  </dialog>
}