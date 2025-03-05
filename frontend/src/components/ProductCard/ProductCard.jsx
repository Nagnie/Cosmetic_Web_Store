import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="w-full h-100  flex flex-col justify-between p-4 rounded-lg" style={{ backgroundColor: "#fff3e7" }}>
            <img src={product.images[0]} alt={product.pro_name} className="w-full h-56 object-cover rounded" />
            <div>
                <h3 className="text-lg font-semibold">{product.pro_name}</h3>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{product.price} VNĐ</span>
                <button className="text-white px-4 py-2 rounded-lg" style={{ backgroundColor: "#8D7B68"}}>Add to cart</button>
            </div>
        </div>
    )
}

export default ProductCard;