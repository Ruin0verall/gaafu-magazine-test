import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#4A0000] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />

        {/* Main Content */}
        <div className="relative max-w-[1200px] mx-auto">
          {/* Top Section - Logo & Contact */}
          <div className="flex justify-end">
            <div className="flex flex-row items-center gap-4 max-w-[400px]">
              <div className="flex flex-col justify-center text-left">
                <h2 className="text-[13px] font-medium">Havaasa News</h2>
                <p className="text-[11px] font-light text-white/80">
                  hello@havaasa.com | 9162676 960
                </p>
              </div>
              <img src="/Logo/White.svg" alt="Havaasa Logo" className="h-12" />
            </div>
          </div>

          {/* Bottom Section - All Horizontal */}
          <div className="flex flex-col gap-4 mt-4">
            {/* Social Media Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://wa.me/9609162076"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <img
                  src="/images/social/whatsapp.svg"
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
                  src="/images/social/telegram.svg"
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
                <img
                  src="/images/social/instagram.svg"
                  alt="Instagram"
                  className="h-5 w-5"
                />
              </a>
              <a
                href="https://x.com/havaasanews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <img
                  src="/images/social/twitter.svg"
                  alt="Twitter"
                  className="h-5 w-5"
                />
              </a>
              <a
                href="https://facebook.com/havaasanews"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <img
                  src="/images/social/facebook.svg"
                  alt="Facebook"
                  className="h-5 w-5"
                />
              </a>
            </div>

            {/* Copyright and Legal Links Row */}
            <div className="flex items-center justify-between">
              {/* Copyright */}
              <div className="text-[8.6px] font-light text-white/80">
                Havaasa. All rights reserved 2025 – 2024©
              </div>

              {/* Legal Links */}
              <div className="flex gap-6 text-[9.4px] text-white/80">
                <Link
                  to="/code-of-ethics"
                  className="hover:text-white transition-colors"
                >
                  Code of Ethics
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
