import {useEffect, useState} from 'react';
import { getProduct, useProduct } from './hooks/useProducts';
import { Product } from './Product';

export const Menu = () => {

    const {products, count, changeProduct, previewProduct} = useProduct();
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState(undefined);

    useEffect(() => {
        changeProduct(page, category);
    }, [page, category]);

    const changeCategory = (cat) => {
        setPage(1);
        setCategory(cat)
    }

    const categories = [
        'CategoryA',
        'CategoryB',
        'CategoryC',
        'CategoryD',
        'CategoryE',
    ]

    return <section className='flex'>
        <div className='flex flex-col gap-4 p-4 max-w-36'>
            <h1>Categories</h1>
            <button onClick={() => changeCategory(undefined)}>Clear</button>
            {categories.map(cat => (
                <button disabled={cat === category} onClick={() => changeCategory(cat)}>
                    {cat}
                </button>
            ))}
            <p>Current page: {page}. Items {20*(page-1)+1} - {20*page} of {count}</p>
            <button onClick={() => setPage(page-1)} disabled={page === 1}>Prev</button>
            {' '}
            <button onClick={() => setPage(page+1)} disabled={page === Math.ceil(count / 20)}>Next</button>
        </div>
        <div className='flex-grow p-4 flex gap-4 flex-wrap justify-center'>
            {products.map(pr => <Product product={pr} preview={previewProduct}/>)}
        </div>
    </section>
}