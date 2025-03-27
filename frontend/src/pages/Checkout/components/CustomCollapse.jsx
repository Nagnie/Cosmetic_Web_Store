import { useRef, useState } from "react";
import { Empty, List, Button } from "antd";
import { DownOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";

import { useInfiniteCartItems } from "@hooks/useCartQueries";
import { CheckoutCard } from ".";
import CustomSpin from "@components/Spin/CustomSpin";

const CustomCollapse = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [useInfiniteScroll] = useState(false);

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

  const totalItems = data?.pages[0]?.total_items || 0;
  const allItems = data?.pages.flatMap((page) => page.data || []) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div>
      {/* Collapse Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="text-secondary-deep flex cursor-pointer items-center rounded-lg border border-gray-200 p-2 select-none"
      >
        <div className="flex items-center">
          <ShoppingCartOutlined />

          <div className="ml-2 flex flex-wrap items-center gap-1 text-sm font-semibold">
            <span>{isOpen ? "Ẩn" : "Hiện"} thông tin giỏ hàng</span>
            <span>({totalItems} sản phẩm)</span>
          </div>
        </div>
        <div>
          {
            <DownOutlined
              className={`transform ${isOpen ? "rotate-180" : ""} transition-transform duration-500 ease-in-out`}
            />
          }
        </div>
      </div>

      {/* Collapse Body */}
      <div className={`${isOpen ? "block" : "hidden"} mt-4 space-y-2`}>
        <div
          id="scrollableCartContainer"
          ref={scrollContainerRef}
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
          ) : useInfiniteScroll ? (
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
                    <CheckoutCard item={item} />
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          ) : (
            <>
              <List
                dataSource={allItems}
                renderItem={(item) => (
                  <List.Item key={`${item.id_pro}-${item.id_class}`}>
                    <CheckoutCard item={item} />
                  </List.Item>
                )}
              />

              {hasNextPage && (
                <div className="mt-4 text-center">
                  <Button
                    type="primary"
                    className="!bg-primary !hover:bg-primary-dark !text-neutral-light rounded-lg px-4 py-2 transition-colors duration-300"
                    onClick={handleLoadMore}
                    loading={isFetchingNextPage}
                    disabled={!hasNextPage}
                  >
                    Tải thêm
                  </Button>
                </div>
              )}

              {!hasNextPage && allItems.length > 0 && (
                <div className="py-4 text-center text-gray-500">
                  Đã hiển thị tất cả sản phẩm trong giỏ hàng
                </div>
              )}
            </>
          )}
        </div>

        {/* horizontal separate */}
        <div className="my-4 border-t border-gray-200"></div>
      </div>
    </div>
  );
};
export default CustomCollapse;
