import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MobileMenu } from "./navbar/MobileMenu";
import { UserMenu } from "./navbar/UserMenu";
import { ThemeToggle } from "./navbar/ThemeToggle";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "Business",
    "Arts",
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 dark:bg-background/95 border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <MobileMenu categories={categories} isActiveLink={isActiveLink} />

          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <h1 className="text-2xl font-bold text-primary dark:text-primary/90">BookStore</h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {categories.slice(0, 4).map((category) => (
              <Button
                key={category}
                variant="ghost"
                onClick={() => navigate(`/books?category=${category}`)}
                className={`text-foreground hover:text-primary dark:text-foreground/90 dark:hover:text-primary ${
                  isActiveLink(`/books?category=${category}`) ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex">
              <Input
                type="search"
                placeholder="Search books..."
                className="w-64 bg-background dark:bg-background/95"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <ThemeToggle />

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/cart")}
              className={`text-foreground hover:text-primary dark:text-foreground/90 ${
                isActiveLink('/cart') ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
            </Button>

            {user ? (
              <UserMenu isActiveLink={isActiveLink} />
            ) : (
              <Button 
                onClick={() => navigate("/auth")}
                className={`bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary ${
                  isActiveLink('/auth') ? 'bg-primary/80' : ''
                }`}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};