import Header from "../../Header/Header.jsx";
import Footer from "../../Footer/Footer.jsx";
import CartDrawer from "@components/Cart/CartDrawer/CartDrawer.jsx";
import useCartStore from "@components/Cart/ZustandCartStore.js";

const GuestLayout = ({ children }) => {
  const isCartDrawerOpen =
    useCartStore((state) => state.isCartDrawerOpen) || false;

  return (
    <div className="Container">
      <Header />
      <div className="container">
        <div className="content">{children}</div>
      </div>
      <Footer />

      {isCartDrawerOpen && <CartDrawer />}
    </div>
  );
};

export default GuestLayout;
