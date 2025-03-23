import React, { useState } from 'react';
import {Eye, EyeOff, LogIn, Save} from 'lucide-react';
import "./Admin.css"
import { useNavigate } from 'react-router-dom';
import loginApi from '@apis/loginApi.js'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setActionLoading(true);
            const data = await loginApi.login({ email, password }); // Gọi API login

            console.log("data", data);

            if (data) { // Kiểm tra response
                localStorage.setItem("isAdmin", "true");
                navigate("/admin"); // Chuyển hướng đến trang Admin
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center" style={{ background: 'linear-gradient(105deg, #f8a7bd, #ffe9ef)'}}>
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden mx-auto">
                {/* Header */}
                <div className="w-full py-6 px-6 text-center" style={{ background: '#D14D72' }}>
                    <h2 className="text-xl font-bold text-white">Welcome Back</h2>
                    <p className="text-white">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pt-10 pb-15 w-full ">
                    <div className="space-y-4 w-full px-3">
                        {/* Email Field */}
                        <div className="w-full mb-5">
                            <label htmlFor="email" className="block text-start mb-2">
                                Email Address
                            </label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">✉️</span>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 block w-full rounded-md border border-gray-300 py-3 focus:outline-none"
                                    style={{
                                        focusRing: '2px solid #D14D72',
                                        focusBorderColor: '#D14D72'
                                    }}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="w-full mb-5">
                            <label htmlFor="password" className="block text-start mb-2">
                                Password
                            </label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">🔒</span>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 block w-full rounded-md border border-gray-300 py-3 focus:outline-none"
                                    style={{
                                        focusRing: '2px solid #D14D72',
                                        focusBorderColor: '#D14D72'
                                    }}
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {error && <div className="error-message text-red-800 ">{error}</div>}
                        {/* Submit Button */}
                        <div className="w-full">
                            <button
                                type="submit"
                                className="group flex items-center w-full justify-center py-3 px-4 mb-4 border border-transparent font-medium rounded-md text-white"
                                style={{
                                    backgroundColor: '#D14D72',
                                    transition: 'background-color 0.2s ease',
                                    ':hover': { backgroundColor: '#911f3f' }
                                }}
                            >
                                {actionLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="inline mr-2" size={16} />
                                        Sign in
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;