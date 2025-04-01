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
import ComboProductDetail from "@pages/ComboProduct/ComboProductDetail.jsx";
import AllCombos from "@pages/AllCombos/AllCombos.jsx";
import ComboEdit from "@components/Admin/Combo/ComboEdit.jsx";
import ComboInfo from "@components/Admin/Combo/ComboInfo.jsx";
import ComboModal from "@components/Admin/Combo/ComboModal.jsx";
import comboEdit from "@components/Admin/Combo/ComboEdit.jsx";
import PaymentMethods from "@pages/PaymentMethods/PaymentMethods.jsx";

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
    path: "/checkout/payment-methods",
    component: PaymentMethods,
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
    path: "/combo/:name/:id",
    component: ComboProductDetail,
    layout: GuestLayout,
  },
  {
    path: "/all_combos",
    component: AllCombos,
    layout: GuestLayout,
  },
  {
    path: "/admin/combo/create",
    component: ComboModal,
    layout: AdminLayout,
  },
  {
    path: "/admin/combo/edit/:id",
    component: comboEdit,
    layout: AdminLayout,
  },
  {
    path: "/admin/combo/info/:id",
    component: ComboInfo,
    layout: AdminLayout,
  },
];

export { PublicRoutes };
