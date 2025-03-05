import { Image } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { QuantitySelector } from "@pages/ProductDetail/components";

const CartDrawerCart = () => {
  return (
    <div className="flex justify-between gap-2 sm:gap-3">
      <div className="w-1/5 cursor-pointer">
        <Image
          className="aspect-square w-full"
          preview={false}
          loading="lazy"
          src="https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg"
        />
      </div>

      <div className="w-4/5">
        <h3 className="cursor-pointer text-[12px] font-semibold sm:text-sm">
          [DEAL 26/2 - 10/3 HĐ 229K COLORKEY TẶNG 1 GƯƠNG TRANG ĐIỂM COLORKEY +
          1 BÔNG MÚT COLORKEY] Nước Hoa Colorkey Rose Wild Violet Eau De Parfum
        </h3>

        <p className="text-xs">10ml</p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantitySelector width={28 * 3} height={28} />
          <span className="text-sm font-semibold">229.000đ</span>
        </div>
      </div>

      <div className="cursor-pointer">
        <CloseOutlined />
      </div>
    </div>
  );
};
export default CartDrawerCart;
