import { useAddCartItem } from "@hooks/useCartQueries";
import { formatCurrency } from "@utils/utils";
import { Link } from "react-router-dom";
//
// const IMAGES = [
//   "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021429010ko.jpg?l=ko",
//   "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0017/A00000017142381ko.jpg?l=ko",
//   "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0020/A00000020744412ko.jpg?l=ko",
//   "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021463307ko.jpg?l=ko",
//   "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0018/A00000018023767ko.jpg?l=ko",
//   "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0020/A00000020514525ko.jpg?l=ko",
//   "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021753007ko.jpg?l=ko",
//   "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0017/A000000171427112ko.png?l=ko",
// ];

// const getRandomImage = () => {
//   return IMAGES[Math.floor(Math.random() * IMAGES.length)];
// };

const ProductCard = ({ product }) => {
  // console.log(product);
  const addCartItemMutation = useAddCartItem();

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
      to={`/products/${encodeURIComponent(product.pro_name)}/${product.id_pro}`}
      className="flex h-100 w-full flex-col justify-between rounded-lg p-4"
      style={{ backgroundColor: "#fff3e7" }}
    >
      <img
        loading="lazy"
        src={
          product.images?.[0] ??
          "https://placehold.co/276x350?text=No%20Image"
        }
        alt={product.pro_name}
        className="h-56 w-full rounded object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">{product.pro_name}</h3>
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
