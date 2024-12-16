import { ShoppingCart, Search, Menu, Sun, Moon, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark");
    
    if (user) {
      try {
        await supabase
          .from('profiles')
          .upsert({ id: user.id, dark_mode: newMode });
      } catch (error) {
        toast({
          title: "Error saving preference",
          description: "Your dark mode preference couldn't be saved.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    const loadDarkModePreference = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('dark_mode')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setIsDarkMode(data.dark_mode);
          if (data.dark_mode) {
            document.documentElement.classList.add("dark");
          }
        }
      }
    };

    loadDarkModePreference();
  }, [user]);

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
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] dark:bg-background">
              <div className="flex flex-col gap-4 mt-8">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className={`justify-start dark:text-foreground/90 dark:hover:text-primary ${
                      isActiveLink(`/books?category=${category}`) ? 'bg-accent text-accent-foreground' : ''
                    }`}
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
            <h1 className="text-2xl font-bold text-primary dark:text-primary/90">BookStore</h1>
          </div>

          {/* Desktop Navigation */}
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

          {/* Search, Cart, Theme, and Auth */}
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
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="text-foreground hover:text-primary dark:text-foreground/90"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative text-foreground hover:text-primary dark:text-foreground/90"
                  >
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 dark:bg-background/95 mt-2"
                  sideOffset={5}
                >
                  <DropdownMenuItem 
                    onClick={() => navigate("/profile")} 
                    className={`cursor-pointer ${isActiveLink('/profile') ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem 
                      onClick={() => navigate("/admin")} 
                      className={`cursor-pointer ${isActiveLink('/admin') ? 'bg-accent text-accent-foreground' : ''}`}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-500 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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