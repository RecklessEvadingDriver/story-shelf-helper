import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const search = new FormData(form).get("search") as string;
    if (search.trim()) {
      navigate(`/books?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-secondary to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fadeIn">
            Discover Your Next
            <span className="text-primary"> Literary Adventure</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            Explore our vast collection of books across all genres. From bestsellers to rare finds,
            we have something for every reader.
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            <div className="flex gap-4">
              <Input
                type="search"
                name="search"
                placeholder="Search for books, authors, or genres..."
                className="h-12"
              />
              <Button type="submit" size="lg">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </form>
          <div className="flex flex-wrap justify-center gap-4 animate-fadeIn" style={{ animationDelay: "0.6s" }}>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/books?category=New")}
              className="text-lg"
            >
              New Arrivals
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/books?category=Bestsellers")}
              className="text-lg"
            >
              Bestsellers
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};