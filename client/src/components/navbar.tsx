import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  // Simplified version without useAuth
  const user = null; // No user for simplicity

  const handleLogout = () => {
    // No-op for now
  };

  const navLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#testimonials", label: "Testimonials" },
    ...(user ? [{ href: "/chat", label: "My Chat" }] : []),
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <motion.div 
              className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bot className="h-5 w-5 text-white" />
            </motion.div>
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ReportMate AI</span>
          </Link>
          <div className="hidden md:flex md:ml-10 space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 py-2 text-sm font-medium ${
                  location === link.href 
                    ? "text-primary dark:text-primary-400" 
                    : "text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-primary-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="hidden md:inline-flex"
            >
              Log out
            </Button>
          ) : (
            <>
              <Link href="/auth" className="hidden md:inline-block">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/auth?tab=signup" className="hidden md:inline-block">
                <Button className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 transition-all duration-300">
                  Sign up
                </Button>
              </Link>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow-lg">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location === link.href 
                      ? "text-primary dark:text-primary-400 bg-primary/10 dark:bg-primary/20" 
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center px-5">
                    <Link 
                      href="/auth" 
                      className="block w-full px-4 py-2 text-center text-primary hover:text-primary-700 dark:text-primary-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <Link 
                      href="/auth?tab=signup"
                      className="block w-full px-4 py-2 text-center text-white bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 rounded-lg shadow-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center">
                        <span className="text-primary font-medium">U</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-white">User</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Log out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
