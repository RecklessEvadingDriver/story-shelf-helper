import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
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
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
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

          {/* Search and Cart */}
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
            <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};