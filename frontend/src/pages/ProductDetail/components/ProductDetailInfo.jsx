import { Button, Tag } from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import QuantitySelector from "./QuantitySelector";
import { formatCurrency } from "@utils/utils";

const ProductDetailInfo = ({ isShowBottomSheet = false, product = {} }) => {
  const selected = true;

  const classification = product.classification ?? [];

  return (
    <div className="text-left">
      <div className="text-primary-dark text-left text-xl font-bold md:text-2xl">
        {product.pro_name ??
          `[DEAL 26/2 - 10/3 HĐ 229K COLORKEY TẶNG 1 GƯƠNG TRANG ĐIỂM COLORKEY + 1
        BÔNG MÚT COLORKEY] Nước Hoa Colorkey Rose Wild Violet Eau De Parfum`}
      </div>
      <div>
        <Tag
          title="Thương hiệu"
          bordered={false}
          className="!rounded-full"
          color="magenta"
        >
          <a href="!#" className="!text-primary !font-bold">
            {product.bra_name ?? "Colorkey"}
          </a>
        </Tag>
        <Tag
          title="Danh mục"
          bordered={false}
          className="!rounded-full !font-bold"
          color="blue"
        >
          <a href="!#">{product.cat_name ?? "Nước hoa"}</a>
        </Tag>
        <Tag
          title="Tình trạng"
          bordered={false}
          className="!rounded-full !font-bold"
          color="green"
        >
          {product.pro_status ?? "Còn hàng"}
        </Tag>
      </div>
      <div className="!mt-4">
        <Tag
          title="Giá"
          bordered={false}
          className="!text-primary-dark !flex w-full !items-center !rounded-full !p-2 !px-4 !text-xl !font-bold"
          color="red"
        >
          <span className="!text-2xl !font-bold">
            {formatCurrency(product.price || 0) ?? "229.000 đ"}
          </span>
        </Tag>
      </div>
      {/* <div className={`!mt-4 ${isShowBottomSheet ? "hidden" : ""}`}>
        <p>
          <span className="!font-bold">
            Colorkey Rose Wild Violet Eau De Parfum
          </span>{" "}
          là sự kết hợp hoàn hảo của ba tầng hương tinh tế: mở đầu tươi mới với
          tinh dầu bạch tùng hương và hạt tiêu hồng, dịu dàng của hoa violet và
          ấm áp từ gỗ tuyết tùng, gỗ đàn hương, kết thúc quyến rũ với rêu, cây
          bách, hương thảo. Một mùi hương đầy nữ tính, sâu lắng và khó quên.
        </p>
      </div> */}
      {classification.length > 0 && (
        <div className="!mt-4">
          <span className="!font-bold">Phân loại</span>

          <div className="!mt-2 !flex !flex-wrap text-sm">
            {classification.map((item, index) => (
              <Tag
                key={index}
                title={item.name ?? item}
                className={`${
                  selected
                    ? "!-translate-y-[1px] !shadow-[0_4px_10px_rgba(87,74,58,0.2),0_0_2px_rgba(87,74,58,0.3)]"
                    : ""
                } !border-primary-dark !text-primary-dark !flex !h-[35px] !w-fit cursor-pointer !items-center !justify-between bg-white !px-4 !font-bold !transition-all !duration-200`}
              >
                {item.name ?? item}
              </Tag>
            ))}
          </div>
        </div>
      )}
      <div className={`!mt-10 ${isShowBottomSheet ? "" : "hidden md:block"}`}>
        <div className="flex items-center space-x-4">
          <span className="font-bold">SỐ LƯỢNG:</span>
          <QuantitySelector />
        </div>

        <div className="mt-4 flex h-[90px] w-full flex-col gap-2 sm:flex-row sm:gap-4 md:h-auto">
          <Button
            type="default"
            icon={<ShoppingCartOutlined />}
            size="large"
            // onClick={handleAddToCart}
            className="!bg-secondary !border-secondary !text-primary-dark flex flex-1 items-center justify-center"
          >
            Thêm vào giỏ
          </Button>

          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            size="large"
            // onClick={handleBuyNow}
            className="!bg-primary-dark !border-primary-dark flex flex-1 items-center justify-center !text-white"
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

ProductDetailInfo.propTypes = {
  isShowBottomSheet: PropTypes.bool,
  product: PropTypes.object,
};

export default ProductDetailInfo;
