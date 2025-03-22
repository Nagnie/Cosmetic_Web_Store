import { useEffect, useRef, useMemo, useState } from "react";
import { Breadcrumb, Empty, List, Space } from "antd";
import { HomeOutlined, GiftOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";

import { CartCard, CartPriceInfo, DiscountSelector } from "./components";
import { useInfiniteCartItems } from "@hooks/useCartQueries";
import { useCartStore } from "@components/Cart";
import {
  getAvailableClassifications,
  getUnavailableClassifications,
} from "@utils/utils";
import CustomSpin from "@components/Spin/CustomSpin";
import { useModalStore } from "@components/Modal";
import { CouponModalContent } from "@components/Modal/Content";

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

const CartPage = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");

  const showModal = useModalStore((state) => state.showModal);
  const hideModal = useModalStore((state) => state.hideModal);
  const setItemCount = useCartStore((state) => state.setItemCount);
  const setTotalPrice = useCartStore((state) => state.setTotalPrice);

  const scrollContainerRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    error,
  } = useInfiniteCartItems({
    limit: 10,
  });

  // Tính toán các giá trị dẫn xuất từ data
  const { totalItems, totalPrice, allItems } = useMemo(() => {
    const totalItems = data?.pages[0]?.total_items || 0;
    const totalPrice = data?.pages[0]?.total_prices || 0;
    const allItems = data?.pages.flatMap((page) => page.data || []) || [];

    return { totalItems, totalPrice, allItems };
  }, [data]);

  // Tính toán các phân loại có sẵn
  const availableClasses = useMemo(() => {
    const unavailableClasses = getUnavailableClassifications(allItems);

    return allItems.map((item) => ({
      id_pro: item.id_pro,
      id_class: item.id_class,
      quantity: item.quantity,
      availableClassifications: getAvailableClassifications(
        item,
        unavailableClasses,
      ),
    }));
  }, [allItems]);

  // Cập nhật số lượng item trong store
  useEffect(() => {
    setItemCount(totalItems);
  }, [totalItems, setItemCount]);

  // Cập nhật tổng giá trong store
  useEffect(() => {
    setTotalPrice(totalPrice);
  }, [totalPrice, setTotalPrice]);

  const routes = useMemo(
    () => [
      {
        title: (
          <>
            <HomeOutlined className="mr-1 text-base" />
            <span>Trang chủ</span>
          </>
        ),
        href: "/",
      },
      {
        title: `Giỏ hàng (${totalItems})`,
        href: "/cart",
      },
    ],
    [totalItems],
  );

  // Render các trạng thái khác nhau
  const renderCartContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <CustomSpin size="large" />
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="flex h-full items-center justify-center">
          <Empty
            description={`Có lỗi xảy ra: ${error.message}`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      );
    }

    if (allItems.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <Empty description="Giỏ hàng trống" />
        </div>
      );
    }

    return (
      <InfiniteScroll
        dataLength={allItems.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <div className="py-4 text-center">
            {isFetchingNextPage && <CustomSpin />}
          </div>
        }
        scrollThreshold={0.8}
        endMessage={
          <div className="py-4 text-center text-gray-500">
            Đã hiển thị tất cả sản phẩm trong giỏ hàng
          </div>
        }
        scrollableTarget="scrollableCartContainer"
      >
        <List
          dataSource={allItems}
          renderItem={(item, index) => (
            <List.Item key={`${item.id_pro}-${item.id_class}`}>
              <CartCard
                availableClassifications={
                  availableClasses[index].availableClassifications
                }
                item={item}
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    );
  };

  // Hàm xử lý khi voucher được chọn từ modal
  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);

    // Nếu voucher được chọn, cập nhật voucherCode
    if (voucher) {
      setVoucherCode(voucher.code);
    } else {
      setVoucherCode("");
    }
  };

  // Hàm xử lý khi mã voucher được nhập thủ công
  const handleVoucherApply = (code) => {
    setVoucherCode(code);

    // Tìm voucher tương ứng với code để cập nhật selectedVoucher
    if (code) {
      // Import VOUCHER từ CouponModalContent hoặc từ service
      const voucher = VOUCHER.find(
        (v) => v.code.toLowerCase() === code.toLowerCase(),
      );
      setSelectedVoucher(voucher || null);
    } else {
      setSelectedVoucher(null);
    }
  };

  // Hiển thị modal với CouponModalContent
  const handleShowCouponModal = () => {
    showModal(
      <CouponModalContent
        onApplyCoupon={handleVoucherSelect}
        selectedVoucher={selectedVoucher}
        onCancel={hideModal}
      />,
      {
        title: (
          <Space>
            <GiftOutlined />
            <span>Chọn mã giảm giá</span>
          </Space>
        ),
        styles: {
          header: {
            backgroundColor: "",
            borderBottom: "",
          },
          body: {
            padding: 0,
            backgroundColor: "",
          },
          mask: {
            backgroundColor: "rgba(145, 119, 94, 0.2)",
          },
          content: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        },
      },
    );
  };

  return (
    <div className="mx-auto mt-35 mb-4 pt-10 lg:px-4">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Breadcrumb separator=">" items={routes} />
      </div>

      <div className="flex flex-col gap-4 text-left lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full rounded-md bg-white p-4 px-2 shadow-md sm:px-4 lg:w-4/5 lg:px-6">
          <div className="border-b-5 border-gray-300 pb-4">
            <div className="flex items-center justify-between">
              <h1 className="!text-xl font-bold">Giỏ hàng:</h1>
              <span className="!text-sm text-gray-500 underline underline-offset-5">
                {totalItems} sản phẩm
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div
              id="scrollableCartContainer"
              ref={scrollContainerRef}
              className="p-[15px] sm:p-[20px]"
              style={{
                overflow: "auto",
              }}
            >
              {renderCartContent()}
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:w-2/5">
          <div className="w-full rounded-md bg-white p-4 px-6 shadow-md">
            <CartPriceInfo totalPrice={totalPrice} />
          </div>
          <div className="w-full rounded-md bg-white p-4 px-6 shadow-md">
            <DiscountSelector
              voucherCode={voucherCode}
              onApplyVoucher={handleVoucherApply}
              onShowCouponModal={handleShowCouponModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
