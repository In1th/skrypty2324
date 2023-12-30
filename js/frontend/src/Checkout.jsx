import { useEffect, useRef, useState } from "react";
import { Img } from "./Img";
import { useCart } from "./hooks/useCart"
import { useCheckout } from "./hooks/useCheckout";

export const Checkout = () => {
    const {items, deleteItem} = useCart();
    const {prices, newDiscount, endCheckout, newDelivery, submitOrder} = useCheckout();
    const [blockAddress, setBlockAddress] = useState(true);

    const discountRef = useRef(null);

    const onDiscount = () => {
        if (discountRef.current.value > prices.base){
            discountRef.current.value = prices.base;
        }
        newDiscount('user discount', discountRef.current.value)
    }

    useEffect(() => {
        if (!items.length) {
            endCheckout();
        }
    }, [items]);

    const shippements = [
        {name: 'None', amount: 0, blockingAddress: true},
        {name: 'Store pick-up', amount: 0, blockingAddress: true},
        {name: 'Delivery by magic', amount: 1000},
        {name: 'Regular delivery', amount: 20},
        {name: 'Fast delivery', amount: 40},
    ];

    const onSelect = (ev) => {
        const data = JSON.parse(ev.currentTarget.value);
        newDelivery(data.name, parseFloat(data.amount));

        if (data.blockingAddress ?? false){
            setBlockAddress(true);
        }
    }

    const abort = () => {
        setBlockAddress(true);
        endCheckout();
    }

    const onSubmit = async (ev) => {
        ev.preventDefault();
        let arr = [];
        ev.target.querySelectorAll('input').forEach(input => arr = [...arr, {[input.id]: input.value}]);
        const args = Object.assign({}, ...arr);
        console.log(args)
        await submitOrder(args);
        endCheckout();
    }

    return <section className="flex h-full">
        <div className="flex flex-col gap-2">
            <h1>Items total: {items.length}</h1>
            {items.map(it => 
            <section key={`cart-${it.id}`} className="flex gap-3 min-w-[400px]">
                <Img src={it.img} className="h-32 aspect-square"/>
                <div className="flex-grow flex flex-col">
                    <h1>{it.name ?? 'N/A'}</h1>
                    <h2>{it.cost ?? 'N/A'} PLN x {it.quantity ?? 'N/A'}</h2>
                    <div className="mt-auto flex">
                        <h2 className="ml-auto italic">= {it.cost * it.quantity} PLN</h2>
                    </div>
                </div>
                <button className="px-1" onClick={() => deleteItem(it.id)}>D</button>
            </section>)}
        </div>
        <div className="flex-grow flex flex-col gap-2 h-full p-6">
            <div className="flex p-2 gap-2">
                <p>Select discount</p>
                <input ref={discountRef} className="text-black text-right ml-auto" type="number" onChange={onDiscount} min={0} max={prices.base}/> PLN
            </div>
            <div className="flex p-2 gap-2">
                <p>Select shippement:</p>
                <select className="ml-auto text-black" onChange={onSelect}>
                    {shippements.map(ship => 
                    <option key={ship.name} value={JSON.stringify(ship)}>
                        {ship.name} - {ship.amount} PLN
                    </option>)}
                </select>
            </div>
            <form className="text-black flex flex-col gap-2" onSubmit={onSubmit}>
                <h1 className="text-white">Payment Details</h1>
                <div className="flex gap-4">
                    <input id="first" type="text" placeholder="First name" className="flex-grow" required/>
                    <input id="surname" type="text" placeholder="Surname"className="flex-grow" required/>
                </div>
                <div className="flex gap-4">
                    <input id="email" type="email" placeholder="E-mail" required/>
                    <input id="phone" type="tel" placeholder="Phone no." required/>
                </div>
                <h1 className="text-white">Address Details</h1>
                <div className="flex gap-4">
                    <input id="street" type="text" placeholder="Street" className="flex-grow" required/>
                    <input id="apartament" type="text" placeholder="Apartement" className="w-32"/>
                </div>
                <div className="flex gap-4">
                    <input id="code" type="text" placeholder="Postal Code" required/>
                    <input id="city" type="text" placeholder="City" required/>    
                </div>
                <div className="flex p-2 gap-2 mt-auto text-white">
                    <p>Total:</p>
                    <h3 className="ml-auto">{prices.base ?? 'N/A'} PLN</h3>
                </div>
                <div className="flex p-2 gap-2 text-white">
                    <p>Discount:</p>
                    <h3 className="ml-auto">- {prices.discout ?? 'N/A'} PLN</h3>
                </div>
                <div className="flex p-2 gap-2 text-white">
                    <p>Shipping:</p>
                    <h3 className="ml-auto">+ {prices.delivery ?? 'N/A'} PLN</h3>
                </div>
                <div className="h-px w-full bg-white"></div>
                <div className="flex p-2 gap-2 text-white">
                    <p>Final sum:</p>
                    <h3 className="ml-auto">{prices.final ?? 'N/A'} PLN</h3>
                </div>
                <div className="flex gap-4">
                    <input id="blik" type="text" placeholder="BLIK Code" required/>
                    <button className="ml-auto" onClick={abort}>Cancel</button>
                    <button type="submit" className="bg-white">Place Order</button>
                </div>
            </form>
            
        </div>
    </section>
}