import { FaFacebookMessenger } from "react-icons/fa";

const FloatingMessengerButton = () => {
    return (
        <a
            href="https://m.me/112965468523702"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-10 right-10 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg hover:bg-blue-800 transition-colors z-50"
        >
            <FaFacebookMessenger />
        </a>
    );
};

export default FloatingMessengerButton;
