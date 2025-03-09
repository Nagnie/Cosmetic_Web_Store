import { Image } from "antd";

const CheckoutCard = () => {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <div className="relative w-1/6 cursor-pointer">
        <div className="absolute -top-3 -right-3 z-10 flex items-center justify-center rounded bg-black/25 p-1 px-2 py-0.5 text-sm text-white shadow-md">
          1
        </div>
        <Image
          className="aspect-square w-full object-contain"
          preview={false}
          loading="lazy"
          src="https://product.hstatic.net/200000868185/product/65c7fde00b6db533ec7c_bf3f88e452fb458da23e4c2d5700e2af_master.jpg"
        />
      </div>

      <div className="w-5/6">
        <h3 className="cursor-pointer text-[12px] font-semibold sm:text-sm">
          [DEAL 26/2 - 10/3 HĐ 229K COLORKEY TẶNG 1 GƯƠNG TRANG ĐIỂM COLORKEY +
          1 BÔNG MÚT COLORKEY] Nước Hoa Colorkey Rose Wild Violet Eau De Parfum
        </h3>

        <p className="text-xs text-gray-400 sm:text-sm">10ml</p>

        <div className="mt-2 flex items-center justify-between gap-2"></div>
      </div>

      <div>
        <span className="text-sm font-semibold">229.000đ</span>
      </div>
    </div>
  );
};
export default CheckoutCard;
