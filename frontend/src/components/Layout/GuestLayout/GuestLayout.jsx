import Header from "../../Header/Header.jsx";
import Footer from "../../Footer/Footer.jsx";

const GuestLayout = ({ children }) => {
    return (
        <div style={{ maxWidth: "1280px"}}>
            <Header />
            <div className="container">
                <div className="content">{children}</div>
            </div>
            <Footer />
        </div>
    );
};

export default GuestLayout;
