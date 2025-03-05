import React from "react";

const ProductCard = ({ product }) => {
  console.log(product);
  return (
    <div
      className="flex h-100 w-full flex-col justify-between rounded-lg p-4"
      style={{ backgroundColor: "#fff3e7" }}
    >
      <img
        src={product.images?.[0] ?? product.image}
        alt={product.pro_name}
        className="h-56 w-full rounded object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">{product.pro_name}</h3>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{product.price} VNĐ</span>
        <button
          className="rounded-lg px-4 py-2 text-white"
          style={{ backgroundColor: "#8D7B68" }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
