//Pages
import Homepage from "../pages/Home/Home.jsx";
import ByCategory from "../pages/ByCategory/ByCategory.jsx";
import Products from "../pages/Products/Products.jsx";

const PublicRoutes = [
    {
        path: "/",
        component: Homepage,
    },
    {
        path: "/:category_name",
        component: ByCategory,
    },
    {
        path: "/all_products",
        component: Products,
    }
];

export { PublicRoutes };