import { useEffect, useRef, useMemo } from "react";
import { Breadcrumb, Empty, List, Spin } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";

import { CartCard, CartPriceInfo } from "./components";
import { useInfiniteCartItems } from "@hooks/useCartQueries";
import { useCartStore } from "@components/Cart";
import {
  getAvailableClassifications,
  getUnavailableClassifications,
} from "@utils/utils";

const CartPage = () => {
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
          <Spin size="large" />
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
            {isFetchingNextPage && <Spin />}
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
        <div className="w-full rounded-md bg-white p-4 px-6 shadow-md lg:w-2/5">
          <CartPriceInfo totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
