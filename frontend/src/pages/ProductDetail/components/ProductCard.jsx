import { Image } from "antd";

const ProductCard = () => {
  return (
    <div>
      <div className="product-image relative aspect-square p-1">
        <div className="aspect-square w-full">
          <Image
            preview={false}
            src="https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg"
            alt="product"
            className="aspect-square w-full cursor-pointer object-contain"
          />
        </div>
        <div></div>
      </div>
      <div className="product-info p-2 text-left">
        <div>
          <div className="text-[10px] font-bold uppercase">COLORKEY</div>
        </div>
        <h3
          title="[DEAL 26/2 - 10/3 HĐ 229K COLORKEY TẶNG 1 GƯƠNG TRANG ĐIỂM COLORKEY +
          1 BÔNG MÚT COLORKEY] Nước Hoa Colorkey Rose Wild Violet Eau De Parfum"
          className="line-clamp-2 font-medium"
        >
          <a href="#!">
            [DEAL 26/2 - 10/3 HĐ 229K COLORKEY TẶNG 1 GƯƠNG TRANG ĐIỂM COLORKEY
            + 1 BÔNG MÚT COLORKEY] Nước Hoa Colorkey Rose Wild Violet Eau De
            Parfum
          </a>
        </h3>
        <div>
          <span className="text-primary-dark font-bold">229.000đ</span>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
