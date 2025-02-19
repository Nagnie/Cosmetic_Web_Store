import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import './App.css'

function App() {
    return (
        <Router>
            <div className="app-container">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
                        <Route path="/analytics" element={<div>Analytics Page</div>} />
                        <Route path="/settings" element={<div>Settings Page</div>} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App