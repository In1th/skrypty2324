import { createContext, useContext, useEffect, useState } from "react"
import { useCart } from "./useCart";
import axios from "axios";

export const CheckoutContext = createContext({
    checkoutEnabled: false,
    setCheckoutEnabled: (check) => {}
});

export const useCheckout = () => {
    const {items, total, clearCart} = useCart();
    const [discout, setDiscount] = useState({
        name: undefined,
        amount: 0.0
    });
    const [delivery, setDelivery] = useState({
        name: undefined,
        amount: 0.0
    });
    const [updatedPrice, setUpdatePrice] = useState(total);
    const {checkoutEnabled, setCheckoutEnabled} = useContext(CheckoutContext);

    useEffect(() => {
        setUpdatePrice(total + delivery.amount - discout.amount);
    }, [delivery, discout])

    return {
        startCheckout: () => setCheckoutEnabled(true),
        endCheckout: () => setCheckoutEnabled(false),
        checkoutEnabled,
        prices: ({base: total, delivery: delivery.amount, discout: discout.amount, final: updatedPrice}),
        newDiscount: (name, amount) => {
            setDiscount({name, amount})
        },
        newDelivery: (name, amount) => {
            setDelivery({name, amount})
        },
        submitOrder: async (form) => {
            const body = {
                items: items,
                person: `${form.first} ${form.surname}`,
                email: form.email,
                phone: form.phone,
                address: `${form.street} ${form.apartament ?? ''}, ${form.code} ${form.city}`
            };

            const res = await axios.post('http://127.0.0.1:3001/buy', {
                body: body,
                withCredentials: false,
            });
            clearCart();
            alert(`Order submitted succesfully. Order id: ${res.data.id}`);
        }
    }
}