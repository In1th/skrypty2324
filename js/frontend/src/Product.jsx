import { useRef } from "react";
import { Img } from "./Img";

export const Product = ({product, preview}) => {
    const {id, name, imageUrl, price, quantity} = product;

    const onClick = () => {
        preview(product);
        document.getElementById('product-dialog').showModal();
    }

    return (
        <button
            key={id}
            onClick={onClick}
            className="z-0 h-64 aspect-square border-4 rounded-xl relative flex flex-col cursor-pointer text-white">
            <Img src={imageUrl} className=" z-10 absolute h-full w-full top-0 object-cover rounded-xl"/>
            <div className="z-20 absolute h-full w-full grad top-0 rounded-xl"></div>
            <div className="w-full z-30 mt-auto px-2 pb-2 justify-center">
                <h4>{name}</h4>
                <p>{price} PLN</p>
                <p>{quantity? 'avaliable' : 'out of stock'}</p>
            </div>
        </button>
    )
}