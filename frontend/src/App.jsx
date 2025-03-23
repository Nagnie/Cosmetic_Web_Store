import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./routes/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.css";
import { useInfiniteCartItems } from "@hooks/useCartQueries.js";
import useCartStore from "@components/Cart/ZustandCartStore.js";
import { useEffect } from "react";

function App() {
  const itemCount = useCartStore((state) => state.itemCount);
  const setItemCount = useCartStore((state) => state.setItemCount);
  const clearCart = useCartStore((state) => state.clearCart);

  const { data, status } = useInfiniteCartItems({
    limit: 10,
    enabled: true,
  });

  useEffect(() => {
    if (status === "success" && data) {
      const totalItems = data?.pages[0]?.total_items || 0;

      if (totalItems !== itemCount) {
        setItemCount(totalItems);
      }
    } else if (status === "error") {
      clearCart();
    }
  }, [data, setItemCount, status, clearCart, itemCount]);

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
