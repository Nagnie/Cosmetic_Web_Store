import { Image, Select } from "antd";
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
        <h3 className="hover:text-primary cursor-pointer text-[14px] font-semibold sm:text-lg">
          [DEAL 26/2 - 10/3 HĐ 229K COLORKEY TẶNG 1 GƯƠNG TRANG ĐIỂM COLORKEY +
          1 BÔNG MÚT COLORKEY] Nước Hoa Colorkey Rose Wild Violet Eau De Parfum
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: "#9b9b9b" }}>
            Phân loại:
          </span>
          <Select
            defaultValue="10ml"
            options={[
              { value: "10ml", label: "10ml" },
              { value: "20ml", label: "20ml" },
              { value: "30ml", label: "30ml" },
            ]}
          />
        </div>

        <div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <QuantitySelector width={35 * 3} height={35} />
            <span className="font-semibold sm:text-lg">229.000đ</span>
          </div>
        </div>
      </div>

      <div className="cursor-pointer">
        <CloseOutlined />
      </div>
    </div>
  );
};
export default CartDrawerCart;
