import { AdminLayout, GuestLayout } from "../components/Layout/index.jsx";

//Pages
import Homepage from "../pages/Home/Home.jsx";
import ProductList from "../pages/ProductList/ProductList.jsx";
import ProductDetail from "@pages/ProductDetail/index.js";
import AdminLogin from "../pages/Admin/AdminLogin.jsx";
import Admin from "../pages/Admin/Admin.jsx";
import CartPage from "@pages/Cart/CartPage.jsx";
import CheckoutPage from "@pages/Checkout/CheckoutPage.jsx";
import PaymentSuccess from "@pages/PaymentSuccess/PaymentSuccess.jsx";
import AllBrands from "@pages/AllBrand/AllBrands.jsx";

import ProtectedRoute from "@components/ProtectedRoute.jsx";

const PublicRoutes = [
  {
    path: "/",
    component: Homepage,
    layout: GuestLayout,
  },
  {
    path: "/all_products",
    component: ProductList,
    layout: GuestLayout,
  },
  {
    path: "/products/:name/:id",
    component: ProductDetail,
    layout: GuestLayout,
  },
  {
    path: "/cart",
    component: CartPage,
    layout: GuestLayout,
  },
  {
    path: "/checkout",
    component: CheckoutPage,
    layout: GuestLayout,
  },
  {
    path: "/admin/login",
    component: AdminLogin,
    layout: AdminLayout,
  },
  {
    path: "/admin",
    component: Admin,
    layout: AdminLayout,
    protected: true,
  },
  {
    path: "/payment-confirmation",
    component: PaymentSuccess,
    layout: GuestLayout,
  },
  {
    path: "/brands",
    component: AllBrands,
    layout: GuestLayout,
  }
];

export { PublicRoutes };
