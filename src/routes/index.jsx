import { AdminLayout, GuestLayout } from "../components/Layout/index.jsx";

//Pages
import Homepage from "../pages/Home/Home.jsx";
import ProductList from "../pages/ProductList/ProductList.jsx";
import Products from "../pages/Products/Products.jsx";
import AdminLogin from "../pages/Admin/AdminLogin.jsx";

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
        path: "/admin/login",
        component: AdminLogin,
        layout: AdminLayout,
    }
];

export { PublicRoutes };