import { Image } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { formatCurrency } from "@utils/utils";

const SAMPLE_PRODUCT = {
  images: [
    "https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg",
  ],
  brand: "Colorkey",
  name: "[DEAL 26/2 - 10/3 HĐ 229K COLORKEY TẶNG 1 GƯƠNG TRANG ĐIỂM COLORKEY + 1 BÔNG MÚT COLORKEY] Nước Hoa Colorkey Rose Wild Violet Eau De Parfum",
  price: 229000,
};

const ProductCard = ({ product }) => {
  return (
    <div>
      <div className="product-image relative aspect-square p-1">
        <Link
          to={`/products/${encodeURIComponent(product.pro_name)}/${product.id_pro}`}
          className="aspect-square w-full"
        >
          <Image
            preview={false}
            src={
              product.images?.[0] || product.image || SAMPLE_PRODUCT.images[0]
            }
            alt="product"
            className="aspect-square w-full cursor-pointer object-contain"
          />
        </Link>
        <div></div>
      </div>
      <div className="product-info p-2 text-left">
        <div>
          <div className="text-[10px] font-bold uppercase">
            {product.brand || SAMPLE_PRODUCT.brand}
          </div>
        </div>
        <h3
          title={product.pro_name || SAMPLE_PRODUCT.name}
          className="line-clamp-2 font-medium"
        >
          <Link
            to={`/products/${encodeURIComponent(product.pro_name)}/${product.id_pro}`}
          >
            {product.pro_name || SAMPLE_PRODUCT.name}
          </Link>
        </h3>
        <div>
          <span className="text-primary-dark font-bold">
            {formatCurrency({
              number: Number(product.price) || SAMPLE_PRODUCT.price,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
