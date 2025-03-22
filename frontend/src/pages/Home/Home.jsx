import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { useBrands } from "@hooks/useBrandQueries.js";
import { useProducts } from "@hooks/useProductQueries.js";
import { numberToArray } from "@utils/utils.js";
import ProductCardSkeleton from "@components/ProductCard/ProductCardSkeleton.jsx";
import BrandCard from "@components/BrandCard/BrandCard.jsx";
import BrandCardSkeleton from "@components/BrandCard/BrandCardSkeleton.jsx";
import VoucherCurvedSlider from "./components/VoucherCurvedSlider.jsx";
import DiscountCard from "./components/DiscountCard.jsx";
import ComboProductCard from "@components/ComboProductCard/ComboProductCard.jsx";

const VOUCHER = [
  {
    id: 1,
    title: "Giảm giá cố định",
    price: "200.000đ",
    description: "Áp dụng cho đơn hàng từ 1.000.000đ",
    code: "HOLIDAY200K",
    expiry: "30/04/2025",
    ribbonText: "200K",
  },
  {
    id: 2,
    title: "Freeship Extra",
    price: "50.000đ",
    description: "Miễn phí vận chuyển toàn quốc",
    code: "FREESHIP50",
    expiry: "15/04/2025",
    ribbonText: "SHIP",
  },
  {
    id: 3,
    title: "Giảm 30%",
    price: "Tối đa 199.000đ",
    description: "Đơn hàng từ 300.000đ",
    code: "FASHION30",
    expiry: "10/04/2025",
    ribbonText: "30%",
  },
  {
    id: 4,
    title: "Voucher Sinh Nhật",
    price: "300.000đ",
    description: "Quà tặng đặc biệt cho thành viên",
    code: "BIRTHDAY300",
    expiry: "05/04/2025",
    ribbonText: "GIFT",
  },
  {
    id: 5,
    title: "Giảm 15%",
    price: "Tối đa 50.000đ",
    description: "Đơn hàng từ 200.000đ",
    code: "NEW15PCT",
    expiry: "20/04/2025",
    ribbonText: "15%",
  },
  {
    id: 6,
    title: "Giảm 20%",
    price: "Tối đa 500.000đ",
    description: "Cho sản phẩm điện tử, công nghệ",
    code: "TECH20PCT",
    expiry: "25/04/2025",
    ribbonText: "20%",
  },
  {
    id: 7,
    title: "Giảm 50%",
    price: "Tối đa 1.000.000đ",
    description: "Dành cho khách hàng VIP",
    code: "VIP50PCT",
    expiry: "01/05/2025",
    ribbonText: "50%",
  },
  {
    id: 8,
    title: "Giảm 15%",
    price: "Tối đa 100.000đ",
    description: "Cho tất cả đồ gia dụng",
    code: "HOME15PCT",
    expiry: "12/04/2025",
    ribbonText: "15%",
  },
  {
    id: 9,
    title: "Giảm 15%",
    price: "Tối đa 100.000đ",
    description: "Cho tất cả đồ gia dụng",
    code: "HOME15PCT",
    expiry: "12/04/2025",
    ribbonText: "15%",
  },
];

const Homepage = () => {
  const navigate = useNavigate();

  const brandsQuery = useBrands();
  const productsQuery = useProducts({ page: 1, limit: 8 });

  const brands = brandsQuery.data?.data?.data || [];
  const products = productsQuery.data?.data || [];

  // Lấy 5 brands đầu tiên
  const topBrands = brands.slice(0, 5);

  const voucher = VOUCHER.map((item) => {
    return {
      id: item.id,
      metadata: item,
      content: <DiscountCard item={item} />,
    };
  });

  return (
    <div className="font-sans">
      <Header />

      {/* Swiper Section */}
      <section className={"mx-auto mt-50 mb-20 max-w-6xl pt-10"}>
        <div className="my-5 text-center" style={{ color: "#574a3a" }}>
          <h1 className="mb-2 text-5xl font-bold">Welcome to Nâu Cosmetic</h1>
          <p className="text-2xl">Mỹ phẩm, thực phẩm chức năng, sâm Hàn Quốc</p>
        </div>
      </section>

      {/* Brands Section */}
      <section className="mx-auto py-3">
        <div className="mx-10 mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-black">
            Thương hiệu nổi tiếng
          </h2>
          <button
            className="z-100 cursor-pointer text-sm font-medium hover:underline"
            style={{ color: "#91775e" }}
            onClick={() => navigate("/brands")}
          >
            Xem tất cả →
          </button>
        </div>
        <div className="flex cursor-pointer flex-wrap justify-center gap-6">
          {brandsQuery.isLoading ? (
            <>
              {[...Array(5)].map((_, index) => (
                <BrandCardSkeleton key={index} />
              ))}
            </>
          ) : (
            topBrands.map((brand) => <BrandCard key={brand.id} brand={brand} />)
          )}
        </div>
      </section>

      {/*Why choose us section*/}
      <section className="mt-10 py-10">
        <h2 className="mb-8 text-center text-3xl font-bold">Why Choose Us?</h2>

        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div
            className="rounded-2xl px-7 py-10 text-center shadow-xl"
            style={{ backgroundColor: "#F1DEC9" }}
          >
            <h3 className="mb-4 text-xl font-semibold">Chất Lượng Chuẩn Hàn</h3>
            <p className="text-gray-600">
              Chúng tôi tuyển chọn mỹ phẩm xách tay chính hãng từ Hàn Quốc, cam
              kết mang đến sản phẩm an toàn, chất lượng cao cho bạn.
            </p>
          </div>

          <div
            className="rounded-2xl px-7 py-10 text-center shadow-xl"
            style={{ backgroundColor: "#e0cdbc" }}
          >
            <h3 className="mb-4 text-xl font-semibold">
              Khách Hàng Là Thượng Đế
            </h3>
            <p className="text-gray-600">
              Chúng tôi luôn lắng nghe và đồng hành cùng bạn, mang đến trải
              nghiệm mua sắm dễ dàng, dịch vụ tận tâm và hỗ trợ nhanh chóng.
            </p>
          </div>

          <div
            className="rounded-2xl px-7 py-10 text-center shadow-xl"
            style={{ backgroundColor: "#cbb7a4" }}
          >
            <h3 className="mb-4 text-xl font-semibold">
              Vẻ Đẹp Chuẩn Xu Hướng
            </h3>
            <p className="text-gray-600">
              Khám phá những sản phẩm hot hit từ Hàn Quốc, kết hợp xu hướng làm
              đẹp hiện đại với sự tinh tế, giúp bạn luôn rạng rỡ và tự tin.
            </p>
          </div>
        </div>
      </section>
      <div className="reset-all">
        <div className="voucher-container">
          <VoucherCurvedSlider
            items={voucher}
            itemsToShow={5}
            itemsToScroll={3}
          />
        </div>
      </div>

      <section className="mt-10">
        <ComboProductCard />
      </section>

      {/* Best Sellers Section */}
      <div className="px-10 py-10">
        <h2 className="text-center text-3xl font-semibold">Best Sellers</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productsQuery.isLoading &&
            numberToArray(8).map((index) => (
              <ProductCardSkeleton key={index} />
            ))}
          {!productsQuery.isLoading &&
            products.map((product) => (
              <ProductCard key={product.id_pro} product={product} />
            ))}
          {!productsQuery.isLoading && products.length === 0 && (
            <div className="w-full py-10 text-center">
              Không có sản phẩm nào
            </div>
          )}
        </div>
        <button
          className="mx-auto my-10 block rounded-lg px-4 py-2 text-white"
          style={{ backgroundColor: "#675746" }}
          onClick={() => navigate("/all_products")}
        >
          Xem tất cả sản phẩm
        </button>
      </div>
    </div>
  );
};

export default Homepage;
