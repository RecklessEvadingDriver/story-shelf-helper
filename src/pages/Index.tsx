import { HeroSection } from "@/components/HeroSection";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const { data: featuredBooks, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featured-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: newArrivals, isLoading: isNewArrivalsLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const categories = [
    { name: "Fiction", icon: "📚" },
    { name: "Non-Fiction", icon: "📖" },
    { name: "Science", icon: "🔬" },
    { name: "Technology", icon: "💻" },
    { name: "Business", icon: "💼" },
    { name: "Arts", icon: "🎨" }
  ];

  const renderBookSkeleton = () => (
    <>
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <HeroSection />
      
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Featured Books Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground dark:text-foreground/90">
              Featured Books
            </h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/books")}
              className="group"
            >
              View All
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isFeaturedLoading ? (
              renderBookSkeleton()
            ) : (
              featuredBooks?.map((book) => (
                <BookCard key={book.id} {...book} />
              ))
            )}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-foreground dark:text-foreground/90">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ name, icon }) => (
              <div
                key={name}
                onClick={() => navigate(`/books?category=${encodeURIComponent(name)}`)}
                className="bg-secondary dark:bg-accent/10 rounded-lg p-6 text-center 
                  hover:bg-primary hover:text-white dark:hover:bg-accent 
                  transition-all duration-300 transform hover:scale-105 
                  cursor-pointer shadow-sm hover:shadow-md dark:text-foreground/90
                  flex flex-col items-center justify-center gap-2"
              >
                <span className="text-2xl">{icon}</span>
                <h3 className="font-semibold">{name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground dark:text-foreground/90">
              New Arrivals
            </h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/books?sort=newest")}
              className="group"
            >
              View All
              <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isNewArrivalsLoading ? (
              renderBookSkeleton()
            ) : (
              newArrivals?.map((book) => (
                <BookCard key={book.id} {...book} />
              ))
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section>
          <div className="bg-accent/10 dark:bg-accent/5 rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground dark:text-foreground/90">
                Join Our Book Club
              </h2>
              <p className="text-lg text-muted-foreground dark:text-muted-foreground/80 mb-6">
                Get exclusive access to new releases, author interviews, and special discounts.
                Plus, receive a 10% discount on your first purchase!
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/join-club")}
                className="dark:bg-accent dark:text-accent-foreground"
              >
                Join Now
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;