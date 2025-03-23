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
import ProductEdit from "@components/Admin/Product/ProductEdit.jsx";
import ProductInfo from "@components/Admin/Product/ProductInfo.jsx";
import ComboProduct from "@pages/ComboProduct/ComboProduct.jsx";

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
    path: "/admin/product/:id",
    component: ProductInfo,
    layout: AdminLayout,
    protected: true,
  },
  {
    path: "/admin/product/:id/update",
    component: ProductEdit,
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
  },
  {
    path: "/combo/:name",
    component: ComboProduct,
    layout: GuestLayout,
  }
];

export { PublicRoutes };
