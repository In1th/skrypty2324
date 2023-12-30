import { useContext, useEffect, useState } from "react"
import { ProductContext } from "./hooks/useProducts"
import { Counter } from "./Counter";
import { useCart } from "./hooks/useCart";
import {Img} from './Img';

export const ProductDialog = () => {

    const {product} = useContext(ProductContext);
    const {addCartItem} = useCart();
    const [amount, setAmount] = useState(1);

    const closeDialog = () => {
        setAmount(1);
        document.getElementById('product-dialog').close();
    }

    const handleKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            closeDialog();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    const addToCart = () => {
        addCartItem({
            id: product.id,
            img: product.imageUrl,
            name: product.name,
            cost: product.price,
            quantity: amount
        })
        closeDialog();
    }

    return <dialog id="product-dialog" className="w-[1200px] bg-slate-800 border-white border-2 rounded-2xl text-slate-100 p-8 ">
        <div className="flex mb-4">
            <h1>{product.name ?? "NO_NAME"}</h1>
            <button className="ml-auto px-2" onClick={closeDialog} autoFocus>X</button>
        </div>
        <div className="flex-grow flex gap-2">
            <Img className="h-96 aspect-square object-cover" src={product.imageUrl} alt="NO_IMAGE"/>
            <div className="flex-grow flex flex-col">
                <div className="h-px w-full bg-white mb-4"></div>
                <div className="px-4 flex flex-col">
                    <i className="dialog-info">Ref ID: {product.id ?? "NO_ID"}</i>
                    <i className="dialog-info mb-4">Category: {product.category ?? "NO_CATEGORY"}</i>
                    <p>{product.description}</p>
                </div>
                <div className="mt-auto flex gap-2">
                    <p className="ml-auto">{product.price ?? "NO_PRICE"} PLN</p>
                    {product.quantity? 
                    <Counter value={amount} setValue={setAmount} max={product.quantity}/>:
                    <i className="dialog-info">Not avaliable</i>}
                    <button disabled={!product.quantity || !amount} onClick={addToCart}>Add to cart</button>
                </div>
            </div>
        </div>
    </dialog>
}