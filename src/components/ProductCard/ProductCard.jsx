import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="w-full h-100  flex flex-col justify-between p-4 rounded-lg" style={{ backgroundColor: "#FDE5EC" }}>
            <img src={product.image} alt={product.name} className="w-full h-56 object-cover rounded" />
            <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{product.price} VNĐ</span>
                <button className="text-white px-4 py-2 rounded-lg" style={{ backgroundColor: "#D14D72"}}>Add to cart</button>
            </div>
        </div>
    )
}

export default ProductCard;