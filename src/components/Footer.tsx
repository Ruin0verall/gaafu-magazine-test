import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { categoryLabels } from "@/lib/types";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gaafu-accent text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src="/Logo/White.svg" alt="Gaafu Logo" className="h-8" />
            </Link>
            <p className="text-white/80">
              ގާފު އަކީ ދިވެހި ބަހުން ހިންގާ ހަބަރާއި މަޢުލޫމާތު ފޯރުކޮށްދޭ
              ފަރާތެކެވެ. އަޅުގަނޑުމެން އަބަދުވެސް މަސައްކަތް ކުރަނީ ރަނގަޅު
              ފެންވަރުގެ ލިޔުންތައް ފޯރުކޮށްދިނުމަށެވެ.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-medium mb-4 border-b border-white/20 pb-2">
              ކެޓަގަރީތައް
            </h3>
            <ul className="space-y-2">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <li key={key}>
                  <Link
                    to={`/category/${key}`}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4 border-b border-white/20 pb-2">
              މުހިންމު ލިންކުތައް
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ގާފުއާއި ބެހޭ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ޕްރައިވަސީ ޕޮލިސީ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ޓާމްސް އޮފް ސަރވިސް
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ގުޅުއްވާ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-medium mb-4 border-b border-white/20 pb-2">
              ގުޅުއްވާ
            </h3>
            <div className="space-y-4">
              <p className="text-white/80">info@gaafu.mv</p>
              <p className="text-white/80">+(960) 7755123</p>
              <div className="flex space-x-4 space-x-reverse">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="mailto:info@gaafu.mv"
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-4 border-t border-white/20 text-center text-white/60">
          <p>© {currentYear} gaafu.mv - ހުރިހާ ޙައްޤެއް ރައްކާތެރިކުރެވިފައި</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
