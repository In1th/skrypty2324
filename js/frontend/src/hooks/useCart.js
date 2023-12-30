import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext({
    cartItems: [],
    setCartItems: (arr) => {}
});

export const useCart = () => {
    const {cartItems, setCartItems} = useContext(CartContext);
    const [totalCost, setTotal] = useState(0);

    useEffect(() => {
        setTotal(cartItems.reduce((acc, pr) => acc + pr.cost * pr.quantity, 0));
    }, [cartItems]);

    return {
        items: cartItems,
        total: totalCost,
        addCartItem: (item) => {
            const itemInList = cartItems.find(it => it.id === item.id);
            if (itemInList){
                item.quantity += itemInList.quantity;
            }
            setCartItems([...cartItems.filter(it => it.id !== item.id), item])
        },
        deleteItem: (id) => {
            setCartItems([...cartItems.filter(it => it.id !== id)])
        },
        clearCart: () => setCartItems([])
    }
}