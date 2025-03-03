import Header from "../../Header/Header.jsx";
import Footer from "../../Footer/Footer.jsx";

const GuestLayout = ({ children }) => {
  return (
    <div className="Container">
      <Header />
      <div className="container">
        <div className="content">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default GuestLayout;
