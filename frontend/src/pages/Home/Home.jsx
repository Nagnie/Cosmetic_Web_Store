import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { useBrands } from "@hooks/useBrandQueries.js";
import { useProducts } from "@hooks/useProductQueries.js";
import { useAllPosters } from "@hooks/usePosterQueries.js"
import { numberToArray } from "@utils/utils.js";
import BrandCardSkeleton from "@components/BrandCard/BrandCardSkeleton.jsx";
import BrandCard from "@components/BrandCard/BrandCard.jsx";
import VoucherCurvedSlider from "./components/VoucherCurvedSlider.jsx";
import DiscountCard from "./components/DiscountCard.jsx";
import ComboProductCard from "@components/ComboProductCard/ComboProductCard.jsx";
import { useCallback, useMemo } from "react";
import { useInfiniteVouchers } from "@hooks/useVoucherQueries.js";
import { useAllCombo } from "@hooks/useComboQueries.js";
import {AnimatePresence, motion} from "framer-motion";
import { SyncLoader } from "react-spinners"

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductCardSkeleton from "@components/ProductCard/ProductCardSkeleton.jsx";

const Homepage = () => {
  const navigate = useNavigate();

  const brandsQuery = useBrands();
  const productsQuery = useProducts({ page: 1, limit: 8 });
  const comboQuery = useAllCombo();
  const posterQuery = useAllPosters();

  const brands = brandsQuery.data?.data?.data || [];
  const products = productsQuery.data?.data || [];
  const allCombos = comboQuery.data || [];
  const posters = posterQuery.data || [];

  // 3 newest combo
  const newestCombos = useMemo(() => {
    return [...allCombos].sort((a, b) => b.id_combo - a.id_combo).slice(0, 3);
  }, [allCombos]);
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
        title: voucher.unit === "fixed" ? "Giảm giá" : `Giảm ${voucher.value}%`,
        price:
          voucher.unit === "fixed"
            ? new Intl.NumberFormat("vi-VN").format(voucher.value) + "đ"
            : `Tối đa ${new Intl.NumberFormat("vi-VN").format(voucher.max_value)}đ`,
        description: `Áp dụng cho đơn hàng từ ${new Intl.NumberFormat("vi-VN").format(voucher.minimum_order_value)}đ`,
        code: voucher.code,
        expiry: new Date(voucher.end_at).toLocaleDateString("vi-VN"),
        ribbonText:
          voucher.unit === "fixed"
            ? new Intl.NumberFormat("vi-VN").format(voucher.value) + "đ"
            : `${voucher.value}%`,
        minOrderValue: voucher.minimum_order_value,
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
  // const loaderVariants = {
  //   animate: {
  //     scale: [1, 1.2, 1],
  //     opacity: [0.5, 1, 0.5],
  //     transition: {
  //       duration: 1.5,
  //       repeat: Infinity,
  //       repeatType: "loop"
  //     }
  //   }
  // };

  return (
    <div className="font-sans">
      <Header />
      {/* Poster Swiper Section */}
      {posters.isLoading ? (
          <SyncLoader />
      ) : (
          <section
              className="mb-15 mt-40 lg:mt-50"
          >
            <style>
              {`
                      .swiper-pagination-bullet {
                        opacity: 0.5;
                        width: 15px;
                        height: 15px;
                        background-color: #FAF1E6;
                      }
                      .swiper-pagination-bullet-active {
                        opacity: 1;
                        background-color: #FAF1E6;
                      }
                      .swiper-pagination {
                        bottom: 20px !important;
                      }
                    `}
            </style>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                loop={true}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                modules={[Autoplay, Pagination]}
                className="w-full h-[225px] md:h-[450px] lg:h-[550px] rounded-2xl poster-swiper"
            >
              {posters.map((poster) => (
                  <SwiperSlide key={poster.id_post}>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${poster.link})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                    />
                  </SwiperSlide>
              ))}
            </Swiper>
          </section>
      )}

      {/* Brands Section */}
      <section
          className="mx-auto py-3"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
              className="text-2xl md:text-3xl text-left font-semibold text-black"
          >
            Thương hiệu nổi tiếng
          </h2>
          <button
              className="z-5 cursor-pointer text-sm font-medium hover:underline"
              style={{ color: "#91775e" }}
              onClick={() => navigate("/brands")}
          >
            Xem tất cả →
          </button>
        </div>

        {brandsQuery.isLoading ? (
            <div className="flex flex-wrap justify-center gap-6">
              {[...Array(5)].map((_, index) => (
                  <div key={index}>
                    <BrandCardSkeleton />
                  </div>
              ))}
            </div>
        ) : (
            <div className="flex cursor-pointer flex-wrap justify-center gap-6">
              {topBrands.map((brand) => (
                  <div key={brand.id}>
                    <BrandCard brand={brand} />
                  </div>
              ))}
            </div>
        )}

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
          <h2 className="text-center text-primary-dark text-5xl font-semibold">NEW VOUCHERS</h2>
          <div className="voucher-container">
            {vouchersQuery.isError ? (
              <div className="py-4 text-center text-red-500">
                Có lỗi xảy ra khi tải vouchers, vui lòng thử lại sau.
              </div>
            ) : formattedVouchers.length > 0 ? (
              <VoucherCurvedSlider
                items={formattedVouchers}
                itemsToShow={formattedVouchers.length < 6 ? 3 : 5}
                // {formattedVouchers % 2 !== 0 ? 3 : 5}
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

      {/*<motion.section*/}
      {/*    className="my-10"*/}
      {/*    initial="hidden"*/}
      {/*    whileInView="visible"*/}
      {/*    viewport={{ once: true, amount: 0.2 }}*/}
      {/*    variants={{*/}
      {/*      hidden: { opacity: 0, y: 20 },*/}
      {/*      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }*/}
      {/*    }}*/}
      {/*>*/}
      {/*  <motion.h2*/}
      {/*      className="text-5xl text-primary-dark font-bold text-center uppercase mb-10"*/}
      {/*      variants={{*/}
      {/*        hidden: { opacity: 0, y: 20 },*/}
      {/*        visible: { opacity: 1, y: 0 }*/}
      {/*      }}*/}
      {/*  >*/}
      {/*    Combo Mới Nhất*/}
      {/*  </motion.h2>*/}
      {/*  {comboQuery.isLoading ? (*/}
      {/*      <div className="flex h-60 items-center justify-center">*/}
      {/*        <motion.div*/}
      {/*            className="h-10 w-10 rounded-full mx-2"*/}
      {/*            animate={{*/}
      {/*              scale: [1, 1.5, 1],*/}
      {/*              opacity: [0.3, 1, 0.3]*/}
      {/*            }}*/}
      {/*            transition={{*/}
      {/*              duration: 1,*/}
      {/*              repeat: Infinity,*/}
      {/*              delay: 0*/}
      {/*            }}*/}
      {/*            style={{ backgroundColor: "#675746" }}*/}
      {/*        />*/}
      {/*        <motion.div*/}
      {/*            className="h-10 w-10 rounded-full mx-2"*/}
      {/*            animate={{*/}
      {/*              scale: [1, 1.5, 1],*/}
      {/*              opacity: [0.3, 1, 0.3]*/}
      {/*            }}*/}
      {/*            transition={{*/}
      {/*              duration: 1,*/}
      {/*              repeat: Infinity,*/}
      {/*              delay: 0.2*/}
      {/*            }}*/}
      {/*            style={{ backgroundColor: "#7a6854" }}*/}
      {/*        />*/}
      {/*        <motion.div*/}
      {/*            className="h-10 w-10 rounded-full mx-2"*/}
      {/*            animate={{*/}
      {/*              scale: [1, 1.5, 1],*/}
      {/*              opacity: [0.3, 1, 0.3]*/}
      {/*            }}*/}
      {/*            transition={{*/}
      {/*              duration: 1,*/}
      {/*              repeat: Infinity,*/}
      {/*              delay: 0.4*/}
      {/*            }}*/}
      {/*            style={{ backgroundColor: "#8b7a62" }}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*  ) : (*/}
      {/*      <motion.div*/}
      {/*          className="flex flex-wrap justify-center gap-8"*/}
      {/*          variants={{*/}
      {/*            hidden: { opacity: 0 },*/}
      {/*            visible: {*/}
      {/*              opacity: 1,*/}
      {/*              transition: {*/}
      {/*                staggerChildren: 0.1*/}
      {/*              }*/}
      {/*            }*/}
      {/*          }}*/}
      {/*      >*/}
      {/*        <AnimatePresence>*/}
      {/*          {newestCombos.map((combo) => (*/}
      {/*              <motion.div*/}
      {/*                  key={combo.id_combo}*/}
      {/*                  variants={{*/}
      {/*                    hidden: { opacity: 0, scale: 0.9 },*/}
      {/*                    visible: {*/}
      {/*                      opacity: 1,*/}
      {/*                      scale: 1,*/}
      {/*                      transition: {*/}
      {/*                        type: "spring",*/}
      {/*                        stiffness: 100*/}
      {/*                      }*/}
      {/*                    }*/}
      {/*                  }}*/}
      {/*              >*/}
      {/*                <ComboProductCard combo={combo} />*/}
      {/*              </motion.div>*/}
      {/*          ))}*/}
      {/*        </AnimatePresence>*/}
      {/*      </motion.div>*/}
      {/*  )}*/}

      {/*  <motion.button*/}
      {/*      className="mx-auto my-10 block rounded-lg px-4 py-2 text-white"*/}
      {/*      style={{ backgroundColor: "#675746" }}*/}
      {/*      onClick={() => navigate("/all_combos")}*/}
      {/*      whileHover={{ scale: 1.05, backgroundColor: "#7a6854" }}*/}
      {/*      whileTap={{ scale: 0.95 }}*/}
      {/*      variants={{*/}
      {/*        hidden: { opacity: 0, y: 20 },*/}
      {/*        visible: { opacity: 1, y: 0 }*/}
      {/*      }}*/}
      {/*  >*/}
      {/*    Xem tất cả combo*/}
      {/*  </motion.button>*/}
      {/*</motion.section>*/}
      {/* Best Sellers Section */}


      <motion.div
          className="md:px-10 py-10 my-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          transition={{ duration: 0.7 }}
      >
        <motion.h2
            className="text-center text-5xl font-semibold"
            variants={fadeInUp}
        >
          BEST SELLERS
        </motion.h2>

        {productsQuery.isLoading ? (
            <div className="mt-6 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                  <div key={index}>
                    <ProductCardSkeleton />
                  </div>
              ))}
            </div>
        ) : (
            <div
                className="mt-6 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
                {products.map((product, index) => (
                    <div
                        key={product.id_pro}
                    >
                      <ProductCard product={product} />
                    </div>
                ))}

              {products.length === 0 && (
                  <motion.div
                      className="w-full col-span-4 py-10 text-center"
                      variants={fadeInUp}
                  >
                    Không có sản phẩm nào
                  </motion.div>
              )}
            </div>
        )}

        <motion.button
            className="mx-auto my-10 block rounded-lg px-4 py-2 text-white"
            style={{ backgroundColor: "#675746" }}
            onClick={() => navigate("/all_products")}
            whileHover={{ scale: 1.05, backgroundColor: "#7a6854" }}
            whileTap={{ scale: 0.95 }}
            variants={fadeInUp}
        >
          Xem tất cả sản phẩm
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Homepage;
