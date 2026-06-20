import React, { useState, useEffect } from "react";

export default function ImageComponent({ src, alt, className }) {
    const [isLoading, setIsLoading] = useState(true);
    const imgRef = React.useRef(null);

    useEffect(() => {
        setIsLoading(true);
    }, [src]);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsLoading(false);
        }
    }, [src]);

    const isWebp = src?.endsWith('.webp');
    const avifSrc = isWebp ? src.replace(/\.webp$/, '.avif') : null;

    return (
        <>
            {isLoading && (
                <div className={`${className} bg-gray-200 animate-pulse`} />
            )}
            <picture style={isLoading ? { position: 'absolute', opacity: 0, pointerEvents: 'none' } : {}}>
                {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
                <img 
                    ref={imgRef}
                    src={src} 
                    alt={alt} 
                    className={className} 
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                />
            </picture>
        </>
    );
}