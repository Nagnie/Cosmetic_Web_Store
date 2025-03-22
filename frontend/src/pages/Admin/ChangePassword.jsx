import React, { useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import loginApi from '@apis/loginApi.js';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate passwords
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới không khớp!");
            return;
        }

        try {
            setActionLoading(true);

            console.log("Email: " + email, "NewPassword: " + newPassword);

            const response = await loginApi.changePassword({
                email,
                newPassword
            });

            if (response) {
                setSuccess("Đổi mật khẩu thành công!");
                // Reset form
                setEmail('');
                setNewPassword('');
                setConfirmPassword('');

                // Close modal after 2 seconds
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            setError("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin!");
        } finally {
            setActionLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="w-full py-4 px-6 text-center" style={{ background: '#D14D72' }}>
                    <h2 className="text-xl font-bold text-white">Đổi Mật Khẩu</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pt-6 pb-6 w-full">
                    <div className="space-y-4 w-full">
                        {/* Email */}
                        <div className="w-full mb-4">
                            <label htmlFor="email" className="block text-sm text-start mb-2">
                                Email
                            </label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">✉️</span>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 block w-full rounded-md border border-gray-300 py-3 focus:outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="w-full mb-4">
                            <label htmlFor="newPassword" className="block text-sm text-start mb-2">
                                Mật khẩu mới
                            </label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">🔒</span>
                                </div>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10 block w-full rounded-md border border-gray-300 py-3 focus:outline-none"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="w-full mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm text-start mb-2">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">🔒</span>
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 block w-full rounded-md border border-gray-300 py-3 focus:outline-none"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && <div className="error-message text-red-800">{error}</div>}
                        {success && <div className="success-message text-green-800">{success}</div>}

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                                style={{ backgroundColor: '#D14D72' }}
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
                                        Save
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

export default ChangePasswordModal;