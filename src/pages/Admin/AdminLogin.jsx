import React, { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import "./Admin.css"
const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt with:', { email, password });
    };

    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden mx-auto">
                {/* Header */}
                <div className="w-full py-6 px-6 text-center" style={{ background: '#D14D72' }}>
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-white text-sm">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pt-10 pb-15 w-full ">
                    <div className="space-y-4 w-full px-3">
                        {/* Email Field */}
                        <div className="w-full mb-5">
                            <label htmlFor="email" className="block text-sm text-start mb-2">
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
                            <label htmlFor="password" className="block text-sm text-start mb-2">
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

                        {/* Forgot Password Link */}
                        {/*<div className="flex items-center justify-end">*/}
                        {/*    <a*/}
                        {/*        href="#"*/}
                        {/*        className="text-sm font-medium hover:underline"*/}
                        {/*        style={{ color: '#D14D72' }}*/}
                        {/*    >*/}
                        {/*        Forgot your password?*/}
                        {/*    </a>*/}
                        {/*</div>*/}

                        {/* Submit Button */}
                        <div className="w-full">
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white"
                                style={{
                                    backgroundColor: '#D14D72',
                                    transition: 'background-color 0.2s ease',
                                    ':hover': { backgroundColor: '#911f3f' }
                                }}
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                  <LogIn size={18} style={{ color: '#ffbccc' }} />
                                </span>
                                Sign in
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;