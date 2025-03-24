
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const { isAuthenticated, signOut, user, profile } = useAuth();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-2xl font-bold">
          Your Brand
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/services" className="text-sm font-medium hover:text-primary">
            Services
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">
            Contact
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/rewards" className="text-sm font-medium hover:text-primary">
                Rewards
              </Link>
              <Link to="/receipts" className="text-sm font-medium hover:text-primary">
                My Receipts
              </Link>
            </>
          )}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    {isMounted && profile?.avatar_url ? (
                      <AvatarImage src={profile?.avatar_url} alt={profile?.first_name || "Avatar"} />
                    ) : (
                      <AvatarFallback>{profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </div>
          )}
        </nav>
        
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate through the app.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link to="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link to="/services" className="text-sm font-medium hover:text-primary">
                Services
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="text-sm font-medium hover:text-primary">
                Contact
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/rewards" className="text-sm font-medium hover:text-primary">
                    Rewards
                  </Link>
                  <Link to="/receipts" className="text-sm font-medium hover:text-primary">
                    My Receipts
                  </Link>
                </>
              )}
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                    Log In
                  </Button>
                  <Button size="sm" onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button variant="outline" size="sm" onClick={() => navigate("/profile")}>
                    Profile
                  </Button>
                  <Button size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
