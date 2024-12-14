import { ShoppingCart, Search, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "Business",
    "Arts",
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 mt-8">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="justify-start"
                    onClick={() => navigate(`/books?category=${category}`)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <h1 className="text-2xl font-bold text-primary">BookStore</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.slice(0, 4).map((category) => (
              <Button
                key={category}
                variant="ghost"
                onClick={() => navigate(`/books?category=${category}`)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Search, Cart, Theme, and Auth */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex">
              <Input
                type="search"
                placeholder="Search books..."
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
              <ShoppingCart className="h-6 w-6" />
            </Button>

            {user ? (
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};