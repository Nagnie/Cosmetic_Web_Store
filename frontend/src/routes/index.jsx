import { AdminLayout, GuestLayout } from "../components/Layout/index.jsx";

//Pages
import Homepage from "../pages/Home/Home.jsx";
import ProductList from "../pages/ProductList/ProductList.jsx";
import Products from "../pages/Products/Products.jsx";
import ProductDetail from "@pages/ProductDetail/index.js";
import AdminLogin from "../pages/Admin/AdminLogin.jsx";
import Admin from "../pages/Admin/Admin.jsx";

const PublicRoutes = [
  {
    path: "/",
    component: Homepage,
    layout: GuestLayout,
  },
  {
    path: "/:category",
    component: ProductList,
    layout: GuestLayout,
  },
  {
    path: "/all_products",
    component: Products,
    layout: GuestLayout,
  },
  {
    path: "/products/:id",
    component: ProductDetail,
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
  },
];

export { PublicRoutes };