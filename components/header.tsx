"use client";

import { ConnectButtonTECHeader } from "@/components/connect-button";
import Image from "next/image";
import Link from "next/link";
import HeaderLogo from "@/public/media/full-logo-white.png";
import HeaderLogoMobile from "@/public/media/logomark-white.png";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    {
      label: "Mission",
      href: "https://tecommons.org/#mission",
    },
    {
      label: "Community",
      href: "https://tecommons.org/workgroups",
    },
    {
      label: "Ecosystem",
      href: "https://tecommons.org/#ecosystem",
    },
    {
      label: "Forum",
      href: "https://forum.tecommons.org/",
    },
    {
      label: "Get Involved",
      href: "https://tecommons.org/join",
    },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-[#181183] to-[#2203ae] text-white sticky top-0 z-10 px-2 py-2 lg:py-5">
      <div className="container flex items-center justify-between px-2 lg:px-4 py-1 lg:py-5">
        {/* Mobile Menu Button - Left side on mobile */}
        <button
          className={`lg:hidden text-white transition-colors duration-200 rounded-md p-1.5 pl-1.5 ${
            isMobileMenuOpen ? "bg-tec-yellow" : ""
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className={`h-8 w-8 ${isMobileMenuOpen ? "text-black" : ""}`} />
        </button>

        {/* Logo - Centered on mobile */}
        <Link
          href="https://tecommons.org"
          className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none lg:left-0 flex items-center justify-center lg:justify-start space-x-2 min-w-[200px] lg:mx-0"
        >
          <Image
            src={HeaderLogoMobile}
            alt="TEC Logo"
            width={80}
            height={80}
            className="lg:hidden object-contain"
            priority
          />
          <Image
            src={HeaderLogo}
            alt="TEC Logo"
            width={250}
            height={250}
            className="hidden lg:block object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-end px-10 gap-6 text-sm font-semibold w-full">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg transition-transform duration-300 hover:text-tec-yellow font-bay font-bold whitespace-nowrap"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Connect Button - Hidden on mobile */}
        <div className="hidden lg:block">
          <ConnectButtonTECHeader />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden px-4 py-2 absolute top-full left-0 right-0 bg-gradient-to-r from-[#181183] to-[#2203ae] border-t border-blue-900/50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-lg font-bay font-bold hover:text-tec-yellow"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
          <div className="py-3">
            <ConnectButtonTECHeader />
          </div>
        </nav>
      )}
    </header>
  );
}
