import { Drawer, List, Empty } from "antd";
import { CartDrawerCart } from "@components/ProductCard";
import { useInfiniteCartItems } from "@hooks/useCartQueries";
import useCartStore from "../ZustandCartStore";
import { CartDrawerFooter } from "..";
import { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQueryClient } from "@tanstack/react-query";
import CustomSpin from "@components/Spin/CustomSpin";

const CartDrawer = () => {
  const isCartDrawerOpen = useCartStore((state) => state.isCartDrawerOpen);
  const closeCartDrawer = useCartStore((state) => state.closeCartDrawer);
  const setItemCount = useCartStore((state) => state.setItemCount);
  const itemCount = useCartStore((state) => state.itemCount);
  const setTotalPrice = useCartStore((state) => state.setTotalPrice);
  const scrollContainerRef = useRef(null);
  const queryClient = useQueryClient(); // Để invalidate query cache

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
    enabled: isCartDrawerOpen,
  });

  // Always refetch when drawer opens, regardless of whether data exists
  useEffect(() => {
    if (isCartDrawerOpen) {
      // Invalidate cache và refetch khi drawer mở
      queryClient.invalidateQueries({
        queryKey: ["infiniteCartItems", { limit: 10 }],
      });
    }
  }, [isCartDrawerOpen, queryClient]);

  useEffect(() => {
    if (data) {
      const totalItems = data.pages[0].total_items || 0;
      setItemCount(totalItems);
    } else {
      setItemCount(0);
    }
  }, [data, setItemCount]);

  const totalItems = data?.pages[0]?.total_items || 0;
  const totalPrice = data?.pages[0]?.total_prices || 0;
  const allItems = data?.pages.flatMap((page) => page.data || []) || [];

  useEffect(() => {
    if (totalPrice) {
      setTotalPrice(totalPrice);
    } else {
      setTotalPrice(0);
    }
  }, [totalPrice, setTotalPrice]);

  // Thêm hàm để làm mới dữ liệu thủ công nếu cần
  // const handleRefresh = () => {
  //   queryClient.invalidateQueries({
  //     queryKey: ["infiniteCartItems", { limit: 10 }],
  //   });
  // };

  // console.log(">>> all items", allItems);

  // console.log(">>> loading", isLoading, status, error);

  return (
    <Drawer
      classNames={{
        body: "scrollbar-custom !p-0",
        header: "!p-[15px] sm:!p-[20px]",
        footer: "!p-[15px] sm:!p-[20px]",
      }}
      title={
        <div className="flex items-center justify-between">
          <span>{`Giỏ hàng (${totalItems} sản phẩm)`}</span>
          {/* <button
            onClick={handleRefresh}
            className="text-xs text-blue-500 hover:underline"
          >
            Làm mới
          </button> */}
        </div>
      }
      width={480}
      placement="right"
      open={isCartDrawerOpen}
      closable={true}
      maskClosable={true}
      onClose={() => closeCartDrawer()}
      footer={
        <CartDrawerFooter itemCount={itemCount} totalPrice={totalPrice} />
      }
    >
      <div
        id="scrollableCartContainer"
        ref={scrollContainerRef}
        className="p-[15px] sm:p-[20px]"
        style={{
          overflow: "auto",
        }}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <CustomSpin size="large" />
          </div>
        ) : status === "error" ? (
          <div className="flex h-full items-center justify-center">
            <Empty
              description={`Có lỗi xảy ra: ${error.message}`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : allItems.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Empty description="Giỏ hàng trống" />
          </div>
        ) : (
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
              renderItem={(item) => (
                <List.Item key={`${item.id_pro}-${item.id_class}`}>
                  <CartDrawerCart item={item} />
                </List.Item>
              )}
            />
          </InfiniteScroll>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
