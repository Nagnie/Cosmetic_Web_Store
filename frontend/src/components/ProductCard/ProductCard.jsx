import { useAddCartItem } from "@hooks/useCartQueries";
import { formatCurrency } from "@utils/utils";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  // console.log(product);
  const addCartItemMutation = useAddCartItem();

  const images = useMemo(() => {
    if (product.images && typeof product.images === "string") {
      return JSON.parse(product.images);
    }

    return product.images;
  }, [product.images]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    const item = {
      id_pro: product.id_pro,
      id_class: product.classification[0]?.id_class ?? "",
      quantity: 1,
    };

    addCartItemMutation.mutate(item);
  };

  return (
    <Link
      to={`/products/${encodeURIComponent(product.pro_name || product.name)}/${product.id_pro}`}
      className="flex h-100 w-full flex-col justify-between rounded-lg p-4"
      style={{ backgroundColor: "#fff3e7" }}
    >
      <img
        loading="lazy"
        src={images?.[0] ?? "https://placehold.co/276x350?text=No%20Image"}
        alt={product.pro_name || product.name}
        className="h-56 w-full rounded object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">
          {product.pro_name || product.name}
        </h3>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">
          {formatCurrency({
            number: Number(product.price),
            useFullCurrencyName: true,
          })}
        </span>
        <button
          className="rounded-lg px-4 py-2 text-white"
          style={{ backgroundColor: "#8D7B68" }}
          onClick={(e) => handleAddToCart(e)}
        >
          Add to cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
