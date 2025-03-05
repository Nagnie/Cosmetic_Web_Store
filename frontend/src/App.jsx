import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./routes/index.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.css";

function App() {
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
