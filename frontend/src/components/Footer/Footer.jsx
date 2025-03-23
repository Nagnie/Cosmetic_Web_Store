import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { FaTiktok, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="w-full"
      style={{ backgroundColor: "#C8B6A6", color: "#312417" }}
    >
      <div className="mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-brown-600 text-lg font-semibold">About Us - NÂU Cosmetic</h2>
            <div className="text-start space-y-2 text-black max-w-200 px-20 lg:px-8 md:px-10 ">
              <span>NÂU COSMETIC tự hào là địa chỉ tin cậy cung cấp mỹ phẩm Hàn Quốc xách tay, cam kết chính hãng 100%, chất lượng cao và giá cả hợp lý.</span>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h2 className="text-brown-600 text-lg font-semibold">
              Contact Us
            </h2>
            <div className="space-y-2 text-black">
              <div className="flex justify-center items-center gap-2">
                <Phone size={18} style={{ color: "#41372d" }} />
                <span>097 311 3685</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Mail size={18} style={{ color: "#41372d" }} />
                <span>naucosmeticbmt@gmail.com</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <MapPin size={18} style={{ color: "#41372d" }} />
                <span className={"text-start"}>
                  부산 서구 서대신동1가 26-4
                </span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-brown-600 text-lg font-semibold">Follow Us</h3>
            <div className="flex justify-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=100094394933462"
                target="_blank"
                className="rounded-full bg-white p-2 transition-colors hover:bg-orange-50"
              >
                <FaFacebookF size={20} style={{ color: "#41372d" }} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100094204077003 "
                target="_blank"
                className="rounded-full bg-white p-2 transition-colors hover:bg-orange-50"
              >
                <FaFacebookF size={20} style={{ color: "#41372d" }} />
              </a>
              <a
                href="https://www.tiktok.com/@naucosmetic?_t=ZS-8ukm3nUap3i&_r=1"
                target="_blank"
                className="rounded-full bg-white p-2 transition-colors hover:bg-orange-50"
              >
                <FaTiktok size={20} style={{ color: "#41372d" }} />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-beige-50 py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-neutral-600">
          <p>© 2025 Nâu Cosmetic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;