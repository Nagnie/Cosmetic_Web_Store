import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="w-full"
      style={{ backgroundColor: "#ffb3c1", color: "#8a1b3a" }}
    >
      <div className="mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-brown-600 text-lg font-semibold">Contact Us</h2>
            <div className="ms-25 justify-center space-y-2 text-gray-800 md:ms-10">
              <div className="flex items-center gap-2">
                <Phone size={18} style={{ color: "#d7426c" }} />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} style={{ color: "#d7426c" }} />
                <span>contact@beautystore.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} style={{ color: "#d7426c" }} />
                <span className={"text-start"}>
                  123 Beauty Lane, Fashion City, FC 12345
                </span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h2 className="text-brown-600 text-lg font-semibold">
              Opening Hours
            </h2>
            <div className="space-y-2 text-gray-800">
              <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p>Saturday: 10:00 AM - 6:00 PM</p>
              <p>Sunday: 11:00 AM - 5:00 PM</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-brown-600 text-lg font-semibold">Follow Us</h3>
            <div className="flex justify-center gap-4">
              <a
                href="https://web.facebook.com/profile.php?id=100094204077003"
                target="_blank"
                className="rounded-full bg-white p-2 transition-colors hover:bg-red-50"
              >
                <Facebook size={20} style={{ color: "#d7426c" }} />
              </a>
              <a
                href="#"
                target="_blank"
                className="rounded-full bg-white p-2 transition-colors hover:bg-red-50"
              >
                <Instagram size={20} style={{ color: "#d7426c" }} />
              </a>
              <a
                href="#"
                target="_blank"
                className="rounded-full bg-white p-2 transition-colors hover:bg-red-50"
              >
                <Twitter size={20} style={{ color: "#d7426c" }} />
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