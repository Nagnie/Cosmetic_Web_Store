import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./routes/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.css";
import { useInfiniteCartItems } from "@hooks/useCartQueries.js";
import useCartStore from "@components/Cart/ZustandCartStore.js";
import { useEffect } from "react";
import FloatingMessengerButton from "@components/FloatingMessengerButton.jsx";

function App() {
  const itemCount = useCartStore((state) => state.itemCount);
  const setItemCount = useCartStore((state) => state.setItemCount);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const setTotalPrice = useCartStore((state) => state.setTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const shippingFee = useCartStore((state) => state.shippingFee);
  const setShippingFee = useCartStore((state) => state.setShippingFee);

  const { data, status } = useInfiniteCartItems({
    limit: 10,
    enabled: true,
  });

  useEffect(() => {
    if (status === "success" && data) {
      const totalItems = data?.pages[0]?.total_items || 0;
      const totalPrices = data?.pages[0]?.total_prices || 0;
      const shippingFees = data?.pages[0]?.ship_price || 0;

      if (totalItems !== itemCount) {
        setItemCount(totalItems);
      }

      if (totalPrices !== totalPrice) {
        setTotalPrice(totalPrices);
      }

      if (shippingFees !== shippingFee) {
        setShippingFee(shippingFees);
      }
    } else if (status === "error") {
      clearCart();
    }
  }, [
    data,
    setItemCount,
    status,
    clearCart,
    itemCount,
    totalPrice,
    setTotalPrice,
    shippingFee,
    setShippingFee,
  ]);

  useEffect(() => {
    window.addEventListener("beforeunload", clearCart);

    return () => {
      window.removeEventListener("beforeunload", clearCart);
    };
  }, [clearCart]);

  return (
    <Router>
      <div className="app-container">
        <div className="content">
          <FloatingMessengerButton />
          <Routes>
            {PublicRoutes.map((route, index) => {
              const Layout = route.layout || ((props) => <>{props.children}</>);
              const Page = route.component;

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    route.protected ? (
                      <ProtectedRoute>
                        <Layout>
                          <Page />
                        </Layout>
                      </ProtectedRoute>
                    ) : (
                      <Layout>
                        <Page />
                      </Layout>
                    )
                  }
                />
              );
            })}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
