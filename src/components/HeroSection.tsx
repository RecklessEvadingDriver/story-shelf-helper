import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchBooks } from "@/services/bookApi";
import { useDebounce } from "@/hooks/use-debounce";

export const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data: searchResults, isLoading } = useSearchBooks(debouncedSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section 
      className="relative min-h-[80vh] flex items-center bg-gradient-to-b from-secondary/50 to-background dark:from-background dark:to-background dark:bg-grid-white/[0.2] py-12 md:py-20" 
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <BookOpen className="h-16 w-16 text-primary dark:text-primary/90" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 
              id="hero-heading" 
              className="text-4xl md:text-6xl font-bold text-foreground dark:text-foreground/90 mb-6"
            >
              Your Gateway to
              <span className="text-primary dark:text-primary/90 ml-2">Literary Wonders</span>
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground dark:text-muted-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed" 
            >
              Discover stories that resonate with your soul. From timeless classics to contemporary gems,
              find your next literary adventure with us.
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleSearch} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-8 relative"
          >
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What story speaks to you today?"
                  className="h-12 pr-10 dark:bg-background/95 dark:border-accent/20"
                  aria-label="Search books"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-6 bg-primary hover:bg-primary/90 dark:bg-primary/90 dark:hover:bg-primary text-primary-foreground transition-all duration-200"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Books
              </Button>
            </div>

            {searchResults && searchResults.length > 0 && searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card dark:bg-card/95 rounded-lg shadow-lg border border-border/50 overflow-hidden z-10"
              >
                <ul className="max-h-64 overflow-y-auto">
                  {searchResults.slice(0, 5).map((book) => (
                    <li key={book.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-3 hover:bg-accent/50"
                        onClick={() => navigate(`/book/${book.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={book.cover_image} 
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div className="text-left">
                            <p className="font-medium line-clamp-1">{book.title}</p>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                          </div>
                        </div>
                      </Button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.form>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/books?category=New")}
              className="text-lg transition-all duration-200 hover:scale-105 dark:border-accent/20 dark:hover:bg-accent/20"
            >
              Latest Releases
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/books?category=Bestsellers")}
              className="text-lg transition-all duration-200 hover:scale-105 dark:border-accent/20 dark:hover:bg-accent/20"
            >
              Popular Reads
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent dark:from-background/90"></div>
    </section>
  );
};