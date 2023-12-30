export const Counter = ({value, setValue, max}) => {

    return (
        <section className="flex gap-2 w-16 border-white border-2 rounded-lg">
            <button className="px-1 rounded-r-none" disabled={value === 0} onClick={() => setValue(value-1)}>-</button>
            <span className="flex-grow text-center">
                {value}
            </span>
            <button className="px-1 rounded-l-none" disabled={value === max} onClick={() => setValue(value+1)}>+</button>
        </section>
    )
}