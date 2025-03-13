import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#4A0000] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="flex justify-between items-start">
          {/* Left Section */}
          <div className="flex flex-col gap-6">
            {/* Logo & Contact */}
            <div className="flex flex-col gap-2">
              <Link to="/" className="inline-block">
                <img
                  src="/Logo/White.svg"
                  alt="Havaasa Logo"
                  className="h-12"
                />
              </Link>
              <div className="flex flex-col text-white/80">
                <h2 className="text-white text-lg">Havaasa News</h2>
                <p className="text-sm">+960 9162676 | hello@havaasa.com</p>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex gap-6 text-sm text-white/80">
              <Link
                to="/code-of-ethics"
                className="hover:text-white transition-colors"
              >
                Code of Ethics
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms and Conditions
              </Link>
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/cookie-policy"
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end gap-6">
            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/9609162076"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <img
                  src="/icons/whatsapp.svg"
                  alt="WhatsApp"
                  className="h-5 w-5"
                />
              </a>
              <a
                href="https://t.me/havaasanews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <img
                  src="/icons/telegram.svg"
                  alt="Telegram"
                  className="h-5 w-5"
                />
              </a>
              <a
                href="https://instagram.com/havaasanews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com/havaasanews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://facebook.com/havaasanews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-white/80">
              ©2024 - 2025 NEWSLAB MEDIA Private Limited. All rights reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
