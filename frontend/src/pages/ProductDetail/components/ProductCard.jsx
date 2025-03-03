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
          <span className="!mr-2 !text-[10px] font-bold !text-gray-400 !line-through">
            299.000đ
          </span>
          <span className="text-primary-dark font-bold">229.000đ</span>
        </div>
        <div className="mt-[10px]">
          <div></div>
          <div>
            <div className="flex items-center space-x-1 text-[11px] font-[400] overflow-ellipsis">
              <span>Đã bán 154</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="10"
                viewBox="0 0 11 10"
                fill="none"
              >
                <path
                  d="M8.09056 3.90685L8.03746 3.85436L8.02761 3.8462C7.25743 3.20686 6.8829 2.24769 7.00009 1.2146L7.13788 0L5.95608 0.637664C4.70014 1.3153 3.87326 2.57072 3.7341 3.97445L2.40804 3.58726L2.30451 3.82369C1.88734 4.77599 1.68119 5.69014 1.6918 6.54082C1.70339 7.4687 2.07532 8.33876 2.73908 8.99077C3.40154 9.64155 4.278 9.99998 5.20688 9.99998H5.34886C4.8457 9.99998 4.37093 9.80581 4.01204 9.45333C3.65239 9.09994 3.45083 8.62837 3.44449 8.12544C3.43892 7.67905 3.54619 7.20152 3.76317 6.70607L3.8667 6.46971L4.4904 6.65183C4.6111 5.97296 5.03499 5.37665 5.65373 5.04279L6.4919 4.5906L6.39134 5.47706C6.33763 5.95031 6.50166 6.3716 6.85299 6.66335L6.86284 6.67151L6.89015 6.69852C7.32892 7.0748 7.54063 7.54088 7.53735 8.12285C7.53155 9.15793 6.67721 9.99998 5.63306 9.99998H5.77519C7.70268 9.99998 9.27952 8.44687 9.29028 6.53769C9.2963 5.46187 8.90377 4.6012 8.09056 3.90685Z"
                  fill="#FC504E"
                ></path>
                <path
                  d="M6.95005 8.1194C6.95234 7.70657 6.81394 7.40406 6.50121 7.13849L6.48481 7.12346L6.46764 7.10652C6.03139 6.73932 5.79282 6.21571 5.79427 5.64282C5.33193 5.95235 5.04766 6.47252 5.04255 7.03572L5.03904 7.4236L4.20561 7.18029C4.08644 7.51088 4.02799 7.82536 4.03166 8.11787C4.04058 8.83175 4.63148 9.41257 5.34879 9.41257H5.63299C6.35518 9.4125 6.946 8.83244 6.95005 8.1194Z"
                  fill="#FC504E"
                ></path>
              </svg>
            </div>
            <div className="relative h-3 w-full rounded-full border border-[#F85D8C] bg-[#FFE7F0]">
              <span className="absolute h-full w-[80%] rounded-full bg-gradient-to-l from-[#FF66CB] to-[#FC504E]"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
