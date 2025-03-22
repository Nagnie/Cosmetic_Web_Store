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
import { useCallback, useMemo } from "react";
import { useInfiniteVouchers } from "@hooks/useVoucherQueries.js";
import { motion, AnimatePresence } from "framer-motion";

const Homepage = () => {
  const navigate = useNavigate();

  const brandsQuery = useBrands();
  const productsQuery = useProducts({ page: 1, limit: 8 });

  const brands = brandsQuery.data?.data?.data || [];
  const products = productsQuery.data?.data || [];

  // Lấy 5 brands đầu tiên
  const topBrands = brands.slice(0, 5);

  // Sử dụng hook useInfiniteVouchers với cấu hình mặc định
  const vouchersQuery = useInfiniteVouchers({
    limit: 10,
    orderBy: "ASC",
    sortBy: "id",
  });

  // Lấy tất cả vouchers từ tất cả các trang đã tải
  const allVouchers = useMemo(() => {
    if (!vouchersQuery.data) return [];
    // Gộp vouchers từ tất cả các trang thành một mảng duy nhất
    return vouchersQuery.data.pages.flatMap((page) => page.data.data || []);
  }, [vouchersQuery.data]);

  // Hàm tải trang tiếp theo
  const loadMoreVouchers = useCallback(async () => {
    if (vouchersQuery.hasNextPage && !vouchersQuery.isFetchingNextPage) {
      await vouchersQuery.fetchNextPage();
      return true;
    }
    return false;
  }, [vouchersQuery]);

  // Chuyển đổi vouchers thành định dạng cho VoucherCurvedSlider
  const formattedVouchers = useMemo(() => {
    return allVouchers.map((voucher) => {
      // Chuyển đổi thông tin từ API sang định dạng hiển thị
      const formattedVoucher = {
        id: voucher.id,
        title:
          voucher.unit === "fixed"
            ? "Giảm giá cố định"
            : `Giảm ${voucher.value}%`,
        price:
          voucher.unit === "fixed"
            ? new Intl.NumberFormat("vi-VN").format(voucher.value) + "đ"
            : `Tối đa ${new Intl.NumberFormat("vi-VN").format(voucher.max_value)}đ`,
        description: `Áp dụng cho đơn hàng từ ${new Intl.NumberFormat("vi-VN").format(voucher.minimum_order_value)}đ`,
        code: voucher.code,
        expiry: new Date(voucher.end_at).toLocaleDateString("vi-VN"),
        ribbonText:
          voucher.unit === "fixed"
            ? new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(
                voucher.value,
              ) + "đ"
            : `${voucher.value}%`,
      };

      return {
        id: voucher.id,
        metadata: formattedVoucher,
        content: <DiscountCard item={formattedVoucher} />,
      };
    });
  }, [allVouchers]);
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Loader animation
  const loaderVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  return (
    <div className="font-sans">
      <Header />

      {/* Swiper Section */}
      <motion.section
        className={"mx-auto mt-50 mb-20 max-w-6xl pt-10"}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <div className="my-5 text-center" style={{ color: "#574a3a" }}>
          <motion.h1
            className="mb-2 text-5xl font-bold"
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
          >
            Welcome to Nâu Cosmetic
          </motion.h1>
          <motion.p
            className="text-2xl"
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
          >
            Mỹ phẩm, thực phẩm chức năng, sâm Hàn Quốc
          </motion.p>
        </div>
      </motion.section>

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
      <motion.section
        className="mt-10 py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        transition={{ duration: 0.7 }}
      >
        <motion.h2
          className="mb-8 text-center text-3xl font-bold"
          variants={fadeInUp}
        >
          Why Choose Us?
        </motion.h2>

        <motion.div
          className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3"
          variants={staggerContainer}
        >
          <motion.div
            className="rounded-2xl px-7 py-10 text-center shadow-xl"
            style={{ backgroundColor: "#F1DEC9" }}
            variants={scaleIn}
            whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <h3 className="mb-4 text-xl font-semibold">Chất Lượng Chuẩn Hàn</h3>
            <p className="text-gray-600">
              Chúng tôi tuyển chọn mỹ phẩm xách tay chính hãng từ Hàn Quốc, cam
              kết mang đến sản phẩm an toàn, chất lượng cao cho bạn.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl px-7 py-10 text-center shadow-xl"
            style={{ backgroundColor: "#e0cdbc" }}
            variants={scaleIn}
            whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <h3 className="mb-4 text-xl font-semibold">
              Khách Hàng Là Thượng Đế
            </h3>
            <p className="text-gray-600">
              Chúng tôi luôn lắng nghe và đồng hành cùng bạn, mang đến trải
              nghiệm mua sắm dễ dàng, dịch vụ tận tâm và hỗ trợ nhanh chóng.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl px-7 py-10 text-center shadow-xl"
            style={{ backgroundColor: "#cbb7a4" }}
            variants={scaleIn}
            whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <h3 className="mb-4 text-xl font-semibold">
              Vẻ Đẹp Chuẩn Xu Hướng
            </h3>
            <p className="text-gray-600">
              Khám phá những sản phẩm hot hit từ Hàn Quốc, kết hợp xu hướng làm
              đẹp hiện đại với sự tinh tế, giúp bạn luôn rạng rỡ và tự tin.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Vouchers Section */}
      {vouchersQuery.isLoading ? (
        <div className="reset-all">
          <div className="voucher-container">
            <div className="py-4 text-center">Đang tải vouchers...</div>
          </div>
        </div>
      ) : (
        <div className="reset-all">
          <div className="voucher-container">
            {vouchersQuery.isError ? (
              <div className="py-4 text-center text-red-500">
                Có lỗi xảy ra khi tải vouchers, vui lòng thử lại sau.
              </div>
            ) : formattedVouchers.length > 0 ? (
              <VoucherCurvedSlider
                items={formattedVouchers}
                itemsToShow={5}
                itemsToScroll={3}
                onLoadMore={loadMoreVouchers}
                hasMoreItems={vouchersQuery.hasNextPage}
                isLoadingMore={vouchersQuery.isFetchingNextPage}
              />
            ) : (
              <div className="py-4 text-center">
                Không có voucher nào khả dụng.
              </div>
            )}
          </div>
        </div>
      )}

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
