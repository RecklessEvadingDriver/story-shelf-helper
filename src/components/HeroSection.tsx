import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
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
    <section 
      className="relative bg-gradient-to-b from-secondary/50 to-background dark:from-background dark:to-background dark:bg-grid-white/[0.2] py-20 md:py-32" 
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-6">
            <BookOpen className="h-16 w-16 text-primary dark:text-primary/90 animate-fadeIn" />
          </div>
          
          <div className="space-y-4">
            <h1 
              id="hero-heading" 
              className="text-4xl md:text-6xl font-bold text-foreground dark:text-foreground/90 mb-6 animate-fadeIn"
            >
              Your Gateway to
              <span className="text-primary dark:text-primary/90"> Literary Wonders</span>
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground dark:text-muted-foreground/80 mb-8 animate-fadeIn max-w-2xl mx-auto" 
              style={{ animationDelay: "0.2s" }}
            >
              Discover stories that resonate with your soul. From timeless classics to contemporary gems,
              find your next literary adventure with us.
            </p>
          </div>

          <form 
            onSubmit={handleSearch} 
            className="max-w-2xl mx-auto mb-8 animate-fadeIn" 
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex gap-4 flex-col sm:flex-row">
              <Input
                type="search"
                name="search"
                placeholder="What story speaks to you today?"
                className="h-12 dark:bg-background/95 dark:border-accent/20"
                aria-label="Search books"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 interactive-scale bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary text-primary-foreground"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Books
              </Button>
            </div>
          </form>

          <div 
            className="flex flex-wrap justify-center gap-4 animate-fadeIn" 
            style={{ animationDelay: "0.6s" }}
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/books?category=New")}
              className="text-lg interactive-scale dark:border-accent/20 dark:hover:bg-accent/20"
            >
              Latest Releases
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/books?category=Bestsellers")}
              className="text-lg interactive-scale dark:border-accent/20 dark:hover:bg-accent/20"
            >
              Popular Reads
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent dark:from-background/90"></div>
    </section>
  );
};