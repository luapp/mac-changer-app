/*
 * Copyright (c) 2025 Paul Le Gall. All Rights Reserved.
 * Licensed See LICENSE file in the project root for details.
 */

import { useState } from "react";
import { Settings, Info, Mail, Home, Menu, X } from "lucide-react";
import { H2 } from "@ui/core/Text";
import { Button } from "@ui/core/Button";

const navItems = [
  { icon: Home, href: "/", label: "Home" },
  { icon: Settings, href: "/settings", label: "Settings" },
  { icon: Mail, href: "/contact", label: "Contact" },
  { icon: Info, href: "/about", label: "About" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative bg-gray-800 fixed top-0 h-15 w-full z-50 border-b border-gray-700 p-4 pt-1 pb-1 shadow-md flex justify-between items-center">
      <a href="/" className="text-white text-2xl font-bold">
        <H2 className="text-white m-0">MAC Changer</H2>
      </a>

      <div className="relative">
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 text-white bg-transparent"
          variant="primary"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>

        {isMenuOpen && (
          <>
            <div
              className="fixed top-19 left-0 right-0 bottom-0 z-40 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            <div className="absolute right-0 mt-7 w-48 bg-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50">
              {navItems.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
