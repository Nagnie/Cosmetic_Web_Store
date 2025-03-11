import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    return isAdmin ? children : <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;
