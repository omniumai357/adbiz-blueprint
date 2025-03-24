
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out backdrop-blur-md",
        isScrolled
          ? "py-3 bg-white/80 shadow-sm"
          : "py-6 bg-transparent"
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center text-xl font-bold transition-opacity hover:opacity-80"
        >
          <span className="text-primary">ad</span>
          <span>biz</span>
          <span className="text-primary">.pro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                location.pathname === item.path
                  ? "text-primary after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full"
                  : "text-foreground/80"
              )}
            >
              {item.label}
            </Link>
          ))}
          
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                location.pathname === "/admin"
                  ? "text-primary after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:rounded-full"
                  : "text-foreground/80"
              )}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* CTA Button & User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                asChild 
                variant="ghost" 
                size="sm"
              >
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="button-transition hover:shadow-md hover:scale-105"
              >
                <Link to="/services">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/80 backdrop-blur-md shadow-lg animate-fade-in">
          <div className="container px-4 py-6 mx-auto flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "py-2 text-base font-medium transition-colors hover:text-primary",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/80"
                )}
              >
                {item.label}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "py-2 text-base font-medium transition-colors hover:text-primary",
                  location.pathname === "/admin"
                    ? "text-primary"
                    : "text-foreground/80"
                )}
              >
                Admin
              </Link>
            )}
            
            {user ? (
              <>
                <div className="border-t border-border my-2 pt-2"></div>
                <Link
                  to="/profile"
                  className="py-2 text-base font-medium transition-colors hover:text-primary"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="py-2 text-base font-medium transition-colors hover:text-primary"
                >
                  My Orders
                </Link>
                <Button 
                  variant="destructive"
                  onClick={signOut}
                  className="mt-2 w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                >
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full"
                >
                  <Link to="/services">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
