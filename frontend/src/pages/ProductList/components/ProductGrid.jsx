import PropTypes from "prop-types";

import ProductCardSkeleton from "@components/ProductCard/ProductCardSkeleton.jsx";
import { numberToArray } from "@utils/utils.js";
import ProductCard from "@components/ProductCard/ProductCard";

const LIMIT = 30;

const ProductGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {numberToArray(LIMIT).map((item) => (
          <ProductCardSkeleton key={item} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">
          Không tìm thấy sản phẩm phù hợp với bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id_pro} product={product} />
      ))}
    </div>
  );
};

ProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};

export default ProductGrid;
