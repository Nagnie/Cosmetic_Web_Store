import { Drawer, List } from "antd";
import useCartStore from "../ZustandCartStore";
import { CartDrawerCart } from "@components/ProductCard";
import { CartDrawerFooter } from "..";

const CartDrawer = () => {
  const isCartDrawerOpen = useCartStore((state) => state.isCartDrawerOpen);
  const closeCartDrawer = useCartStore((state) => state.closeCartDrawer);

  return (
    <Drawer
      classNames={{
        body: "scrollbar-custom !p-[15px] sm:!p-[20px]",
        header: "!p-[15px] sm:!p-[20px]",
        footer: "!p-[15px] sm:!p-[20px]",
      }}
      title="Giỏ hàng"
      width={480}
      placement="right"
      open={isCartDrawerOpen}
      closable={true}
      maskClosable={true}
      onClose={() => closeCartDrawer()}
      footer={<CartDrawerFooter />}
    >
      <List
        dataSource={[4, 3, 5, 5, 4, 1]}
        renderItem={() => (
          <List.Item>
            <CartDrawerCart />
          </List.Item>
        )}
      />
    </Drawer>
  );
};
export default CartDrawer;
