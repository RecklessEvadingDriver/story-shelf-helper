import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MobileMenu } from "./navbar/MobileMenu";
import { UserMenu } from "./navbar/UserMenu";
import { ThemeToggle } from "./navbar/ThemeToggle";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${
      isScrolled ? 'glass-effect shadow-sm' : 'bg-background dark:bg-background'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <MobileMenu categories={categories} isActiveLink={isActiveLink} />

          <div
            className="flex-shrink-0 cursor-pointer interactive-scale"
            onClick={() => navigate("/")}
          >
            <h1 className="text-2xl font-bold text-primary dark:text-primary/90">BookStore</h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {categories.slice(0, 4).map((category) => (
              <Button
                key={category}
                variant="ghost"
                onClick={() => navigate(`/books?category=${category}`)}
                className={`text-foreground hover:text-primary transition-colors duration-200 dark:text-foreground/90 dark:hover:text-primary truncate max-w-[120px] ${
                  isActiveLink(`/books?category=${category}`) ? 'bg-accent text-accent-foreground' : ''
                }`}
                title={category}
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
                className="w-64 transition-all duration-200 focus:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <ThemeToggle />

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/cart")}
              className={`interactive-scale text-foreground hover:text-primary dark:text-foreground/90 ${
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
                className={`interactive-scale bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary ${
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