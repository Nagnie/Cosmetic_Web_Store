import { Drawer } from "antd";
import useCartStore from "./ZustandCartStore";

const CartDrawer = () => {
  const isCartDrawerOpen = useCartStore((state) => state.isCartDrawerOpen);
  const closeCartDrawer = useCartStore((state) => state.closeCartDrawer);

  return (
    <Drawer
      title="Giỏ hàng"
      placement="right"
      open={isCartDrawerOpen}
      closable={true}
      maskClosable={true}
      onClose={() => closeCartDrawer()}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
};
export default CartDrawer;
