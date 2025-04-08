
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-cdo-gold" />
              CDO<span className="text-cdo-gold">Guide</span>
            </h3>
            <p className="mb-4 text-sm">
              Your comprehensive guide to exploring the beautiful city of Cagayan de Oro. Discover the best attractions and activities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-cdo-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-cdo-gold transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-cdo-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-cdo-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/attractions-activities" className="hover:text-cdo-gold transition-colors">Attractions & Activities</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cdo-gold transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-cdo-gold" />
                <span>Cagayan de Oro City, 9000 Misamis Oriental, Philippines</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-cdo-gold" />
                <span>+63 (88) 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-cdo-gold" />
                <span>info@cdoguide.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CDOGuide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
