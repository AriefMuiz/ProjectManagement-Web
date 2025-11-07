import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
      <footer className="bg-primary text-white text-sm">
        {/* Social Media Section */}
        <section className="flex justify-center lg:justify-between p-4 border-b border-white/20">
          {/* Left */}
          <div className="hidden lg:block">
            <span className="opacity-80">{t("getConnected") || "Get connected with us on social networks:"}</span>
          </div>

          {/* Right */}
          <div className="flex space-x-4 text-white">
            <a href="#" className="hover:text-accent transition-colors"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="hover:text-accent transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-accent transition-colors"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="hover:text-accent transition-colors"><i className="fab fa-instagram"></i></a>
          </div>
        </section>

        {/* Links Section */}
        <section className="container mx-auto mt-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Company */}
            <div>
              <h6 className="font-bold text-lg mb-4">UTeM Holdings</h6>
              <p className="opacity-80">
                A subsidiary of Universiti Teknikal Malaysia Melaka, focused on driving innovation, business ventures, and project excellence.
              </p>
            </div>

            {/* Solutions */}
            <div>
              <h6 className="font-bold text-lg mb-4">Our Solutions</h6>
              <p><a href="#!" className="hover:underline">Project Management Portal</a></p>
              <p><a href="#!" className="hover:underline">Consulting & Advisory</a></p>
              <p><a href="#!" className="hover:underline">Technology Development</a></p>
            </div>

            {/* Resources */}
            <div>
              <h6 className="font-bold text-lg mb-4">Resources</h6>
              <p><a href="#!" className="hover:underline">Annual Reports</a></p>
              <p><a href="#!" className="hover:underline">Case Studies</a></p>
              <p><a href="#!" className="hover:underline">Research Publications</a></p>
            </div>

            {/* Contact */}
            <div>
              <h6 className="font-bold text-lg mb-4">{t("contact") || "Contact"}</h6>
              <p><i className="fas fa-home mr-2"></i> Universiti Teknikal Malaysia Melaka</p>
              <p><i className="fas fa-envelope mr-2"></i> info@utemholdings.com</p>
              <p><i className="fas fa-phone mr-2"></i> +606 270 2478</p>
              <p><i className="fas fa-print mr-2"></i> +606 270 2478</p>
            </div>
          </div>
        </section>

        {/* Copyright */}
        <div className="text-center p-4 border-t border-white/20 mt-4 opacity-80">
          © {new Date().getFullYear()} UTeM Holdings. All rights reserved.
        </div>
      </footer>
  );
}
