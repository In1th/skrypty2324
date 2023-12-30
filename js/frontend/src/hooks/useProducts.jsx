import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const productMap = new Map();

export const ProductContext = createContext({
    product: undefined,
    setProduct: (prod) => {}
});

export const ProductContextProvider = ({value, children}) => (
    <ProductContext.Provider value={value}>
        {children}
    </ProductContext.Provider>
)

export const useProduct = () => {
    const [products, setProducts] = useState([]);
    const [count, setCount] = useState(0);
    const {_, setProduct} = useContext(ProductContext);

    useEffect(() => {
        getProduct(1).then(data => {
            setProducts(data.products);
            setCount(data.total)
        })
    }, []);

    return {
        products,
        count,
        changeProduct: (page, category = undefined) => {
            getProduct(page, category).then(data => {
                setProducts(data.products);
                setCount(data.total)
            })
        },
        previewProduct: (product) => {
            setProduct(product);
        }
    }
}

export const getProduct = async (page, category = undefined) => {
    const key = `${category ?? 'none'}:${page}`;

    if (productMap.has(key)){
        return productMap.get(key);
    }

    const res = await axios.get('http://127.0.0.1:3001/products', {
        params: {
            page: page,
            category: category
        },
        withCredentials: false,
    });

    productMap.set(key, res.data);

    return res.data;
}