import Header from "../../Header/Header.jsx";
import Footer from "../../Footer/Footer.jsx";
import CartDrawer from "@components/Cart/CartDrawer.jsx";

const GuestLayout = ({ children }) => {
  return (
    <div className="Container">
      <Header />
      <div className="container">
        <div className="content">{children}</div>
      </div>
      <Footer />

      <CartDrawer />
    </div>
  );
};

export default GuestLayout;
