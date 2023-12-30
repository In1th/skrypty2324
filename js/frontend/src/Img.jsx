import { useRef } from "react";

export const Img = ({url: src, className}) => {

    const imageRef = useRef(null);

    const fallbackImg = () => {
        imageRef.current.src = 'vite.svg';
    }

    return <img ref={imageRef} src={src} className={className} onError={fallbackImg}/>
}